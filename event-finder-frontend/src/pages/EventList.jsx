"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getEvents } from "../api/events.js"
import { useAuth } from '../context/AuthContext.jsx';
import EventCard from "../components/EventCard.jsx" // 👈 Import the new card component
import toast, { Toaster } from 'react-hot-toast';

// ComponentWhereLinkIsRendered को हटाकर, सारा लॉजिक EventList के अंदर डालें
const EventList = () => {
  // 1. Auth Hook का उपयोग करें (अब यह EventList के अंदर है)
  const { isAuthenticated } = useAuth(); 
  
  // 2. Alert फंक्शन को EventList के अंदर डिफाइन करें
  const handleCreateClick = (e) => {
      if (!isAuthenticated) {
          e.preventDefault(); // लिंक को खुलने से रोकें
          toast.error("Please sign in to create a new event.", {
              duration: 4000, // 4 सेकंड तक दिखाएँ
              position: 'top-center',
              style: {
                  fontSize: '16px',
                  backgroundColor: '#fee2e2', // Red/Error background
                  color: '#991b1b',
              }
          });
      }
    };

  // ... बाकी के सारे State (unchanged)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchInput, setSearchInput] = useState("")
  const [activeFilter, setActiveFilter] = useState("")
  const [userLat, setUserLat] = useState(null)
  const [userLon, setUserLon] = useState(null)
  const [distanceRadius, setDistanceRadius] = useState(50)

  const fetchEvents = async (filter, lat, lon, radius) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents(filter, lat, lon, radius)
      setEvents(data)
    } catch (err) {
      console.error("Failed to fetch events:", err)
      setError("Failed to load events. Please check the backend connection.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchEvents(activeFilter, userLat, userLon, distanceRadius)
  }, [activeFilter, userLat, userLon, distanceRadius])

  const handleInputChange = (e) => setSearchInput(e.target.value)
  const handleSearchClick = () => setActiveFilter(searchInput)
  const handleClearClick = () => {
    setSearchInput("")
    setActiveFilter("")
    setUserLat(null)
    setUserLon(null)
    setDistanceRadius(50)
  }
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude)
          setUserLon(position.coords.longitude)
          setDistanceRadius(50)
          toast.success("Location set! Filtering events within 50km.", { position: 'top-center' });
        },
        (error) => {
          toast.error("Error getting location: " + error.message, { position: 'top-center' });
        },
      )
    } else {
      toast.error("Geolocation is not supported by this browser.", { position: 'top-center' });
    }
  }

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-center text-sm sm:text-base md:text-lg text-blue-500">⌛ Loading Events...</p>
      </div>
    )
  if (error)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-center text-sm sm:text-base md:text-lg text-red-600">❌ Error: {error}</p>
      </div>
    )

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Find and join amazing events happening near you
          </p>
        </div>

        {/* Action Buttons Section - Improved responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
          
          {/* 3. Link Rendering Logic */}
          <Link
            to={isAuthenticated ? "/create" : "#"} // अगर लॉग इन हैं तो /create, वरना # (यानी कहीं नहीं)
            onClick={handleCreateClick} // हमेशा इस फंक्शन को चलाएँ
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 sm:py-2.5 text-sm sm:text-base bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200"
        >
            + Create New Event
          </Link>
          
          <button
            onClick={handleGetLocation}
            className={`flex-1 sm:flex-initial px-6 py-3 sm:py-2.5 text-sm sm:text-base text-white font-semibold rounded-lg shadow-md transition-all duration-200 ${userLat ? "bg-purple-700 hover:bg-purple-800 hover:shadow-lg" : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"}`}
          >
            {userLat ? `📍 Near Me (${distanceRadius}km)` : "📍 Find Events Near Me"}
          </button>
        </div>

        {/* Search Section - Enhanced search bar with better responsive design */}
        <div className="mb-8 sm:mb-10 bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search by location (e.g., Bengaluru, Mumbai)"
              value={searchInput}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearchClick}
              className="px-6 py-3 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 whitespace-nowrap"
            >
              Search
            </button>
            <button
              onClick={handleClearClick}
              className="px-6 py-3 text-sm sm:text-base bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Available Events <span className="text-blue-600">({events.length})</span>
        </h2>

        {/* Events Grid - Uses the imported EventCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event._id} event={event} />) 
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-base sm:text-lg md:text-xl font-medium">
                No events found matching your criteria.
              </p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventList