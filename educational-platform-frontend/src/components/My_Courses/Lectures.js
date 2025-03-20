import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Lectures.css";

const Lectures = () => {
  const { courseId, weekNumber, lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      setLoading(true);
      setError(null);
      
      console.log("Current params:", { courseId, weekNumber, lectureId });

      if (!courseId || !weekNumber) {
        setError("Missing course ID or week number");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${weekNumber}`);
        console.log("API Response:", response.data);
        
        if (response.data) {
          let lectures = response.data;
          
          if (response.data.data) {
            lectures = response.data.data;
          }
          
          if (!Array.isArray(lectures)) {
            lectures = [lectures];
          }
          
          console.log("Processed lectures:", lectures);
          
          let targetLecture;
          if (!lectureId && lectures.length > 0) {
            targetLecture = lectures[0];
          } else {
            targetLecture = lectures.find(l => 
              String(l._id) === String(lectureId) || 
              String(l.lectureId) === String(lectureId)
            );
          }
          
          console.log("Found target lecture:", targetLecture);
          
          if (targetLecture) {
            setLecture(targetLecture);
          } else {
            setError("Lecture not found in week " + weekNumber);
          }
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to fetch lecture details");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [courseId, weekNumber, lectureId]);

  const handleTakeNotes = () => {
    if (currentNote.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      setNotes([...notes, { timestamp, note: currentNote }]);
      setCurrentNote("");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          Loading lecture content...
          <br />
          Course: {courseId}
          <br />
          Week: {weekNumber}
          <br />
          Lecture: {lectureId || 'First lecture'}
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          Error: {error}
          <br />
          Course: {courseId}
          <br />
          Week: {weekNumber}
          <br />
          Lecture: {lectureId || 'First lecture'}
        </div>
      );
    }

    if (!lecture) {
      return (
        <div className="error-message">
          No lecture data available
          <br />
          Course: {courseId}
          <br />
          Week: {weekNumber}
          <br />
          Lecture: {lectureId || 'First lecture'}
        </div>
      );
    }

    return (
      <div className="main-content">
        <h2 className="lecture-title">
          {lecture.title || `Week ${weekNumber} - Lecture ${lectureId || '1'}`}
        </h2>

        {/* Video Section */}
        <div className="video-container">
          <video controls>
            <source src={lecture.videoUrl || "#"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Lecture Content */}
        <div className="lecture-description">
          <p>{lecture.description || "No description available"}</p>
        </div>
        {lecture.content && (
          <div className="lecture-main-content" dangerouslySetInnerHTML={{ __html: lecture.content }} />
        )}

        {/* Notes Section */}
        <div className="notes-section">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Take notes here..."
            className="notes-textarea"
          />
          <button onClick={handleTakeNotes} className="notes-button">
            Save Note
          </button>
        </div>

        {/* Display Notes */}
        <div className="notes-display">
          <h3>Your Notes</h3>
          <div className="notes-list">
            {notes.map((note, index) => (
              <div key={index} className="note-item">
                <strong>{note.timestamp}:</strong> {note.note}
              </div>
            ))}
          </div>
        </div>

        {/* Graded Assignment Section */}
        {lecture.assignment && (
          <div className="assignment-section">
            <h3>Graded Assignment</h3>
            <div className="assignment-content">
              <h4>{lecture.assignment.title}</h4>
              <p>{lecture.assignment.description}</p>
              <div className="assignment-meta">
                <span>Due Date: {lecture.assignment.dueDate}</span>
                <span>Points: {lecture.assignment.points}</span>
              </div>
              <button className="submit-assignment-btn">
                Submit Assignment
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-content-wrapper">
        <Sidebar />
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Lectures;
