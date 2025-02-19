import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import Topbar from './Topbar'; // Import Topbar
import GradedAssignment from './Student__GradedAssignment';
import './Lectures.css'; // Import the CSS file
// import GradedAssignment from './Student__GradedAssignment'

const Lecture1 = () => {
  const courseName = "Software Engineering"; // Course name for TopBar
  const [notes, setNotes] = useState([
    "08:00 - We can append in a list by list.append method.",
    "10:20 - Lists are mutable.",
    "10:30 - Two lists can be added to make a new list."
  ]);
  
  const [activeLecture, setActiveLecture] = useState(null);

  // Handle adding notes dynamically
  const handleTakeNotes = () => {
    const newNote = prompt("Enter your note:");
    if (newNote) {
      setNotes([...notes, newNote]);
    }
  };

  const handleCapture = () => {
    alert("Screenshot functionality will be added later!");
  };

  const renderLectureContent = () => {
    switch (activeLecture) {
      case "Lecture 1":
        return (
          <div>
            <h3>Video: Introduction to Binary Search</h3>
            <div className="video-placeholder">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/mKZ-i-UfE2k" // Replace with actual video
                title="Lecture Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-buttons">
              <button onClick={handleTakeNotes}>Take Notes</button>
              <button onClick={handleCapture}>Capture</button>
            </div>
            <div className="notes-section">
              <h3>Notes: Lecture 1</h3>
              <ul>
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "Lecture 2":
        return <div><h3>Lecture 2 Content Goes Here</h3></div>;
      case "Graded Assignment":

        return <GradedAssignment />;

        return <div><GradedAssignment/></div>;

      case "Programming Assignment":
        return <div><h3>Programming Assignment Content</h3></div>;
      default:
        return (
          <div>
            <h3>Course Introduction</h3>
            <p>Welcome to the Software Engineering course! In this course, we will cover...</p>
          </div>
        );
    }
  };

  return (
    <div className="lecture-page">
      {/* Sidebar with setActiveLecture passed as prop */}
      <Sidebar setActiveLecture={setActiveLecture} />

      {/* Top Bar */}
      <Topbar courseName={courseName} />

      {/* Main Content */}
      <div className="lecture-content">
        {renderLectureContent()}
      </div>
    </div>
  );
};

export default Lecture1;
