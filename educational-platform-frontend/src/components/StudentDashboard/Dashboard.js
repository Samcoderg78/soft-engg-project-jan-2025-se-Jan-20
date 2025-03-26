import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./../../styles/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [feedback, setFeedback] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    roll_no: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Initialize user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setEditFormData({
        name: userData.name || "",
        email: userData.email || "",
        roll_no: userData.roll_no || "",
        password: ""
      });
    }
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!user) return;
    
    if (feedback.trim()) {
      try {
        const response = await fetch("http://localhost:3009/api/feedback/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user._id, 
            course_id: "COURSE_ID", 
            feedback_string: feedback,
            rating: 5,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Feedback submitted successfully!");
          setFeedback("");
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback. Please try again.");
      }
    } else {
      alert("Please enter your feedback before submitting.");
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:3009/api/user/update/${user._id}`,
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update user data
      const updatedUser = { ...user, ...response.data.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {/* Profile Section */}
          <section className="profile-section">
            <div className="profile-info">
              <div className="profile-picture"></div>
              <div>
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-id">{user.roll_no}</p>
              </div>
            </div>
            <button 
              className="edit-profile-btn"
              onClick={() => {
                console.log("Edit button clicked");
                setIsEditModalOpen(true);
              }}
            >
              Edit Profile
            </button>
          </section>

          {/* Notes & Marked Questions Section */}
          <section className="notes-marked-container">
            <div className="notes-content">
              <div className="notes-card">
                <h3 className="notes-heading text-gray-700 font-semibold">Lecture Notes</h3>
                <h6 className="detailed-text text-gray-500">
                  Add your personal notes with timestamps below each lecture video. 
                  Your notes will be automatically saved and organized by lecture 
                  for easy reference during revision.
                </h6>
              </div>
              <div className="marked-questions-card">
                <h3 className="notes-heading text-gray-700 font-semibold">Difficult Questions</h3>
                <h6 className="detailed-text text-gray-500">
                  Mark questions you find challenging during practice sessions. 
                  All marked questions will be collected in one place, making it 
                  easy to focus on your weak areas during revision.
                </h6>
              </div>
            </div>
          </section>
          
          {/* AI Assistance Section */}
          <section className="ai-assistance-container">
            <h2 className="ai-title">AI Assistance</h2>
            <div className="ai-box">
              <div className="ai-content">
                <div className="ai-image">🧠</div>
                <div className="ai-text">
                  <p className="ai-category">Smart Learning Assistant</p>
                  <p className="ai-description">
                    Get instant explanations for any topic confusion, hints for 
                    assignment questions, and curated additional resources for 
                    difficult concepts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Panel */}
          <section className="feedback-container">
            <div className="blue-box">
              <section className="feedback-panel">
                <h2 className="feedback-title">Feedback Panel</h2>
                <h5 className="feedback-subtitle">Give your feedback on the application</h5>
                <div className="feedback-content">
                  <label htmlFor="feedback" className="feedback-label">
                    Your Feedback
                  </label>
                  <input
                    type="text"
                    id="feedback"
                    className="feedback-input"
                    placeholder="Enter your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <button
                    className="feedback-submit"
                    onClick={handleFeedbackSubmit}
                  >
                    Submit Feedback
                  </button>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>

      {/* Edit Profile Modal - Fixed Styling */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Edit Profile</h2>
            
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleEditProfile}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }} htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  style={{ width: '100', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  style={{ width: '100', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }} htmlFor="roll_no">
                  Roll Number
                </label>
                <input
                  type="text"
                  id="roll_no"
                  name="roll_no"
                  value={editFormData.roll_no}
                  onChange={handleInputChange}
                  style={{ width: '100', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }} htmlFor="password">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleInputChange}
                  style={{ width: '100', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="Enter new password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem' }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.375rem' }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;