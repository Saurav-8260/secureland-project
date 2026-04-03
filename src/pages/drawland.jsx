import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  GeoJSON
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import indiaGeo from "../data/india.json";

// 🎯 ICONS
const selectedIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32]
});

// 🔥 INDIA CHECK
function isInsideIndia(lat, lng, geoData){

  function pointInPolygon(point, vs) {
    let x = point[0], y = point[1];
    let inside = false;

    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0], yi = vs[i][1];
      let xj = vs[j][0], yj = vs[j][1];

      let intersect =
        ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  }

  const point = [lng, lat];

  for (const feature of geoData.features) {
    const geom = feature.geometry;

    if (geom.type === "Polygon") {
      if (pointInPolygon(point, geom.coordinates[0])) return true;
    }

    if (geom.type === "MultiPolygon") {
      for (const polygon of geom.coordinates) {
        if (pointInPolygon(point, polygon[0])) return true;
      }
    }
  }

  return false;
}

// 📍 CLICK
function LocationMarker({ setCoords }) {

  const [pos,setPos] = useState(null);

  useMapEvents({
    click(e){

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if(!isInsideIndia(lat, lng, indiaGeo)){
        alert("❌ Only India allowed");
        return;
      }

      setPos([lat, lng]);
      setCoords({ lat, lng });

      localStorage.setItem("selectedLocation", JSON.stringify({
        lat,
        lng
      }));
    }
  });

  return pos ? (
    <Marker position={pos} icon={selectedIcon}>
      <Popup>📍 Selected Location</Popup>
    </Marker>
  ) : null;
}

// 🔥 MAIN
function DrawLand(){

  const [coords,setCoords] = useState(null);
  const [lands,setLands] = useState([]);

  useEffect(()=>{
    loadLands();
    window.addEventListener("storage", loadLands);
    return ()=>window.removeEventListener("storage", loadLands);
  },[]);

  function loadLands(){
    const data = JSON.parse(localStorage.getItem("lands")) || [];
    setLands(data);
  }

  return(

    <div style={{height:"90vh"}}>

      <h2>📍 Select & View Lands (India Only)</h2>

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{height:"80vh"}}
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {/* 🇮🇳 INDIA */}
        <GeoJSON
          data={indiaGeo}
          style={{
            color: "green",
            weight: 2,
            fillOpacity: 0.1
          }}
        />

        <LocationMarker setCoords={setCoords}/>

        {/* 🔥 SAVED LANDS */}
        {lands.map((land, i)=>{

          const isFraud = land.id % 2 === 0;

          const icon = new L.Icon({
            iconUrl: isFraud
              ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            iconSize: [32,32]
          });

          // 🔥 GET PREVIOUS OWNER
          const prevOwner =
            land.history && land.history.length > 1
              ? land.history[land.history.length - 2].owner
              : "None";

          return(
            land.lat && land.lng && (
              <Marker key={i} position={[land.lat, land.lng]} icon={icon}>
                <Popup>
                  <h4>🏡 Land Details</h4>

                  <b>ID:</b> {land.id} <br/>
                  <b>Owner:</b> {land.owner} <br/>
                  <b>Previous Owner:</b> {prevOwner} <br/>
                  <b>Location:</b> {land.location} <br/>

                  {isFraud && (
                    <span style={{color:"red"}}>
                      ⚠ Risk Detected
                    </span>
                  )}

                </Popup>
              </Marker>
            )
          );
        })}

      </MapContainer>

      {coords && (
        <p style={{marginTop:"10px"}}>
          ✅ Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      )}

    </div>
  );
}

export default DrawLand;