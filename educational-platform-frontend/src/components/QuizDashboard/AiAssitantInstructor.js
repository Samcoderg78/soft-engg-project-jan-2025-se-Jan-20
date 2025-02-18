import React from "react";
import Sidebar from "../QuizDashboard/Sidebar"; // Import the Sidebar component
import Header from "../QuizDashboard/Header"; // Import the Header component
import "../AIAssistance/AIAssistancePage.css"

export default function AIAssistanceInstructor() {
  return (
    <div className="dashboard-container">
      <Header /> {/* Add the Header */}
      <div className="dashboard-layout">
        <div className="sidebar-container">
          <Sidebar /> {/* Add the Sidebar */}
        </div>
        <div className="dashboard-content">
          <div className="ai-assistance-container">
            <h1>AI Study Assistance</h1>
            <p className="user-email">22f100338@iitm.study.ac.in</p>
            <div className="recommended-section">
              <h2>Recommended</h2>
              <input type="text" placeholder="Type here..." className="search-input" />
            </div>
            <div className="ai-help-section">
              <h2>AI Help</h2>
              <button className="ai-help-button">Get Instant Solutions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}