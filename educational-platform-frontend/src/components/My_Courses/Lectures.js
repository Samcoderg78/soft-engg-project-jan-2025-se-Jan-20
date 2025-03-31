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
  const userId = JSON.parse(localStorage.getItem("user")); // Replace with actual user ID from your auth system

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        setLoading(true);
        // If we have specific lecture parameters, fetch that lecture
        if (lectureNumber) {
          const response = await axios.get(`http://localhost:3009/api/lecture/${lectureNumber}`);
          if (response.data && response.data.data) {
            setLecture(response.data.data);
            setError(null);
            
            // Fetch notes for this lecture after lecture is loaded
            await fetchNotes(response.data.data._id);
          }
        } else {
          // If no specific lecture, fetch the first lecture of the first week
          const weeksResponse = await axios.get(`http://localhost:3009/api/week/course/${courseId}`);
          if (weeksResponse.data && weeksResponse.data.length > 0) {
            const firstWeek = weeksResponse.data[0];
            const lecturesResponse = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${firstWeek.weekNumber}`);
            if (lecturesResponse.data && lecturesResponse.data.length > 0) {
              const firstLecture = lecturesResponse.data[0];
              const lectureResponse = await axios.get(`http://localhost:3009/api/lecture/${firstLecture._id}`);
              if (lectureResponse.data && lectureResponse.data.data) {
                setLecture(lectureResponse.data.data);
                setError(null);
                
                // Fetch notes for this lecture after lecture is loaded
                await fetchNotes(lectureResponse.data.data._id);
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

    const fetchNotes = async (lectureId) => {
      try {
        const response = await axios.get(`http://localhost:3009/api/tn/lecture/${lectureId}`);
        if (response.data && response.data.notes) {
          // Filter notes for the current user on the frontend
          const filteredNotes = response.data.notes.filter(note => note.user_id === userId._id);
    
          // Format notes with timestamp and note content
          const formattedNotes = filteredNotes.map(note => ({
            timestamp: new Date(note.timestamp).toLocaleTimeString(),
            note: note.note
          }));
    
          setNotes(formattedNotes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchLectureDetails();
  }, [courseId, weekNumber, lectureNumber, userId._id]);

  const handleTakeNotes = async () => {
    if (currentNote.trim() && lecture) {
      try {
        const timestamp = new Date();
        
        // Save note to database
        await axios.post("http://localhost:3009/api/tn/take_note", {
          user_id: userId._id,
          lecture_id: lecture._id,
          course_id: courseId,
          note: currentNote
        });

        // Update local state with the new note
        setNotes(prevNotes => [
          {
            timestamp: timestamp.toLocaleTimeString(),
            note: currentNote
          },
          ...prevNotes
        ]);
        
        setCurrentNote("");
      } catch (err) {
        console.error("Error saving note:", err);
        // Optionally show error to user
      }
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
                  {notes.length > 0 ? (
                    notes.map((note, index) => (
                      <div key={index} className="note-item">
                        <strong>{note.timestamp}:</strong> {note.note}
                      </div>
                    ))
                  ) : (
                    <p>No notes yet. Add your first note above!</p>
                  )}
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