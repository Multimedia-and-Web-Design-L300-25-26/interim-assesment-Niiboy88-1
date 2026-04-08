# Coinbase Clone Backend API

A RESTful backend API for the Coinbase Clone full-stack integration assignment. Built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT) stored in HTTP-only cookies
- **Password Hashing**: bcryptjs

---

## 📁 Project Structure

```
coinbase-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register, Login, Logout logic
│   ├── userController.js  # Profile logic
│   └── cryptoController.js# Crypto CRUD logic
├── middleware/
│   └── auth.js            # JWT protect middleware
├── models/
│   ├── User.js            # User schema
│   └── Crypto.js          # Cryptocurrency schema
├── routes/
│   ├── authRoutes.js      # /register, /login, /logout
│   ├── userRoutes.js      # /profile
│   └── cryptoRoutes.js    # /crypto endpoints
├── .env.example           # Environment variable template
├── .gitignore
├── package.json
├── server.js              # Entry point
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd coinbase-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/coinbase_clone
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 🔗 API Endpoints

### Base URL
- **Local**: `http://localhost:5000`
- **Production**: `https://your-app.onrender.com`

---

### 🔐 Authentication

#### Register — `POST /register`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully! Welcome aboard.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` – Missing fields or validation error
- `409` – Email already registered

---

#### Login — `POST /login`
Authenticate an existing user. Returns JWT in both cookie and body.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful! Redirecting to homepage...",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` – Missing email or password
- `401` – Invalid credentials

---

### 👤 Profile (Protected)

#### Get Profile — `GET /profile`
Returns the authenticated user's profile data.

**Headers:** `Authorization: Bearer <token>` OR cookie `token`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully.",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` – No token / invalid token → redirect to `/login`

---

### 💰 Cryptocurrency

#### Get All Cryptos — `GET /crypto`
Returns all available cryptocurrencies.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cryptocurrencies fetched successfully.",
  "count": 5,
  "data": [
    {
      "_id": "64abc...",
      "name": "Bitcoin",
      "symbol": "BTC",
      "price": 65000,
      "image": "https://example.com/btc.png",
      "change24h": 2.5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Top Gainers — `GET /crypto/gainers`
Returns cryptos with positive 24h change, sorted highest to lowest.

**Success Response (200):** Same structure as above, filtered & sorted by `change24h` descending.

---

#### Get New Listings — `GET /crypto/new`
Returns the 20 most recently added cryptocurrencies.

**Success Response (200):** Same structure as above, sorted by `createdAt` descending.

---

#### Add New Crypto — `POST /crypto`
Adds a new cryptocurrency to the database.

**Request Body:**
```json
{
  "name": "Bitcoin",
  "symbol": "BTC",
  "price": 65000,
  "image": "https://example.com/btc.png",
  "change24h": 2.5
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Bitcoin (BTC) has been successfully added.",
  "data": { ... }
}
```

**Error Responses:**
- `400` – Missing required fields
- `409` – Symbol already exists

---

## 🚀 Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add **Environment Variables** in the Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend-url.com`
7. Deploy!

---

## 🌐 Frontend Integration Guide

### Connecting to the API from your Coinbase frontend

```javascript
const API_BASE = "https://your-backend.onrender.com"; // or localhost:5000

// Register
const register = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for cookies
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Login
const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("token", data.token); // Backup storage
    window.location.href = "/"; // Redirect to homepage
  }
  return data;
};

// Get Profile (Protected)
const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (res.status === 401) {
    window.location.href = "/login"; // Redirect if not authenticated
  }
  return res.json();
};

// Get All Cryptos
const getCryptos = async () => {
  const res = await fetch(`${API_BASE}/crypto`);
  return res.json();
};

// Get Top Gainers
const getGainers = async () => {
  const res = await fetch(`${API_BASE}/crypto/gainers`);
  return res.json();
};

// Get New Listings
const getNewListings = async () => {
  const res = await fetch(`${API_BASE}/crypto/new`);
  return res.json();
};

// Add New Crypto
const addCrypto = async (cryptoData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/crypto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(cryptoData),
  });
  return res.json();
};
```
