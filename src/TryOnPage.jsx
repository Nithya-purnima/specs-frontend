// src/pages/TryOnPage.js
import VirtualTryOn from "./VirtualTryOn";
import glasses1 from "./assets/glasses1.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./TryOnPage.css";

function TryOnPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // glasses image passed from product page
  const glassesImg =
    location?.state?.glassesImg || glasses1;

  const handleExit = () => {
    navigate("/Products");
  };

  return (
    <div className="tryon-page-container">
      
      {/* TITLE */}
      <h2 className="tryon-title">
        Virtual Try-On 👓
      </h2>

      {/* CARD */}
      <div
        className="tryon-card"
        style={{ position: "relative" }}
      >

        {/* EXIT BUTTON */}
        <button
          onClick={handleExit}
          title="Exit Try-On"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "rgba(44,62,80,0.08)",
            border: "none",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: "#2d3a4a",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ✕
        </button>

        {/* AR COMPONENT */}
        <VirtualTryOn glassesImg={glassesImg} />

      </div>
    </div>
  );
}

export default TryOnPage;