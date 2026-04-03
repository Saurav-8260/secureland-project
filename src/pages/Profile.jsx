import { useEffect, useState } from "react";
import { updateProfile, uploadImage } from "../api/backend";
function Profile(){

  const [account,setAccount] = useState("");
  const [lands,setLands] = useState([]);

  const [name,setName] = useState("");
  const [editing,setEditing] = useState(false);
  const [photo,setPhoto] = useState("");

  const [history,setHistory] = useState([]);

  useEffect(()=>{

    // wallet
    if(window.ethereum){
      window.ethereum.request({ method:"eth_accounts" })
        .then(acc => setAccount(acc[0]));
    }

    // lands
    const data = JSON.parse(localStorage.getItem("lands")) || [];
    setLands(data);

    // profile data
    const savedName = localStorage.getItem("profileName") || "User";
    const savedPhoto = localStorage.getItem("profilePhoto") || "";
    setName(savedName);
    setPhoto(savedPhoto);

    // history
    const h = JSON.parse(localStorage.getItem("notifications")) || [];
    setHistory(h);

  },[]);

async function saveProfile(){

  let photoUrl = photo;

  // agar file hai to upload
  if(photo && photo.startsWith("data:")){
    const blob = await fetch(photo).then(r=>r.blob());
    const file = new File([blob], "profile.png");

    const uploaded = await uploadImage(file);
    photoUrl = uploaded.url;
  }

  await updateProfile({
    wallet: account,
    name,
    photo: photoUrl
  });

  setEditing(false);
}

  // 📷 IMAGE UPLOAD
  function handlePhoto(e){
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = ()=>{
      setPhoto(reader.result);
    };

    if(file){
      reader.readAsDataURL(file);
    }
  }

  return(
    <div style={styles.container}>

      {/* 🔥 PROFILE CARD */}
      <div style={styles.card}>

        {/* 👤 PHOTO */}
        <div style={styles.avatar}>
          {photo ? (
            <img src={photo} style={styles.img}/>
          ) : "👤"}
        </div>

        {editing && (
          <input type="file" onChange={handlePhoto}/>
        )}

        {/* 📝 NAME */}
        {editing ? (
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            style={styles.input}
          />
        ) : (
          <h2>{name}</h2>
        )}

        <p style={styles.label}>Wallet</p>
        <p style={styles.addr}>{account}</p>

        {/* ✏️ EDIT BUTTON */}
        {editing ? (
          <button onClick={saveProfile}>Save</button>
        ) : (
          <button onClick={()=>setEditing(true)}>Edit Profile</button>
        )}

      </div>

      {/* 📊 STATS */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>{lands.length}</h3>
          <p>Total Lands</p>
        </div>

        <div style={styles.statCard}>
          <h3>{new Set(lands.map(l=>l.owner)).size}</h3>
          <p>Owners</p>
        </div>

        <div style={styles.statCard}>
          <h3>{lands.filter(l=>l.documentURL).length}</h3>
          <p>Documents</p>
        </div>
      </div>

      {/* 📜 HISTORY */}
      <div style={styles.history}>

        <h3>Activity History</h3>

        {history.length === 0 ? (
          <p>No activity</p>
        ) : (
          history.map((h,i)=>(
            <div key={i} style={styles.historyItem}>
              <p>{h.message}</p>
              <span>{h.time}</span>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

const styles = {
  container:{
    padding:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"30px"
  },

  card:{
    background:"rgba(255,255,255,0.6)",
    backdropFilter:"blur(12px)",
    padding:"30px",
    borderRadius:"20px",
    textAlign:"center",
    boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
  },

  avatar:{
    width:"90px",
    height:"90px",
    borderRadius:"50%",
    background:"#6366f1",
    color:"white",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"30px",
    margin:"0 auto 10px",
    overflow:"hidden"
  },

  img:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },

  input:{
    padding:"8px",
    marginBottom:"10px"
  },

  label:{
    fontSize:"12px",
    color:"#64748b"
  },

  addr:{
    fontSize:"12px",
    wordBreak:"break-all"
  },

  stats:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
    gap:"20px"
  },

  statCard:{
    background:"white",
    padding:"20px",
    borderRadius:"16px",
    textAlign:"center"
  },

  history:{
    background:"white",
    padding:"20px",
    borderRadius:"16px"
  },

  historyItem:{
    borderBottom:"1px solid #ddd",
    padding:"10px 0",
    fontSize:"13px"
  }
};

export default Profile;