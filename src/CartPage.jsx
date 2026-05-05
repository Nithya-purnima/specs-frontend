
import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import cartempty from "./cartempty.png";
function CartPage() {
    const { cart, removeFromCart, buyProduct } = useCart();
    const navigate = useNavigate();
    const [modalItem, setModalItem] = useState(null);

    function handleBuyNow(item) {
        buyProduct(item, 1);
        setModalItem(item);
    }

    function closeModal() {
        setModalItem(null);
    }

    function handleBuyAll() {
        if (cart.length === 0) return;
        cart.forEach(item => {
            // If item already in orders, quantity will be handled in context
            buyProduct(item, 1);
        });
        setModalItem(null);
    }

    return (
        <div>
            <Navbar />
            
            {cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                    <img src={cartempty} alt="Cart is empty" style={{ width: '180px', marginBottom: '1rem', opacity: 0.85 }} />
                    <p style={{ fontSize: '1.2rem', color: '#888', fontWeight: 500 }}>Your cart is empty! Add some products to get started.</p>
                </div>
            ) : (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {cart.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "16px",
                                background: "#fafafa"
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "16px", borderRadius: "8px" }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: "0 0 8px 0" }}>{item.name}</h3>
                                <p style={{ margin: "0 0 8px 0" }}>{item.Description || item.description}</p>
                                <strong>₹{item.price}</strong>
                            </div>
                            <button
                                style={{ marginLeft: "16px", padding: "8px 16px", borderRadius: "6px", border: "none", background: "#ff4d4f", color: "#fff", cursor: "pointer" }}
                                onClick={() => removeFromCart(item.id)}
                            >
                                Remove
                            </button>
                            <button
                                style={{ marginLeft: "10px", background: '#4caf50', color: '#fff', border: 'none', borderRadius: '24px', padding: '10px 28px', fontWeight: 600, cursor: 'pointer' }}
                                onClick={() => handleBuyNow(item)}
                            >
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total: ₹{cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)}
                    </div>
                    <button
                        onClick={() => {
                            const customer = localStorage.getItem('customer');
                            if (!customer) {
                                alert('Please login to proceed with checkout');
                                navigate('/login');
                                return;
                            }
                            navigate('/checkout', {
                                state: {
                                    cartItems: cart,
                                    totalAmount: cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
                                }
                            });
                        }}
                        style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: '24px', padding: '12px 32px', fontWeight: 600, cursor: 'pointer', fontSize: '1.1rem' }}
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
                {modalItem && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative' }}>
                            <img src={modalItem.image} alt={modalItem.name} style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                            <h2>{modalItem.name}</h2>
                            <p>{modalItem.Description}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Price: ₹{modalItem.price}</p>
                            <button onClick={closeModal} style={{ marginTop: '18px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '24px', padding: '10px 28px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
    );
}

export default CartPage;