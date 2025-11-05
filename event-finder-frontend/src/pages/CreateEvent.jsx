"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import { getEventDetail } from "../api/events.js"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050/api"

const initialFormData = {
  title: "",
  description: "",
  location: "",
  date: "",
  lastRegistrationDate: "",
  maxParticipants: 0,
  category: "",
  subCategory: "",
  fee: 0,
  imageURL: "",
  instagramLink: "",
  websiteLink: "",
  registrationLink: "",
}

const CreateEvent = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("editId")

  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(!!editId)

  const inputClasses =
    "px-4 py-3 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 bg-white text-gray-800 text-sm md:text-base"
  const selectClasses =
    "px-4 py-3 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-800 text-sm md:text-base cursor-pointer"
  const textareaClasses =
    "px-4 py-3 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-gray-400 bg-white text-gray-800 text-sm md:text-base"

  // Subcategory options by category (UPDATED)
  const subOptions = {
    "Educational & Professional Events": [
      "Workshops",
      "Seminars",
      "Conferences",
      "Webinars",
      "Hackathons",
      "Bootcamps",
      "Training Sessions",
      "Career Fairs",
      "Award Ceremonies",
    ],
    "Corporate & Business Events": [
      "Product Launches",
      "Trade Shows",
      "Networking Events",
      "Annual Meetings",
      "Press Conferences",
      "Team-Building Retreats",
      "Corporate Parties",
    ],
    "Tech & Startup Events": [
      "Startup Pitches",
      "Demo Days",
      "Tech Talks",
      "Developer Meetups",
      "Product Demos",
      "AI/ML Conferences",
    ],
    "Cultural & Entertainment Events": [
      "Festivals",
      "Concerts",
      "Theatre Plays",
      "Dance Shows",
      "Movie Screenings",
      "Comedy Nights",
      "Art Exhibitions",
      "Fashion Shows",
    ],
    "Sports & Fitness Events": [
      "Marathons",
      "Sports Tournaments",
      "Esports Competitions",
      "Fitness Challenges",
      "Yoga Camps",
      "Charity Runs",
    ],
    "Social & Personal Events": [
      "Weddings",
      "Engagements",
      "Birthdays",
      "Anniversaries",
      "Baby Showers",
      "Housewarming Parties",
      "Family Gatherings",
      "Reunions",
    ],
    "Charity & Community Events": [
      "Fundraisers",
      "Blood Donation Camps",
      "Environmental Drives",
      "NGO Meetups",
      "Volunteer Programs",
    ],
    "Other": [
        "Miscellaneous",
    ],
  }

  const categoryKeys = Object.keys(subOptions);


  useEffect(() => {
    if (editId) {
      const fetchExistingEvent = async () => {
        try {
          const data = await getEventDetail(editId)

          const formatDate = (isoDate) => {
            if (!isoDate) return ""
            const d = new Date(isoDate)
            const month = (d.getMonth() + 1).toString().padStart(2, "0")
            const day = d.getDate().toString().padStart(2, "0")
            return `${d.getFullYear()}-${month}-${day}`
          }

          setFormData({
            title: data.title,
            description: data.description || "",
            location: data.location,
            date: formatDate(data.date),
            lastRegistrationDate: formatDate(data.lastRegistrationDate),
            maxParticipants: data.maxParticipants,
            category: data.category || "",
            subCategory: data.subCategory || "",
            fee: data.fee || 0,
            imageURL: data.imageURL || "",
            instagramLink: data.instagramLink || "",
            websiteLink: data.websiteLink || "",
            registrationLink: data.registrationLink || "",
          })
          setIsEditing(true)
        } catch (e) {
          setError("Could not load event data for editing. Check event ID or connection.")
          setIsEditing(false)
        }
      }
      fetchExistingEvent()
    } else {
      setFormData(initialFormData)
      setIsEditing(false)
    }
  }, [editId])

  const handleChange = (e) => {
    const { name, value } = e.target
    const isNumeric = name === "maxParticipants" || name === "fee"

    setFormData((prev) => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value,
      ...(name === "category" ? { subCategory: "" } : {}), // Reset subCategory when category changes
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.title || !formData.location || !formData.date || Number.parseInt(formData.maxParticipants) <= 0) {
        setError("Please fill in all required fields (Title, Location, Event Date, Max Participants).")
        setSubmitting(false)
        return
      }
      
      // Ensure category and subCategory are selected (optional validation, but good practice)
      if (!formData.category || !formData.subCategory) {
          setError("Please select both a Category and a Subcategory.")
          setSubmitting(false)
          return
      }


      const dataToSend = {
        ...formData,
        fee: Number(formData.fee),
        maxParticipants: Number(formData.maxParticipants),
      }

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/events/${editId}`, dataToSend, { withCredentials: true })
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, dataToSend, { withCredentials: true })
      }

      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || `Error ${isEditing ? "updating" : "creating"} event. Check console for details.`
      setError(errorMsg)
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {isEditing ? "✏️ Edit Event" : "🎉 Create New Event"}
            </h2>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">
              Fill in the details below to {isEditing ? "update your" : "create a new"} event
            </p>
          </div>

          <div className="px-6 sm:px-8 py-8">
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <p className="text-green-700 font-medium">
                  Event {isEditing ? "updated" : "created"} successfully! Redirecting...
                </p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Title *</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    placeholder="Event title"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className={selectClasses}
                  >
                    <option value="">Select Category</option>
                    {/* Rendering all comprehensive categories */}
                    {categoryKeys.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Subcategory *</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                  disabled={!formData.category || submitting}
                  className={selectClasses}
                >
                  <option value="">Select Subcategory</option>
                  {/* Rendering subcategories based on selected category */}
                  {formData.category &&
                    subOptions[formData.category]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  disabled={submitting}
                  placeholder="Tell attendees about your event..."
                  className={textareaClasses}
                ></textarea>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Event Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Registration Deadline</label>
                  <input
                    type="date"
                    name="lastRegistrationDate"
                    value={formData.lastRegistrationDate}
                    onChange={handleChange}
                    disabled={submitting}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Location + Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Location *</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    placeholder="City or Address"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Ticket Price / Fee (INR) *</label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    min="0"
                    required
                    disabled={submitting}
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Max Participants *</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={submitting}
                  placeholder="100"
                  className={inputClasses}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Image/Poster URL</label>
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="https://..."
                  className={inputClasses}
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Instagram Link</label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="https://instagram.com/..."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">External Website Link</label>
                  <input
                    type="url"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Registration Link */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Registration Link</label>
                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="https://registration-link.com"
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full mt-8 px-6 py-4 font-bold rounded-lg transition-all transform text-white text-sm sm:text-base
                  ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105"
                  }`}
              >
                {submitting ? "⏳ Processing..." : isEditing ? "✏️ Update Event" : "🚀 Create Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent