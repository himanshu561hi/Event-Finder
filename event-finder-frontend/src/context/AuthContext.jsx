// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        // 🔑 FIX: Full path use karein
        axios.get(`${API_BASE_URL}/api/auth/current_user`, { withCredentials: true })
            .then(res => {
                // Backend 'false' bhejega agar logged out hai
                setUser(res.data || null); 
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch user status:", error);
                setUser(null);
                setLoading(false);
            });
    }, []);

    const logout = async () => {
        try {
            // 🔑 FIX: Full path use karein
            await axios.get(`${API_BASE_URL}/api/auth/logout`, { withCredentials: true });
            
            setUser(null);
            
            // Redirect to Home after logout
            navigate('/'); 
            
        } catch (error) {
            console.error("Client-side Logout Error:", error);
            navigate('/'); 
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};