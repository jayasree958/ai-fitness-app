from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class DietRequest(BaseModel):
    weight: float
    height: float
    age: int
    goal: str
    diet_type: str

@router.post("/plan")
def get_diet_plan(req: DietRequest):
    bmi = req.weight / ((req.height / 100) ** 2)
    prompt = f"""You are an expert dietician. A user has the following profile:
- Age: {req.age}
- BMI: {bmi:.1f}
- Goal: {req.goal}
- Diet preference: {req.diet_type}

Give a 1-day meal plan (breakfast, lunch, dinner, snacks) with calorie counts.
Also list a simple grocery list for the week.
Be specific, practical, and concise."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800
    )
    return {
        "bmi": round(bmi, 1),
        "plan": response.choices[0].message.content
    }