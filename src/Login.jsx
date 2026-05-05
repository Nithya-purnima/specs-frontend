import Navbar from "./Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';


const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('customer', JSON.stringify(data.user));
                localStorage.setItem('customerToken', data.token);
                // Redirect back to products page after login
                navigate("/products");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to server. Please try again later.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
       <><Navbar />
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
                    <h2 className="login-title">Welcome Back </h2>
                    <p className="login-subtitle">Login to continue</p>
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="input"
                    />
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <div className="error">{error}</div>}
                    <p className="login-footer">Don't have an account? <a href="/register" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: '600' }}>Sign up</a></p>
                </form>
            </div>
            </>
     
    );
};
export default Login