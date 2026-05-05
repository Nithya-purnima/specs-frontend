import Product from './Product';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

function DynamicContent() {
    const [dataList, setdataList] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products from backend API
        fetch('http://localhost:5000/api/products')
            .then((response) => {
                if (!response.ok) {
                    throw Error('Could not retrieve products from server');
                }
                return response.json();
            })
            .then((data) => {
                // Backend returns { products: [...] }
                setdataList(data.products || []);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <h3>Loading products...</h3>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <h5 style={{ color: '#ff4d4f' }}>Error: {error}</h5>
                </div>
            </>
        );
    }

    if (!dataList || dataList.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <h3>No products available</h3>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {dataList.map((item) => (
                    <Product key={item.id} product={item} />
                ))}
            </div>
        </>
    );
}
export default DynamicContent;