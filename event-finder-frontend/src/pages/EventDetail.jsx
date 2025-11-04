// // src/pages/EventDetail.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getEventDetail, getEventDistance } from '../api/events.js'; // NEW: getEventDistance import
// import EventLinks from '../components/EventLinks.jsx'; 
// // NOTE: Helper Components (DetailItem, ExternalLink) are kept inside the file's global scope as per original structure

// const DetailItem = ({ icon, label, value }) => (
//     <div className="flex justify-between items-center py-1">
//         <span className="text-gray-500 flex items-center space-x-2 font-medium">
//             {icon} <span>{label}</span>
//         </span>
//         <span className="text-gray-800 font-semibold">{value}</span>
//     </div>
// );

// const EventDetail = () => {
//   const { id } = useParams(); 
  
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null);
  
//   const [roadDistance, setRoadDistance] = useState(null); 
//   const [roadDuration, setRoadDuration] = useState(null);
  
//   // undefined = not checked; {lat: null, lon: null} = permission denied/error
//   const [userCoords, setUserCoords] = useState(undefined); 

//   // --- 1. NON-BLOCKING GEOLOCATION FETCH ---
//   useEffect(() => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => { setUserCoords({ lat: position.coords.latitude, lon: position.coords.longitude }); },
//             () => { setUserCoords({ lat: null, lon: null }); console.warn("Could not retrieve user location."); },
//             { enableHighAccuracy: false, timeout: 5000 }
//         );
//     } else {
//         setUserCoords({ lat: null, lon: null });
//     }
//   }, []); 

//   // --- 2. FETCH MAIN EVENT DATA ---
//   useEffect(() => {
//     const fetchMainData = async () => {
//       setLoading(true); setError(null);
      
//       if (!id || id === 'undefined') { setError('Error: Invalid event ID in URL.'); setLoading(false); return; }

//       try {
//         const eventData = await getEventDetail(id); 
//         setEvent(eventData);
//       } catch (err) {
//         const errorMsg = (err.response && err.response.status === 404) 
//             ? 'Error: Event not found (404).' : 'Error: Could not load details.';
//         setError(errorMsg);
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchMainData();
//   }, [id]); 


//   // --- 3. FETCH DISTANCE (Background task) ---
//   useEffect(() => {
//     // Run only if event data is fetched AND userCoords is resolved (not undefined)
//     if (event && userCoords !== undefined) {
//         const { lat: userLat, lon: userLon } = userCoords;
//         const { locationLat, locationLon } = event;
        
//         // Only calculate if BOTH event coords AND user coords are valid
//         if (userLat && userLon && locationLat && locationLon) {
//             const fetchDistance = async () => {
//                 try {
//                     // Use the dedicated API function
//                     const result = await getEventDistance(event._id, userLat, userLon);
                    
//                     if (result.distance) {
//                         setRoadDistance(result.distance);
//                         setRoadDuration(result.duration);
//                     } else {
//                         setRoadDistance('N/A (API Failed)');
//                     }
//                 } catch (err) {
//                     setRoadDistance('N/A (Network Error)'); 
//                 }
//             };
//             fetchDistance();
//         } else {
//             setRoadDistance('N/A (Coords Missing)');
//         }
//     }
//   }, [event, userCoords]); 


//   // --- Render Gates and Helper Logic ---
//   if (loading) return <h2 className="text-xl text-blue-500 mt-4">⌛ Loading Event Details...</h2>;
//   if (error) {
//     return (
//       <div className="mt-4">
//         <h2 className="text-xl text-red-600">❌ {error}</h2>
//         <Link to="/" className="text-blue-600 mt-2 inline-block">← Back to Event List</Link>
//       </div>
//     );
//   }
//   if (!event || !event._id) return <h2 className="mt-4">No data found for this event.</h2>; 

//   const formatDate = (isoDate) => isoDate ? new Date(isoDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
//   const formatPrice = (fee) => fee > 0 ? `INR ${fee}` : 'Free';
//   const capitalize = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  

//   // Remaining JSX is unchanged to maintain UI/UX
//   return (
//     <div className="max-w-4xl mx-auto mt-6">
      
//       <Link to="/" className="text-gray-600 hover:text-gray-800 mb-4 block font-medium">
//         ← Back to Event List
//       </Link>
      
//       <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          
//           {/* Header Image */}
//           <div className="bg-gray-800 h-94 flex items-center justify-center text-white text-5xl font-extrabold relative">
//               {event.imageURL ? (
//                   <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover opacity-90" />
//               ) : (
//                   <span className="z-10">🎉 Event Poster</span>
//               )}
//               <h1 className="absolute bottom-0 left-0 p-6 text-4xl font-extrabold text-white z-10 bg-black/40 w-full">
//                 {event.title}
//               </h1>
//           </div>
          
//           <div className="p-6 md:p-8">
              
//               {/* Event Details and Pricing */}
//               <div className="grid md:grid-cols-3 gap-6 mb-8 border-b pb-6">
                  
//                   <div>
//                       <p className="text-lg font-semibold text-gray-400 mb-1">Pricing</p>
//                       <p className={`text-3xl font-extrabold ${event.fee > 0 ? 'text-green-600' : 'text-blue-600'}`}>
//                           {formatPrice(event.fee)}
//                       </p>
//                       {event.category && (
//                           <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
//                               {capitalize(event.category)}
//                           </span>
//                       )}
//                   </div>

//                   <div className="md:col-span-2 space-y-2">
//                       <DetailItem icon="📅" label="Event Date" value={formatDate(event.date)} />
//                       {event.lastRegistrationDate && (
//                           <DetailItem icon="⏰" label="Register By" value={formatDate(event.lastRegistrationDate)} />
//                       )}
//                       <DetailItem icon="👥" label="Capacity" value={`${event.currentParticipants} / ${event.maxParticipants}`} />
//                   </div>
//               </div>
              
//               {/* Description */}
//               <div className="mb-8">
//                   <h3 className="text-xl font-bold text-gray-700 mb-3">About This Event</h3>
//                   <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description || "No detailed description provided."}</p>
//               </div>

//               {/* Road Distance Status */}
//               <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-8">
//                   <h4 className="font-semibold text-lg text-indigo-800 mb-2">Distance & Travel</h4>
//                   <div className="space-y-1 text-sm">
//                       <p className="text-gray-700">📍 Location: {event.location}</p>
                      
//                       <p className="font-bold">
//                         {roadDistance ? (
//                             `🚗 Actual Road Distance: ${roadDistance} km`
//                         ) : (
//                             userCoords === undefined ? (
//                                 <span className="text-gray-500">Awaiting location permission...</span>
//                             ) : (
//                                 <span className="text-red-500">Calculating Road Distance...</span>
//                             )
//                         )}
//                       </p>
//                       {roadDuration && <p className="text-gray-600">🕒 Estimated Travel Time: {roadDuration}</p>}
//                   </div>
//               </div>
              
//               {/* Connect Section */}
//               <div className="pt-4">
//                   <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Connect & Registration</h3>
                  
//                   {(event.registrationLink || event.websiteLink) && (
//                       <a 
//                           href={event.registrationLink || event.websiteLink} 
//                           target="_blank" 
//                           rel="noopener noreferrer" 
//                           className="w-full inline-flex items-center justify-center bg-pink-600 text-white text-lg font-bold py-3 rounded-lg shadow-xl hover:bg-pink-700 transition-colors duration-300 mb-6"
//                       >
//                          <span role="img" aria-label="ticket" className="mr-3 text-2xl">🎟️</span>
//                           Register Now
//                       </a>
//                   )}

//                   <EventLinks event={event} />
//               </div>
//           </div>
//       </div>
//     </div>
//   );
// };
// export default EventDetail;



"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getEventDetail, getEventDistance } from "../api/events.js"
import EventLinks from "../components/EventLinks.jsx"

const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-2 border-b sm:border-b-0">
    <span className="text-gray-600 flex items-center space-x-2 font-medium text-sm sm:text-base mb-1 sm:mb-0">
      {icon} <span>{label}</span>
    </span>
    <span className="text-gray-900 font-semibold text-sm sm:text-base">{value}</span>
  </div>
)

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roadDistance, setRoadDistance] = useState(null)
  const [roadDuration, setRoadDuration] = useState(null)
  const [userCoords, setUserCoords] = useState(undefined)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({ lat: position.coords.latitude, lon: position.coords.longitude })
        },
        () => {
          setUserCoords({ lat: null, lon: null })
          console.warn("Could not retrieve user location.")
        },
        { enableHighAccuracy: false, timeout: 5000 },
      )
    } else {
      setUserCoords({ lat: null, lon: null })
    }
  }, [])

  useEffect(() => {
    const fetchMainData = async () => {
      setLoading(true)
      setError(null)

      if (!id || id === "undefined") {
        setError("Error: Invalid event ID in URL.")
        setLoading(false)
        return
      }

      try {
        const eventData = await getEventDetail(id)
        setEvent(eventData)
      } catch (err) {
        const errorMsg =
          err.response && err.response.status === 404
            ? "Error: Event not found (404)."
            : "Error: Could not load details."
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchMainData()
  }, [id])

  useEffect(() => {
    if (event && userCoords !== undefined) {
      const { lat: userLat, lon: userLon } = userCoords
      const { locationLat, locationLon } = event

      if (userLat && userLon && locationLat && locationLon) {
        const fetchDistance = async () => {
          try {
            const result = await getEventDistance(event._id, userLat, userLon)

            if (result.distance) {
              setRoadDistance(result.distance)
              setRoadDuration(result.duration)
            } else {
              setRoadDistance("N/A (API Failed)")
            }
          } catch (err) {
            setRoadDistance("N/A (Network Error)")
          }
        }
        fetchDistance()
      } else {
        setRoadDistance("N/A (Coords Missing)")
      }
    }
  }, [event, userCoords])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl sm:text-2xl text-blue-600 font-semibold">⌛ Loading Event Details...</h2>
      </div>
    )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <h2 className="text-lg sm:text-xl text-red-600 font-bold mb-4">❌ {error}</h2>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Event List
          </Link>
        </div>
      </div>
    )
  }

  if (!event || !event._id) return <h2 className="mt-6 text-center text-gray-600">No data found for this event.</h2>

  const formatDate = (isoDate) =>
    isoDate
      ? new Date(isoDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A"

  const formatPrice = (fee) => (fee > 0 ? `INR ${fee}` : "Free")
  const capitalize = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "")

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors text-sm sm:text-base"
        >
          ← Back to Event List
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white relative overflow-hidden group">
            {event.imageURL ? (
              <img
                src={event.imageURL || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-3xl sm:text-5xl z-10">🎉</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
              <h1 className="p-4 sm:p-6 lg:p-8 text-2xl sm:text-3xl md:text-4xl font-bold text-white text-balance">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="lg:col-span-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pricing</p>
                <p
                  className={`text-3xl sm:text-4xl font-bold mb-3 ${event.fee > 0 ? "text-green-600" : "text-blue-600"}`}
                >
                  {formatPrice(event.fee)}
                </p>
                {event.category && (
                  <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-indigo-200 transition-colors">
                    {capitalize(event.category)}
                  </span>
                )}
              </div>

              <div className="sm:col-span-1 lg:col-span-2 space-y-3 sm:space-y-2">
                <DetailItem icon="📅" label="Event Date" value={formatDate(event.date)} />
                {event.lastRegistrationDate && (
                  <DetailItem icon="⏰" label="Register By" value={formatDate(event.lastRegistrationDate)} />
                )}
                <DetailItem
                  icon="👥"
                  label="Capacity"
                  value={`${event.currentParticipants} / ${event.maxParticipants}`}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About This Event</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {event.description || "No detailed description provided."}
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl mb-8">
              <h4 className="font-bold text-base sm:text-lg text-indigo-900 mb-3 sm:mb-4">📍 Distance & Travel</h4>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-800">
                  <span className="font-semibold">Location:</span> {event.location}
                </p>

                <p className="font-semibold">
                  {roadDistance ? (
                    <span className="text-indigo-700">
                      🚗 Road Distance: <span className="text-green-600">{roadDistance} km</span>
                    </span>
                  ) : userCoords === undefined ? (
                    <span className="text-gray-500">Awaiting location permission...</span>
                  ) : (
                    <span className="text-orange-600">Calculating Road Distance...</span>
                  )}
                </p>
                {roadDuration && (
                  <p className="text-gray-800">
                    <span className="font-semibold">🕒 Travel Time:</span> {roadDuration}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-300 pb-3">
                Connect & Registration
              </h3>

              {(event.registrationLink || event.websiteLink) && (
                <a
                  href={event.registrationLink || event.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300 text-base sm:text-lg mb-6"
                >
                  <span className="mr-2 text-xl sm:text-2xl">🎟️</span>
                  Register Now
                </a>
              )}

              <EventLinks event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
