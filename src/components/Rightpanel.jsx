import { Link } from "react-router-dom";

function RightPanel(){

  const lands = JSON.parse(localStorage.getItem("lands")) || [];
  const last = lands[lands.length - 1];

  return(

    <div style={styles.panel}>

      {/* QUICK STATS */}
      <div style={styles.card}>
        <h3>📊 Stats</h3>
        <p>Total Lands: {lands.length}</p>
        <p>Last Owner: {last?.owner || "N/A"}</p>
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.card}>
        <h3>⚡ Quick Actions</h3>

        <Link to="/register">➕ Register</Link><br/>
        <Link to="/transfer">🔁 Transfer</Link><br/>
        <Link to="/records">📄 Records</Link>

      </div>

      {/* STATUS */}
      <div style={styles.card}>
        <h3>🟢 System Status</h3>
        <p>Blockchain: Connected</p>
        <p>Network: Sepolia</p>
        <p>Status: Active</p>
      </div>

    </div>

  )
}

const styles = {
  panel:{
    width:"250px",
    display:"flex",
    flexDirection:"column",
    gap:"20px"
  },

  card:{
    background:"white",
    padding:"15px",
    borderRadius:"12px",
    boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
  }
};

export default RightPanel;