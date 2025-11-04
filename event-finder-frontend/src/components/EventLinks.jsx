// import React from 'react';

// /**
//  * Renders dynamic social media and website links using Font Awesome icons.
//  * This component is used on the Event Detail page.
//  */
// const EventLinks = ({ event }) => {
    
//     // Safety check: Don't render if neither link is present
//     if (!event || (!event.instagramLink && !event.websiteLink)) {
//         return null; 
//     }

//     // Helper function to render a single dynamic link card
//     const LinkCard = ({ label, url, iconClass, iconColor, subtext }) => {
//         if (!url) return null;

//         return (
//             <a 
//                 href={url} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 // Styling: Clean white background, subtle hover effect, flex-grow for layout
//                 className="flex flex-col items-center p-4 rounded-xl transition-shadow duration-200 hover:shadow-lg bg-white border border-gray-200 flex-grow min-w-[120px]"
//             >
//                 {/* Icon Circle */}
//                 <div className={`p-3 rounded-full mb-2 ${iconColor === 'text-pink-600' ? 'bg-pink-100' : 'bg-blue-100'}`}> 
//                     {/* Font Awesome Icon */}
//                     <span className={`text-2xl ${iconClass} ${iconColor}`}></span>
//                 </div>
                
//                 {/* Title & Subtitle */}
//                 <div className="text-sm font-medium text-gray-800">{label}</div>
//                 <div className="text-xs text-gray-500 mt-1">{subtext}</div>
//             </a>
//         );
//     };

//     return (
//         <div className="flex flex-col items-center justify-center py-6 px-8 bg-white rounded-xl font-sans antialiased max-w-lg mx-auto"> 

//             <h1 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
//                 Connect with Us
//             </h1>

//             {/* Icon Container: Responsive layout for the links */}
//             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">

//                 {/* --- 1. Instagram Link --- */}
//                 <LinkCard 
//                     label="Instagram"
//                     url={event.instagramLink}
//                     iconClass="fab fa-instagram"
//                     iconColor="text-pink-600"
//                     subtext="Visit our page"
//                 />

//                 {/* --- 2. Website Link --- */}
//                 {/* Using websiteLink for Official Website link */}
//                 <LinkCard 
//                     label="Official Website"
//                     url={event.websiteLink}
//                     iconClass="fas fa-globe"
//                     iconColor="text-blue-600"
//                     subtext="Official homepage"
//                 />

//             </div>
//         </div>
//     );
// };


// export default EventLinks;

/**
 * Renders dynamic social media and website links using Font Awesome icons.
 * This component is used on the Event Detail page.
 */
const EventLinks = ({ event }) => {
  // Safety check: Don't render if neither link is present
  if (!event || (!event.instagramLink && !event.websiteLink)) {
    return null
  }

  // Helper function to render a single dynamic link card
  const LinkCard = ({ label, url, iconClass, iconColor, subtext }) => {
    if (!url) return null

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white border border-gray-100 flex-grow min-w-[140px] sm:min-w-[160px] group"
      >
        <div
          className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 ${
            iconColor === "text-pink-600"
              ? "bg-gradient-to-br from-pink-100 to-pink-50"
              : "bg-gradient-to-br from-blue-100 to-blue-50"
          }`}
        >
          {/* Font Awesome Icon */}
          <span className={`text-2xl sm:text-3xl ${iconClass} ${iconColor}`}></span>
        </div>

        <div className="text-sm sm:text-base font-semibold text-gray-900 text-center">{label}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 text-center">{subtext}</div>
      </a>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-gray-50 to-white rounded-3xl font-sans antialiased w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
        Connect with Us
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-8 sm:mb-10 text-center">
        Follow us on social media and visit our official website
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 w-full justify-center px-2 sm:px-4">
        {/* --- 1. Instagram Link --- */}
        <LinkCard
          label="Instagram"
          url={event.instagramLink}
          iconClass="fab fa-instagram"
          iconColor="text-pink-600"
          subtext="Visit our page"
        />

        {/* --- 2. Website Link --- */}
        {/* Using websiteLink for Official Website link */}
        <LinkCard
          label="Official Website"
          url={event.websiteLink}
          iconClass="fas fa-globe"
          iconColor="text-blue-600"
          subtext="Official homepage"
        />
      </div>
    </div>
  )
}

export default EventLinks
