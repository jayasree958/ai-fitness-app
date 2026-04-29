from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import diet, habits, chat, workout

app = FastAPI(title="AI Fitness Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diet.router, prefix="/diet", tags=["Diet"])
app.include_router(habits.router, prefix="/habits", tags=["Habits"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(workout.router, prefix="/workout", tags=["Workout"])

@app.get("/")
def root():
    return {"status": "AI Fitness API running"}