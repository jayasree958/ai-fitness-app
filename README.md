# 🏋️ AI Gym & Fitness Assistant

![AI Fitness](https://img.shields.io/badge/AI-Fitness%20Assistant-2c7a7b)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose-orange)

## 📌 Project Overview

The **AI Gym & Fitness Assistant** is a unified AI-powered fitness ecosystem that acts as a smart personal trainer, dietician, motivator, and data-driven fitness manager. Built using modern AI/ML technologies, it improves user engagement, discipline, and physical performance through intelligent automation.

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| 🤸 AI Gym Trainer | Real-time pose detection using MediaPipe, rep counting, form feedback |
| 🥗 AI Dietician | LLM-powered personalized diet plans based on BMI and goals |
| 📊 Habit Tracker | MongoDB-backed workout logging with streak tracking |
| 🤖 Virtual Gym Buddy | AI chat companion for motivation and fitness guidance |
| ⚖️ BMI Calculator | Health analysis with personalized advice |
| 💪 Workout Planner | AI-generated workout plans based on fitness level |
| 📈 Analytics | Chart.js visualization of fitness progress |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Python FastAPI |
| AI/ML | MediaPipe, Groq LLM (Llama 3.3-70B) |
| Database | MongoDB |
| Conversational AI | Groq API (LLM + NLP) |
| Analytics | Chart.js |
| Computer Vision | MediaPipe Pose Detection |

---

## 📁 Project Structure
ai-fitness-app/
├── backend/
│   ├── routers/
│   │   ├── diet.py          # AI Diet Planner API
│   │   ├── habits.py        # Habit Tracker API (MongoDB)
│   │   ├── chat.py          # Virtual Gym Buddy API
│   │   └── workout.py       # Workout Recommender API
│   ├── main.py              # FastAPI entry point
│   ├── .env                 # API keys
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── App.jsx          # Main React application
│   ├── index.html
│   └── package.json
└── README.md
---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11
- Node.js v24
- MongoDB 8.0
- Groq API Key (free at console.groq.com)

### Step 1: Clone the project
```bash
cd Desktop
cd ai-fitness-app
```

### Step 2: Backend Setup
```bash
cd backend
venv311\Scripts\activate
uvicorn main:app --reload
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Browser
http://localhost:5173
---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/diet/plan` | POST | Generate AI diet plan |
| `/habits/log` | POST | Log workout to MongoDB |
| `/habits/history` | GET | Get workout history and streak |
| `/habits/analytics` | GET | Get analytics data |
| `/chat/message` | POST | Chat with AI Gym Buddy |
| `/workout/recommend` | POST | Get workout recommendation |

---

## 🎯 How It Works

### AI Pose Detection
1. MediaPipe loads via CDN in the browser
2. Webcam feed is processed frame by frame
3. 33 body landmarks are detected in real time
4. Joint angles are calculated to count reps
5. Performance score is generated based on motion efficiency

### AI Diet Planning
1. User inputs weight, height, age, goal and diet type
2. BMI is calculated automatically
3. Groq LLM generates a personalized 1-day meal plan
4. Grocery list is included in the response

### Habit Tracking
1. Workouts are stored in MongoDB database
2. Streak is calculated from consecutive workout dates
3. Motivational nudges are sent when streak breaks
4. Analytics charts show progress over time

---

## 📊 Analytics Dashboard

The analytics page shows:
- Total workouts completed
- Total calories burned
- Total minutes exercised
- Line chart: Calories burned per day
- Bar chart: Duration per day
- Doughnut chart: Exercise distribution

---

## 🔮 Future Enhancements

- IoT integration with gym equipment via MQTT/Node-RED
- AWS S3 cloud storage for workout videos
- Mobile app (React Native)
- OpenPose for more accurate pose detection
- Scikit-learn models for workout prediction
- JWT authentication system
- Deployment on AWS/GCP
