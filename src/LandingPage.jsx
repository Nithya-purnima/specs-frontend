
import React from "react";
import Navbar from "./Navbar";
import "./LandingPage.css";
import specsBg from './assets/specsbg.jpg'; // Update the extension to match your actual file (.jpg, .png, etc)


import prescGlasses from './assets/presc.jpg';
import sunGlasses from './assets/sunglass.jpg';
import readingGlasses from './assets/reading.jpg';
import eyeGlasses from './assets/eyeglass.jpg';

const categories = [
    { name: "Prescription Glasses", image: prescGlasses },
    { name: "Sunglasses", image: sunGlasses },
    { name: "Reading Glasses", image: readingGlasses },
    { name: "Eye Glasses", image: eyeGlasses },
];

const LandingPage = () => {
    return (
        <>
            <div style={{
                minHeight: '100vh',
                
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <Navbar />

                {/* Hero Section */}
                <div className="hero" style={{ 
    borderRadius: '0 0 32px 32px', 
    paddingBottom: '2rem',
    backgroundImage: `url(${specsBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}}>
    <div className="hero-content">
        <h1>Welcome to SpecsCart</h1>
        <p>Get amazing deals on top products!</p>
        <button
            className="hero-btn"
            onClick={() => window.location.href = "/products"}
        >
            Shop Now
        </button>
    </div>
</div>


                {/* Category Grid */}
                <section className="category-section">
                    <h2>Categories</h2>
                    <div className="category-grid">
                        {categories.map((category, index) => (
                            <div
                                className="category-card"
                                key={index}
                                onClick={() => window.location.href = "/products"}
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name}
                                    style={{
                                        width: '100%',
                                        height: '45%',
                                        objectFit: 'contain',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        background: '#ffffff'
                                    }}
                                />
                                <p style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    margin: '0'
                                }}>{category.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 SpecsCart. All rights reserved.</p>
            </footer>
        </>
    );
};

export default LandingPage;
