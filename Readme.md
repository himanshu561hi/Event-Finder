# 📅 EventSyncc – Mini Event Finder & Manager 🗺️

> **Discover, Create, and Manage Events with Geo-Filtering & Profile Verification**

EventSyncc is a modern full-stack web application designed for event discovery, management, and identity verification. It features Google OAuth 2.0 authentication, persistent storage via MongoDB, geocoding & road distance matrix APIs, user identity document upload via Cloudinary, and responsive UI with Tailwind CSS.

---

## 🚀 Live Demo & Repository
- **Local Dev Server**: `http://localhost:5173`
- **Backend API**: `http://localhost:5050`

---

## 🎯 Key Features

- 🔐 **Secure Google Authentication**: Passport.js (Google OAuth 2.0) with persistent MongoDB session storage (`connect-mongo`).
- 📍 **Location-Based Proximity & Geo-Filtering**: Auto-geocoding locations via OpenCage API and calculating real-time road distance/travel duration via Google Distance Matrix API.
- 📜 **Event Lifecycle Management**: Full CRUD operations for creating, editing, viewing, and soft-deleting/archiving user-owned events.
- 🆔 **User Profile Verification**: Verification workflow allowing users to submit identity documents processed via Multer and stored securely on Cloudinary.
- 🎨 **Modern Responsive UI**: Built with React, Vite, Tailwind CSS, custom modals, and interactive toast notifications via React Hot Toast.

---

## 🗂️ Project Structure

```
Event-Finder/
├── event-finder-backend/             # Node.js / Express Server
│   ├── config/
│   │   └── passport-setup.js        # Google Strategy & Serialization
│   ├── helpers/
│   │   └── upload.js                # Multer & Cloudinary Storage Config
│   ├── models/
│   │   ├── User.js                  # User Mongoose Schema (with verification)
│   │   ├── Event.js                 # Event Mongoose Schema
│   │   └── DeletedEvent.js          # Archived Event Schema
│   ├── routes/
│   │   ├── auth.js                  # Google Auth & Logout Routes
│   │   ├── events.js                # Event CRUD & Distance API Routes
│   │   └── users.js                 # Profile Verification Submission Route
│   ├── index.js                     # Main Express App Server
│   └── .env                         # Server Environment Variables
│
└── event-finder-frontend/            # React Client (Vite)
    ├── src/
    │   ├── api/
    │   │   └── events.js            # Axios helper functions for backend calls
    │   ├── components/
    │   │   ├── Navbar.jsx           # Global Navigation Header
    │   │   ├── WelcomeBanner.jsx    # Hero/Welcome Component
    │   │   ├── EventCard.jsx        # Individual Event Card Display
    │   │   ├── EventLinks.jsx       # External Links Handler
    │   │   └── UserEvents.jsx       # User Dashboard Uploaded Events Manager
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global Authentication State Provider
    │   ├── pages/
    │   │   ├── Home.jsx             # Main Landing & Event List Page
    │   │   ├── Dashboard.jsx        # User Profile & Dashboard View
    │   │   ├── EventDetail.jsx      # Detailed Event Information & Distance Calculator
    │   │   ├── CreateEvent.jsx      # Event Creation & Edit Form
    │   │   ├── Settings.jsx         # User Settings & Status Dashboard
    │   │   └── VerifyProfile.jsx    # Profile & Document Verification Form
    │   ├── App.jsx                  # Main Router Setup
    │   └── main.jsx                 # Entry Point
    ├── .env                         # Client Environment Configuration
    └── vite.config.js               # Vite Configuration
```

---

## 🛠️ Tech Stack & Dependencies

### **Backend**
- **Core**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ORM
- **Auth & Session**: Passport.js (`passport-google-oauth20`), `express-session`, `connect-mongo`
- **File Upload**: `multer`, `multer-storage-cloudinary`, `cloudinary`
- **APIs & Utilities**: `dotenv`, `cors`, `node-fetch`

### **Frontend**
- **Framework & Build**: React 19, Vite
- **Routing**: `react-router-dom` v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: `react-hot-toast`

---

## ⚙️ Environment Configuration (.env)

### **Backend (`event-finder-backend/.env`)**
```env
PORT=5050
MONGODB_URI=mongodb://localhost:27017/event-finder
SESSION_SECRET=your_session_secret
HOST_URL=http://localhost:5050
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Geocoding & Maps APIs
OPENCAGE_API_KEY=your_opencage_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### **Frontend (`event-finder-frontend/.env`)**
```env
VITE_BACKEND_URL=http://localhost:5050
```

---

## 🚦 How to Run Locally

### 1. **Clone the Repository**
```bash
git clone https://github.com/himanshu561hi/Event-Finder.git
cd Event-Finder
```

### 2. **Run Backend**
```bash
cd event-finder-backend
npm install
npm start
```
*Backend server will start at `http://localhost:5050`*

### 3. **Run Frontend**
```bash
cd ../event-finder-frontend
npm install
npm run dev
```
*Frontend app will start at `http://localhost:5173`*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/google` | Initiates Google OAuth Login | No |
| `GET` | `/api/auth/current_user` | Fetches current user session data | No |
| `GET` | `/api/auth/logout` | Destroys active session & logs out | Yes |
| `GET` | `/api/events` | List all events (supports location & radius filters) | No |
| `GET` | `/api/events/:id` | Get detailed information for a single event | No |
| `POST` | `/api/events` | Create a new event | Yes |
| `PUT` | `/api/events/:id` | Update an existing event (owner only) | Yes |
| `DELETE` | `/api/events/:id` | Soft delete/archive an event (owner only) | Yes |
| `GET` | `/api/events/distance/:id` | Calculate road distance to event coordinates | No |
| `POST` | `/api/users/verify` | Submit profile verification & ID document | Yes |

---

## 📄 License
This project is open-source under the ISC License.
