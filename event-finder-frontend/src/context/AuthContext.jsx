// // src/context/AuthContext.jsx

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check user status upon loading
//         axios.get('http://localhost:5050/api/auth/current_user', { withCredentials: true })
//             .then(res => {
//                 setUser(res.data || null);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error("Failed to fetch user status:", error);
//                 setUser(null);
//                 setLoading(false);
//             });
//     }, []);

//     const logout = async () => {
//         try {
//             // CRITICAL FIX: Add { withCredentials: true } to send the session cookie
//             await axios.get('http://localhost:5050/api/auth/logout', { withCredentials: true });
            
//             setUser(null);
//             // After successful logout and session clear, force page reload
//             window.location.href = '/'; 
            
//         } catch (error) {
//             console.error("Client-side Logout Error:", error);
//         }
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };



// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5050/api/auth/current_user', { withCredentials: true })
            .then(res => {
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
            // CRITICAL FIX: Ensure 'withCredentials: true' is added
            await axios.get('http://localhost:5050/api/auth/logout', { withCredentials: true });
            
            // Clear client-side state and reload
            setUser(null);
            window.location.href = '/'; 
            
        } catch (error) {
            console.error("Client-side Logout Error:", error);
            // Optionally, force reload even on error to clear local state
            window.location.href = '/'; 
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};