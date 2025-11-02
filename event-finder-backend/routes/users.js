// backend/routes/users.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); // 🎯 File upload ke liye
const fs = require('fs'); // File operations ke liye
const path = require('path');
const User = mongoose.model('User');
require('dotenv').config();

// --- Middleware: Check if User is Logged In (from events.js) ---
const requireLogin = (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized. Must be logged in.' });
    }
    next();
};

// 📁 Multer Setup: Files ko 'uploads' folder mein temporarily store karega
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/verification');
        // Ensure folder exists
        fs.mkdirSync(uploadPath, { recursive: true }); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Filename: userId-timestamp.ext
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}-${Date.now()}${ext}`);
    }
});

// Multer instance setup (max 5MB file, accepting images/pdf)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('image') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and PDF are allowed.'), false);
        }
    }
});

// ----------------------------------------
// POST /api/users/verify - Save user details and document
// ----------------------------------------
router.post('/verify', requireLogin, upload.single('document'), async (req, res) => {
    // req.body mein form fields hongi, req.file mein uploaded file hogi
    const { fullName, fatherName, mobileNumber, fullAddress } = req.body;
    
    // File path is local storage (real world mein S3/Cloud Storage use hota hai)
    const documentPath = req.file ? req.file.path : null; 

    if (!fullName || !mobileNumber || !documentPath) {
        // Agar file upload ho gayi hai par form fields miss hain, toh uploaded file delete kar dein
        if (documentPath) {
             fs.unlink(documentPath, (err) => { if (err) console.error("Error deleting file:", err); });
        }
        return res.status(400).json({ error: 'Missing mandatory fields or document.' });
    }

    try {
        // 🎯 CRITICAL: User document ko verification details se update karna
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                verificationDetails: {
                    fullName: fullName,
                    fatherName: fatherName || '',
                    mobileNumber: mobileNumber,
                    fullAddress: fullAddress || '',
                    documentURL: documentPath, // Store the local path (or S3 URL)
                    submittedAt: new Date(),
                },
                verifiedProfile: false, // Set to false, manual verification pending
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
             return res.status(404).json({ error: 'User not found.' });
        }

        console.log(`✅ Verification details submitted for User ID: ${updatedUser._id}. Document saved locally.`);
        
        res.status(200).json({ 
            message: 'Verification details and document submitted successfully. Review pending.',
            submission: updatedUser.verificationDetails
        });

    } catch (err) {
        console.error("MongoDB/Upload Error:", err);
        // Error hone par uploaded file delete kar dein
        if (documentPath) {
            fs.unlink(documentPath, (err) => { if (err) console.error("Error deleting file on failure:", err); });
        }
        res.status(500).json({ error: 'Failed to process verification submission.' });
    }
});

module.exports = router;