import React from 'react';
const EventLinks = ({ event }) => {
    
    if (!event || (!event.instagramLink && !event.websiteLink)) {
        return null; 
    }

    const ICON_SIZE_CLASSES = "h-10 w-10 text-white";
    
    const InstagramIcon = () => (
        <svg className={ICON_SIZE_CLASSES} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
    );

    const WebsiteIcon = () => (
        <svg className={ICON_SIZE_CLASSES} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
        </svg>
    );

    return (
        <div className="flex flex-col items-center justify-center py-6 px-8 bg-white rounded-xl font-sans antialiased max-w-lg mx-auto"> 

            <h1 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Connect with Us
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">

                {event.instagramLink && (
                    <a 
                        href={event.instagramLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gray-50 border border-gray-100 min-w-[120px]"
                    >
                        <div className="p-3 rounded-full from-pink-500 via-red-500 to-yellow-500 shadow-md mb-2">
                            <InstagramIcon />
                        </div>
                        <div className="text-sm font-semibold text-gray-800">Instagram</div>
                        <div className="text-xs text-gray-500 mt-1">Visit our page</div>
                    </a>
                )}

                {event.websiteLink && (
                    <a 
                        href={event.websiteLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gray-50 border border-gray-100 min-w-[120px]"
                    >
                        <div className="p-3 rounded-full bg-blue-600 shadow-md mb-2">
                            <WebsiteIcon />
                        </div>
                        <div className="text-sm font-semibold text-gray-800">Website</div>
                        <div className="text-xs text-gray-500 mt-1">Official homepage</div>
                    </a>
                )}

            </div>
        </div>
    );
};


export default EventLinks;