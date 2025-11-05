"use client"
import { useAuth } from "../context/AuthContext.jsx"
import { Link } from "react-router-dom"
import UserEvents from "../components/UserEvents.jsx"

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="text-center mt-10 text-lg sm:text-xl text-gray-600">Loading Dashboard...</div>
  }

  if (!isAuthenticated) {
    return <h1 className="text-lg sm:text-xl text-red-600 mt-10 px-4">Access Denied. Please login.</h1>
  }

  const isVerified = user.verifiedProfile === true
  const verifiedData = user.verificationDetails || {}

  const userName = isVerified ? verifiedData.fullName : user.displayName
  const userEmail = user.email
  const userPhotoUrl = user.profilePhoto

  return (
    <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
        Dashboard
      </h2>

      {/* 1. PROFILE DETAILS SECTION (Displaying Verified Data) */}
      <div className="flex flex-col sm:flex-row items-start bg-white p-4 sm:p-6 border border-gray-200 rounded-lg shadow-md mb-6 sm:mb-8 gap-4 sm:gap-6">
        {userPhotoUrl && (
          <img
            src={userPhotoUrl || "/placeholder.svg"}
            alt={userName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-100 flex-shrink-0"
          />
        )}

        <div className="flex-1 w-full">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{userName}</h3>

          {/* Verified Details vs. Basic Details */}
          {isVerified && verifiedData.mobileNumber ? (
            <div className="text-xs sm:text-sm text-gray-700 space-y-1 mb-4">
              <p className="font-medium text-green-700">✅ Profile Verified</p>
              <p>📧 {userEmail}</p>
              <p>📱 {verifiedData.mobileNumber}</p>
              <p>📍 {verifiedData.fullAddress}</p>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-gray-500 space-y-1 mb-4">
              <p className="font-medium text-red-700">❌ Verification Required</p>
              <p>📧 {userEmail}</p>
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-500">
            👤 <b>Account Type:</b> Google User
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            🗓️ <b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <Link
            to="/create"
            className="mt-4 inline-block px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white text-sm sm:text-base rounded hover:bg-green-700 transition duration-150 font-semibold active:scale-95 sm:active:scale-100"
          >
            + Create New Event
          </Link>
        </div>
      </div>

      {/* 2. UPLOADED EVENTS SECTION */}
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b pb-1">
        Uploaded Events
      </h3>
      <UserEvents />
    </div>
  )
}
export default Dashboard
