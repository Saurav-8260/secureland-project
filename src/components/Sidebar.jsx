import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
FaHome, FaPlusSquare, FaExchangeAlt, FaDatabase,
FaHistory, FaMap, FaUserShield, FaDrawPolygon
} from "react-icons/fa";

function Sidebar() {

  const location = useLocation();
  const [collapsed,setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;
  const name = localStorage.getItem("adminName");
  const photo = localStorage.getItem("profilePhoto");
  <p>{name || "Admin"}</p>
  const menu = [
    { path:"/home", icon:<FaHome/>, label:"Dashboard" },
    { path:"/register", icon:<FaPlusSquare/>, label:"Register" },
    { path:"/transfer", icon:<FaExchangeAlt/>, label:"Transfer" },
    { path:"/records", icon:<FaDatabase/>, label:"Records" },
    { path:"/history", icon:<FaHistory/>, label:"History" },
    { path:"/map", icon:<FaMap/>, label:"Map" },
    { path:"/admin", icon:<FaUserShield/>, label:"Admin Panel" },
    { path:"/draw", icon:<FaDrawPolygon/>, label:"Draw Land" }
  ];

  return (
    <div style={{
      ...styles.sidebar,
      width: collapsed ? "80px" : "240px"
    }}>

      {/* TOP */}
      <div style={styles.top}>
        {!collapsed && <h2 style={styles.logo}>🚀 SecureLand</h2>}
        <button onClick={()=>setCollapsed(!collapsed)} style={styles.toggle}>
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* PROFILE ICON ONLY (NO PAGE) */}
      <div style={styles.profileBox}>
        <div style={styles.avatar}>
          {photo ? (
            <img src={photo} style={styles.img}/>
          ) : "👤"}
        </div>
        {!collapsed && <p style={{fontSize:"12px"}}>Admin</p>}
      </div>

      {/* MENU */}
      <div style={styles.menu}>
        {menu.map((item,i)=>(
          <Link
            key={i}
            to={item.path}
            style={styles.link(isActive(item.path))}
            title={collapsed ? item.label : ""}

            onMouseEnter={(e)=>{
              if(!isActive(item.path)){
                e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(99,102,241,0.4)";
              }
            }}

            onMouseLeave={(e)=>{
              if(!isActive(item.path)){
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {item.icon}
            {!collapsed && item.label}
          </Link>
        ))}
      </div>

    </div>
  );
}

const styles = {
  sidebar:{
    minHeight:"100vh",
    padding:"15px",
    transition:"all 0.3s ease",
    background:"rgba(255,255,255,0.15)",
    backdropFilter:"blur(12px)",
    borderRight:"1px solid rgba(255,255,255,0.2)",
    boxShadow:"0 8px 32px rgba(0,0,0,0.2)"
  },

  top:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
  },

  toggle:{
    border:"none",
    background:"transparent",
    cursor:"pointer",
    fontSize:"16px"
  },

  logo:{
    fontSize:"18px"
  },

  profileBox:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    marginBottom:"20px"
  },

  avatar:{
    width:"50px",
    height:"50px",
    borderRadius:"50%",
    background:"#6366f1",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    color:"white",
    fontSize:"20px",
    overflow:"hidden"
  },

  img:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },

  menu:{
    display:"flex",
    flexDirection:"column",
    gap:"10px"
  },

  link:(active)=>({
    display:"flex",
    alignItems:"center",
    gap:"10px",
    padding:"10px",
    borderRadius:"10px",
    textDecoration:"none",
    transition:"all 0.3s ease",

    background: active
      ? "linear-gradient(135deg, #6366f1, #a855f7)"
      : "transparent",

    color: active ? "white" : "#1e293b",

    boxShadow: active ? "0 0 15px rgba(168,85,247,0.6)" : "none"
  })
};

export default Sidebar;