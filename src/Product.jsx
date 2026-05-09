import React, { useState } from 'react';
import './Product.css';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from './config';

function Product({ product }) {
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const isInCart = cart.some(item => item.id === product.id);

    const checkLogin = () => {
        const customer = localStorage.getItem('customer');
        const token = localStorage.getItem('customerToken');
        return customer && token;
    };

    function handleAddToCart() {
        if (!checkLogin()) {
            alert("Please login first");
            return;
        }
        if (!isInCart) addToCart(product);
    }

    function handleBuyNow() {
        if (!checkLogin()) {
            alert("Please login first");
            return;
        }
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setQuantity(1);
    }

    function handleConfirmBuy() {
        navigate('/checkout', {
            state: {
                cartItems: [{ ...product, quantity }],
                totalAmount: product.price * quantity
            }
        });
        closeModal();
    }

    const imageUrl = getImageUrl(product.image);

    return (
        <>
            <div className="card">

                <img
                    src={imageUrl}
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
                <p>{product.description}</p>

                {/* CATEGORY CLICK */}
                {product.category && (
                    <span
                        className="category-badge-product"
                        style={{ cursor: 'pointer', color: 'white', fontWeight: 600 }}
                        onClick={() =>
                            navigate(`/products?category=${encodeURIComponent(product.category)}`)
                        }
                    >
                        {product.category}
                    </span>
                )}

                <p className="price">Price: ₹{product.price}</p>
                <p>Brand: {product.brand}</p>

                {/* 👓 VIRTUAL TRY ON BUTTON (FIXED - ADDED BACK) */}
                <button
                    onClick={() =>
                        navigate('/tryon', {
                            state: {
                                glassesImg: imageUrl
                            }
                        })
                    }
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

                <button onClick={handleAddToCart} disabled={isInCart}>
                    {isInCart ? "Added to Cart" : "Add to Cart"}
                </button>

                <button onClick={handleBuyNow}>
                    Buy Now
                </button>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <img
                            src={imageUrl}
                            alt={product.name}
                            style={{
                                width: '180px',
                                height: '180px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginBottom: '16px'
                            }}
                        />

                        <h2>{product.name}</h2>
                        <p>{product.description}</p>

                        <p><b>Price: ₹{product.price}</b></p>

                        <p style={{ color: '#4caf50' }}>
                            Total: ₹{product.price * quantity}
                        </p>

                        <div style={{ margin: '18px 0' }}>
                            <label>Quantity: </label>

                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Math.max(1, Number(e.target.value)))
                                }
                            />
                        </div>

                        <button onClick={handleConfirmBuy}>Confirm Buy</button>
                        <button onClick={closeModal}>Cancel</button>

                    </div>
                </div>
            )}
        </>
    );
}

export default Product;