# 🍔 Food Ordering Website – MERN Stack with Stripe Payments(Khaddoroshik)

A **full-stack multi-restaurant food ordering platform** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.  
It supports **user authentication, restaurant & food item management, cart, order placement, and Stripe-based payments**.  
The app has both **frontend (React + Vite)** and **backend (Express + MongoDB)** deployed frontend on netlify and backend on Render.

---

## 🚀 Live Demo

👉 **[Frontend Live Link](https://khaddoroshik.netlify.app/)**  
👉 **[Backend API Live Link](https://food-ordering-website-backend-fh57.onrender.com)**  

---

## ✨ Features

### 👥 Users
- 🔑 Authentication (using access and refresh token both) & Authorization (JWT + Cookies)
- 👤 Profile management
- 🛒 Add/remove items from cart
- 💳 Checkout with Stripe
- 📦 Place & track orders

### 🍴 Restaurants
- 🏪 Restaurant registration & login
- 📋 Add, update, and manage food items
- 📊 View customer orders

### 🛍️ Ordering & Payments
- 🛒 Cart system with quantity management
- 💳 Secure **Stripe Checkout**
- 📍 Delivery address integration
- 📦 Order history & tracking

### 🎨 Frontend (React + Vite)
- ⚡ Fast & modern UI
- 🎨 Styled with Tailwind CSS
- 🔗 Axios for API calls
- 🔒 Protected routes
- 🖼️ Cloudinary for image uploads

### ⚙️ Backend (Express + MongoDB)
- 🚀 RESTful APIs with Express.js
- 💾 MongoDB & Mongoose for database
- 🔐 JWT authentication with cookies
- ☁️ Cloudinary for food images
- 💳 Stripe API integration for payments

---

## 🏗️ Tech Stack

### 🌐 Frontend
- React 18 + Vite
- Tailwind CSS
- Axios
- React Router DOM

### ⚙️ Backend
- Express.js
- MongoDB + Mongoose
- Stripe
- Cloudinary
- Cookie-Parser
- CORS
- dotenv

---

## 📂 Folder Structure

### 🌐 Frontend
```bash
frontend/
├── dist/
├── node_modules/
├── public/
│   └── _redirects      # Fixes refresh issue on Render
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

```
```bash
backend/
├── config/
│   └── db.js
├── controllers/
├── middlewares/
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   └── authMiddleware.js
├── models/
│   ├── user.model.js
│   ├── resturent.model.js
│   ├── foodItem.model.js
│   ├── cart.model.js
│   └── order.model.js
├── routes/
│   ├── auth.routes.js
│   ├── resturent.routes.js
│   ├── foodItems.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   └── user.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── cloudinary.js
├── .env
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```


⭐️ Thanks for visiting my project! Feel free to explore the code and try out the live demo above.


---



