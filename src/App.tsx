import React from "react";

function App() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "sans-serif",
      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      color: "#0f172a"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "2rem 2.5rem",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Employee Feedback Analysis</h1>
        <p style={{ margin: "0.75rem 0 0", color: "#475569" }}>
          Frontend ready for Vite + React.
        </p>
      </div>
    </main>
  );
}

export default App;
