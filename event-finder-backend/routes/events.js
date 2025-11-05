

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 🎯 CRITICAL FIX: node-fetch V3+ ko .default ke saath import karein
// Taki woh fetch function ke roop mein available ho.
// Agar aapka Node version 18 se kam hai, toh yeh zaroori hai.
const fetch = require('node-fetch').default; 

// Mongoose Models ko load karein
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const DeletedEvent = mongoose.model('DeletedEvent'); 

require('dotenv').config();

// --- Middleware: Check if User is Logged In ---
const requireLogin = (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized. Must be logged in.' });
    }
    next();
};

// --- HELPER FUNCTIONS ---
const getDistance = (lat1, lon1, lat2, lon2) => { 
    const R = 6371; const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c; 
};

// 🎯 Finalized Geocoding Function
const geocodeLocation = async (location) => {
    const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; 
    
    if (!OPENCAGE_API_KEY) {
        console.error("❌ Geocoding failed: OPENCAGE_API_KEY is missing in .env");
        return { lat: null, lon: null }; 
    }
    
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPENCAGE_API_KEY}`;
    
    try {
        const response = await fetch(url); 
        const data = await response.json(); 

        if (data.status && data.status.code !== 200) {
            console.error(`❌ OpenCage API returned error status ${data.status.code}: ${data.status.message}.`);
            return { lat: null, lon: null }; 
        }

        if (!data.results || data.results.length === 0) {
            console.warn(`⚠️ Geocoding failed for "${location}": No coordinates found.`);
            return { lat: null, lon: null }; 
        }

        const { lat, lng } = data.results[0].geometry;
        console.log(`✅ Geocoding successful for location: ${location}. Lat: ${lat}, Lon: ${lng}`);
        return { lat, lon: lng };
        
    } catch (error) {
        console.error("❌ Geocoding Network/Parsing Error:", error.message);
        return { lat: null, lon: null }; 
    }
};

const getRoadDistance = async (userLat, userLon, eventLat, eventLon) => {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const origins = `${userLat},${userLon}`; 
    const destinations = `${eventLat},${eventLon}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
        const response = await fetch(url); // fetch() is now defined
        const data = await response.json();
        
        if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements[0].status === 'OK') {
            const element = data.rows[0].elements[0];
            const distanceMeters = element.distance.value;
            const distanceKm = (distanceMeters / 1000).toFixed(1); 
            return { distance: distanceKm, duration: element.duration.text };
        }
        return { distance: null, duration: null };
    } catch (error) { 
        console.error("Google Maps Distance Error:", error.message); // Logging error message instead of object
        return { distance: null, duration: null }; 
    }
};

// --- CRUD & DISTANCE ROUTES ---

// POST /api/events - Create an event
router.post('/', requireLogin, async (req, res) => { 
    const { title, description, location, date, maxParticipants, 
            lastRegistrationDate, category, subCategory, fee, imageURL, instagramLink, websiteLink, registrationLink } = req.body;
    
    if (!title || !location || !date || !maxParticipants) { 
        return res.status(400).json({ error: 'Missing required fields: title, location, date, maxParticipants.' }); 
    }

    try {
        const coords = await geocodeLocation(location);

        const newEvent = new Event({ 
            ownerId: req.user._id, 
            title, description: description || '',
            location, date, lastRegistrationDate, category, subCategory,
            fee: parseFloat(fee || 0), imageURL, instagramLink, websiteLink, registrationLink,
            maxParticipants: parseInt(maxParticipants), currentParticipants: 0,
            locationLat: coords.lat, 
            locationLon: coords.lon, 
        });

        const savedEvent = await newEvent.save(); // 1. Save Event

        await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { createdEvents: savedEvent._id } },
            { new: true }
        ); 
        
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error("MongoDB Save Error:", err);
        res.status(500).json({ error: 'Error creating event. Check date formats or server logs.' });
    }
});



// PUT /api/events/:id - Update an event
router.put('/:id', requireLogin, async (req, res) => {
    const eventId = req.params.id;
    const updateData = req.body; 

    try {
        let existingEvent = await Event.findById(eventId);

        if (!existingEvent) { return res.status(404).json({ error: 'Event not found.' }); }
        
        // Check ownership
        if (existingEvent.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden. You are not the owner of this event.' });
        }

        // Re-geocode if location is changed
        if (updateData.location && existingEvent.location !== updateData.location) { 
            const coords = await geocodeLocation(updateData.location);
            // 🚨 FIX: Update locationLat/Lon even if they are null (to handle failed geocoding attempts)
            updateData.locationLat = coords.lat; 
            updateData.locationLon = coords.lon;
        }

        // Clean up update data before passing to Mongoose (to prevent ownerId modification, etc.)
        delete updateData._id;
        delete updateData.ownerId;
        
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId, 
            updateData,
            { new: true, runValidators: true } 
        );

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error("MongoDB Update Error:", err);
        res.status(500).json({ error: 'Failed to update event.' });
    }
});

// DELETE /api/events/:id - Delete an event (Soft Delete/Archiving)
router.delete('/:id', requireLogin, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user._id;

    try {
        // 1. Original Event ko fetch karein
        const eventToDelete = await Event.findOne({ 
            _id: eventId,
            ownerId: userId // Ownership check
        }).lean(); 

        if (!eventToDelete) { 
            return res.status(404).json({ error: 'Event not found or user unauthorized to delete.' }); 
        }
        
        // 2. Data ko DeletedEvent collection mein save karein
        const deletedRecord = new DeletedEvent({ // <-- Ab DeletedEvent defined hai
            originalEvent: eventToDelete, 
            deletedById: userId,
            originalEventId: eventId,
            reason: req.body.reason || 'User initiated deletion' 
        });

        await deletedRecord.save();

        // 3. Original Event ko Event collection se delete karein
        const result = await Event.deleteOne({ _id: eventId });
        
        if (result.deletedCount === 0) {
             return res.status(404).json({ error: 'Event not found in main collection for deletion.' });
        }
        
        // 4. Event ID ko User's createdEvents array se remove karein
        await User.findByIdAndUpdate(
            userId,
            { $pull: { createdEvents: eventId } } 
        );

        res.status(200).json({ message: 'Event archived and deleted successfully from active list.' });
    } catch (err) {
        console.error("MongoDB Delete/Archive Error:", err);
        res.status(500).json({ error: 'Failed to delete and archive event.' });
    }
});

// GET /api/events/distance/:id - Road Distance Endpoint
router.get('/distance/:id', async (req, res) => { 
    const eventId = req.params.id;
    const { userLat, userLon } = req.query; 

    if (!userLat || !userLon) { 
        return res.status(400).json({ error: 'User coordinates are required for road distance calculation.' }); 
    }
    
    try {
        const event = await Event.findById(eventId); 
        // 🚨 FIX: Check for required API key
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            return res.status(500).json({ error: 'Server Error: GOOGLE_MAPS_API_KEY is missing.' }); 
        }

        if (!event || !event.locationLat || !event.locationLon) { 
            // Agar coordinates missing hain, toh yahan 404/error bhejte hain
            return res.status(404).json({ error: 'Event not found or coordinates missing.' }); 
        }

        const result = await getRoadDistance(userLat, userLon, event.locationLat, event.locationLon);
        
        if (result.distance) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: 'Could not calculate road distance.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving distance data.' });
    }
});


// GET /api/events - List all events (Optimized MongoDB Filtering)
router.get('/', async (req, res) => { 
    const { location: locationFilter, userLat, userLon, radius, ownerId } = req.query;
    
    try {
        let mongoQuery = {};

        // 1. Filter by Owner ID (Mongoose Query)
        if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) { 
            mongoQuery.ownerId = ownerId; 
        }

        // 2. Filter by Location Search (Mongoose Query)
        if (locationFilter) {
            // Case-insensitive, partial match
            mongoQuery.location = { $regex: locationFilter, $options: 'i' }; 
        }

        // Fetch events based on the MongoDB query
        let eventsFromDb = await Event.find(mongoQuery).lean(); 

        // 3. Filter by Geographical Radius (In-Memory Filtering - optimized)
        if (userLat && userLon && radius) {
            const userLatNum = parseFloat(userLat);
            const userLonNum = parseFloat(userLon);
            const radiusNum = parseFloat(radius);
            
            eventsFromDb = eventsFromDb.filter(event => {
                // Ensure event has coordinates
                if (event.locationLat && event.locationLon) {
                    const distance = getDistance(userLatNum, userLonNum, event.locationLat, event.locationLon);
                    return distance <= radiusNum;
                }
                return false;
            });
        }
        
        res.status(200).json(eventsFromDb);
    } catch (err) {
        console.error("GET /api/events Error:", err);
        res.status(500).json({ error: 'Error fetching events list.' });
    }
});

// GET /api/events/:id - Get single event detail
router.get('/:id', async (req, res) => { 
    const eventId = req.params.id;
    
    try {
        const event = await Event.findById(eventId); 
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving event.' });
    }
});

module.exports = router;



