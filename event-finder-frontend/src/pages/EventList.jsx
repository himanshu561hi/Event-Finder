
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getEvents } from '../api/events.js'; 

// const EventList = () => {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     // ... (States for filtering remain the same) ...
//     const [searchInput, setSearchInput] = useState('');
//     const [activeFilter, setActiveFilter] = useState(''); 
//     const [userLat, setUserLat] = useState(null);
//     const [userLon, setUserLon] = useState(null);
//     const [distanceRadius, setDistanceRadius] = useState(50); 

//     // ... (fetchEvents and useEffect logic remains the same) ...
//     const fetchEvents = async (filter, lat, lon, radius) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await getEvents(filter, lat, lon, radius); 
//             setEvents(data);
//         } catch (err) {
//             console.error("Failed to fetch events:", err);
//             setError('Failed to load events. Please check the backend connection.');
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchEvents(activeFilter, userLat, userLon, distanceRadius); 
//     }, [activeFilter, userLat, userLon, distanceRadius]);

//     // ... (Handler functions: handleInputChange, handleSearchClick, handleClearClick, handleGetLocation) ...
//     const handleInputChange = (e) => setSearchInput(e.target.value);
//     const handleSearchClick = () => setActiveFilter(searchInput); 
//     const handleClearClick = () => {
//         setSearchInput('');
//         setActiveFilter('');
//         setUserLat(null);
//         setUserLon(null);
//         setDistanceRadius(50);
//     };
//     const handleGetLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setUserLat(position.coords.latitude);
//                     setUserLon(position.coords.longitude);
//                     setDistanceRadius(50);
//                     alert("Location set! Filtering events within 50km.");
//                 },
//                 (error) => {
//                     alert("Error getting location: " + error.message);
//                 }
//             );
//         } else {
//             alert("Geolocation is not supported by this browser.");
//         }
//     };


//     if (loading) return <p className="text-center py-10 text-xl text-blue-500">⌛ Loading Events...</p>;
//     if (error) return <p className="text-center py-10 text-xl text-red-600">❌ Error: {error}</p>;

//     // Get today's date (normalized to midnight) for comparison
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     return (
//         <div className="pt-2">
            
//             {/* Action Buttons Section (Unchanged) */}
//             <div className="flex gap-4 mb-6 items-center">
//                 <Link to="/create" className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors">
//                     + Create New Event
//                 </Link>
//                 <button
//                     onClick={handleGetLocation}
//                     className={`px-4 py-2 text-white font-semibold rounded-md shadow-md transition-colors ${userLat ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'}`}
//                 >
//                     {userLat ? `Near Me (${distanceRadius}km)` : "Find Events Near Me"}
//                 </button>
//             </div>

//             {/* Refined Search Interface (Unchanged) */}
//             <div className="flex gap-2 mb-6 items-stretch">
//                 <input
//                     type="text"
//                     placeholder="Filter by Location (e.g., Bengaluru)"
//                     value={searchInput}
//                     onChange={handleInputChange} 
//                     className="p-3 border border-gray-300 rounded-md flex-grow focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                     onClick={handleSearchClick}
//                     className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
//                 >
//                     Search
//                 </button>
//                 <button
//                     onClick={handleClearClick}
//                     className="px-4 py-3 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 transition-colors whitespace-nowrap"
//                 >
//                     Clear
//                 </button>
//             </div>

//             <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//                 Available Events ({events.length})
//             </h2>

//             {/* EVENT CARDS GRID - Optimized Structure */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
//                 {events.length > 0 ? (
//                     events.map(event => {
                        
//                         // --- NEW: Registration Logic ---
//                         const regDate = new Date(event.lastRegistrationDate);
//                         // Check if registration date exists AND if it has passed (is less than today)
//                         const isRegistrationClosed = event.lastRegistrationDate && regDate < today;
//                         // ------------------------------

//                         return (
//                             <div 
//                                 key={event._id} 
//                                 className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
//                             >
                                
//                                 {/* Header Image Placeholder */}
//                                 <div className="bg-gray-800 h-40 flex items-center justify-center text-white text-5xl font-extrabold relative">
//                                     {event.imageURL ? (
//                                         <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover opacity-100" />
//                                     ) : (
//                                         <span className="z-10 text-2xl">🎉 Event Poster</span>
//                                     )}
//                                 </div>

//                                 <div className="p-5 flex flex-col flex-grow">
//                                     <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
//                                         {event.title}
//                                     </h3>
                                    
//                                     {/* Location (with Ellipsis) */}
//                                     <p className="text-gray-600 flex items-center mb-1 truncate whitespace-nowrap overflow-hidden">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
//                                         {event.location}
//                                     </p>
                                    
//                                     <p className="text-gray-600 flex items-center mb-3">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
//                                         {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                                     </p>

//                                     {/* Participants Status Badge (Uses mt-auto to push content down) */}
//                                     <div className="mb-4 mt-auto flex justify-between items-center">
                                        
//                                         {/* Seats Badge */}
//                                         {event.currentParticipants < event.maxParticipants ? (
//                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                                                 Seats Available
//                                             </span>
//                                         ) : (
//                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                                                 Event Full
//                                             </span>
//                                         )}

//                                         {/* NEW: Registration Status Badge */}
//                                         {isRegistrationClosed ? (
//                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
//                                                 Closed
//                                             </span>
//                                         ) : (
//                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                                                 Open
//                                             </span>
//                                         )}
//                                     </div>
                                    
//                                     {/* View Details Button (Sticks to the very bottom) */}
//                                     <Link 
//                                         to={`/events/${event._id}`} 
//                                         className="w-full block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
//                                     >
//                                         View Details
//                                     </Link>
//                                 </div>
//                             </div>
//                         )
//                     })
//                 ) : (
//                     <p className="col-span-full text-center text-gray-500 text-lg py-10">No events found matching the criteria.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EventList;


// src/pages/EventList.jsx

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getEvents } from "../api/events.js"
import EventCard from "../components/EventCard.jsx" // 👈 Import the new card component

const EventList = () => {
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
          alert("Location set! Filtering events within 50km.")
        },
        (error) => {
          alert("Error getting location: " + error.message)
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
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
          <Link
            to="/create"
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