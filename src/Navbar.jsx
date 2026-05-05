import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import Sidebar from './Sidebar';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if customer is logged in
        const customer = localStorage.getItem('customer');
        const token = localStorage.getItem('customerToken');
        setIsLoggedIn(!!(customer && token));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('customerToken');
        localStorage.removeItem('cart');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="nav">
            <div className="logo">
                <FaShoppingCart style={{  paddingTop: '9px', paddingLeft: '35px' }} /> SpecsCart
            </div>
            <ul className="navLinks">
                <li><NavLink to="/" className={({ isActive }) => isActive ? "link active" : "link"}>Home</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => isActive ? "link active" : "link"}>Products</NavLink></li>
                {isLoggedIn && (
                    <>
                        <li><NavLink to="/customer-dashboard" className={({ isActive }) => isActive ? "link active" : "link"}>My Profile</NavLink></li>
                        <li><NavLink to="/orders" className={({ isActive }) => isActive ? "link active" : "link"}>Your Orders</NavLink></li>
                        <li><NavLink to="/cart" className={({ isActive }) => isActive ? "link active" : "link"}>Cart</NavLink></li>
                    </>
                )}
                <li><NavLink to="/contactus" className={({ isActive }) => isActive ? "link active" : "link"}>Contact Us</NavLink></li>
                {isLoggedIn ? (
                    <li><button onClick={handleLogout} className="link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit' }}>Logout</button></li>
                ) : (
                    <li><NavLink to="/login" className={({ isActive }) => isActive ? "link active" : "link"}>Login</NavLink></li>
                )}
            </ul>
            <form className="searchForm">
                <input
                    type="text"
                    placeholder="Search..."
                    className="searchInput"
                />
                <button type="submit" className="searchButton">Search</button>
            </form>
            </nav>
    
    );
};

export default Navbar;
