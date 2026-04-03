import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Welcome() {

  const navigate = useNavigate();
  const cardRef = useRef(null);

  // 🔥 SAFE PARALLAX
  useEffect(()=>{
    const move = (e)=>{
      if(!cardRef.current) return;

      const x = (window.innerWidth/2 - e.clientX) / 50;
      const y = (window.innerHeight/2 - e.clientY) / 50;

      cardRef.current.style.transform =
        `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    window.addEventListener("mousemove", move);
    return ()=>window.removeEventListener("mousemove", move);
  },[]);

  // 🔥 RIPPLE FUNCTION
  function handleRipple(e){
    const circle = document.createElement("span");
    const rect = e.target.getBoundingClientRect();

    circle.style.left = e.clientX - rect.left + "px";
    circle.style.top = e.clientY - rect.top + "px";

    e.target.appendChild(circle);

    setTimeout(()=>circle.remove(), 600);

    navigate("/home");
  }

  return (
    <div style={styles.container}>

      {/* 🔥 BACKGROUND */}
      <div style={styles.bg}></div>
      <div style={styles.bg2}></div>

      {/* 🔥 CARD */}
      <motion.div
        ref={cardRef}
        initial={{ opacity:0, scale:0.9 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.8 }}
        style={styles.card}
      >

        {/* 🔥 NEON TITLE */}
        <h1 style={styles.title} className="neon-text">
          🚀 SecureLand
        </h1>

        <p style={styles.subtitle}>
          Secure • Transparent • Blockchain Powered
        </p>

        {/* 🔥 FUTURISTIC CARD */}
        <div className="futuristic-card" style={{marginTop:"15px"}}>
          <p>AI + Blockchain Land System</p>
        </div>

        {/* 🔥 RIPPLE BUTTON */}
        <button
          className="ripple-btn"
          style={styles.btn}
          onClick={handleRipple}
        >
          🚀 Get Started
        </button>

      </motion.div>

    </div>
  );
}

const styles = {
  container:{
    height:"100vh",
    width:"100vw",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    position:"relative",
    overflow:"hidden",
    background:"#0f172a"
  },

  bg:{
    position:"absolute",
    width:"600px",
    height:"600px",
    background:"radial-gradient(circle,#6366f1,transparent)",
    filter:"blur(150px)",
    animation:"move1 10s infinite alternate"
  },

  bg2:{
    position:"absolute",
    width:"500px",
    height:"500px",
    background:"radial-gradient(circle,#a855f7,transparent)",
    filter:"blur(150px)",
    animation:"move2 12s infinite alternate"
  },

  card:{
    zIndex:1,
    padding:"60px",
    borderRadius:"20px",
    textAlign:"center",
    background:"rgba(255,255,255,0.08)",
    backdropFilter:"blur(20px)",
    boxShadow:"0 0 40px rgba(99,102,241,0.5)",
    transition:"transform 0.2s"
  },

  title:{
    fontSize:"52px",
    fontWeight:"700",
    color:"white",
    textShadow:"0 0 20px #6366f1"
  },

  subtitle:{
    marginTop:"10px",
    color:"#cbd5f5"
  },

  btn:{
    marginTop:"25px",
    padding:"14px 25px",
    border:"none",
    borderRadius:"12px",
    background:"linear-gradient(135deg,#6366f1,#a855f7)",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }
};

export default Welcome;