
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const fetch = require("node-fetch");
const cloudinary = require('cloudinary').v2; 

// --- Configuration Constants ---
const PORT = process.env.PORT || 5050;

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

// --- Cloudinary Configuration ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
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
  origin: ['https://eventsyncc.vercel.app', 'https://event-finder-jv4o.onrender.com', 'http://localhost:5173'], 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
      
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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