
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventDetail } from '../api/events.js'; 
import axios from 'axios'; 
import EventLinks from '../components/EventLinks.jsx';

const EventDetail = () => {
  const { id } = useParams(); 
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [roadDistance, setRoadDistance] = useState(null); 
  const [roadDuration, setRoadDuration] = useState(null);

  useEffect(() => {
    let userLat = null;
    let userLon = null;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => { userLat = position.coords.latitude; userLon = position.coords.longitude; },
            () => { console.warn("Could not retrieve user location."); },
            { enableHighAccuracy: false, timeout: 5000 }
        );
    }
    
    const fetchDataAndDistance = async () => {
      setLoading(true); setError(null); setRoadDistance(null); setRoadDuration(null);
      if (!id || id === 'undefined') { setError('Error: Invalid event ID in URL.'); setLoading(false); return; }

      try {
        const eventData = await getEventDetail(id); 
        setEvent(eventData);

        await new Promise(resolve => setTimeout(resolve, 150)); 
        
        if (userLat && userLon && eventData.locationLat && eventData.locationLon) {
            const response = await axios.get(
                `http://localhost:5050/api/events/distance/${id}?userLat=${userLat}&userLon=${userLon}`
            );
            setRoadDistance(response.data.distance);
            setRoadDuration(response.data.duration);
        }

      } catch (err) {
        const errorMsg = (err.response && err.response.status === 404) 
            ? 'Error: Event not found (404).' : 'Error: Could not load details or calculate distance.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndDistance();
  }, [id]);

  if (loading) return <h2 className="text-xl text-blue-500 mt-4">⌛ Loading Event Details...</h2>;
  if (error) {
    return (
      <div className="mt-4">
        <h2 className="text-xl text-red-600">❌ {error}</h2>
        <Link to="/" className="text-blue-600 mt-2 inline-block">← Back to Event List</Link>
      </div>
    );
  }
  if (!event || !event._id) return <h2 className="mt-4">No data found for this event.</h2>; 

  // --- Helper Functions ---
  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatPrice = (fee) => fee > 0 ? `INR ${fee}` : 'Free';
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  // Reusable Detail Item Component
  const DetailItem = ({ icon, label, value }) => (
      <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 flex items-center space-x-2 font-medium">
              {icon} <span>{label}</span>
          </span>
          <span className="text-gray-800 font-semibold">{value}</span>
      </div>
  );

  // Reusable External Link Component (Updated with SVGs)
  const ExternalLink = ({ label, url }) => {
    if (!url) return null;
    let iconSvg = null;
    
    if (url.includes('instagram.com')) {
        iconSvg = (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2.2c-2 0-3.6 1.6-3.6 3.6v8.4c0 2 1.6 3.6 3.6 3.6h8.4c2 0 3.6-1.6 3.6-3.6V7.8c0-2-1.6-3.6-3.6-3.6H7.6z"/><circle cx="12" cy="12" r="3"/><circle cx="16.9" cy="7.1" r=".5"/></svg>);
    } else {
        iconSvg = (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M16.907 10.172l1.1-1.102a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656z" /></svg>);
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-150 py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-xl">{iconSvg}</span> 
            <span className="font-medium underline">{label}</span>
        </a>
    );
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Link to="/" className="text-gray-600 hover:text-gray-800 mb-4 block font-medium">
        ← Back to Event List
      </Link>
      
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          
          {/* Header Image */}
          <div className="bg-gray-800 h-94 flex items-center justify-center text-white text-5xl font-extrabold relative">
              {event.imageURL ? (
                  <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover opacity-90" />
              ) : (
                  <span className="z-10">🎉 Event Poster</span>
              )}
              <h1 className="absolute bottom-0 left-0 p-6 text-4xl font-extrabold text-white z-10 bg-black/40 w-full">
                {event.title}
              </h1>
          </div>
          
          <div className="p-6 md:p-8">
              
              {/* Event Details and Pricing */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 border-b pb-6">
                  
                  <div>
                      <p className="text-lg font-semibold text-gray-400 mb-1">Pricing</p>
                      <p className={`text-3xl font-extrabold ${event.fee > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          {formatPrice(event.fee)}
                      </p>
                      {event.category && (
                          <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              {capitalize(event.category)}
                          </span>
                      )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                      <DetailItem icon="📅" label="Event Date" value={formatDate(event.date)} />
                      {event.lastRegistrationDate && (
                          <DetailItem icon="⏰" label="Register By" value={formatDate(event.lastRegistrationDate)} />
                      )}
                      <DetailItem icon="👥" label="Capacity" value={`${event.currentParticipants} / ${event.maxParticipants}`} />
                  </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-3">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description || "No detailed description provided."}</p>
              </div>

              {/* Road Distance Status */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-8">
                  <h4 className="font-semibold text-lg text-indigo-800 mb-2">Distance & Travel</h4>
                  <div className="space-y-1 text-sm">
                      <p className="text-gray-700">📍 Location: {event.location}</p>
                      
                      <p className="font-bold">
                        {roadDistance ? (
                            `🚗 Actual Road Distance: ${roadDistance} km`
                        ) : (
                            <span className="text-red-500">Calculating Road Distance...</span>
                        )}
                      </p>
                      {roadDuration && <p className="text-gray-600">🕒 Estimated Travel Time: {roadDuration}</p>}
                  </div>
              </div>
              
              {/* Connect Section (Finalized) */}
              <div className="pt-4">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Connect & Registration</h3>
                  
                  {(event.registrationLink || event.websiteLink) && (
                      <a 
                          href={event.registrationLink || event.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full inline-flex items-center justify-center bg-pink-600 text-white text-lg font-bold py-3 rounded-lg shadow-xl hover:bg-pink-700 transition-colors duration-300 mb-6"
                      >
                         <span role="img" aria-label="ticket" className="mr-3 text-2xl">🎟️</span>
                          Register Now
                      </a>
                  )}

                  <EventLinks event={event} />
              </div>
          </div>
      </div>
    </div>
  );
};
export default EventDetail;