import React from "react";


export default function Home() {
  return (
    <React.Fragment>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          main {
            padding: 10vw;
            flex-direction: column;
            gap: 5px;
          }

          h1 {
            font-size: 1.5rem;
          }

          p {
            font-size: 1rem;
          }
        }
      `}</style>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        margin: "0", 
        padding: "0",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box"
      }}>
        <main style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "5vw",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "white",
          textAlign: "center",
          flexWrap: "wrap",
          gap: "50px",
          height: "100vh",
          marginTop: "40px",
        }}>
          <div style={{ maxWidth: "500px", textAlign: "left" }}>
            <h1 style={{ fontSize: "2.5rem" }}>Welcome to Crowd Funding</h1>
            <p style={{ fontSize: "1.2rem" }}>Explore campaigns or start your own!</p>
          </div>
          <div style={{ maxWidth: "500px" }}>
            <img 
              src="/homeimage.png" 
              alt="Crowdfunding" 
              style={{ 
                width: "100%", 
                height: "auto", 
                borderRadius: "10px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" 
              }} 
            />
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}