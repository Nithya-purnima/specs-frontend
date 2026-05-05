import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };

    const buyProduct = (product, quantity = 1) => {
        setOrders((prev) => {
            // Check if product already exists in orders
            const existingIndex = prev.findIndex(item => item.id === product.id);
            if (existingIndex !== -1) {
                // If exists, update quantity
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: (updated[existingIndex].quantity || 1) + quantity
                };
                return updated;
            } else {
                // If not, add with quantity
                return [...prev, { ...product, quantity }];
            }
        });
        setCart((prev) => prev.filter(item => item.id !== product.id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, orders, buyProduct }}>
            {children}
        </CartContext.Provider>
    );
}