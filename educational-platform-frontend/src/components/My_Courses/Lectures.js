import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Lectures.css";

const Lectures = () => {
  const { courseId, weekNumber, lectureNumber } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    const fetchLectureDetails = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        // If we have a specific lecture number, fetch that lecture
        if (lectureNumber) {
          const response = await axios.get(`http://localhost:3009/api/lecture/${lectureNumber}`);
          if (response.data && response.data.data) {
            setLecture(response.data.data);
            return;
          }
        }

        // If no specific lecture or fetch failed, get the first lecture of the first week
        const weeksResponse = await axios.get(`http://localhost:3009/api/week/course/${courseId}`);
        if (weeksResponse.data && weeksResponse.data.length > 0) {
          const targetWeek = weekNumber 
            ? weeksResponse.data.find(w => w.weekNumber.toString() === weekNumber.toString())
            : weeksResponse.data[0];

          if (targetWeek) {
            const lecturesResponse = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${targetWeek.weekNumber}`);
            if (lecturesResponse.data && lecturesResponse.data.length > 0) {
              const targetLecture = lecturesResponse.data[0];
              const lectureResponse = await axios.get(`http://localhost:3009/api/lecture/${targetLecture._id}`);
              if (lectureResponse.data && lectureResponse.data.data) {
                setLecture(lectureResponse.data.data);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching lecture:", err);
        setError(err.response?.data?.message || 'Failed to fetch lecture');
      } finally {
        setLoading(false);
      }
    };

    fetchLectureDetails();
  }, [courseId, weekNumber, lectureNumber]);

  const handleTakeNotes = () => {
    if (currentNote.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      setNotes([...notes, { timestamp, note: currentNote }]);
      setCurrentNote("");
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Topbar />
        <div className="main-content-wrapper">
          <Sidebar />
          <div className="content-container">
            <div className="loading-spinner">Loading lecture...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Topbar />
        <div className="main-content-wrapper">
          <Sidebar />
          <div className="content-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Topbar />
      <div className="main-content-wrapper">
        <Sidebar />
        <div className="content-container">
          {lecture && (
            <div className="main-content">
              <h2 className="lecture-title">
                {lecture.title || `Lecture ${lectureNumber}`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Lectures;
