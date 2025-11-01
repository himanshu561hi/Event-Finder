// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { /* ... */ },
    displayName: { /* ... */ },
    email: { /* ... */ },
    profilePhoto: String,
    
    // --- NEW FIELDS ---
    locationLat: Number, // यूज़र का अक्षांश (Latitude)
    locationLon: Number, // यूज़र का देशांतर (Longitude)
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    // ------------------
}, { timestamps: true }); 

module.exports = mongoose.model('User', UserSchema);