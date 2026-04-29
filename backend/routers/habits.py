from fastapi import APIRouter
from pydantic import BaseModel
from datetime import date, timedelta
from pymongo import MongoClient

router = APIRouter()

client = MongoClient("mongodb://localhost:27017/")
db = client["ai_fitness"]
collection = db["workouts"]

class WorkoutLog(BaseModel):
    exercise: str
    duration: int
    calories: int

@router.post("/log")
def log_workout(log: WorkoutLog):
    collection.insert_one({
        "date": str(date.today()),
        "exercise": log.exercise,
        "duration": log.duration,
        "calories": log.calories
    })
    return {"message": "Workout logged!"}

@router.get("/history")
def get_history():
    data = list(collection.find({}, {"_id": 0}))
    dates = sorted(set(d["date"] for d in data), reverse=True)
    streak = 0
    today = date.today()
    for i, d in enumerate(dates):
        if str(today - timedelta(days=i)) == d:
            streak += 1
        else:
            break
    nudge = ""
    if streak == 0:
        nudge = "You haven't worked out today. Let's go!"
    elif streak >= 3:
        nudge = f"Amazing! You're on a {streak} day streak. Keep it up!"
    return {"logs": data, "streak": streak, "nudge": nudge}

@router.get("/analytics")
def get_analytics():
    data = list(collection.find({}, {"_id": 0}))
    date_calories = {}
    date_duration = {}
    exercise_count = {}
    for d in data:
        date_calories[d["date"]] = date_calories.get(d["date"], 0) + d["calories"]
        date_duration[d["date"]] = date_duration.get(d["date"], 0) + d["duration"]
        exercise_count[d["exercise"]] = exercise_count.get(d["exercise"], 0) + 1
    dates = sorted(date_calories.keys())
    return {
        "dates": dates,
        "calories": [date_calories[d] for d in dates],
        "durations": [date_duration[d] for d in dates],
        "exercise_count": exercise_count,
        "total_workouts": len(data),
        "total_calories": sum(d["calories"] for d in data),
        "total_duration": sum(d["duration"] for d in data)
    }