const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS – allow requests from the frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Required for HTTP-only cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies (required for HTTP-only JWT cookie)
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

// Mount routes at root level to match assignment spec:
// POST /register, POST /login, GET /profile, GET /crypto, etc.
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", cryptoRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coinbase Clone API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /register",
        login: "POST /login",
        logout: "POST /logout",
      },
      profile: {
        get: "GET /profile (🔒 Protected)",
      },
      crypto: {
        getAll: "GET /crypto",
        getGainers: "GET /crypto/gainers",
        getNew: "GET /crypto/new",
        addNew: "POST /crypto",
      },
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
