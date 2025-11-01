// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    lastRegistrationDate: { 
        type: Date,
    },
    category: String,
    fee: {
        type: Number,
        default: 0
    },
    imageURL: String,
    instagramLink: String,
    websiteLink: String,
    registrationLink: String, // This was missing in the schema but added in the form
    maxParticipants: {
        type: Number,
        default: 1
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    locationLat: Number,
    locationLon: Number,
}, { timestamps: true }); 

module.exports = mongoose.model('Event', EventSchema);