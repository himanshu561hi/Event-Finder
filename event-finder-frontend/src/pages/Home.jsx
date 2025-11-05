
"use client"
import { useAuth } from "../context/AuthContext.jsx"
import EventList from './EventList.jsx'; 

const Home = () => {
  const { loading, isAuthenticated } = useAuth()


  if (loading) {
    return <div className="text-center mt-10 text-lg sm:text-xl text-gray-600">Checking authentication status...</div>
  }

  if (!isAuthenticated) {
    // 🔒 Display Login Prompt
    const googleAuthUrl =
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/google` || "http://localhost:5050/api/auth/google"

    // return (
    //   <div className="flex items-center justify-center min-h-screen bg-red-50 p-4 sm:p-6 md:p-8">
    //     <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-12">
    //       <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-blue-900 mb-4 sm:mb-6 md:mb-10">
    //         EventSyncc
    //       </h1>

    //       <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-red-700 mb-2 sm:mb-3">
    //         🔐 Access Restricted
    //       </h2>
    //       <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 md:mb-10">
    //         Please sign in with Google to view and manage events.
    //       </p>
    //       <a
    //         href={googleAuthUrl}
    //         className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
    //       >
    //         Sign in with Google
    //       </a>
    //     </div>
    //   </div>
    // )
};
    return (
      
         <div className="mt-3">
             <EventList /> 
         </div>
     );
  
}

export default Home
