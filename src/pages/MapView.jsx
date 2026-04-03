import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// 🇮🇳 INDIA BOUNDS
const indiaBounds = [
  [6.0, 68.0],
  [37.0, 97.0]
];

// 🔥 FIX ICON ISSUE
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 📍 custom icon
const icon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

// 📍 Locate button
function LocateButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.locate({ setView: true, maxZoom: 15 })}
      style={styles.locateBtn}
    >
      📍 My Location
    </button>
  );
}

function MapView() {
  const [lands, setLands] = useState([]);
  const [toast, setToast] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ location: "", owner: "" });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("lands")) || [];
    setLands(data);
  }, []);

  function deleteLand(id) {
    if (!window.confirm("Delete land?")) return;

    const updated = lands.filter(l => l.id !== id);
    localStorage.setItem("lands", JSON.stringify(updated));
    setLands(updated);

    showToast("Deleted");
  }

  function startEdit(land) {
    setEditingId(land.id);
    setEditData({ location: land.location, owner: land.owner });
  }

  function saveEdit(id) {
    const updated = lands.map(l =>
      l.id === id ? { ...l, ...editData } : l
    );

    localStorage.setItem("lands", JSON.stringify(updated));
    setLands(updated);

    setEditingId(null);
    showToast("Updated");
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>

      {/* 🔔 TOAST */}
      {toast && <div style={styles.toast}>{toast}</div>}

      <MapContainer
        center={[22.9734, 78.6569]} // India center
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        maxBounds={indiaBounds} // 🔥 restrict India
        maxBoundsViscosity={1.0}
      >

        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        <LocateButton />

        {/* 📍 MARKERS */}
        {lands.map((land, i) => (
          land.lat && land.lng && (
            <Marker key={i} position={[land.lat, land.lng]} icon={icon}>
              <Popup>

                {editingId === land.id ? (
                  <>
                    <input
                      value={editData.location}
                      onChange={(e)=>setEditData({...editData, location:e.target.value})}
                      style={styles.input}
                    />
                    <input
                      value={editData.owner}
                      onChange={(e)=>setEditData({...editData, owner:e.target.value})}
                      style={styles.input}
                    />
                    <button onClick={()=>saveEdit(land.id)} style={styles.btn}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h4>🏠 {land.location || "No Name"}</h4>
                    <p>👤 Owner: {land.owner || "Unknown"}</p>
                    <p>📍 Lat: {land.lat.toFixed(4)}</p>
                    <p>📍 Lng: {land.lng.toFixed(4)}</p>

                    <button onClick={()=>startEdit(land)} style={styles.btn}>
                      Edit
                    </button>

                    <button onClick={()=>deleteLand(land.id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </>
                )}

              </Popup>
            </Marker>
          )
        ))}

      </MapContainer>
    </div>
  );
}

const styles = {
  locateBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    padding: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius:"6px",
    cursor:"pointer"
  },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#111",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    zIndex: 999
  },

  input:{
    display:"block",
    marginBottom:"5px",
    padding:"5px"
  },

  btn:{
    marginRight:"5px",
    padding:"5px",
    background:"#2563eb",
    color:"#fff",
    border:"none",
    borderRadius:"5px"
  },

  deleteBtn:{
    padding:"5px",
    background:"red",
    color:"#fff",
    border:"none",
    borderRadius:"5px"
  }
};

export default MapView;