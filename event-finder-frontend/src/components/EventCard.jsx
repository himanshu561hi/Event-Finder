// src/components/EventCard.jsx (Assuming you place components in a 'components' folder)

import React from 'react';
import { Link } from "react-router-dom";

// Get today's date (normalized to midnight) for comparison
const today = new Date();
today.setHours(0, 0, 0, 0);

const EventCard = ({ event }) => {
    const regDate = new Date(event.lastRegistrationDate);
    const isRegistrationClosed = event.lastRegistrationDate && regDate < today;

    return (
        <div
            key={event._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 hover:border-blue-200"
        >
            {/* Event Image */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 h-40 sm:h-44 md:h-48 flex items-center justify-center overflow-hidden">
                {event.imageURL ? (
                    <img
                        src={event.imageURL || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-center">
                        <div className="text-5xl sm:text-6xl mb-2 text-white">🎉</div>
                        <p className="text-gray-300 text-xs sm:text-sm font-medium">Event Poster</p>
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                {/* Event Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {event.title}
                </h3>

                {/* Location */}
                <div className="flex items-start gap-2 mb-2 text-xs sm:text-sm text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {/* Status Badges - Better badge layout and styling */}
                <div className="mb-5 mt-auto flex flex-wrap gap-2">
                    {event.currentParticipants < event.maxParticipants ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Seats Available
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✕ Event Full
                        </span>
                    )}

                    {isRegistrationClosed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                            Closed
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Open
                        </span>
                    )}
                </div>

                {/* View Details Button */}
                <Link
                    to={`/events/${event._id}`}
                    className="w-full text-center bg-blue-600 text-white py-2.5 sm:py-3 px-4 text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;