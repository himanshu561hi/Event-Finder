// // backend/models/Event.js
// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//     ownerId: {
//         type: mongoose.Schema.Types.ObjectId, // FIX: Use Mongoose ObjectId for proper reference
//         required: true,
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: String,
//     location: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true
//     },
//     lastRegistrationDate: { 
//         type: Date,
//     },
//     category: { type: String, required: true }, 
//   subCategory: { type: String, required: true },
//     fee: {
//         type: Number,
//         default: 0
//     },
//     imageURL: { type: String, required: true },
//     instagramLink: String,
//     websiteLink: String,
//     registrationLink:  { type: String, required: true },
//     maxParticipants: {
//         type: Number,
//         default: 1
//     },
//     currentParticipants: {
//         type: Number,
//         default: 0
//     },
//     locationLat: Number,
//     locationLon: Number,
// }, { timestamps: true }); 

// module.exports = mongoose.model('Event', EventSchema);


// backend/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, // ✅ Mongoose ObjectId का उपयोग सही है
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
    // Subcategory successfully added and required
    category: { type: String, required: true }, 
    subCategory: { type: String, required: true }, // ✅ सब-कैटेगरी सही ढंग से जोड़ा गया है
    // ...
    fee: {
        type: Number,
        default: 0
    },
    imageURL: { 
        type: String, 
        required: true // ⚠️ ध्यान दें: फ्रंटएंड फॉर्म इसे वैकल्पिक (optional) मान रहा था, लेकिन स्कीमा इसे आवश्यक (required) मान रही है।
    },
    instagramLink: String,
    websiteLink: String,
    registrationLink:  { 
        type: String, 
        required: true 
    },
    // ...
}, { timestamps: true }); 

module.exports = mongoose.model('Event', EventSchema);