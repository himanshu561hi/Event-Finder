import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import EventList from './EventList.jsx';

const Home = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-lg sm:text-xl text-gray-600 animate-pulse">
          Checking authentication status...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <EventList />
    </div>
  );
};

export default Home;
