import { useState } from "react";
import { getContract } from "../blockchain/contract";
import { uploadToIPFS } from "../blockchain/ipfs";

function TransferLand(){

  const [id,setId]=useState("");
  const [newOwner,setNewOwner]=useState("");
  const [file,setFile]=useState(null);
  const [loading,setLoading]=useState(false);

  async function transfer(){

    try{

      if(!id || !newOwner){
        alert("⚠️ Fill all fields");
        return;
      }

      if(!file){
        alert("📄 Upload transfer document");
        return;
      }

      const lands = JSON.parse(localStorage.getItem("lands")) || [];

      const land = lands.find(l => String(l.id) === String(id));

      if(!land){
        alert("❌ Land not found");
        return;
      }

      // 🔥 OWNER VALIDATION (IMPORTANT)
      // (Note: yaha wallet validation simplified hai)
      const currentWallet = localStorage.getItem("token"); // ya apna wallet logic use kar
      if(!currentWallet){
        alert("❌ Connect wallet first");
        return;
      }

      setLoading(true);

      // 📄 Upload transfer proof
      const documentURL = await uploadToIPFS(file);

      // 🔗 Blockchain transfer
      const contract = await getContract();

      const tx = await contract.transferOwnership(
        Number(id),
        newOwner
      );

      await tx.wait();

      // 🔥 UPDATE LOCAL DATA

      // update owner
      land.owner = newOwner;

      // add transfer doc
      land.transferDoc = documentURL;

      // 🔥 HISTORY ADD
      if(!land.history){
        land.history = [];
      }

      land.history.push({
        owner: newOwner,
        date: new Date().toLocaleString()
      });

      // save updated list
      localStorage.setItem("lands", JSON.stringify(lands));

      // 🔔 NOTIFICATION
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

      notifications.push({
        message: `Land #${id} transferred to ${newOwner}`,
        time: new Date().toLocaleString()
      });

      localStorage.setItem("notifications", JSON.stringify(notifications));

      alert("✅ Ownership Transferred");

      setId("");
      setNewOwner("");
      setFile(null);
      setLoading(false);

    }catch(err){

      console.log(err);
      setLoading(false);
      alert("❌ Transaction Failed");

    }
  }

  return(

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>🔄 Transfer Land</h1>

        <input
          placeholder="Land ID"
          value={id}
          onChange={e=>setId(e.target.value)}
        />

        <input
          placeholder="New Owner Name"
          value={newOwner}
          onChange={e=>setNewOwner(e.target.value)}
        />

        {/* 📄 DOCUMENT */}
        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <button onClick={transfer}>
          {loading ? "Processing..." : "Transfer Ownership"}
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
    minWidth:"300px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
  }
};

export default TransferLand;