// src/components/UserEvents.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050/api';

const UserEvents = () => {
    const { user, isAuthenticated } = useAuth();
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches events created by the currently authenticated user
     const fetchUserEvents = async () => {
        if (!isAuthenticated || !user?._id) { 
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // CRITICAL FIX: Use user._id (Mongoose ID) to query events by ownerId
            const response = await axios.get(`${API_BASE_URL}/events?ownerId=${user._id}`);
            setUserEvents(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user events:", err);
            setError("Could not load your uploaded events.");
        } finally {
            setLoading(false);
        }
    };

    // FIX: useEffect dependency to trigger fetch when user object is available
    useEffect(() => {
        if (isAuthenticated && user?._id) {
             fetchUserEvents();
        } else if (!isAuthenticated && !user) {
            setLoading(false);
        }
    }, [isAuthenticated, user?._id]); 

    // Handles the deletion of an event
    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/events/${eventId}`, { withCredentials: true });
            
            setUserEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
            alert("Event deleted successfully!");

        } catch (err) {
            console.error("Error deleting event:", err.response ? err.response.data : err);
            alert("Failed to delete the event. You must be the owner to perform this action.");
        }
    };


    if (loading) return <div className="text-center py-10 text-xl text-blue-600">Loading your events...</div>;
    if (error) return <div className="text-center py-10 text-xl text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;

    // Remaining JSX is unchanged to maintain UI/UX
    return (
        <div>
            {userEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                    {userEvents.map(event => (
                        <div key={event._id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                            
                            {/* Card Header with Image */}
                            <div className="h-32 bg-gray-200">
                                {event.imageURL ? (
                                    <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-3xl">🎉</div>
                                )}
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">{event.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 truncate">📍 {event.location}</p>
                                
                                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between space-x-2">
                                    <Link 
                                        to={`/create?editId=${event._id}`} 
                                        className="w-1/2 text-center text-sm bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                                    >
                                        Edit
                                    </Link>
                                    
                                    <button 
                                        onClick={() => handleDelete(event._id)}
                                        className="w-1/2 text-center text-sm bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-8 p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl shadow-inner">
                    <h4 className="text-2xl font-bold text-gray-700 mb-2">You Haven't Created Any Events Yet!</h4>
                    <p className="text-lg text-gray-500">
                        Click the "Create New Event" button to get started.
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserEvents;