from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class WorkoutRequest(BaseModel):
    fitness_level: str
    goal: str
    available_time: int
    equipment: str

@router.post("/recommend")
def recommend_workout(req: WorkoutRequest):
    prompt = f"""You are an expert personal trainer. Create a workout plan for:
- Fitness level: {req.fitness_level}
- Goal: {req.goal}
- Available time: {req.available_time} minutes
- Equipment: {req.equipment}

Give a specific workout with exercises, sets, reps and rest time. Be concise."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    return {"workout": response.choices[0].message.content}