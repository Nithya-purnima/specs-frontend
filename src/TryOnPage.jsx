
import VirtualTryOn from "./VirtualTryOn";
import glasses1 from "./assets/glasses1.png";
import { useLocation, useNavigate } from 'react-router-dom';
import './TryOnPage.css';

function TryOnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedImg = location?.state?.glassesImg || null;
  const glassesImg = passedImg || glasses1;

  const handleExit = () => {
    navigate('/Products');
  };

  return (
    <div className="tryon-page-container">
      <h2 className="tryon-title">Virtual Try-On <span role="img" aria-label="glasses">👓</span></h2>
      <div className="tryon-card" style={{ position: 'relative' }}>
        <button
          className="tryon-exit-btn"
          onClick={handleExit}
          title="Exit Try-On"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(44,62,80,0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#2d3a4a',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(44,62,80,0.18)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(44,62,80,0.08)'}
        >
          &#10005;
        </button>
        <VirtualTryOn glassesImg={glassesImg} />
      </div>
    </div>
  );
}

export default TryOnPage;
