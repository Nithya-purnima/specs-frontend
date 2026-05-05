import { useState } from 'react'
import './App.css'
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Contact from "./Contact";
import DynamicContent from "./DynamicContent";
import SellerRegister from "./SellerRegister";
import SellerLogin from "./SellerLogin";
import SellerDashboard from "./SellerDashboard";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import CameraTest from "./CameraTest";
import TryOnPage from './TryOnPage';
import { CartProvider } from "./CartContext";
import CartPage from "./CartPage";
import OrderPage from "./OrderPage";
import Checkout from "./Checkout";
import LandingPage from "./LandingPage";
import CustomerDashboard from './CustomerDashboard';
import Layout from './Layout';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "products",
          element: <DynamicContent />,
        },
        {
          path: "cart",
          element: <CartPage />
        },
        {
          path: "contactus",
          element: <Contact />
        },
        {
          path: "orders",
          element: <OrderPage />
        },
        {
          path: "checkout",
          element: <Checkout />
        },
        {
          path: "seller-register",
          element: <SellerRegister />
        },
        {
          path: "seller-login",
          element: <SellerLogin />
        },
        {
          path: "seller-dashboard",
          element: <SellerDashboard />
        },
        {
          path: "admin-login",
          element: <AdminLogin />
        },
        {
          path: "admin-dashboard",
          element: <AdminDashboard />
        },
        {
          path: "tryon",
          element: <TryOnPage />
        },
        {
          path: "camera-test",
          element: <CameraTest />
        },
        {
          path: "customer-dashboard",
          element: <CustomerDashboard />
        },
      ]
    },
  ]);

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}

export default App
