import { loginUser } from "../api/backend";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar(){

  const [account,setAccount] = useState("");
  const [notiOpen,setNotiOpen] = useState(false);
  const [userOpen,setUserOpen] = useState(false);
  const [dark,setDark] = useState(false);
  const [notifications,setNotifications] = useState([]);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(()=>{
    checkConnection();

    const data = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(data);

    document.body.classList.add("light");
  },[]);

  async function checkConnection(){
    try{
      if(window.ethereum){
        const acc = await window.ethereum.request({ method:"eth_accounts" });
        if(acc.length > 0){
          setAccount(acc[0]);
        }
      }
    }catch(err){
      console.log(err);
    }
  }

  async function connectWallet(){
    try{
      if(!window.ethereum){
        alert("Install MetaMask ❌");
        return;
      }

      const acc = await window.ethereum.request({
        method:"eth_requestAccounts"
      });

      const wallet = acc[0];
      setAccount(wallet);

      try{
        const data = await loginUser(wallet);
        localStorage.setItem("token", data.token);
      }catch{}
    }catch(err){
      if(err.code === 4001){
        alert("User rejected ❌");
      }
    }
  }

  function logout(){
    setAccount("");
    setUserOpen(false);
    localStorage.removeItem("token");
  }

  function toggleDark(){
    const isDark = !dark;
    setDark(isDark);

    document.body.classList.remove("light","dark");

    document.body.classList.add(isDark ? "dark" : "light");
  }

  function clearNotifications(){
    localStorage.setItem("notifications","[]");
    setNotifications([]);
  }

  useEffect(()=>{
    function handleClickOutside(e){
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setNotiOpen(false);
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return ()=>document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  // 🔥 INITIALS (Premium Avatar)
  const initials = account ? account.slice(2,4).toUpperCase() : "👤";

  return(
    <div style={styles.navbar}>

      <h2 style={styles.logo}>🚀 SecureLand</h2>

      <div style={styles.right} ref={dropdownRef}>

        {/* 🌙 DARK */}
        <button onClick={toggleDark} style={styles.iconBtn}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🔔 NOTIFICATION */}
        <div style={styles.bell} onClick={()=>setNotiOpen(!notiOpen)}>
          🔔
          {notifications.length > 0 && (
            <span style={styles.badge}>{notifications.length}</span>
          )}
        </div>

        {notiOpen && (
          <div style={styles.dropdown}>
            <h4>🔔 Notifications</h4>

            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n,i)=>(
                <div key={i} style={styles.notiItem}>
                  <p>{n.message}</p>
                  <span>{n.time}</span>
                </div>
              ))
            )}

            <button onClick={clearNotifications} style={styles.clearBtn}>
              Clear All
            </button>
          </div>
        )}

        {/* 👤 USER */}
        {account ? (
          <>
            <div style={styles.userBox} onClick={()=>setUserOpen(!userOpen)}>
              <div style={styles.avatar}>{initials}</div>
              <span>{account.slice(0,6)}...</span>
            </div>

            {userOpen && (
              <div style={styles.dropdown}>

                <p style={{fontSize:"12px", opacity:0.7}}>Wallet</p>
                <p style={{wordBreak:"break-all"}}>{account}</p>

                <p style={styles.adminBadge}>👑 Admin</p>

                <button onClick={logout} style={styles.logoutBtn}>
                  🚪 Logout
                </button>

              </div>
            )}
          </>
        ) : (
          <button onClick={connectWallet} style={styles.btn}>
            🔐 Connect Wallet
          </button>
        )}

      </div>

    </div>
  );
}

const styles = {
  navbar:{
    height:"60px",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"0 20px",
    background:"rgba(255,255,255,0.15)",
    backdropFilter:"blur(15px)",
    borderBottom:"1px solid rgba(255,255,255,0.2)"
  },

  logo:{
    fontWeight:"bold"
  },

  right:{
    display:"flex",
    alignItems:"center",
    gap:"15px",
    position:"relative"
  },

  iconBtn:{
    border:"none",
    background:"transparent",
    fontSize:"18px",
    cursor:"pointer"
  },

  bell:{
    position:"relative",
    cursor:"pointer",
    fontSize:"20px"
  },

  badge:{
    position:"absolute",
    top:"-5px",
    right:"-8px",
    background:"red",
    color:"white",
    borderRadius:"50%",
    fontSize:"10px",
    padding:"2px 6px"
  },

  userBox:{
    display:"flex",
    alignItems:"center",
    gap:"8px",
    cursor:"pointer"
  },

  avatar:{
    width:"34px",
    height:"34px",
    borderRadius:"50%",
    background:"linear-gradient(135deg,#6366f1,#a855f7)",
    color:"white",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontWeight:"bold"
  },

  dropdown:{
    position:"absolute",
    top:"50px",
    right:"0",
    background:"rgba(255,255,255,0.95)",
    backdropFilter:"blur(10px)",
    padding:"12px",
    borderRadius:"12px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.2)",
    width:"240px",
    zIndex:1000
  },

  notiItem:{
    borderBottom:"1px solid #eee",
    padding:"6px 0",
    fontSize:"12px"
  },

  adminBadge:{
    marginTop:"10px",
    padding:"5px",
    background:"linear-gradient(135deg,#facc15,#f59e0b)",
    borderRadius:"8px",
    textAlign:"center",
    fontWeight:"bold"
  },

  clearBtn:{
    width:"100%",
    marginTop:"10px"
  },

  btn:{
    background:"#2563eb",
    color:"white",
    border:"none",
    padding:"8px",
    borderRadius:"8px"
  },

  logoutBtn:{
    width:"100%",
    marginTop:"10px",
    background:"red",
    color:"white",
    border:"none",
    padding:"8px",
    borderRadius:"8px"
  }
};

export default Navbar;