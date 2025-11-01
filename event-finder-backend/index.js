const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const fetch = require('node-fetch').default; 
const mongoose = require('mongoose'); 

const dotenv = require('dotenv');
dotenv.config();

// --- MODEL IMPORTS ---
const Event = require('./models/Event'); 
const User = require('./models/User'); // 👈 User Model is critical for login

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventfinderdb'; 
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
// ---------------------------

// --- AUTHENTICATION & SESSION IMPORTS ---
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// ----------------------------------------

const app = express();
const PORT = 5050; 

// 🔑 CRITICAL: API and Auth Keys (Use the provided values)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; 
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

// --- MIDDLEWARE SETUP (Unchanged) ---
const corsOptions = { origin: 'http://localhost:5173', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true, optionsSuccessStatus: 204 };
app.use(cors(corsOptions));
app.use(bodyParser.json()); 
app.use(session({
    secret: 'a-strong-secret-key-for-session-management', 
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// --- 💡 PASSPORT SERIALIZATION FIX (Database Persistence Logic) ---
passport.serializeUser((user, done) => {
    // Session में Mongoose User ID सेव करें
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); 
    } catch (err) {
        done(err, null);
    }
});

// --- 💡 Google Strategy Configuration (CRITICAL DB SAVE LOGIC) ---
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/api/auth/callback" 
},
async (accessToken, refreshToken, profile, done) => { // 👈 MUST BE ASYNC
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // 2. User exists: UPDATE details and log them in
            user.displayName = profile.displayName;
            user.email = profile.emails[0].value;
            user.profilePhoto = profile.photos[0].value;
            await user.save(); // UPDATE existing record
            return done(null, user); 
        } else {
            // 3. New user: Create and save to MongoDB
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                profilePhoto: profile.photos[0].value,
            });
            await newUser.save(); // 👈 SAVING NEW USER TO MONGODB
            return done(null, newUser); 
        }
    } catch (err) {
        console.error("Passport Strategy Error:", err);
        return done(err, null);
    }
}));
// ----------------------------------------


// ------------------------------------
// HELPER FUNCTIONS (Distance & Geocoding)
// ------------------------------------
const getDistance = (lat1, lon1, lat2, lon2) => { /* ... Haversine code ... */
    const R = 6371; const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; 
};

const geocodeLocation = async (location) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPENCAGE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { lat, lon: lng };
        }
        return { lat: null, lon: null }; 
    } catch (error) {
        return { lat: null, lon: null }; 
    }
};

const getRoadDistance = async (userLat, userLon, eventLat, eventLon) => {
    const origins = `${userLat},${userLon}`; const destinations = `${eventLat},${eventLon}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
        const response = await fetch(url); const data = await response.json();
        if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements[0].status === 'OK') {
            const element = data.rows[0].elements[0];
            const distanceMeters = element.distance.value;
            const distanceKm = (distanceMeters / 1000).toFixed(1); 
            return { distance: distanceKm, duration: element.duration.text };
        }
        return { distance: null, duration: null };
    } catch (error) { return { distance: null, duration: null }; }
};

// ------------------------------------
// ROUTES
// ------------------------------------

// 1. AUTHENTICATION ROUTES (Unchanged)
app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => { 
        if (err) return res.status(500).send("Error logging out.");
        
        // This ensures the session is cleared in MongoDB/store
        req.session.destroy(() => { 
            res.send({ loggedOut: true }); 
        });
    });
});
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
    (req, res) => { res.redirect('http://localhost:5173/'); }
);
app.get('/api/auth/current_user', (req, res) => {
    res.send(req.user || false); 
});


// 2. CRUD & DISTANCE ROUTES

// POST /api/events - Create an event (FINAL FIX)
app.post('/api/events', async (req, res) => { 
    const { title, description, location, date, maxParticipants, 
            lastRegistrationDate, category, fee, imageURL, instagramLink, websiteLink, registrationLink } = req.body;
    
    if (!req.user || !req.user._id) { // CRITICAL FIX: Check for Mongoose _id
         return res.status(401).json({ error: 'Unauthorized. Must be logged in to create an event.' });
    }
    if (!title || !location || !date || !maxParticipants) { return res.status(400).json({ error: 'Missing required fields.' }); }

    try {
        const coords = await geocodeLocation(location);

        const newEvent = new Event({ 
            ownerId: req.user._id, 
            title, description: description || 'No description provided.',
            location, date, lastRegistrationDate, category, 
            fee: parseFloat(fee || 0), imageURL, instagramLink, websiteLink,
            maxParticipants: parseInt(maxParticipants), currentParticipants: 0,
            locationLat: coords.lat, locationLon: coords.lon,
        });

        const savedEvent = await newEvent.save(); // 1. Event Save हुआ

        // 🎯 CRITICAL FIX: Update User document
        // 2. User की createdEvents array में नए Event की ID जोड़ें
        await User.findByIdAndUpdate(
            req.user._id, // Logged-in user's MongoDB ID
            { $push: { createdEvents: savedEvent._id } }, // $push ऑपरेटर का उपयोग करके ID जोड़ें
            { new: true }
        );
        // ----------------------------------------------------

        res.status(201).json(savedEvent);
    } catch (err) {
        console.error("MongoDB Save Error (500 Crash):", err);
        res.status(500).json({ error: 'Error creating event. Check required fields or date format.' });
    }
});


// PUT /api/events/:id - Update an event (Mongoose Implementation)
app.put('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const updateData = req.body; 

    if (!req.user || !req.user._id) { return res.status(401).json({ error: 'Unauthorized.' }); }

    if (!updateData.title || !updateData.location || !updateData.date || !updateData.maxParticipants) {
        return res.status(400).json({ error: 'Missing required fields for update.' });
    }
    
    try {
        let coords = {};
        const existingEvent = await Event.findById(eventId);

        if (!existingEvent) { return res.status(404).json({ error: 'Event not found.' }); }
        
        // FIX: Geocoding logic if location changes
        if (existingEvent.location !== updateData.location) { 
            coords = await geocodeLocation(updateData.location);
            const finalCoords = coords || { lat: existingEvent.locationLat, lon: existingEvent.locationLon };
            updateData.locationLat = finalCoords.lat;
            updateData.locationLon = finalCoords.lon;
        }

        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId, ownerId: req.user._id }, 
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedEvent) { return res.status(403).json({ error: 'Unauthorized to update this event.' }); }
        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error("MongoDB Update Error:", err);
        res.status(500).json({ error: 'Failed to update event.' });
    }
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;

    if (!req.user || !req.user._id) { return res.status(401).json({ error: 'Unauthorized.' }); }

    try {
        const result = await Event.findOneAndDelete({ 
            _id: eventId,
            ownerId: req.user._id 
        });

        if (!result) { return res.status(404).json({ error: 'Event not found or user unauthorized to delete.' }); }
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (err) {
        console.error("MongoDB Delete Error:", err);
        res.status(500).json({ error: 'Failed to delete event.' });
    }
});

app.get('/api/events', async (req, res) => { 
    const { location: locationFilter, userLat, userLon, radius, ownerId } = req.query;
    
    try {
        let mongoQuery = {};
        if (ownerId) { 
            mongoQuery.ownerId = ownerId; 
        }

        let eventsFromDb = await Event.find(mongoQuery); 

        let filteredEvents = eventsFromDb;

        if (locationFilter) {
            const searchLocation = locationFilter.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
                event.location.toLowerCase().includes(searchLocation)
            );
        }

        if (userLat && userLon && radius) {
            const userLatNum = parseFloat(userLat);
            const userLonNum = parseFloat(userLon);
            const radiusNum = parseFloat(radius);
            
            if (isNaN(userLatNum) || isNaN(userLonNum) || isNaN(radiusNum)) {
                 return res.status(400).json({ error: 'userLat, userLon, and radius must be valid numbers.' });
            }
            
            filteredEvents = filteredEvents.filter(event => {
                if (event.locationLat && event.locationLon) {
                    const eventLatNum = parseFloat(event.locationLat);
                    const eventLonNum = parseFloat(event.locationLon);
                    
                    const distance = getDistance(userLatNum, userLonNum, eventLatNum, eventLonNum);
                    
                    return distance <= radiusNum;
                }
                return false; 
            });
        }

        res.status(200).json(filteredEvents);
    } catch (err) {
        console.error("GET /api/events Error:", err);
        res.status(500).json({ error: 'Error fetching events list.' });
    }
});


app.get('/api/events', async (req, res) => { 
    const { location: locationFilter, userLat, userLon, radius, ownerId } = req.query;
    
    try {
        let mongoQuery = {};
        if (ownerId) { mongoQuery.ownerId = ownerId; }

        let eventsFromDb = await Event.find(mongoQuery); 

        let filteredEvents = eventsFromDb;

        if (locationFilter) { /* ... */ }
        if (userLat && userLon && radius) { /* ... */ }

        res.status(200).json(filteredEvents);
    } catch (err) {
        console.error("GET /api/events Error:", err);
        res.status(500).json({ error: 'Error fetching events list.' });
    }
});


app.get('/api/events/:id', async (req, res) => { 
    const eventId = req.params.id;
    
    try {
        const event = await Event.findById(eventId); 
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving event.' });
    }
});


app.listen(PORT, () => {
    console.log(`✅ MongoDB connected successfully.`);
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});