import { useEffect, useState } from "react";

function History(){

  const [data,setData] = useState([]);

  useEffect(()=>{
    const lands = JSON.parse(localStorage.getItem("lands")) || [];
    setData(lands);
  },[]);

  return(

    <div style={{padding:"20px"}}>

      <h1>📜 Transaction History</h1>

      {data.length === 0 ? (
        <p>No history found</p>
      ) : (

        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Owner</th>
            </tr>
          </thead>

          <tbody>

            {data.map((l,i)=>(
              <tr key={i}>
                <td>{l.id}</td>
                <td>{l.location}</td>
                <td>{l.owner}</td>
              </tr>
            ))}

          </tbody>
        </table>

      )}

    </div>
  )
}

const table = {
  width: "100%",
  marginTop: "20px",
  borderCollapse: "collapse",
  background: "white",   // 🔥 ADD
  color: "black"         // 🔥 ADD
};

export default History;