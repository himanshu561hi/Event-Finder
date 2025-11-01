// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const userPhotoUrl = user?.profilePhoto; // Use DB field

    const renderAuthControls = () => {
        if (loading) {
            return <div className="text-gray-500">Loading...</div>;
        }

        if (user) {
            return (
                <div className="flex items-center space-x-3">
                    <span className="hidden sm:inline text-gray-700 text-sm font-medium">
                        Welcome, {user.displayName}!
                    </span>
                    
                    {userPhotoUrl ? (
                         <img 
                            key={user.id}
                            src={userPhotoUrl} 
                            alt={user.displayName} 
                            className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover" 
                        />
                    ) : (
                         <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                             {user.displayName ? user.displayName[0] : 'U'}
                         </div>
                    )}

                    <button 
                        onClick={logout} 
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            );
        } else {
            return (
                <a 
                    href="http://localhost:5050/api/auth/google" 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 font-semibold text-sm"
                >
                    Sign in with Google
                </a>
            );
        }
    };

    return (
        <header className="bg-white shadow-md py-3 sticky top-0 z-10 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-blue-800 tracking-tight">
                    Mini Event Finder
                </Link>
                {renderAuthControls()}
            </div>
        </header>
    );
};
export default Navbar;