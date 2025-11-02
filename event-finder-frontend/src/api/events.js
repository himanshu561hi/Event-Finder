// src/api/events.js
import axios from 'axios';

// 🔑 FIX: Environment variable se URL use karein
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050/api'; 
// NOTE: VITE projects mein environment variables ko VITE_ prefix se access karte hain.

export const getEvents = async (locationFilter = '', userLat = null, userLon = null, radius = null) => {
    try {
        let url = `${API_BASE_URL}/events`;
        const params = new URLSearchParams();

        if (locationFilter) {
            params.append('location', locationFilter);
        }
        
        if (userLat && userLon && radius) {
            params.append('userLat', userLat);
            params.append('userLon', userLon);
            params.append('radius', radius);
        }

        // Add parameters to the URL
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/events`, 
            eventData,
            { withCredentials: true } 
        );
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const getEventDetail = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
    }
};

// NEW: Helper function to get distance (used in EventDetail)
export const getEventDistance = async (eventId, userLat, userLon) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/events/distance/${eventId}?userLat=${userLat}&userLon=${userLon}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching road distance:", error);
        throw error;
    }
};