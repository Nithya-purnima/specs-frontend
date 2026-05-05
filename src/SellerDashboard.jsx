import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

const SellerDashboard = () => {
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        brand: '',
        stock: '',
        category: 'specs',
        image: null
    });

    useEffect(() => {
        const sellerData = localStorage.getItem('seller');
        const token = localStorage.getItem('sellerToken');

        if (!sellerData || !token) {
            navigate('/seller-login');
            return;
        }

        setSeller(JSON.parse(sellerData));
        fetchProducts(token);
        fetchOrders(token);
    }, [navigate]);

    const fetchProducts = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/products/seller/my-products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/orders/seller/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('seller');
        localStorage.removeItem('sellerToken');
        navigate('/seller-login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({ ...productForm, [name]: value });
        setError('');
        setSuccess('');
    };

    const handleImageChange = (e) => {
        setProductForm({ ...productForm, image: e.target.files[0] });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!productForm.name || !productForm.description || !productForm.price || !productForm.brand) {
            setError('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('brand', productForm.brand);
        formData.append('stock', productForm.stock || 0);
        formData.append('category', productForm.category);
        if (productForm.image) {
            formData.append('image', productForm.image);
        }

        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Product added successfully!');
                setProductForm({ name: '', description: '', price: '', brand: '', stock: '', category: 'specs', image: null });
                setShowAddProduct(false);
                fetchProducts(token);
            } else {
                setError(data.message || 'Failed to add product');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error adding product:', err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setSuccess('Product deleted successfully!');
                fetchProducts(token);
            } else {
                setError('Failed to delete product');
            }
        } catch (err) {
            setError('Unable to connect to server');
            console.error('Error deleting product:', err);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div>;
    }

    return (
        <div className="seller-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Seller Dashboard</h1>
                    <p>Welcome, {seller?.businessName}!</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="dashboard-content">
                <div className="stats-section">
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p className="stat-number">{products.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Stock</h3>
                        <p className="stat-number">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{orders.length}</p>
                    </div>
                </div>

                <div className="tabs-section">
                    <button 
                        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        My Products
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Customer Orders ({orders.length})
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div className="products-section">
                        <div className="section-header">
                            <h2>My Products</h2>
                            <button onClick={() => setShowAddProduct(!showAddProduct)} className="add-product-btn">
                                {showAddProduct ? 'Cancel' : '+ Add Product'}
                            </button>
                        </div>

                        {error && <div className="error-msg">{error}</div>}
                        {success && <div className="success-msg">{success}</div>}

                        {showAddProduct && (
                            <form onSubmit={handleAddProduct} className="product-form">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Product Name *"
                                    value={productForm.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Product Description *"
                                    value={productForm.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price *"
                                    value={productForm.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    required
                                />
                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="Brand Name *"
                                    value={productForm.brand}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Stock Quantity"
                                    value={productForm.stock}
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleInputChange}
                                    className="category-select"
                                >
                                    <option value="specs">Prescription Specs</option>
                                    <option value="sunglasses">Sunglasses</option>
                                    <option value="glasses">Eyeglasses</option>
                                    <option value="reading">Reading Glasses</option>
                                </select>
                                <div className="file-input-wrapper">
                                    <label>Product Image:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <button type="submit" className="submit-btn">Add Product</button>
                            </form>
                        )}

                        <div className="products-grid">
                            {products.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    No products yet. Add your first product!
                                </p>
                            ) : (
                                products.map(product => (
                                    <div key={product.id} className="product-card">
                                        <img 
                                            src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/200'} 
                                            alt={product.name}
                                        />
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p className="product-desc">{product.description}</p>
                                            <p className="product-brand">Brand: {product.brand}</p>
                                            {product.category && product.category !== 'general' && (
                                                <p className="product-category">
                                                    <span className="category-badge">{product.category}</span>
                                                </p>
                                            )}
                                            <p className="product-price">₹{product.price}</p>
                                            <p className="product-stock">Stock: {product.stock}</p>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)} 
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <h2>Customer Orders</h2>
                        {orders.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                No orders yet.
                            </p>
                        ) : (
                            <div className="orders-table-wrapper">
                                <table className="orders-table custom-orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th>Shipping Address</th>
                                            <th>Status</th>
                                            <th>Order Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{order.customer?.name || 'N/A'}</span>
                                                        <span style={{ fontSize: '0.95em', color: '#222' }}>{order.customer?.email || 'N/A'}</span>
                                                        <span style={{ fontSize: '0.95em', color: '#d72660', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '1.1em' }}>📞</span> {order.customer?.phone || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>{order.product?.name || 'N/A'}</td>
                                                <td>{order.quantity}</td>
                                                <td>₹{order.totalPrice}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.98em', color: '#222' }}>{order.deliveryAddress || 'N/A'}</span>
                                                </td>
                                                <td>
                                                    <span style={{ background: order.status === 'PENDING' ? '#f5d7b6' : '#c8e6c9', color: '#7c4a00', padding: '4px 16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '1em', letterSpacing: '1px', display: 'inline-block' }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.98em', color: '#222' }}>{new Date(order.orderDate).toLocaleDateString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
