import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN = "0x0A3DC13795F440e2D1481A38Ee9705f032FEAC2E";

function Admin(){

  const [lands,setLands] = useState([]);
  const [search,setSearch] = useState("");
  const [user,setUser] = useState("");

  const [editingId,setEditingId] = useState(null);
  const [editData,setEditData] = useState({ location:"", owner:"" });

  // 🔥 PROFILE STATE
  const [name,setName] = useState(localStorage.getItem("adminName") || "");
  const [photo,setPhoto] = useState(localStorage.getItem("adminPhoto") || "");
  const [editProfile,setEditProfile] = useState(false);

  const navigate = useNavigate();

  // 🔐 ADMIN CHECK
  useEffect(()=>{
    async function checkAdmin(){
      if(window.ethereum){
        const acc = await window.ethereum.request({ method:"eth_accounts" });
        const current = acc[0];

        if(!current || current.toLowerCase() !== ADMIN.toLowerCase()){
          alert("❌ Access Denied");
          navigate("/");
        } else {
          setUser(current);
        }
      }
    }

    checkAdmin();
    load();
  },[]);

  function load(){
    const data = JSON.parse(localStorage.getItem("lands")) || [];
    setLands(data);
  }

  function deleteLand(id){
    if(!window.confirm("Delete this land?")) return;

    const updated = lands.filter(l=>l.id !== id);
    localStorage.setItem("lands", JSON.stringify(updated));
    setLands(updated);
  }

  function startEdit(land){
    setEditingId(land.id);
    setEditData({
      location: land.location,
      owner: land.owner
    });
  }

  function saveEdit(id){
    const updated = lands.map(l=>{
      if(l.id === id){
        return {
          ...l,
          location: editData.location,
          owner: editData.owner
        };
      }
      return l;
    });

    localStorage.setItem("lands", JSON.stringify(updated));
    setLands(updated);
    setEditingId(null);
  }

  // 📸 PHOTO
  function handlePhoto(e){
    const file = e.target.files[0];

    if(!file){
      alert("Select image ❌");
      return;
    }

    if(file.type !== "image/png" && file.type !== "image/jpeg"){
      alert("Only JPG/PNG allowed ❌");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = ()=>{
      localStorage.setItem("adminPhoto", reader.result);
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  // 💾 SAVE PROFILE
  function saveProfile(){
    localStorage.setItem("adminName", name);
    setEditProfile(false);
    alert("✅ Profile Saved");
  }

  const filtered = useMemo(()=>
    lands.filter(l =>
      String(l.id).includes(search) ||
      l.owner.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    )
  ,[lands,search]);

  return(
    <div style={styles.container}>

      {/* 🔥 PROFILE */}
      <div style={styles.profileBox}>

        <div style={styles.avatar}>
          {photo ? (
            <img src={photo} style={styles.img}/>
          ) : (
            name ? name[0].toUpperCase() : "A"
          )}
        </div>

        {!editProfile ? (
          <>
            <h2>{name || "Admin"}</h2>
            <p style={{color:"#6366f1"}}>👑 Admin</p>
            <p style={styles.wallet}>{user}</p>

            <button
              onClick={()=>setEditProfile(true)}
              style={styles.editProfileBtn}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter Name"
              style={styles.input}
            />

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handlePhoto}
            />

            <div style={{display:"flex", gap:"10px"}}>
              <button onClick={saveProfile} style={styles.saveProfileBtn}>
                💾 Save
              </button>

              <button
                onClick={()=>setEditProfile(false)}
                style={styles.cancelBtn}
              >
                ❌ Cancel
              </button>
            </div>
          </>
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
      </div>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={styles.search}
      />

      {/* 📋 LAND LIST */}
      <div style={styles.grid}>
        {filtered.map((l,i)=>(

          <div key={i} style={styles.card}>

            <p><b>ID:</b> {l.id}</p>

            {editingId === l.id ? (
              <>
                <input
                  value={editData.owner}
                  onChange={(e)=>setEditData({...editData, owner:e.target.value})}
                />
                <input
                  value={editData.location}
                  onChange={(e)=>setEditData({...editData, location:e.target.value})}
                />

                <button onClick={()=>saveEdit(l.id)} style={styles.saveBtn}>
                  💾 Save
                </button>
              </>
            ) : (
              <>
                <p><b>Owner:</b> {l.owner}</p>
                <p><b>Location:</b> {l.location}</p>
              </>
            )}

            <div style={styles.actions}>
              <button onClick={()=>startEdit(l)} style={styles.editBtn}>
                ✏️ Edit
              </button>

              <button onClick={()=>deleteLand(l.id)} style={styles.deleteBtn}>
                🗑 Delete
              </button>
            </div>

          </div>

        ))}
      </div>

      {/* 📜 ACTIVITY */}
      <div style={styles.activity}>
        <h3>Activity History</h3>

        {(JSON.parse(localStorage.getItem("notifications")) || []).map((n,i)=>(
          <div key={i}>
            <p>{n.message}</p>
            <small>{n.time}</small>
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container:{ padding:"20px" },

  profileBox:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:"12px",
    marginBottom:"30px",
    padding:"30px",
    borderRadius:"20px",
    background:"rgba(255,255,255,0.15)",
    backdropFilter:"blur(15px)",
    boxShadow:"0 10px 40px rgba(0,0,0,0.2)"
  },

  avatar:{
    width:"100px",
    height:"100px",
    borderRadius:"50%",
    background:"linear-gradient(135deg,#6366f1,#a855f7)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    color:"white",
    fontSize:"35px",
    fontWeight:"bold",
    overflow:"hidden"
  },

  img:{ width:"100%", height:"100%", objectFit:"cover" },

  input:{
    padding:"10px",
    borderRadius:"10px",
    border:"1px solid #ddd",
    width:"250px",
    textAlign:"center"
  },

  saveProfileBtn:{
    padding:"10px 20px",
    borderRadius:"10px",
    border:"none",
    background:"#6366f1",
    color:"white"
  },

  editProfileBtn:{
    padding:"10px 20px",
    borderRadius:"10px",
    border:"none",
    background:"#2563eb",
    color:"white"
  },

  cancelBtn:{
    padding:"10px 20px",
    borderRadius:"10px",
    border:"none",
    background:"red",
    color:"white"
  },

  wallet:{
    fontSize:"12px",
    color:"#64748b",
    wordBreak:"break-all"
  },

  stats:{ display:"flex", gap:"15px", marginBottom:"20px" },

  statCard:{
    background:"#111",
    color:"white",
    padding:"15px",
    borderRadius:"10px"
  },

  search:{
    padding:"10px",
    width:"300px",
    marginBottom:"20px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
    gap:"15px"
  },

  card:{
    background:"white",
    padding:"15px",
    borderRadius:"12px",
    boxShadow:"0 4px 15px rgba(0,0,0,0.1)"
  },

  actions:{ display:"flex", gap:"10px", marginTop:"10px" },

  editBtn:{ background:"#2563eb", color:"white", border:"none", padding:"6px" },

  saveBtn:{ background:"green", color:"white", border:"none", padding:"6px" },

  deleteBtn:{ background:"red", color:"white", border:"none", padding:"6px" },

  activity:{ marginTop:"30px" }
};

export default Admin;