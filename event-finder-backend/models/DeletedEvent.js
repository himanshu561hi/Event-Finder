// backend/models/DeletedEvent.js

const mongoose = require('mongoose');

const DeletedEventSchema = new mongoose.Schema({
    // 🎯 Yahan poora Event object save hota hai, jismein saari details hain.
    originalEvent: { 
        type: Object, // Original event object ko store karega
        required: true 
    },
    
    // Deletion Metadata
    deletedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deletedAt: {
        type: Date,
        default: Date.now,
    },
    reason: String, 
    
    // Original Event ID for reference
    originalEventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    }
}, { timestamps: true }); 

module.exports = mongoose.model('DeletedEvent', DeletedEventSchema);