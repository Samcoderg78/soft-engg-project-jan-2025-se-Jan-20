import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Sidebar = ({ setActiveLecture }) => {
  const [activeWeek, setActiveWeek] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleWeek = (week) => {
    setActiveWeek(activeWeek === week ? null : week); // Toggle the active week
  };

  const handleDifficultQuestionsClick = () => {
    navigate('/difficult-questions'); // Navigate to the Difficult Questions page
  };

  const handleCourseIntroClick = () => {
    setActiveLecture(null); // Show Course Intro content
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <strong
            onClick={handleCourseIntroClick}
            style={{ cursor: 'pointer', color: '#fff' }}
          >
            Course Intro
          </strong>
        </li>
        {[1, 2].map((week) => (
          <li key={week}>
            <strong
              onClick={() => toggleWeek(week)}
              className={`week ${activeWeek === week ? 'active' : ''}`} // Apply 'active' class conditionally
              style={{ cursor: 'pointer', color: '#fff' }}
            >
              Week {week}
            </strong>
            {activeWeek === week && ( // Render lectures only if the week is active
              <ul className="lectures-list">
                <li onClick={() => setActiveLecture("Lecture 1")}>Lecture 1</li>
                <li onClick={() => setActiveLecture("Lecture 2")}>Lecture 2</li>
                <li onClick={() => setActiveLecture("Graded Assignment")}>Graded Assignment</li>
                <li onClick={() => setActiveLecture("Programming Assignment")}>Programming Assignment</li>
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Difficult Questions Button */}
      <strong
        onClick={handleDifficultQuestionsClick}
        className="difficult-questions-button"
        style={{ cursor: 'pointer', color: '#fff' }}
      >
        Difficult Questions
      </strong>
    </div>
  );
};

export default Sidebar;
