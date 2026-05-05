import React, { useState } from "react";
import './Contact.css';
import Navbar from "./Navbar";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send to backend logic here
        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
            <div className="contact-container">

                <h2 className="contact-title">Contact Us</h2>
                {submitted ? (
                    <div style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>
                    Thank you for contacting us! We’ll get back to you soon.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <div>
                        <label className="contact-label">Name</label>
                        <input
                        placeholder="Your Name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="contact-input"
                        />
                    </div>
                    <div>
                        <label className="contact-label">Email</label>
                        <input
                            placeholder="Your Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="contact-input"
                        />
                    </div>
                    <div>
                        <label className="contact-label">Message</label>
                        <textarea
                            placeholder="Your Message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="contact-textarea"
                        />
                    </div>
                    <button type="submit" className="contact-button">
                        Send Message
                    </button>
                </form>
            )}
        </div>
        </>
    );
};

export default Contact;
