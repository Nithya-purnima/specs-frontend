import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({});
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        const token = localStorage.getItem('adminToken');

        if (!adminData || !token) {
            navigate('/admin-login');
            return;
        }

        setAdmin(JSON.parse(adminData));
        fetchDashboardData(token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            // Fetch all data in parallel
            const [statsRes, customersRes, productsRes, sellersRes, pendingSellersRes] = await Promise.all([
                fetch('http://localhost:5000/api/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/dashboard/customers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/dashboard/products', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/dashboard/sellers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/dashboard/sellers/pending', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const statsData = await statsRes.json();
            const customersData = await customersRes.json();
            const productsData = await productsRes.json();
            const sellersData = await sellersRes.json();
            const pendingSellersData = await pendingSellersRes.json();

            setStats(statsData.stats || {});
            setCustomers(customersData.customers || []);
            setProducts(productsData.products || []);
            setSellers(sellersData.sellers || []);
            setPendingSellers(pendingSellersData.sellers || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const handleApproveSeller = async (sellerId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/dashboard/sellers/${sellerId}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setSuccess('Seller approved successfully!');
                fetchDashboardData(token);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to approve seller');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error approving seller:', err);
        }
    };

    const handleRejectSeller = async (sellerId) => {
        if (!window.confirm('Are you sure you want to reject this seller?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/dashboard/sellers/${sellerId}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setSuccess('Seller rejected successfully!');
                fetchDashboardData(token);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to reject seller');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error rejecting seller:', err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/dashboard/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setSuccess('Product deleted successfully!');
                fetchDashboardData(token);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete product');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error deleting product:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;
    }

    return (
        <>
        <Navbar/>
        <div className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {admin?.name}!</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="admin-content">
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <div className="tabs">
                    <button 
                        className={activeTab === 'overview' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={activeTab === 'pending' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Sellers ({pendingSellers.length})
                    </button>
                    <button 
                        className={activeTab === 'sellers' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('sellers')}
                    >
                        All Sellers
                    </button>
                    <button 
                        className={activeTab === 'products' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button 
                        className={activeTab === 'customers' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('customers')}
                    >
                        Customers
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <h2>Dashboard Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Customers</h3>
                                <p className="stat-number">{stats.customers || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Sellers</h3>
                                <p className="stat-number">{stats.sellers || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Products</h3>
                                <p className="stat-number">{stats.products || 0}</p>
                            </div>
                            <div className="stat-card pending">
                                <h3>Pending Sellers</h3>
                                <p className="stat-number">{stats.pendingSellers || 0}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div className="section">
                        <h2>Pending Seller Requests</h2>
                        {pendingSellers.length === 0 ? (
                            <p className="empty-state">No pending seller requests</p>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Business Name</th>
                                            <th>Business Address</th>
                                            <th>Requested On</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingSellers.map(seller => (
                                            <tr key={seller.id}>
                                                <td>{seller.id}</td>
                                                <td>{seller.name}</td>
                                                <td>{seller.email}</td>
                                                <td>{seller.phone}</td>
                                                <td><strong>{seller.businessName}</strong></td>
                                                <td>{seller.businessAddress || 'N/A'}</td>
                                                <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleApproveSeller(seller.id)}
                                                        className="approve-btn"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRejectSeller(seller.id)}
                                                        className="reject-btn"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sellers' && (
                    <div className="section">
                        <h2>All Sellers</h2>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Business Name</th>
                                        <th>Status</th>
                                        <th>Registered On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map(seller => (
                                        <tr key={seller.id}>
                                            <td>{seller.id}</td>
                                            <td>{seller.name}</td>
                                            <td>{seller.email}</td>
                                            <td>{seller.phone}</td>
                                            <td><strong>{seller.businessName}</strong></td>
                                            <td>
                                                <span className={`status-badge ${seller.status}`}>
                                                    {seller.status}
                                                </span>
                                            </td>
                                            <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="section">
                        <h2>All Products</h2>
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <img 
                                        src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/200'} 
                                        alt={product.name}
                                    />
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <p className="product-brand">Brand: {product.brand}</p>
                                        <p className="product-price">₹{product.price}</p>
                                        <p className="product-seller">Seller: {product.seller?.businessName}</p>
                                        <p className="product-stock">Stock: {product.stock}</p>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)} 
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="section">
                        <h2>All Customers</h2>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Registered On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.address || 'N/A'}</td>
                                            <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;
