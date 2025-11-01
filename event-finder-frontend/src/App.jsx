
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import Navbar from './components/Navbar.jsx';         
import WelcomeBanner from './components/WelcomeBanner.jsx'; 
import Home from './pages/Home.jsx';                       
import EventDetail from './pages/EventDetail.jsx';         
import CreateEvent from './pages/CreateEvent.jsx';         
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <AuthProvider> 
      <Router> 
        <div className="min-h-screen bg-gray-100"> 
          
          <Navbar /> 
          <WelcomeBanner />
          
          <div className="max-w-4xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/dashboard" element={<Dashboard />} /> 
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/settings" element={<h1>Settings Page</h1>} />
              <Route path="*" element={<h1 className="text-4xl font-bold mt-10">404 - Page Not Found</h1>} />
            </Routes>
            
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;