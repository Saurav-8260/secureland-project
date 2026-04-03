import { useEffect, useState } from "react";

function LandRecords() {

  const [lands, setLands] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const data = JSON.parse(localStorage.getItem("lands")) || [];
    setLands(data);
  }

  function deleteLand(id) {
    const updated = lands.filter((l) => l.id !== id);
    localStorage.setItem("lands", JSON.stringify(updated));
    setLands(updated);
  }

  const filtered = lands.filter(l =>
    l.id.includes(search) ||
    l.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>📊 Land Records</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by ID or Owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filtered.length === 0 ? (
        <p style={styles.empty}>No records found.</p>
      ) : (

        <div style={styles.tableBox}>

          <table style={styles.table}>

            <thead>
              <tr style={styles.headRow}>
                <th>ID</th>
                <th>Location</th>
                <th>Owner</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((l, i) => (
                <tr key={i} style={styles.row}>

                  <td>{l.id}</td>
                  <td>{l.location}</td>
                  <td>{l.owner}</td>

                  <td>
                    {l.documentURL ? (
                      <a
                        href={l.documentURL}
                        target="_blank"
                        style={styles.link}
                      >
                        📎 View
                      </a>
                    ) : "N/A"}
                  </td>

                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteLand(l.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

const styles = {
  container: {
    color: "#0f172a",
  },

  title: {
    marginBottom: "20px",
  },

  search: {
    padding: "10px",
    width: "300px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1"
  },

  empty: {
    color: "#64748b"
  },

  tableBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  headRow: {
    background: "#f1f5f9",
    color: "#0f172a",
  },

  row: {
    background: "white",
    borderBottom: "1px solid #e2e8f0"
  },

  link: {
    color: "#2563eb",
    textDecoration: "none"
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default LandRecords;