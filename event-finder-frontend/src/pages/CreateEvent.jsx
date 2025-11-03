// src/pages/CreateEvent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios'; 
import { getEventDetail } from '../api/events.js'; 

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050/api';

const initialFormData = {
    title: '', description: '', location: '', date: '',
    lastRegistrationDate: '', maxParticipants: 0, category: '', fee: 0,
    imageURL: '', instagramLink: '', websiteLink: '', registrationLink: ''
};

const CreateEvent = () => {
    const navigate = useNavigate(); 
    const [searchParams] = useSearchParams(); 
    const editId = searchParams.get('editId'); 

    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(!!editId); 
    
    const inputClasses = "p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500";

    useEffect(() => {
        if (editId) {
            const fetchExistingEvent = async () => {
                try {
                    const data = await getEventDetail(editId);
                    
                    const formatDate = (isoDate) => {
                        if (!isoDate) return '';
                        // Ensures date format is 'YYYY-MM-DD' for input type="date"
                        const d = new Date(isoDate);
                        const month = (d.getMonth() + 1).toString().padStart(2, '0');
                        const day = d.getDate().toString().padStart(2, '0');
                        return `${d.getFullYear()}-${month}-${day}`;
                    };
                    
                    setFormData({
                        title: data.title,
                        description: data.description || '',
                        location: data.location,
                        date: formatDate(data.date),
                        lastRegistrationDate: formatDate(data.lastRegistrationDate),
                        maxParticipants: data.maxParticipants,
                        category: data.category || '',
                        fee: data.fee || 0,
                        imageURL: data.imageURL || '',
                        instagramLink: data.instagramLink || '',
                        websiteLink: data.websiteLink || '',
                        registrationLink: data.registrationLink || '',
                    });
                    setIsEditing(true);
                } catch (e) {
                    setError("Could not load event data for editing. Check event ID or connection.");
                    setIsEditing(false); 
                }
            };
            fetchExistingEvent();
        } else {
            // Reset to initial state if no editId is present
            setFormData(initialFormData);
            setIsEditing(false);
        }
    }, [editId]); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        const isNumeric = name === 'maxParticipants' || name === 'fee';
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: isNumeric ? Number(value) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            if (!formData.title || !formData.location || !formData.date || parseInt(formData.maxParticipants) <= 0) {
                setError("Please fill in all required fields (Title, Location, Event Date, Max Participants).");
                setSubmitting(false);
                return;
            }

            // Ensure fee and maxParticipants are numbers before sending
            const dataToSend = {
                ...formData,
                fee: Number(formData.fee),
                maxParticipants: Number(formData.maxParticipants)
            };

            if (isEditing) {
                // 🔑 FIX: API_BASE_URL use karein
                await axios.put(
                    `${API_BASE_URL}/api/events/${editId}`, 
                    dataToSend, 
                    { withCredentials: true }
                );
            } else {
                // 🔑 FIX: API_BASE_URL use karein
                await axios.post(
                    `${API_BASE_URL}/api/events`, 
                    dataToSend, 
                    { withCredentials: true }
                );
            }
            
            setSuccess(true);
            setTimeout(() => { navigate('/dashboard'); }, 1500); // Redirect to dashboard after creation/edit
            
        } catch (err) {
            const errorMsg = err.response?.data?.error || `Error ${isEditing ? 'updating' : 'creating'} event. Check console for details.`;
            setError(errorMsg);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };
  
    // Remaining JSX is unchanged to maintain UI/UX
    return (
        <div className="max-w-xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 mb-4 block">
                ← Back to Dashboard
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                {isEditing ? 'Edit Event' : 'Create New Event'} 
            </h2>
            
            {/* ... success/error messages ... */}
            {success && <p className="text-green-600 font-bold mb-4">✅ Event {isEditing ? 'updated' : 'created'} successfully! Redirecting...</p>}
            {error && <p className="text-red-600 font-bold mb-4">❌ Error: {error}</p>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <label className="text-gray-700 font-medium">Title:</label>
                <input name="title" value={formData.title} onChange={handleChange} required disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Description (Optional):</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" disabled={submitting} className={inputClasses}></textarea>
                
                <label className="text-gray-700 font-medium">Category:</label>
                <select name="category" value={formData.category} onChange={handleChange} required disabled={submitting} className={inputClasses}>
                    <option value="">Select Category</option>
                    <option value="Tech">Tech / IT</option>
                    <option value="Art">Art & Design</option>
                    <option value="Food">Food & Drinks</option>
                    <option value="Sport">Sport</option>
                    <option value="Other">Other</option>
                </select>

                <label className="text-gray-700 font-medium">Event Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Registration Last Date:</label>
                <input type="date" name="lastRegistrationDate" value={formData.lastRegistrationDate} onChange={handleChange} disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Location (City/Address):</label>
                <input name="location" value={formData.location} onChange={handleChange} required disabled={submitting} className={inputClasses} />
                
                 <label className="text-gray-700 font-medium">Ticket Price / Fee (INR):</label>
                 <input type="number" name="fee" value={formData.fee} onChange={handleChange} min="0" required disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Max Participants Limit:</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" required disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Image/Poster URL:</label>
                <input type="url" name="imageURL" value={formData.imageURL} onChange={handleChange} disabled={submitting} className={inputClasses} />

                <label className="text-gray-700 font-medium">Instagram Link (URL):</label>
                <input type="url" name="instagramLink" value={formData.instagramLink} onChange={handleChange} disabled={submitting} className={inputClasses} />
                
                <label className="text-gray-700 font-medium">External Website Link (URL):</label>
                <input type="url" name="websiteLink" value={formData.websiteLink} onChange={handleChange} disabled={submitting} className={inputClasses} />
                
                <label className="text-gray-700 font-medium">Registration Link (URL):</label>
                <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} disabled={submitting} className={inputClasses} />


                <button 
                  type="submit" 
                  disabled={submitting} 
                  className={`
                    mt-4 px-4 py-3 font-semibold rounded-md transition-colors 
                    ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  {submitting ? 'Processing...' : isEditing ? 'Update Event' : 'Create Event'} 
                </button>
            </form>
        </div>
    );
};
export default CreateEvent;