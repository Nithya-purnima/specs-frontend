import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="sidebar-close" onClick={closeSidebar}>
                    ×
                </button>

                <div className="sidebar-header">
                    <h2>Login Portal</h2>
                    <p>Choose your account type</p>
                </div>

                <div className="sidebar-links">
                    <Link to="/login" className="sidebar-link customer" onClick={closeSidebar}>
                        <div className="sidebar-link-icon">👤</div>
                        <div className="sidebar-link-content">
                            <h3>Customer</h3>
                            <p>Shop and buy products</p>
                        </div>
                    </Link>

                    <Link to="/seller-login" className="sidebar-link seller" onClick={closeSidebar}>
                        <div className="sidebar-link-icon">🏪</div>
                        <div className="sidebar-link-content">
                            <h3>Seller</h3>
                            <p>Manage your products</p>
                        </div>
                    </Link>

                    <Link to="/admin-login" className="sidebar-link admin" onClick={closeSidebar}>
                        <div className="sidebar-link-icon">⚙️</div>
                        <div className="sidebar-link-content">
                            <h3>Admin</h3>
                            <p>Manage the platform</p>
                        </div>
                    </Link>
                </div>
            </div>

            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
