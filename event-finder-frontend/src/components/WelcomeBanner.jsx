// src/components/WelcomeBanner.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx';

const WelcomeBanner = () => {
    const { user, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    if (!isAuthenticated || !user) {
        return null;
    }
    
    const rawPhotoUrl = user?.profilePhoto;
    // FIX: Convert image URL to secure HTTPS for display
    const securePhotoUrl = rawPhotoUrl ? rawPhotoUrl.replace('http://', 'https://') : null;

    return (
        <div className="max-w-4xl mx-auto px-8 pt-8"> 
            <div className="p-4 bg-blue-50 rounded-lg shadow-md border-l-4 border-blue-600 flex items-center justify-between">
                
                {/* Left Side: Welcome Text */}
                <div>
                    <h2 className="text-xl font-bold text-blue-800">
                        👋 Welcome Back, {user.displayName}!
                    </h2>
                    <p className="text-sm text-blue-600 mt-1">Ready to manage your events.</p>
                </div>

                {/* Right Side: Image, Home Button, and Menu Icon Container */}
                <div className="flex items-center space-x-3 relative">
                    
                    <Link 
                        to="/" 
                        className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none flex items-center justify-center rounded-lg border border-transparent hover:border-gray-200 transition-colors"
                        title="Go to Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>

                    {/* User Image (Uses secure URL) */}
                    {securePhotoUrl && (
                        <div className="ml-4">
                            <img 
                                src={securePhotoUrl} 
                                alt={user.displayName || "User Avatar"} 
                                className="w-16 h-16 rounded-full border-2 border-blue-700 object-cover shadow-sm"
                            />
                        </div>
                    )}
                    
                    {/* Hamburger Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="text-2xl font-extrabold">&#x2261;</span> 
                    </button>

                    {/* Dropdown Menu Content */}
                    {isMenuOpen && (
                        <div 
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-100 z-20"
                            onBlur={() => setIsMenuOpen(false)} 
                        >
                            <Link 
                                to="/dashboard" 
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                🏠 Dashboard
                            </Link>
                            <Link 
                                to="/settings" 
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                ⚙️ Settings
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default WelcomeBanner;