// src/components/UserEvents.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

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
            const response = await axios.get(`${API_BASE_URL}/api/events?ownerId=${user._id}`);
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
    // 1. Delete Execution Logic
    // यह फ़ंक्शन कन्फर्मेशन मिलने पर चलाया जाएगा।
    const executeDelete = async (id) => {
        try {
            // API Call
            await axios.delete(`${API_BASE_URL}/api/events/${id}`, { withCredentials: true });
            
            // State Update
            setUserEvents(prevEvents => prevEvents.filter(event => event._id !== id));
            
            // Success Toast
            toast.success("Event Deleted Successfully", {
              duration: 4000,
              position: 'top-center',
              style: {
                  fontSize: '16px',
                  backgroundColor: '#d1fae5', 
                  color: '#065f46',         
              }
            });

        } catch (err) {
            console.error("Error deleting event:", err.response ? err.response.data : err);
            // Error Toast
            toast.error("❌ Failed to delete the event. You must be the owner to perform this action.");
        }
    };

    // 2. Custom Confirmation Toast को दिखाएँ
    // toast.custom() को कॉल करने पर यह एक ID रिटर्न करता है जिसे हम dismiss करने के लिए उपयोग करेंगे।
    const confirmationToastId = toast.custom((t) => (
        <div className="bg-white rounded-xl shadow-2xl p-4 max-w-sm w-full flex flex-col items-center border border-gray-100">
            
            <p className="text-gray-800 font-bold mb-3 text-center text-lg">
                ⚠️ Confirm Deletion
            </p>
            <p className="text-sm text-gray-600 mb-4 text-center">
                Are you sure you want to delete this event? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 w-full mt-2">
                
                {/* Cancel Button: केवल toast को हटाएगा */}
                <button
                    onClick={() => toast.dismiss(t.id)} 
                    className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                
                {/* Delete Button: delete logic को चलाएगा और फिर toast को हटाएगा */}
                <button
                    onClick={() => {
                        toast.dismiss(t.id); // पहले कन्फर्मेशन को हटाएँ
                        executeDelete(eventId); // फिर delete logic चलाएँ
                    }} 
                    className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                    Delete Event
                </button>
            </div>
        </div>
    ), {
        // यह toast तब तक स्क्रीन पर रहेगा जब तक यूज़र किसी बटन पर क्लिक नहीं करता
        duration: Infinity, 
        position: 'top-center',
    });
};

    if (loading) return <div className="text-center py-10 text-xl text-blue-600">Loading your events...</div>;
    if (error) return <div className="text-center py-10 text-xl text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;

    // Remaining JSX is unchanged to maintain UI/UX
    return (
        <div>
            <Toaster />
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
