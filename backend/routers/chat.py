from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatMessage(BaseModel):
    message: str
    history: list = []

@router.post("/message")
def chat(req: ChatMessage):
    messages = [
        {"role": "system", "content": "You are an enthusiastic AI fitness coach and gym buddy. You motivate users, answer fitness questions, suggest workouts, and provide emotional support. Keep responses short, friendly and motivating."}
    ]
    for h in req.history:
        messages.append(h)
    messages.append({"role": "user", "content": req.message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=300
    )
    return {"reply": response.choices[0].message.content}