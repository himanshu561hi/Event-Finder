// backend/config/passport-setup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User'); 
require('dotenv').config();

const HOST_URL = process.env.HOST_URL || 'http://localhost:5050';

// --- PASSPORT SERIALIZATION ---
passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        // Mongoose ID (not Google ID)
        const user = await User.findById(id); 
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// --- GOOGLE STRATEGY CONFIGURATION ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: `${HOST_URL}/api/auth/callback` // 🔑 FIX: callbackURL ko ENV se liya
},
async (accessToken, refreshToken, profile, done) => { 
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // Update user details on every login
            user.displayName = profile.displayName;
            user.email = profile.emails[0].value;
            user.profilePhoto = profile.photos[0].value;
            await user.save(); 
            return done(null, user); 
        } else {
            const newUser = new User({
                googleId: profile.id, 
                displayName: profile.displayName,
                email: profile.emails[0].value, 
                profilePhoto: profile.photos[0].value,
            });
            await newUser.save(); 
            return done(null, newUser); 
        }
    } catch (err) {
        return done(err, null);
    }
}));