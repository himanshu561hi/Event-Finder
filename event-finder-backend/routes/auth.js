// backend/routes/auth.js

const express = require('express');
const passport = require('passport');
const router = express.Router();
require('dotenv').config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Google Auth Initiate
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Auth Callback
router.get('/callback',
    passport.authenticate('google', { failureRedirect: FRONTEND_URL }), 
    // SUCCESS: Redirect to client-side
    (req, res) => { res.redirect(FRONTEND_URL); } 
);

// 3. Get Current User Status
router.get('/current_user', (req, res) => {
    // req.user contains the deserialized user object from MongoDB
    res.send(req.user || false); 
});

// 4. Logout (Destroys Session)
router.get('/logout', (req, res, next) => {
    // req.logout() Passport session ko hataata hai
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        // req.session.destroy() Express session ko hataata hai
        req.session.destroy(sessionErr => {
            if (sessionErr) {
                console.error("Session destruction error:", sessionErr);
            }
            // Client-side ko successful logout bataen
            res.status(200).send({ message: 'Logged out successfully' });
        });
    });
});

module.exports = router;