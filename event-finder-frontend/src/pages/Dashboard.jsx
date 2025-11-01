
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom'; 
import UserEvents from '../components/UserEvents.jsx'; // 👈 Dedicated component for user's events

const Dashboard = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-600">Loading Dashboard...</div>;
    }

    if (!isAuthenticated) {
        // This acts as a route guard
        return <h1 className="text-xl text-red-600 mt-10">Access Denied. Please login.</h1>;
    }
    
    const userName = user.displayName;
    const userEmail = user.email;
    const userPhotoUrl = user.profilePhoto;

    return (
        <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                User Dashboard
            </h2>

            {/* 1. PROFILE DETAILS SECTION */}
            <div className="flex items-start bg-white p-6 border border-gray-200 rounded-lg shadow-md mb-8">
                {userPhotoUrl && (
                    <img 
                        src={userPhotoUrl} 
                        alt={userName} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mr-6"
                    />
                )}
                
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{userName}</h3>
                    <p className="text-gray-600 mb-4">📧 {userEmail}</p>
                    <p className="text-sm text-gray-500">
                        👤 <b>Account Type:</b> Google User
                    </p>
                    <p className="text-sm text-gray-500">
                        🗓️ <b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    
                    <Link 
                        to="/create" 
                        className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 font-semibold"
                    >
                        + Create New Event
                    </Link>
                </div>
            </div>

            {/* 2. UPLOADED EVENTS SECTION */}
            <h3 className="text-2xl font-semibold text-gray-700 mt-8 mb-4 border-b pb-1">Your Uploaded Events</h3>
            <UserEvents /> 
            
        </div>
    );
};
export default Dashboard;