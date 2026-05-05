

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import cartempty from "./cartempty.png";

import './OrderPage.css';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('customerToken');
            const customer = localStorage.getItem('customer');

            if (!token || !customer) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/orders/customer/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <h2>Loading your orders...</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="order-page-container">
                <h2 className="order-header">Your Orders</h2>
                {(!orders || orders.length === 0) ? (
                    <div className="order-items" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                        <img src={cartempty} alt="No orders" style={{ width: '180px', marginBottom: '1rem', opacity: 0.85 }} />
                        <p className="item-name" style={{ fontSize: '1.2rem', color: '#888', fontWeight: 500, textAlign: 'center' }}>You have not placed any orders yet.<br/>Start shopping and your orders will appear here!</p>
                    </div>
                ) : (
                    <div className="order-items-grid">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className={`order-status status-${order.status}`}>{order.status}</span>
                                    </div>
                                    <div className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="order-card-body">
                                    <div className="item-details">
                                        <img 
                                            src={order.product?.image ? `http://localhost:5000${order.product.image}` : 'https://via.placeholder.com/100'} 
                                            alt={order.product?.name} 
                                            className="item-image" 
                                        />
                                        <div className="item-info">
                                            <div className="item-name">{order.product?.name || 'Product'}</div>
                                            <div className="item-brand">{order.product?.brand || 'N/A'}</div>
                                            <div className="item-qty">Quantity: {order.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span>Total Amount:</span>
                                            <strong className="item-price">₹{order.totalPrice}</strong>
                                        </div>
                                        <div className="detail-row">
                                            <span>Seller:</span>
                                            <span>{order.seller?.businessName || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Delivery Address:</span>
                                            <span className="address-text">{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default OrdersPage;
