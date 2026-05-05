import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const SellerRegister = () => {
    const [form, setForm] = useState({ 
        name: "",
        email: "", 
        password: "",
        confirmPassword: "",
        phone: "",
        businessName: "",
        businessAddress: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.phone || !form.businessName) {
            setError("Please fill in all required fields.");
            return;
        }
        
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!/^\d{10}$/.test(form.phone)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/seller/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    businessName: form.businessName,
                    businessAddress: form.businessAddress
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Registration request submitted successfully! Please wait for admin approval.");
                setTimeout(() => {
                    navigate("/seller-login");
                }, 3000);
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to server. Please try again later.");
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', maxWidth: '450px' }}>
                <h2 className="login-title">Seller Registration</h2>
                <p className="login-subtitle">Request to become a seller</p>
                
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                />
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 8 characters) *"
                    value={form.password}
                    onChange={handleChange}
                    className="input"
                />
                
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password *"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="input"
                />
                
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits) *"
                    value={form.phone}
                    onChange={handleChange}
                    className="input"
                    maxLength="10"
                />
                
                <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name *"
                    value={form.businessName}
                    onChange={handleChange}
                    className="input"
                />
                
                <textarea
                    name="businessAddress"
                    placeholder="Business Address (optional)"
                    value={form.businessAddress}
                    onChange={handleChange}
                    className="input"
                    rows="3"
                    style={{ resize: 'vertical' }}
                />
                
                <button type="submit" className="button">Submit Request</button>
                
                {error && <div className="error" style={{ color: '#ff4d4f', marginTop: '12px', fontSize: '14px' }}>{error}</div>}
                {success && <div className="success" style={{ color: '#4caf50', marginTop: '12px', fontSize: '14px' }}>{success}</div>}
                
                <p className="login-footer">
                    Already a seller? <a href="/seller-login" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: '600' }}>Login</a><br />
                    <a href="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Customer Login</a>
                </p>
            </form>
        </div>
    );
};

export default SellerRegister;
