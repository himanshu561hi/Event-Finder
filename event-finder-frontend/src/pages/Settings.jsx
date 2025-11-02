// src/pages/Settings.jsx (FINAL FIXED VERSION - Edit Button Control)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { user, loading, logout } = useAuth();
    const [receiveEmails, setReceiveEmails] = useState(true);

    if (loading) return <div className="text-center mt-10 text-xl text-gray-600">Loading settings...</div>;
    if (!user) return <div className="text-center mt-10 text-xl text-red-600">Please log in to view settings.</div>;

    // 🎯 CRITICAL FIX: Status checks based on DB fields
    const isProfileVerified = user.verifiedProfile === true; // Admin ne manually TRUE kiya
    const isVerificationSubmitted = !!user.verificationDetails?.submittedAt;
    const isVerificationPending = isVerificationSubmitted && !isProfileVerified; 
    
    const verifiedData = user.verificationDetails || {};

    const renderVerificationStatus = () => {
        if (isProfileVerified) {
            return (
                <p className="text-lg font-bold text-green-600">
                    ✅ Verification Completed!
                </p>
            );
        } else if (isVerificationPending) {
            return (
                <p className="text-lg font-bold text-orange-600">
                    ⏳ Verification Processing (Pending Review)
                </p>
            );
        } else {
            return (
                <p className="text-lg font-bold text-red-600">
                    ❌ Verification Required
                </p>
            );
        }
    };

    const handleSaveSettings = () => {
        alert("Settings saved successfully! (Simulated)");
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-2xl">
            
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 mb-4 block font-medium">
                ← Back to Dashboard
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                User Settings ⚙️
            </h2>
            
            {/* 1. Account Details Section (FIXED with EDIT BUTTON LOGIC) */}
            <div className="mb-8 p-6 border rounded-lg bg-indigo-50 relative">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Account Information</h3>
                
                {/* 🎯 CRITICAL FIX: Edit Button sirf tab dikhega jab submitted ho, lekin verified nahi ho (i.e., isVerificationPending) */}
                {isVerificationPending ? (
                    <Link
                        to="/verify-profile?edit=true" 
                        className="absolute top-4 right-4 text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                        title="Edit Submitted Details"
                    >
                        ✏️ Edit Details
                    </Link>
                ) : null}
                {/* END EDIT BUTTON */}
                
                {/* DISPLAY LOGIC */}
                {isProfileVerified && verifiedData.fullName ? (
                    // Agar verified hai, toh verified details dikhaao
                    <>
                        <p className="text-gray-800 font-bold mb-2">
                            👤 Full Name: <span className="text-indigo-900">{verifiedData.fullName}</span>
                        </p>
                        <p className="text-gray-700">🧑 Father's Name: {verifiedData.fatherName || 'N/A'}</p>
                        <p className="text-gray-700">📱 Mobile No: {verifiedData.mobileNumber}</p>
                        <p className="text-gray-700">📧 Email: {user.email}</p>
                        <p className="text-gray-700">📍 Address: {verifiedData.fullAddress}</p>
                        <p className="text-xs text-green-700 mt-2">
                            (Details verified as per submitted documents)
                        </p>
                    </>
                ) : (
                    // Agar verified nahi hai, toh basic Google details dikhaao
                    <>
                        <p className="text-gray-700">👤 Name: {user.displayName}</p>
                        <p className="text-gray-700">📧 Email: {user.email}</p>
                        <p className="text-gray-700 text-sm mt-1">
                            (To see detailed info, complete verification.)
                        </p>
                    </>
                )}
                {/* END DISPLAY LOGIC */}

                <button
                    onClick={logout}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 font-semibold text-sm"
                >
                    Sign Out / Disconnect
                </button>
            </div>
            
            {/* 2. Profile Verification Section (Unchanged) */}
            <div className={`mb-8 p-6 border rounded-lg shadow-md ${isProfileVerified ? 'border-green-400' : 'border-blue-300'}`}>
                <h3 className="text-xl font-bold text-blue-700 mb-3">
                    Profile Verification Status
                </h3>
                
                {renderVerificationStatus()}
                
                <p className="text-gray-600 mb-4 mt-2">
                    Verify your profile to increase trust and event posting limits.
                </p>

                {/* Button Visibility: Show button only if NOT submitted and NOT verified */}
                {!isProfileVerified && !isVerificationSubmitted ? (
                    <Link
                        to="/verify-profile" 
                        className="inline-block px-6 py-2 rounded font-semibold text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-700"
                    >
                        Start Profile Verification
                    </Link>
                ) : isVerificationPending ? (
                    <div className="text-orange-600 font-semibold">
                         ⏳ Your document is under review. Please wait for approval.
                    </div>
                ) : (
                    <div className="text-green-600 font-semibold">
                         ✅ Profile is fully approved.
                    </div>
                )}
                
            </div>

            {/* 3. General App Settings (Unchanged) */}
            <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">App Preferences</h3>
                
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <label htmlFor="email-pref" className="text-gray-700">Receive Event Update Emails</label>
                    <input 
                        type="checkbox" 
                        id="email-pref"
                        checked={receiveEmails}
                        onChange={() => setReceiveEmails(!receiveEmails)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                </div>
                
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <label className="text-gray-700">Dark Mode (Coming Soon)</label>
                    <span className="text-sm text-gray-400">Disabled</span>
                </div>

                <button
                    onClick={handleSaveSettings}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 font-semibold"
                >
                    Save Changes
                </button>
            </div>

        </div>
    );
};
export default Settings;