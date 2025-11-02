<h1 align="center" style="color:#007bff; font-size: 40px;">📅 Mini Event Finder & Manager 🗺️</h1> <h3 align="center" style="color:gray;">Securely Discover, Create, and Manage Events with Geo-Filtering</h3>

<p align="center" style="font-size: 16px;"> Mini Event Finder is a robust full-stack platform enabling authenticated users to list, discover, edit, and delete events. It features persistent storage via MongoDB and advanced geographical filtering based on the user's location. </p> <li><a href="http://localhost:5173/">LIVE LOCAL DEMO</a></li>

<hr>


<ul>
  <li><a href="#about">About the Project</a></li>
  <li><a href="#tech">Tech Stack</a></li>
  <li><a href="#dependencies">All Dependencies</a></li>
  <li><a href="#setup">How to Use This Project</a></li>
  <li><a href="#features">Key Features</a></li>
  <li><a href="#routes">API Endpoints & Data Models</a></li>
  <li><a href="#contact">Contact Me</a></li>
</ul>

<hr>

<h2 id="about">🧭 About the Project</h2>

<p> Mini Event Finder is a robust, full-stack application designed for secure event management and discovery. Unlike simple listing apps, it features persistent user and event data storage, geographical filtering, and comprehensive event management tools. This project serves as a strong demonstration of modern web development principles and secure API integration. </p>

<ul>   <li><strong>Persistent Data Management:</strong> Stores all user profiles and event details securely using <strong>MongoDB and Mongoose</strong>.</li>   <li><strong>Secure User Access:</strong> Implements Google OAuth 2.0 and Passport.js to ensure secure user authentication and session management.</li>   <li><strong>Geo-Filtering Capabilities:</strong> Enables users to find events by location name and filter listings by <strong>physical proximity (Haversine distance)</strong>.</li>   <li><strong>Full Event Lifecycle:</strong> Allows authenticated users to Create, Read, Update, and Delete (CRUD) their own events with automatic coordinate lookup (Geocoding).</li>   <li><strong>Dashboard View:</strong> Provides a clean, personalized dashboard for managing uploaded events and tracking user profile details.</li> </ul>

<hr>

ज़रूर\! आपके **Mini Event Finder** प्रोजेक्ट के लिए यह $\text{Folder}$ $\text{Structure}$ का $\text{HTML}$ कंटेंट है, जिसे $\text{Markdown}$ में प्रस्तुत किया गया है।

यह $\text{structure}$ $\text{Next.js}$ के बजाय हमारे $\text{React}$ / $\text{Node.js}$ प्रोजेक्ट की वास्तविक संरचना को दर्शाता है।

-----

## 🗂️ Folder & File Structure

MINI-EVENT-FINDER/
├── event-finder-backend/         # Node/Express Server
│   ├── models/
│   │   ├── Event.js             # Mongoose Schema for Events
│   │   └── User.js              # Mongoose Schema for User Profiles
│   ├── node_modules/
│   ├── .env                     # API Keys and Secrets (CRITICAL - ignored by Git)
│   ├── .gitignore
│   └── index.js                 # Main Express App (Routes, Middleware, DB Connection)
│
└── event-finder-frontend/        # React Client (Vite)
    ├── node_modules/
    ├── public/
    │   └── images/               # Static assets (Social Media Icons, etc.)
    ├── src/
    │   ├── api/                 # Axios functions for all backend calls
    │   │   └── events.js
    │   ├── components/          # Reusable UI Elements
    │   │   ├── Navbar.jsx       # Global Navigation & Auth Controls
    │   │   ├── WelcomeBanner.jsx# Login Status Banner
    │   │   └── UserEvents.jsx   # Filters and displays user's uploaded events
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global user authentication state
    │   ├── pages/               # Components linked to specific routes
    │   │   ├── Dashboard.jsx    # Main user hub (where UserEvents is shown)
    │   │   ├── EventList.jsx    # All events list view
    │   │   ├── EventDetail.jsx  # Individual event details view
    │   │   └── CreateEvent.jsx  # Create/Edit form (handles POST/PUT)
    │   ├── App.jsx              # Main Router Configuration
    │   └── main.jsx             # React Root Entry Point
    └── .gitignore
</pre>

<hr>

<table>
  <tr><th>Part</th><th>Technology</th><th>Role in Project</th></tr>
  <tr><td>Frontend</td><td><b>React (Vite)</b></td><td>Dynamic UI, AuthContext, Geolocation calls</td></tr>
  <tr><td>Styling</td><td><b>Tailwind CSS</b></td><td>Utility-first styling and responsive design</td></tr>
  <tr><td>Backend</td><td><b>Node.js / Express.js</b></td><td>RESTful API endpoints and server logic</td></tr>
  <tr><td>Database</td><td><b>MongoDB (Mongoose)</b></td><td>Persistent storage for Event and User models</td></tr>
  <tr><td>Authentication</td><td><b>Google OAuth 2.0 (Passport.js)</b></td><td>Secure user login and session management</td></tr>
  <tr><td>Geocoding</td><td><b>OpenCage / node-fetch</b></td><td>Address को Latitude/Longitude में convert करना</td></tr>
  <tr><td>Routing Logic</td><td><b>Google Distance Matrix API</b></td><td>वास्तविक सड़क की दूरी (Road Distance) की गणना करना</td></tr>
</table>

<hr>

<h3>Backend Packages (Server Logic & DB)</h3>
<table>
    <tr><th>Package</th><th>Version (Example)</th><th>Purpose</th></tr>
    <tr><td><b>mongoose</b></td><td>^8.4.3</td><td>MongoDB connection and schema management (ODM).</td></tr>
    <tr><td><b>passport</b></td><td>^0.7.0</td><td>Core authentication middleware.</td></tr>
    <tr><td><b>passport-google-oauth20</b></td><td>^2.0.0</td><td>Google Sign-In strategy implementation.</td></tr>
    <tr><td><b>express-session</b></td><td>^1.18.0</td><td>Tracks user login state and session management.</td></tr>
    <tr><td><b>node-fetch</b></td><td>^2.6.7</td><td>Makes external API calls (Geocoding/Distance Matrix).</td></tr>
    <tr><td><b>dotenv</b></td><td>^16.4.5</td><td>Loads API keys and secrets from the .env file.</td></tr>
    <tr><td><b>express</b></td><td>^4.19.2</td><td>Main server and API routing framework.</td></tr>
    <tr><td><b>cors</b></td><td>^2.8.5</td><td>Allows cross-origin requests.</td></tr>
    <tr><td><b>nodemon</b></td><td>^3.1.4</td><td>Automatically restarts the server (DevDependency).</td></tr>
</table>

<h3>Frontend Packages (UI & Routing)</h3>
<table>
    <tr><th>Package</th><th>Version (Example)</th><th>Purpose</th></tr>
    <tr><td><b>react</b></td><td>^18.2.0</td><td>Core library for building the user interface.</td></tr>
    <tr><td><b>react-router-dom</b></td><td>^6.23.1</td><td>Handles client-side navigation and routing.</td></tr>
    <tr><td><b>axios</b></td><td>^1.6.2</td><td>Handles all API calls from the client.</td></tr>
    <tr><td><b>tailwindcss</b></td><td>^3.4.4</td><td>Utility-first CSS framework for styling.</td></tr>
    <tr><td><b>@vitejs/plugin-react</b></td><td>^4.2.1</td><td>Vite plugin for React (Build Tool).</td></tr>
</table>. 