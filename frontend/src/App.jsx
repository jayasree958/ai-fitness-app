import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

function App() {
  const [page, setPage] = useState("home")
  return (
    <div style={{ fontFamily: "Arial", maxWidth: "960px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#2c7a7b", textAlign: "center" }}>🏋️ AI Gym & Fitness Assistant</h1>
      <nav style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "30px", flexWrap: "wrap" }}>
        <button onClick={() => setPage("diet")} style={btnStyle(page === "diet")}>🥗 Diet Planner</button>
        <button onClick={() => setPage("habits")} style={btnStyle(page === "habits")}>📊 Habit Tracker</button>
        <button onClick={() => setPage("pose")} style={btnStyle(page === "pose")}>🤸 Pose Trainer</button>
        <button onClick={() => setPage("chat")} style={btnStyle(page === "chat")}>🤖 Gym Buddy</button>
        <button onClick={() => setPage("bmi")} style={btnStyle(page === "bmi")}>⚖️ BMI</button>
        <button onClick={() => setPage("workout")} style={btnStyle(page === "workout")}>💪 Workout Plan</button>
        <button onClick={() => setPage("analytics")} style={btnStyle(page === "analytics")}>📈 Analytics</button>
      </nav>
      {page === "home" && <Home setPage={setPage} />}
      {page === "diet" && <Diet />}
      {page === "habits" && <Habits />}
      {page === "pose" && <PoseTrainer />}
      {page === "chat" && <GymBuddy />}
      {page === "bmi" && <BMICalculator />}
      {page === "workout" && <WorkoutRecommender />}
      {page === "analytics" && <Analytics />}
    </div>
  )
}

function btnStyle(active) {
  return {
    padding: "8px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
    background: active ? "#2c7a7b" : "#e2e8f0", color: active ? "white" : "black", fontWeight: "bold", fontSize: "13px"
  }
}

function Home({ setPage }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Welcome to your AI Gym & Fitness Assistant</h2>
      <p>Your personal AI-powered trainer, dietician, motivator and data-driven fitness manager</p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
        <div onClick={() => setPage("diet")} style={cardStyle}>🥗<br/>AI Diet Planner</div>
        <div onClick={() => setPage("habits")} style={cardStyle}>📊<br/>Habit Tracker</div>
        <div onClick={() => setPage("pose")} style={cardStyle}>🤸<br/>Pose Trainer</div>
        <div onClick={() => setPage("chat")} style={cardStyle}>🤖<br/>Gym Buddy</div>
        <div onClick={() => setPage("bmi")} style={cardStyle}>⚖️<br/>BMI Calculator</div>
        <div onClick={() => setPage("workout")} style={cardStyle}>💪<br/>Workout Plan</div>
        <div onClick={() => setPage("analytics")} style={cardStyle}>📈<br/>Analytics</div>
      </div>
    </div>
  )
}

const cardStyle = {
  padding: "24px", background: "#e6fffa", borderRadius: "12px",
  cursor: "pointer", fontSize: "16px", fontWeight: "bold", minWidth: "120px"
}

function Diet() {
  const [form, setForm] = useState({ weight: "", height: "", age: "", goal: "lose weight", diet_type: "vegetarian" })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/diet/plan", {
        ...form, weight: parseFloat(form.weight), height: parseFloat(form.height), age: parseInt(form.age)
      })
      setResult(`BMI: ${res.data.bmi}\n\n${res.data.plan}`)
    } catch { setResult("Error connecting to server.") }
    setLoading(false)
  }

  return (
    <div>
      <h2>🥗 AI Dietician & Calorie Coach</h2>
      <p>NLP-driven diet recommendations based on your BMI, weight goals and dietary preferences</p>
      <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} style={inputStyle} />
        <input placeholder="Height (cm)" value={form.height} onChange={e => setForm({...form, height: e.target.value})} style={inputStyle} />
        <input placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={inputStyle} />
        <select value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} style={inputStyle}>
          <option>lose weight</option><option>gain muscle</option><option>maintain</option>
        </select>
        <select value={form.diet_type} onChange={e => setForm({...form, diet_type: e.target.value})} style={inputStyle}>
          <option>vegetarian</option><option>vegan</option><option>non-vegetarian</option>
        </select>
        <button onClick={submit} style={{ ...btnStyle(true), width: "100%", padding: "12px" }}>{loading ? "Generating..." : "Get My Diet Plan"}</button>
      </div>
      {result && <pre style={{ background: "#f0fff4", padding: "20px", borderRadius: "8px", marginTop: "20px", whiteSpace: "pre-wrap" }}>{result}</pre>}
    </div>
  )
}

const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }

function Habits() {
  const [form, setForm] = useState({ exercise: "", duration: "", calories: "" })
  const [history, setHistory] = useState(null)
  const [msg, setMsg] = useState("")

  const log = async () => {
    try {
      const res = await axios.post("http://localhost:8000/habits/log", {
        ...form, duration: parseInt(form.duration), calories: parseInt(form.calories)
      })
      setMsg(res.data.message)
      fetchHistory()
    } catch { setMsg("Error logging workout.") }
  }

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:8000/habits/history")
    setHistory(res.data)
  }

  return (
    <div>
      <h2>📊 AI Fitness Habit Tracker</h2>
      <p>Behavioral AI that tracks your workouts and sends motivational nudges</p>
      <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input placeholder="Exercise (e.g. Running)" value={form.exercise} onChange={e => setForm({...form, exercise: e.target.value})} style={inputStyle} />
        <input placeholder="Duration (minutes)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} style={inputStyle} />
        <input placeholder="Calories burned" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} style={inputStyle} />
        <button onClick={log} style={{ ...btnStyle(true), padding: "12px" }}>Log Workout to MongoDB</button>
        <button onClick={fetchHistory} style={{ ...btnStyle(false), padding: "12px" }}>View History</button>
      </div>
      {msg && <p style={{ color: "green", fontWeight: "bold" }}>{msg}</p>}
      {history && (
        <div style={{ marginTop: "20px" }}>
          <h3>🔥 Streak: {history.streak} days</h3>
          <p style={{ color: "#e53e3e", fontWeight: "bold" }}>{history.nudge}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead><tr style={{ background: "#2c7a7b", color: "white" }}>
              <th style={th}>Date</th><th style={th}>Exercise</th><th style={th}>Duration</th><th style={th}>Calories</th>
            </tr></thead>
            <tbody>{history.logs.map((l, i) => (
              <tr key={i} style={{ background: i%2===0 ? "#f0fff4" : "white" }}>
                <td style={td}>{l.date}</td><td style={td}>{l.exercise}</td>
                <td style={td}>{l.duration} min</td><td style={td}>{l.calories}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const th = { padding: "10px", textAlign: "left" }
const td = { padding: "10px", borderBottom: "1px solid #e2e8f0" }

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8000/habits/analytics")
      setData(res.data)
    } catch { alert("Error fetching analytics") }
    setLoading(false)
  }

  useEffect(() => { fetchAnalytics() }, [])

  return (
    <div>
      <h2>📈 Analytics & Visualization</h2>
      <p>Plotly-style charts showing your fitness progress over time</p>
      {loading && <p>Loading analytics...</p>}
      {data && (
        <div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ background: "#e6fffa", padding: "20px", borderRadius: "12px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2c7a7b" }}>{data.total_workouts}</div>
              <div>Total Workouts</div>
            </div>
            <div style={{ background: "#fff5f5", padding: "20px", borderRadius: "12px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#e53e3e" }}>{data.total_calories}</div>
              <div>Total Calories Burned</div>
            </div>
            <div style={{ background: "#fffff0", padding: "20px", borderRadius: "12px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#d69e2e" }}>{data.total_duration}</div>
              <div>Total Minutes</div>
            </div>
          </div>
          {data.dates.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3>Calories Burned Per Day</h3>
              <Line data={{
                labels: data.dates,
                datasets: [{ label: "Calories", data: data.calories, borderColor: "#e53e3e", backgroundColor: "rgba(229,62,62,0.1)", tension: 0.4, fill: true }]
              }} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </div>
          )}
          {data.dates.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3>Workout Duration Per Day (minutes)</h3>
              <Bar data={{
                labels: data.dates,
                datasets: [{ label: "Duration (min)", data: data.durations, backgroundColor: "#2c7a7b" }]
              }} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </div>
          )}
          {Object.keys(data.exercise_count).length > 0 && (
            <div style={{ maxWidth: "400px" }}>
              <h3>Exercise Distribution</h3>
              <Doughnut data={{
                labels: Object.keys(data.exercise_count),
                datasets: [{ data: Object.values(data.exercise_count), backgroundColor: ["#2c7a7b", "#e53e3e", "#d69e2e", "#38a169", "#3182ce"] }]
              }} />
            </div>
          )}
          {data.dates.length === 0 && <p>No workout data yet. Log some workouts first!</p>}
        </div>
      )}
    </div>
  )
}

function GymBuddy() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! 💪 I'm your AI Gym Buddy! Ask me anything about fitness, workouts, or motivation!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const history = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
      const res = await axios.post("http://localhost:8000/chat/message", { message: input, history })
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }])
    } catch { setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't connect. Try again!" }]) }
    setLoading(false)
  }

  return (
    <div>
      <h2>🤖 Virtual Gym Buddy</h2>
      <p>AI companion using LLM that motivates you, tracks emotional states and provides personalized guidance</p>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "400px", overflowY: "auto", padding: "16px", background: "#f9fafb", marginBottom: "12px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
            <div style={{
              maxWidth: "70%", padding: "12px 16px", borderRadius: "12px",
              background: m.role === "user" ? "#2c7a7b" : "white",
              color: m.role === "user" ? "white" : "black",
              border: m.role === "assistant" ? "1px solid #e2e8f0" : "none"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>Gym Buddy is typing...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your gym buddy anything..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={send} style={btnStyle(true)}>Send</button>
      </div>
    </div>
  )
}

function BMICalculator() {
  const [form, setForm] = useState({ weight: "", height: "" })
  const [result, setResult] = useState(null)

  const calculate = () => {
    const w = parseFloat(form.weight)
    const h = parseFloat(form.height) / 100
    if (!w || !h) return
    const bmi = (w / (h * h)).toFixed(1)
    let category = "", color = "", advice = ""
    if (bmi < 18.5) { category = "Underweight"; color = "#3182ce"; advice = "Focus on protein-rich foods and strength training." }
    else if (bmi < 25) { category = "Normal weight"; color = "#38a169"; advice = "Great! Maintain with balanced diet and regular exercise." }
    else if (bmi < 30) { category = "Overweight"; color = "#d69e2e"; advice = "Consider cardio exercises and reducing calorie intake." }
    else { category = "Obese"; color = "#e53e3e"; advice = "Please consult a doctor. Focus on diet control and gradual exercise." }
    setResult({ bmi, category, color, advice })
  }

  return (
    <div>
      <h2>⚖️ BMI Calculator & Health Analyzer</h2>
      <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} style={inputStyle} />
        <input placeholder="Height (cm)" value={form.height} onChange={e => setForm({...form, height: e.target.value})} style={inputStyle} />
        <button onClick={calculate} style={{ ...btnStyle(true), padding: "12px" }}>Calculate BMI</button>
      </div>
      {result && (
        <div style={{ marginTop: "20px", padding: "24px", background: "#f0fff4", borderRadius: "12px", maxWidth: "400px" }}>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: result.color, textAlign: "center" }}>{result.bmi}</div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: result.color, textAlign: "center", marginBottom: "12px" }}>{result.category}</div>
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: `2px solid ${result.color}` }}>
            <p style={{ margin: 0 }}>💡 {result.advice}</p>
          </div>
          <div style={{ marginTop: "16px" }}>
            <p>🔵 Below 18.5 — Underweight</p>
            <p>🟢 18.5 – 24.9 — Normal</p>
            <p>🟡 25 – 29.9 — Overweight</p>
            <p>🔴 30 and above — Obese</p>
          </div>
        </div>
      )}
    </div>
  )
}

function WorkoutRecommender() {
  const [form, setForm] = useState({ fitness_level: "beginner", goal: "lose weight", available_time: 30, equipment: "no equipment" })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/workout/recommend", {
        ...form, available_time: parseInt(form.available_time)
      })
      setResult(res.data.workout)
    } catch { setResult("Error connecting to server.") }
    setLoading(false)
  }

  return (
    <div>
      <h2>💪 AI Workout Recommender & Planner</h2>
      <p>AI recommendation engine that suggests workout programs based on your goals and fitness level</p>
      <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <select value={form.fitness_level} onChange={e => setForm({...form, fitness_level: e.target.value})} style={inputStyle}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} style={inputStyle}>
          <option value="lose weight">Lose Weight</option>
          <option value="gain muscle">Gain Muscle</option>
          <option value="improve fitness">Improve Fitness</option>
          <option value="increase flexibility">Increase Flexibility</option>
        </select>
        <input type="number" placeholder="Available time (minutes)" value={form.available_time}
          onChange={e => setForm({...form, available_time: e.target.value})} style={inputStyle} />
        <select value={form.equipment} onChange={e => setForm({...form, equipment: e.target.value})} style={inputStyle}>
          <option value="no equipment">No Equipment</option>
          <option value="dumbbells">Dumbbells</option>
          <option value="full gym">Full Gym</option>
          <option value="resistance bands">Resistance Bands</option>
        </select>
        <button onClick={submit} style={{ ...btnStyle(true), padding: "12px" }}>{loading ? "Generating..." : "Get My Workout Plan"}</button>
      </div>
      {result && <pre style={{ background: "#f0fff4", padding: "20px", borderRadius: "8px", marginTop: "20px", whiteSpace: "pre-wrap" }}>{result}</pre>}
    </div>
  )
}

function PoseTrainer() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [reps, setReps] = useState(0)
  const [feedback, setFeedback] = useState("Press Start to begin")
  const [score, setScore] = useState(0)
  const stageRef = useRef("down")
  const cameraRef = useRef(null)
  const angleHistoryRef = useRef([])

  useEffect(() => {
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
    ]
    let count = 0
    scripts.forEach(src => {
      const existing = document.querySelector(`script[src="${src}"]`)
      if (existing) { count++; return }
      const s = document.createElement("script")
      s.src = src
      s.onload = () => { count++ }
      document.head.appendChild(s)
    })
  }, [])

  const getAngle = (a, b, c) => {
    const ab = [b.x - a.x, b.y - a.y]
    const cb = [b.x - c.x, b.y - c.y]
    const dot = ab[0]*cb[0] + ab[1]*cb[1]
    const mag = Math.sqrt(ab[0]**2+ab[1]**2) * Math.sqrt(cb[0]**2+cb[1]**2)
    return Math.acos(Math.min(Math.max(dot/mag, -1), 1)) * (180/Math.PI)
  }

  const calculateScore = (angles) => {
    if (angles.length === 0) return 0
    const range = Math.max(...angles) - Math.min(...angles)
    return Math.min(100, Math.round(range * 0.6))
  }

  const startPose = () => {
    if (!window.Pose) { setFeedback("Still loading... try again in 2 seconds"); return }
    setRunning(true); setReps(0); setScore(0); setFeedback("Starting camera...")
    angleHistoryRef.current = []
    const pose = new window.Pose({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}` })
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
    pose.onResults(results => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
      if (results.poseLandmarks) {
        window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 })
        window.drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 1, radius: 3 })
        const lm = results.poseLandmarks
        const angle = getAngle(lm[11], lm[13], lm[15])
        angleHistoryRef.current.push(angle)
        if (angle > 160) { stageRef.current = "down"; setFeedback("Arm down — curl up!") }
        if (angle < 40 && stageRef.current === "down") {
          stageRef.current = "up"
          setReps(r => {
            const newReps = r + 1
            const perfScore = calculateScore(angleHistoryRef.current)
            setScore(perfScore)
            setFeedback(`Rep ${newReps} done! Performance Score: ${perfScore}/100`)
            return newReps
          })
        }
        ctx.fillStyle = "white"; ctx.font = "bold 16px Arial"
        ctx.fillText(`Angle: ${Math.round(angle)}°`, 10, 30)
        ctx.fillText(`Score: ${calculateScore(angleHistoryRef.current)}/100`, 10, 55)
      }
    })
    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => { await pose.send({ image: videoRef.current }) },
      width: 640, height: 480
    })
    cameraRef.current = camera
    camera.start()
    setFeedback("Detecting pose — do bicep curls!")
  }

  const stopPose = () => {
    setRunning(false); setFeedback("Stopped. Press Start to begin again.")
    if (cameraRef.current) cameraRef.current.stop()
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    }
  }

  return (
    <div>
      <h2>🤸 AI Gym Trainer — Pose Detection & Performance Analyzer</h2>
      <p>Real-time pose detection using MediaPipe computer vision. Counts reps and scores your performance.</p>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <video ref={videoRef} style={{ display: "none" }} />
          <canvas ref={canvasRef} width={640} height={480} style={{ borderRadius: "12px", border: "2px solid #2c7a7b", maxWidth: "100%" }} />
        </div>
        <div style={{ minWidth: "180px" }}>
          <div style={{ background: "#e6fffa", padding: "20px", borderRadius: "12px", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", fontWeight: "bold", color: "#2c7a7b" }}>{reps}</div>
            <div style={{ fontSize: "14px", color: "#555" }}>Reps Completed</div>
          </div>
          <div style={{ background: "#fffff0", padding: "20px", borderRadius: "12px", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#d69e2e" }}>{score}/100</div>
            <div style={{ fontSize: "14px", color: "#555" }}>Performance Score</div>
          </div>
          <div style={{ background: "#f0fff4", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#2c7a7b", fontSize: "13px" }}>{feedback}</p>
          </div>
          {!running
            ? <button onClick={startPose} style={{ ...btnStyle(true), width: "100%", padding: "12px" }}>▶ Start</button>
            : <button onClick={stopPose} style={{ ...btnStyle(false), width: "100%", padding: "12px", background: "#e53e3e", color: "white" }}>⏹ Stop</button>
          }
        </div>
      </div>
    </div>
  )
}

export default App