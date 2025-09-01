import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import React from 'react'
import CartProvider from './context/cartContext/CartProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
