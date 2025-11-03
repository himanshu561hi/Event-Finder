const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const fetch = require("node-fetch");

// --- Configuration Constants ---
const PORT = process.env.PORT || 5050;
// Note: Vercel console error indicates the exact origin is needed
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Ensure this matches Vercel: https://event-finder-frontend-weld.vercel.app

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in environment variables.");
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// --- MODEL & ROUTE IMPORTS ---
require("./models/User");
require("./models/Event");
require("./models/DeletedEvent");

// Passport Configuration (Strategy and Serialization)
require("./config/passport-setup");

const app = express();

// --- PROXY TRUST (For HTTPS Headers) ---
app.enable('trust proxy');

// --- MIDDLEWARE SETUP ---
const corsOptions = {
  // Production (Vercel) पर, FRONTEND_URL 'https://event-finder-frontend-weld.vercel.app' होना चाहिए
  origin: ['https://eventsyncc.vercel.app', 'https://event-finder-jv4o.onrender.com', 'http://localhost:5173'], // सभी संभावित ओरिजिन शामिल करें
    credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // CORS के लिए यह कुकी भेजने के लिए ज़रूरी है
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "a-strong-secret-key-for-session-management",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      
      // *** 🎯 FIX: Cookied settings को मर्ज करें और production के लिए अनिवार्य values सेट करें ***
      // production पर, secure: true (HTTPS) और sameSite: 'none' (Cross-Domain) होना चाहिए
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // *****************************************************************************************
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES SETUP ---
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/users");

// All API routes are now imported
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log("⚠️ Running in PRODUCTION mode (Secure cookies are ON)");
  }
});