import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./../../styles/dashboard.css";

const Dashboard = () => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      alert(`Feedback submitted: ${feedback}`);
      setFeedback(""); // Clear the input field after submission
    } else {
      alert("Please enter your feedback before submitting.");
    }
  };

  const aiHandleClick = () => {
    alert("AI Assistance Clicked!");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {/* Profile Section */}
          <section className="profile-section">
            <div className="profile-info">
              <div className="profile-picture"></div>
              <div>
                <h3 className="profile-name">Radhika Deol</h3>
                <p className="profile-id">22f100338</p>
              </div>
            </div>
            <button className="edit-profile-btn">Edit Profile</button>
          </section>

          {/* Notes & Marked Questions Section */}
          <section className="notes-marked-container">
            <h2>Notes & Marked Questions</h2>
            <div className="notes-content">
              <div className="notes-card">
                <p className="text-gray-700 font-semibold">Important Notes</p>
                <p className="text-gray-500">3 new notes added</p>
                <button className="details-button">View Notes</button>
              </div>
              <div className="marked-questions-card">
                <p className="text-gray-700 font-semibold">Marked Questions</p>
                <p className="text-gray-500">5 questions marked for review</p>
                <button className="details-button">Review Questions</button>
              </div>
            </div>
          </section>
          

          {/* AI Assistance Section */}
          <section className="ai-assistance-container">
            <h2 className="ai-title">AI Assistance</h2>
            <div className="ai-box" onClick={aiHandleClick}>
              <span className="ai-label">Recommended</span>
              <div className="ai-content">
                <div className="ai-image">🧠</div>
                <div className="ai-text">
                  <p className="ai-category">AI Help</p>
                  <p className="ai-description">
                    Get instant solutions to your questions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Panel */}
          <section className="feedback-container">
            {/* Blue Box with Feedback Panel Inside */}
            <div className="blue-box">
              <section className="feedback-panel">
                <h2 className="feedback-title">Feedback Panel</h2>
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

          <section className="live-support">
            <div className="support-content">
              <div className="support-info">
                <div className="support-icon">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png"
                    alt="Support"
                  />
                </div>
                <div className="support-text">
                  <h3>Need Help?</h3>
                  <p>Our team is available 24/7 to assist you.</p>
                  <div className="badges">
                    <span className="badge">Live Assistance</span>
                    <span className="badge">24/7 Support</span>
                  </div>
                </div>
              </div>
              <button className="chat-button">Chat Now</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
