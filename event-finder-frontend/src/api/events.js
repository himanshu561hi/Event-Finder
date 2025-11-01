// src/api/events.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

export const getEvents = async (locationFilter = '', userLat = null, userLon = null, radius = null) => {
    try {
        let url = `${API_BASE_URL}/events?`;
        let params = [];

        // 1. Add location filter if present
        if (locationFilter) {
            params.push(`location=${locationFilter}`);
        }
        
        // 2. NEW: Add geographical parameters if all are present
        if (userLat && userLon && radius) {
            params.push(`userLat=${userLat}`);
            params.push(`userLon=${userLon}`);
            params.push(`radius=${radius}`);
        }

        url += params.join('&');
        
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
            { withCredentials: true } // <-- CRITICAL: Include cookies for authentication
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