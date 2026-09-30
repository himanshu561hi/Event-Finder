// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  // useAuth से आवश्यक मान प्राप्त करें
  const { user, loading, logout } = useAuth();
  const userPhotoUrl = user?.profilePhoto;

  // displayName को सुरक्षित रूप से निकालने के लिए एक सहायक फ़ंक्शन
  const getFirstName = (displayName) => {
    // अगर displayName मौजूद है और एक स्ट्रिंग है, तो पहले शब्द को split करके वापस करें।
    // अन्यथा, 'User' वापस करें।
    if (typeof displayName === "string" && displayName.length > 0) {
      return displayName.split(" ")[0];
    }
    return "User";
  };

  const renderAuthControls = () => {
    if (loading) {
      return <div className="text-gray-500">Loading...</div>;
    }

    if (user) {
      // 💡 FIX: सुरक्षित नाम निकालना
      const firstName = getFirstName(user.displayName);

      return (
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="hidden sm:inline text-blue-600 hover:text-blue-800 transition duration-150 font-medium text-sm"
          >
            Dashboard
          </Link>

          <span className="hidden sm:inline text-gray-700 text-sm font-medium">
            {/* 💡 Welcome Message में सुरक्षित नाम का उपयोग */}
            Welcome, {firstName}!
          </span>

          {userPhotoUrl ? (
            <img
              key={user.id}
              src={userPhotoUrl} // यह यहाँ से इमेज लोड करने का प्रयास करता है
              alt={user?.displayName}
              className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
              {/* सुनिश्चित करें कि नाम का पहला अक्षर सुरक्षित रूप से निकाला जाए */}
              {user.displayName ? user.displayName[0] : "U"}
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
      const googleAuthUrl = `${backendUrl}/api/auth/google`;
        
      return (
        <a
          href={googleAuthUrl}
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
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-800 tracking-tight"
        >
          EventSyncc
        </Link>
        {renderAuthControls()}
      </div>
    </header>
  );
};
export default Navbar;
