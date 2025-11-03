// src/pages/VerifyProfile.jsx (FINAL FIXED VERSION)

import React, { useState, useEffect } from 'react'; // 🎯 FIX: useEffect added
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // 🎯 FIX: useSearchParams added
import axios from 'axios'; 

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050/api';

const initialFormData = {
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    fullAddress: '',
    documentFile: null,
};

const VerifyProfile = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate(); 
    const [searchParams] = useSearchParams(); // Hook to read query params
    const isEditMode = searchParams.get('edit') === 'true'; // Check for ?edit=true

    const [formData, setFormData] = useState(initialFormData);
    // 🎯 FIX: Status state ko user data se initialize karein, na ki hardcode 'pending' se
    const [status, setStatus] = useState(user?.verifiedProfile ? 'verified' : (user?.verificationDetails?.submittedAt ? 'submitted' : 'pending')); 
    
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 🎯 NEW: useEffect to pre-fill existing user data for Edit Mode
    useEffect(() => {
        if (!loading && user?.verificationDetails?.submittedAt) {
            const data = user.verificationDetails;
            
            // Existing data se form ko pre-fill karein
            setFormData({
                fullName: data.fullName || '',
                fatherName: data.fatherName || '',
                mobileNumber: data.mobileNumber || '',
                fullAddress: data.fullAddress || '',
                documentFile: null, // File is always uploaded new for security
            });
            
            // Status ko user ke DB status se sync karein
            setStatus(user.verifiedProfile ? 'verified' : 'submitted');

            if (isEditMode) {
                setMessage("You are updating your submitted profile details. Re-upload document is required.");
            }
        }
    }, [loading, user, isEditMode]);


    if (loading) return <div className="text-center mt-10 text-xl text-gray-600">Loading profile data...</div>;
    if (!user) return <div className="text-center mt-10 text-xl text-red-600">Please log in to verify your profile.</div>;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, documentFile: e.target.files[0] }));
            setMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🚨 FIX: Edit mode mein document required hai agar user details badal raha hai
        if (!formData.documentFile) {
            setMessage("Please select a document. For security, re-upload is required upon editing.");
            return;
        }

        if (!formData.fullName || !formData.mobileNumber) {
            setMessage("Please fill in Full Name and Mobile Number.");
            return;
        }

        if (submitting) return;

        setSubmitting(true);
        setMessage('');
        
        const dataToSend = new FormData();
        dataToSend.append('fullName', formData.fullName);
        dataToSend.append('fatherName', formData.fatherName);
        dataToSend.append('mobileNumber', formData.mobileNumber);
        dataToSend.append('fullAddress', formData.fullAddress);
        dataToSend.append('document', formData.documentFile);
        
        // Note: Backend /api/users/verify user ID req.user._id se lega, frontend se bhejne ki zaroorat nahi.
        
        try {
            await axios.post(`${API_BASE_URL}/api/users/verify`, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true 
            });

            // Submission successful. Now redirect.
            alert("Details submitted successfully! Your profile status will be updated shortly.");
            
            // Redirect to Settings page
            navigate('/settings'); 
            
        } catch (err) {
            console.error("Verification Submission Error:", err.response?.data || err);
            setMessage(`Upload failed: ${err.response?.data?.error || 'Server error'}. Please try again later.`);
        } finally {
            setSubmitting(false);
        }
    };
    
    // Status check ko user ke DB data se sync karein
    const currentDBStatus = user.verifiedProfile ? 'verified' : (user.verificationDetails?.submittedAt ? 'submitted' : 'pending');
    
    const renderStatusBadge = (currentStatus) => {
        switch (currentStatus) {
            case 'verified':
                return <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full">✅ Verified</span>;
            case 'submitted':
                return <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">⏳ Under Review</span>;
            case 'rejected':
                return <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">❌ Rejected (Resubmit)</span>;
            case 'pending':
            default:
                return <span className="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-yellow-300 rounded-full">❗ Action Required</span>;
        }
    };
    
    const inputClasses = "p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500";


    return (
        <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-2xl">
            
            <Link to="/settings" className="text-gray-600 hover:text-gray-800 mb-4 block font-medium">
                ← Back to Settings
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                {isEditMode ? 'Edit Profile Details' : 'Profile Verification'} 🔒
            </h2>

            {/* 1. Current Status */}
            <div className="p-4 mb-6 border-l-4 border-blue-500 bg-blue-50">
                <p className="text-gray-700 font-semibold flex items-center justify-between">
                    Current Status: {renderStatusBadge(currentDBStatus)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    {isEditMode ? 'Update your information and re-submit your document.' : 'Please fill out the form below.'}
                </p>
            </div>
            
            {/* 2. Verification Form */}
            {/* Form hamesha dikhega agar verified nahi hai */}
            {currentDBStatus !== 'verified' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg">
                    
                    {currentDBStatus === 'submitted' && <div className="text-orange-600 font-semibold mb-2">You are re-submitting details. This will restart the review process.</div>}
                    
                    <h3 className="text-xl font-semibold text-gray-700">{isEditMode ? 'Update Details' : 'Personal Details & Document Upload'}</h3>
                    
                    {/* FULL NAME */}
                    <label className="text-gray-700 font-medium">Full Name (as per ID Proof):</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} required className={inputClasses} disabled={submitting} />

                    {/* FATHER'S NAME */}
                    <label className="text-gray-700 font-medium">Father's Name (Optional):</label>
                    <input name="fatherName" value={formData.fatherName} onChange={handleInputChange} className={inputClasses} disabled={submitting} />

                    {/* MOBILE NUMBER */}
                    <label className="text-gray-700 font-medium">Mobile Number:</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required className={inputClasses} disabled={submitting} />
                    
                    {/* FULL ADDRESS */}
                    <label className="text-gray-700 font-medium">Full Address:</label>
                    <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} rows="2" className={inputClasses} disabled={submitting}></textarea>
                    
                    <hr className="my-2" />
                    
                    {/* DOCUMENT UPLOAD */}
                    <p className="text-sm font-semibold text-red-600">
                        {isEditMode ? 'Required:' : 'Mandatory:'} Please re-upload your Gov. ID for security validation. Max size: 5MB.
                    </p>
                    <label className="block">
                        <span className="sr-only">Choose document file</span>
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            disabled={submitting}
                        />
                    </label>

                    {message && (
                        <p className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    <button 
                        type="submit"
                        disabled={submitting || !formData.fullName || !formData.mobileNumber || !formData.documentFile}
                        className={`px-6 py-3 font-semibold rounded-md transition-colors 
                            ${(submitting || !formData.documentFile) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}
                        `}
                    >
                        {submitting ? 'Uploading & Processing...' : isEditMode ? 'Update Details & Document' : 'Submit Details & Document'}
                    </button>
                </form>
            )}

            {/* 3. Status Message for Submitted/Verified (Will not show if form is open) */}
            {currentDBStatus === 'verified' && (
                 <div className="p-4 mt-4 bg-green-50 rounded-lg border border-green-300">
                    <p className="text-lg font-semibold text-green-700">
                        ✅ Your profile is fully approved.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VerifyProfile;