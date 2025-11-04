// backend/helpers/upload.js

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 📁 Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        
        // 🚨 CRITICAL FIX: req.user._id missing hone par crash rokne ke liye
        if (!req.user || !req.user._id) {
            // Ye error Multer catch karega aur request ko rok dega (500 crash nahi hoga)
            throw new Error('Authentication required for file upload.');
        }

        // Filename: userId-timestamp
        const public_id = `${req.user._id}-${Date.now()}`;
        
        return {
            folder: 'verification_documents', 
            public_id: public_id,          
            resource_type: 'auto',       
        };
    },
});

// Multer instance setup (Cloudinary Storage use ho raha hai)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        // File type validation
        if (file.mimetype.includes('image') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            // Invalid file type error
            cb(new Error('Invalid file type. Only images and PDF are allowed.'), false);
        }
    }
});

module.exports = upload;