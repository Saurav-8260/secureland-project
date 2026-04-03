import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const navigate = useNavigate();

  const lands = JSON.parse(localStorage.getItem("lands")) || [];

  const total = lands.length;
  const owners = new Set(lands.map(l => l.owner)).size;
  const docs = lands.filter(l => l.documentURL).length;

  const [aiInsight, setAiInsight] = useState("Loading...");
  const [risk, setRisk] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/ai-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lands })
    })
    .then(res => res.json())
    .then(data => {
      setAiInsight(data.insight || "No insight");
      setRisk(data.risk || "No risk");
    })
    .catch(() => {
      setAiInsight("AI error ❌");
      setRisk("Unknown");
    });
  }, []);

  // 🎤 VOICE AI
  function startVoice(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported ❌");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (e)=>{
      const text = e.results[0][0].transcript.toLowerCase();

      if(text.includes("map")) navigate("/map");
      else if(text.includes("register")) navigate("/register");
      else if(text.includes("admin")) navigate("/admin");
      else if(text.includes("record") || text.includes("history")) navigate("/records");
      else if(text.includes("transfer")) navigate("/transfer");
      else alert("Command not recognized ❌");
    };

    recognition.start();
  }

  const chartData = {
    labels: ["Total Lands", "Owners", "Documents"],
    datasets: [
      {
        data: [total, owners, docs],
        backgroundColor: [
          "rgba(99,102,241,0.7)",
          "rgba(168,85,247,0.7)",
          "rgba(34,197,94,0.7)"
        ],
        borderRadius: 12
      }
    ]
  };

  return (
    <div style={styles.container}>

      {/* 💎 HERO */}
      <div style={styles.hero}>
        <h1>🚀 SecureLand AI</h1>
        <p>Smart Blockchain Land System</p>

        <div style={styles.buttons}>
          <button onClick={()=>navigate("/register")}>📄 Register</button>
          <button onClick={()=>navigate("/map")}>🗺 Map</button>
          <button onClick={startVoice}>🎤 Voice</button>
        </div>
      </div>

      {/* 📊 STATS */}
      <div style={styles.stats}>
        <div style={styles.card}>
          <h2>{total}</h2>
          <p>Total Lands</p>
        </div>
        <div style={styles.card}>
          <h2>{owners}</h2>
          <p>Owners</p>
        </div>
        <div style={styles.card}>
          <h2>{docs}</h2>
          <p>Documents</p>
        </div>
      </div>

      {/* 🤖 AI */}
      <div style={styles.glass}>
        <h3>🤖 AI Insight</h3>
        <p>{aiInsight}</p>

        <h4>⚠ Risk Level</h4>
        <p style={{color:"red"}}>{risk}</p>
      </div>

      {/* 📊 CHART */}
      <div style={styles.glass}>
        <Bar data={chartData} />
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div style={styles.grid}>
        <div style={styles.feature}>
          🔐 Secure
          <p>Blockchain protection</p>
        </div>
        <div style={styles.feature}>
          🤖 AI Fraud
          <p>Fraud detection</p>
        </div>
        <div style={styles.feature}>
          🗺 Map
          <p>Live tracking</p>
        </div>
      </div>

    </div>
  );
}

const styles = {

  container:{
    padding:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"20px"
  },

  hero:{
    textAlign:"center",
    padding:"40px",
    borderRadius:"20px",
    background:"linear-gradient(135deg,#6366f1,#a855f7)",
    color:"white",
    boxShadow:"0 10px 40px rgba(0,0,0,0.3)"
  },

  buttons:{
    marginTop:"20px",
    display:"flex",
    justifyContent:"center",
    gap:"10px"
  },

  stats:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
    gap:"15px"
  },

  card:{
    padding:"20px",
    borderRadius:"16px",
    background:"rgba(255,255,255,0.2)",
    backdropFilter:"blur(10px)",
    boxShadow:"0 8px 30px rgba(0,0,0,0.2)",
    textAlign:"center"
  },

  glass:{
    padding:"20px",
    borderRadius:"16px",
    background:"rgba(255,255,255,0.2)",
    backdropFilter:"blur(12px)",
    boxShadow:"0 8px 30px rgba(0,0,0,0.2)"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
    gap:"15px"
  },

  feature:{
    padding:"20px",
    borderRadius:"16px",
    background:"white",
    textAlign:"center",
    boxShadow:"0 6px 20px rgba(0,0,0,0.1)"
  }

};

export default Dashboard;