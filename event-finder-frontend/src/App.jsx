// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Components & Pages
import Navbar from "./components/Navbar.jsx";
import WelcomeBanner from "./components/WelcomeBanner.jsx";
import Home from "./pages/Home.jsx"; // Main EventList/Login Page
import Dashboard from "./pages/Dashboard.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import Settings from "./pages/Settings.jsx";
import VerifyProfile from "./pages/VerifyProfile.jsx";

// --- Private Route Wrapper ---
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-10 text-2xl text-blue-600">
        Checking Session...
      </div>
    );
  }

  // All essential routes are now handled by Home or are private (Dashboard/Create)
  // We navigate to '/' (Home) which will display the login prompt if not authenticated.
  if (!isAuthenticated) {
    // If you want a dedicated login page (like /auth), uncomment this:
    // return <Navigate to="/" replace />;
    return <Navigate to="/" replace />; // Home handles the login wall
  }

  return element;
};

function App() {
  return (
    // FIX: AuthProvider ko Router ke upar wrap kiya gaya hai
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <WelcomeBanner />

          <div className="max-w-4xl mx-auto p-8">
            <Routes>
              {/* 1. PUBLIC/AUTHENTICATION ROUTE (The Landing Page) */}
              <Route path="/" element={<Home />} />

              {/* 2. PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/create"
                element={<PrivateRoute element={<CreateEvent />} />}
              />
              <Route
                path="/events/:id"
                // EventDetail is public to view, but requires login to fully interact (e.g., owner actions).
                // Keeping it as a PrivateRoute for consistency since most project features are gated.
                // If you want to make it viewable to everyone, change this to a regular <Route>
                element={<PrivateRoute element={<EventDetail />} />}
              />

              {/* 3. FALLBACK */}
              <Route
                path="*"
                element={
                  <h1 className="text-4xl font-bold mt-10">
                    404 - Page Not Found
                  </h1>
                }
              />
              <Route
                path="/settings"
                element={<PrivateRoute element={<Settings />} />} // <-- New Route Added
              />

              {/* Optional: Add a dedicated page for the complex verification process */}
              <Route // <--- Naya Route
  path="/verify-profile"
  element={<PrivateRoute element={<VerifyProfile />} />} 
/>
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
