
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
require('dotenv').config();

// 🚀 IMPORTS
const upload = require('../helpers/upload'); // Cloudinary/Multer setup

// --- Middleware: Check if User is Logged In ---
const requireLogin = (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized. Must be logged in.' });
    }
    next();
};

// ----------------------------------------
// POST /api/users/verify - Save user details and document
// ----------------------------------------
router.post('/verify', 
    requireLogin, 
    
    // 🎯 DIAGNOSTIC STEP: Check req.user value before file upload
    (req, res, next) => {
        console.log("-----------------------------------------");
        console.log("Authentication Check Result:");
        console.log("req.user:", req.user); 
        console.log("req.user._id:", req.user ? req.user._id : 'User object is missing');
        console.log("-----------------------------------------");
        next(); // Agle middleware (upload.single) par jaana
    },
    
    upload.single('document'), 
    async (req, res) => {
        
        const { fullName, fatherName, mobileNumber, fullAddress } = req.body;
        
        // Cloudinary URL ab req.file.path mein milega
        const documentURL = req.file ? req.file.path : null; 
        
        // Agar file upload nahi hui ya fields missing hain
        if (!fullName || !mobileNumber || !documentURL) {
            return res.status(400).json({ error: 'Missing mandatory fields or document.' });
        }

        try {
            // User document ko verification details se update karna
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    // Update: verificationDetails field ko MongoDB mein set kar rahe hain
                    verificationDetails: {
                        fullName: fullName,
                        fatherName: fatherName || '',
                        mobileNumber: mobileNumber,
                        fullAddress: fullAddress || '',
                        documentURL: documentURL, // Store the Cloudinary URL
                        submittedAt: new Date(),
                    },
                    verifiedProfile: false, // Verification pending hai
                },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                 return res.status(404).json({ error: 'User not found.' });
            }
            
            console.log(`✅ Verification details submitted for User ID: ${updatedUser._id}. Document saved on Cloudinary.`);
            
            res.status(200).json({ 
                message: 'Verification details and document submitted successfully. Review pending.',
                submission: updatedUser.verificationDetails
            });

        } catch (err) {
            // 🎯 CRITICAL FIX: Poora error stack trace print karein
            console.error("MongoDB/Processing Error:", err.message); 
            console.error("MongoDB/Processing Stack:", err.stack); 
            
            // Validation errors ko clean 400 status code de sakte hain
            if (err.name === 'ValidationError') {
                 return res.status(400).json({ error: `Validation Failed: ${err.message}` });
            }

            res.status(500).json({ error: 'Failed to process verification submission.' });
        }
    }
);

module.exports = router;