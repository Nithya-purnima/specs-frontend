import React, { useState } from 'react';
import './product.css';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

function Product({ product }) {
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const isInCart = cart.some(item => item.id === product.id);
    const isGlassesProduct = true; // all are glasses

    const checkLogin = () => {
        const customer = localStorage.getItem('customer');
        const token = localStorage.getItem('customerToken');
        return customer && token;
    };

    function handleAddToCart() {
        if (!checkLogin()) {
            setShowLoginPrompt(true);
            return;
        }
        if (!isInCart) addToCart(product);
    }

    function handleBuyNow() {
        if (!checkLogin()) {
            setShowLoginPrompt(true);
            return;
        }
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setQuantity(1);
    }

    function handleConfirmBuy() {
        if (quantity < 1) return;

        navigate('/checkout', {
            state: {
                cartItems: [{ ...product, quantity }],
                totalAmount: product.price * quantity
            }
        });

        closeModal();
    }

    return (
        <>
            <div className="card">
                <img
                    src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/300'}
                    alt={product.name}
                    style={{ 
                        width: "100%", 
                        height: "300px", 
                        objectFit: "contain",
                        background: "#f8f9fa",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "15px"
                    }}
                />

                <h3>{product.name}</h3>
                <p>{product.description || product.Description}</p>

                {product.category && product.category !== 'general' && (
                    <span className="category-badge-product">{product.category}</span>
                )}

                <p className="price">Price: ₹{product.price}</p>
                <p>Brand: {product.brand || product.model}</p>

                {isGlassesProduct && (
                    <button
                        onClick={() => navigate('/tryon', {
                            state: { glassesImg: product.image ? `http://localhost:5000${product.image}` : null }
                        })}
                        style={{
                            width: '100%',
                            marginBottom: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '24px',
                            padding: '10px 28px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        👓 Virtual Try-On
                    </button>
                )}

                <button onClick={handleAddToCart} disabled={isInCart}>
                    {isInCart ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                    onClick={handleBuyNow}
                    style={{
                        marginLeft: '10px',
                        background: '#4caf50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '10px 28px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Buy Now
                </button>
            </div>

            {/* ✅ Buy Now Modal */}
            {showModal && (
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
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '32px',
                        minWidth: '320px',
                        maxWidth: '90vw',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        textAlign: 'center'
                    }}>
                        <img src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/180'}
                            alt={product.name}
                            style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />

                        <h2>{product.name}</h2>
                        <p>{product.description || product.Description}</p>

                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Price: ₹{product.price}
                        </p>

                        <p style={{ fontWeight: 500, fontSize: '1.1rem', color: '#4caf50', marginTop: 8 }}>
                            Total: ₹{product.price * quantity}
                        </p>

                        <div style={{ margin: '18px 0' }}>
                            <label htmlFor="quantity" style={{ marginRight: 8 }}>Quantity:</label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{
                                    width: 60,
                                    textAlign: 'center',
                                    borderRadius: 6,
                                    border: '1px solid #ccc',
                                    padding: '6px'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleConfirmBuy}
                            style={{
                                background: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '24px',
                                padding: '10px 28px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginRight: 10
                            }}
                        >
                            Confirm Buy
                        </button>

                        <button
                            onClick={closeModal}
                            style={{
                                background: '#ff4d4f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '24px',
                                padding: '10px 28px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ Login Prompt */}
            {showLoginPrompt && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '40px',
                        minWidth: '320px',
                        textAlign: 'center'
                    }}>
                        <h2>Login Required</h2>
                        <p style={{ color: '#555', marginBottom: 20 }}>
                            Please login or register to continue shopping.
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: '#764ba2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '24px',
                                padding: '10px 24px',
                                marginRight: 10
                            }}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                background: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '24px',
                                padding: '10px 24px'
                            }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Product;
