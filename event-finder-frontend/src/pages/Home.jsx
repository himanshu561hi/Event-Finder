
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom'; 
import EventList from './EventList.jsx'; 

const Home = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-600">Checking authentication status...</div>;
    }

    if (!isAuthenticated) {
        // 🔒 Display Login Prompt
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-red-50 p-12 rounded-xl shadow-2xl mt-10">
                <h1 className="text-4xl font-extrabold text-red-700 mb-4">🔐 Access Restricted</h1>
                <p className="text-xl text-gray-700 mb-8">Please sign in with Google to view and manage events.</p>
                <a 
                    href="http://localhost:5050/api/auth/google" 
                    className="px-8 py-3 text-xl bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    Sign in with Google
                </a>
            </div>
        );
    }

    // ✅ Logged In: Display Welcome Section and Main Content
    return (
        <div className="mt-6">
            
            
            {/* NEW: Render the EventList component which contains the filter buttons */}
            <EventList /> 
        </div>
    );
};

export default Home;