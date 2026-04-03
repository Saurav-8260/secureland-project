import { useState, useEffect } from "react";
import { getContract } from "../blockchain/contract";
import { uploadToIPFS } from "../blockchain/ipfs";
import { checkFraud } from "../ai/fraud";

function RegisterLand() {

  const [id, setId] = useState("");
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState(""); // ✅ manual owner
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ text: msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // 📍 GET LOCATION FROM DRAW
  useEffect(() => {
    const loc = JSON.parse(localStorage.getItem("selectedLocation"));
    if (loc) {
      setLat(loc.lat);
      setLng(loc.lng);
    }
  }, []);

  // ❌ REMOVED AUTO WALLET OWNER (IMPORTANT)

  // 🆔 AUTO ID GENERATE
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("lands")) || [];
    const newId = existing.length + 1;
    setId(newId.toString());
  }, []);

  async function register() {
    try {

      if (!location || !owner) {
        return showToast("⚠️ Fill all fields", "warning");
      }

      if (owner.trim().length < 3) {
        return showToast("⚠️ Enter valid owner name", "warning");
      }

      if (!lat || !lng) {
        return showToast("📍 Please select land on map", "warning");
      }

      if (!file) {
        return showToast("📄 Upload document", "warning");
      }

      const existing = JSON.parse(localStorage.getItem("lands")) || [];

      if (existing.find(l => l.id === id)) {
        return showToast("❌ ID already exists", "error");
      }

      const fraud = checkFraud(Number(id), owner);
      if (fraud !== "Safe") {
        return showToast("🚨 Fraud: " + fraud, "error");
      }

      setLoading(true);

      const documentURL = await uploadToIPFS(file);
      const contract = await getContract();

      const tx = await contract.registerLand(
        Number(id),
        location,
        owner, // ✅ now NAME not wallet
        { gasLimit: 300000 }
      );

      await tx.wait();

      // 💾 SAVE LAND
      existing.push({
  id,
  location,
  owner,
  documentURL,
  lat,
  lng,

  // 🔥 ADD THIS
  history: [
    {
      owner: owner,
      date: new Date().toLocaleString()
    }
  ]
});

      localStorage.setItem("lands", JSON.stringify(existing));

      // 🔔 NOTIFICATION
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      notifications.push({
        message: `Land #${id} registered`,
        time: new Date().toLocaleString()
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));

      showToast("✅ Land Registered");

      setLocation("");
      setOwner(""); // ✅ reset owner input
      setFile(null);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
      showToast("❌ Transaction Failed", "error");
    }
  }

  return (
    <div style={styles.container}>

      {/* 🔔 TOAST */}
      {toast && (
        <div style={{
          ...styles.toast,
          background:
            toast.type === "error"
              ? "#ef4444"
              : toast.type === "warning"
              ? "#f59e0b"
              : "#22c55e"
        }}>
          {toast.text}
        </div>
      )}

      <div style={styles.card}>

        <h1>📄 Register Land</h1>

        {/* 🆔 AUTO ID */}
        <input value={id} readOnly />

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        {/* 👤 MANUAL OWNER */}
        <input
          placeholder="Owner Name"
          value={owner}
          onChange={(e)=>setOwner(e.target.value)}
        />

        {/* 📍 LAT LNG */}
        <input value={lat} readOnly placeholder="Latitude" />
        <input value={lng} readOnly placeholder="Longitude" />

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

        <button onClick={register}>
          {loading ? "Processing..." : "Register"}
        </button>

      </div>

    </div>
  );
}

const styles = {
  container:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  card:{
    padding:"30px",
    background:"white",
    borderRadius:"16px",
    display:"flex",
    flexDirection:"column",
    gap:"10px",
    minWidth:"300px"
  },

  toast:{
    position:"fixed",
    top:"20px",
    right:"20px",
    padding:"12px",
    borderRadius:"8px",
    color:"white"
  }
};

export default RegisterLand;