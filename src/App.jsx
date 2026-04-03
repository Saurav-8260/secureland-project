import Welcome from "./pages/Welcome";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

import Dashboard from "./pages/Dashboard";
import RegisterLand from "./pages/RegisterLand";
import TransferLand from "./pages/TransferLand";
import LandRecords from "./pages/LandRecords";
import History from "./pages/History";
import MapView from "./pages/MapView";
import Admin from "./pages/Admin";
import DrawLand from "./pages/drawland";


// 🔥 CURSOR GLOW COMPONENT
function CursorGlow(){
  useEffect(()=>{
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const move = (e)=>{
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);

    return ()=>{
      window.removeEventListener("mousemove", move);
      glow.remove();
    };
  },[]);

  return null;
}


function Layout() {

  const location = useLocation();
  const isMapPage = location.pathname === "/map";
  const isWelcomePage = location.pathname === "/";

  return (
    <div style={styles.appContainer}>

      {/* 🔥 HIDE SIDEBAR ON WELCOME */}
      {!isWelcomePage && <Sidebar />}

      <div style={styles.main}>

        {/* 🔥 HIDE NAVBAR ON WELCOME */}
        {!isMapPage && !isWelcomePage && <Navbar />}

        <div style={
          isWelcomePage
            ? styles.welcomeBody
            : isMapPage
            ? styles.mapBody
            : styles.body
        }>

          <div style={
            isWelcomePage
              ? styles.welcomeContent
              : isMapPage
              ? styles.mapContent
              : styles.content
          }>

            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Dashboard />} />

              <Route path="/register" element={<RegisterLand />} />
              <Route path="/transfer" element={<TransferLand />} />
              <Route path="/records" element={<LandRecords />} />
              <Route path="/history" element={<History />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/draw" element={<DrawLand />} />
            </Routes>

          </div>

          {/* 🔥 HIDE RIGHT PANEL ON WELCOME */}
          {!isMapPage && !isWelcomePage && <RightPanel />}

        </div>

      </div>

      <CursorGlow /> {/* 🔥 IMPORTANT ADD */}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    height: "100vh",
    width: "100vw"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },

  body: {
    display: "flex",
    gap: "20px",
    padding: "15px",
    height: "100%"
  },

  content: {
    flex: 1,
    padding: "20px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: "16px",
    overflowY: "auto"
  },

  mapBody: {
    display: "flex",
    height: "100%",
    width: "100%"
  },

  mapContent: {
    flex: 1,
    height: "100%",
    width: "100%",
    padding: "0",
    margin: "0",
    background: "transparent"
  },

  welcomeBody: {
    height: "100vh",
    width: "100vw"
  },

  welcomeContent: {
    height: "100%",
    width: "100%",
    padding: "0",
    margin: "0"
  }
};

export default App;