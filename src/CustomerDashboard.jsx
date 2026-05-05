import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [customer, setCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [editForm, setEditForm] = useState({
        phone: '',
        address: ''
    });

    useEffect(() => {
        const customerData = localStorage.getItem('customer');
        const token = localStorage.getItem('token');

        if (!customerData || !token) {
            navigate('/login');
            return;
        }

        const parsedCustomer = JSON.parse(customerData);
        setCustomer(parsedCustomer);
        setEditForm({
            phone: parsedCustomer.phone || '',
            address: parsedCustomer.address || ''
        });
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
        setError('');
        setSuccess('');
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/auth/customer/${customer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Profile updated successfully!');
                const updatedCustomer = { ...customer, ...editForm };
                setCustomer(updatedCustomer);
                localStorage.setItem('customer', JSON.stringify(updatedCustomer));
                setIsEditing(false);
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error updating profile:', err);
        }
    };

    const handleCancelEdit = () => {
        setEditForm({
            phone: customer.phone || '',
            address: customer.address || ''
        });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;
    }

    return (
        <div className="customer-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Welcome back, {customer?.name}!</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="dashboard-content">
                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {customer?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-info">
                                <h2>{customer?.name}</h2>
                                <p className="profile-email">{customer?.email}</p>
                            </div>
                        </div>

                        {error && <div className="error-msg">{error}</div>}
                        {success && <div className="success-msg">{success}</div>}

                        <div className="profile-details">
                            <h3>Contact Information</h3>
                            
                            <div className="detail-row">
                                <label>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        className="edit-input"
                                    />
                                ) : (
                                    <p>{customer?.phone || 'Not provided'}</p>
                                )}
                            </div>

                            <div className="detail-row">
                                <label>Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your address"
                                        className="edit-input"
                                        rows="3"
                                    />
                                ) : (
                                    <p>{customer?.address || 'Not provided'}</p>
                                )}
                            </div>

                            <div className="detail-row">
                                <label>Email</label>
                                <p>{customer?.email}</p>
                                <span className="info-text">(Email cannot be changed)</span>
                            </div>

                            <div className="detail-row">
                                <label>Name</label>
                                <p>{customer?.name}</p>
                                <span className="info-text">(Name cannot be changed)</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSaveChanges} className="save-btn">
                                        Save Changes
                                    </button>
                                    <button onClick={handleCancelEdit} className="cancel-btn">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="edit-btn">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <button onClick={() => navigate('/products')} className="action-btn">
                            Browse Products
                        </button>
                        <button onClick={() => navigate('/orders')} className="action-btn">
                            View Orders
                        </button>
                        <button onClick={() => navigate('/cart')} className="action-btn">
                            Go to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
