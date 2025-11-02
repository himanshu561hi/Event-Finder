// backend/models/User.js (UPDATED with Verification Fields)

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { 
        type: String,
        required: true,
        unique: true
    },
    displayName: String,
    email: String,
    profilePhoto: String,
    
    // --- NEW VERIFICATION FIELDS ---
    verifiedProfile: {
        type: Boolean,
        default: false // Status: Is the profile manually verified by admin?
    },
    verificationDetails: {
        fullName: String,
        fatherName: String,
        mobileNumber: String,
        fullAddress: String,
        documentURL: String, // Path or URL of the uploaded document
        submittedAt: Date,
    },
    // -----------------------------
    
    locationLat: Number,
    locationLon: Number,
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
}, { timestamps: true }); 

module.exports = mongoose.model('User', UserSchema);