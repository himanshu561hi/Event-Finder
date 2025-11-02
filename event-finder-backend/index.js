// backend/index.js

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const session = require('express-session');
const passport = require('passport');
require('dotenv').config(); 
// Ensure node-fetch is available globally if needed, or use axios if preferred.
// Keeping 'fetch' polyfill via 'node-fetch' as per original structure.
// NOTE: Since Node 18+, native 'fetch' is available, but keeping 'node-fetch' for broader compatibility.
const nodeFetch = require('node-fetch'); // Required for Opencage/Google Maps API calls

// --- Configuration Constants ---
const PORT = process.env.PORT || 5050; 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI; 
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables.');
    process.exit(1); 
}
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// --- MODEL & ROUTE IMPORTS ---
require('./models/User'); // Passport serialization/deserialization के लिए User model पहले load होना चाहिए
require('./models/Event');
require('./models/DeletedEvent');

// Passport Configuration (Strategy and Serialization)
require('./config/passport-setup'); // Passport logic ko alag file mein shift kiya

const app = express();

// --- MIDDLEWARE SETUP ---
const corsOptions = { 
    origin: FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
    optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// 🧹 FIX: body-parser is redundant. Use Express built-in middleware.
app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded body parsing

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-strong-default-secret', // 🔑 FIX: Secret key ENV variable se aana chahiye
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Production mein secure: true (HTTPS only)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Production mein cross-site cookies allow karein
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES SETUP ---
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// All API routes are now imported
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);





const userRoutes = require('./routes/users'); // 🎯 NEW: User-specific routes

// All API routes are now imported
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes); // 🎯 NEW: Mapping to /api/users



// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV === 'production') {
        console.log('⚠️ Running in PRODUCTION mode (Secure cookies are ON)');
    }
});