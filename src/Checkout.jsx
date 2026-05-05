import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems = [], totalAmount = 0 } = location.state || {};

    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
    const [loading, setLoading] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const handleShippingChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
    };

    const proceedToPayment = () => {
        if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode || !shippingInfo.phone) {
            alert('Please fill in all shipping details');
            return;
        }
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
            alert('Please fill in all payment details');
            return;
        }

        setLoading(true);

        try {
            const customer = JSON.parse(localStorage.getItem('customer'));
            const token = localStorage.getItem('customerToken');

            if (!customer || !token) {
                alert('Please login to place order');
                navigate('/login');
                return;
            }

            const deliveryAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`;

            // Place orders for each cart item
            for (const item of cartItems) {
                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        deliveryAddress: deliveryAddress,
                        phone: shippingInfo.phone
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to place order');
                }
            }

            // Clear cart
            localStorage.removeItem('cart');

            // Show success and redirect
            setStep(3);
            setTimeout(() => {
                navigate('/orders');
            }, 3000);

        } catch (error) {
            alert('Error placing order: ' + error.message);
            console.error('Order error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <div className="empty-checkout">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate('/products')} className="btn-primary">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Shipping</div>
                </div>
                <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Payment</div>
                </div>
                <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Confirmation</div>
                </div>
            </div>

            <div className="checkout-content">
                <div className="checkout-main">
                    {step === 1 && (
                        <div className="shipping-form">
                            <h2>Shipping Address</h2>
                            <form onSubmit={(e) => { e.preventDefault(); proceedToPayment(); }}>
                                <div className="form-group">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleShippingChange}
                                        placeholder="Enter your street address"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleShippingChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingInfo.state}
                                            onChange={handleShippingChange}
                                            placeholder="State"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={shippingInfo.pincode}
                                            onChange={handleShippingChange}
                                            placeholder="Pincode"
                                            maxLength="6"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingInfo.phone}
                                            onChange={handleShippingChange}
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary">
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="payment-form">
                            <h2>Payment Details</h2>
                            
                            <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                                <div className="form-group">
                                    <label>Card Number *</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={paymentInfo.cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Card Holder Name *</label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={paymentInfo.cardHolder}
                                        onChange={handlePaymentChange}
                                        placeholder="Name on card"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date *</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={paymentInfo.expiryDate}
                                            onChange={handlePaymentChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV *</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={handlePaymentChange}
                                            placeholder="123"
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="order-confirmation">
                            <div className="success-icon">✓</div>
                            <h2>Order Placed Successfully!</h2>
                            <p>Thank you for your purchase. Your order has been confirmed.</p>
                            <p className="redirect-note">Redirecting to your orders page...</p>
                            <div className="confirmation-details">
                                <h3>Order Summary</h3>
                                <p><strong>Items:</strong> {cartItems.length}</p>
                                <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
                                <p><strong>Delivery Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="checkout-sidebar">
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="summary-item">
                                    <img
                                        src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/60'}
                                        alt={item.name}
                                    />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-quantity">Qty: {item.quantity || 1}</p>
                                    </div>
                                    <p className="item-price">₹{item.price * (item.quantity || 1)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
