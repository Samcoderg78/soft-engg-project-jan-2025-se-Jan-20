import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Lectures.css";

const Lectures = () => {
  const { courseId, weekNumber, lectureId } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Current params:", { courseId, weekNumber, lectureId });

        // If no lectureId is provided, fetch course data to find first lecture
        if (!lectureId) {
          const courseResponse = await axios.get(`http://localhost:3009/api/course/${courseId}`);
          console.log("Course API Response:", courseResponse.data);
          
          if (courseResponse.data && courseResponse.data.data) {
            const course = courseResponse.data.data;
            // Get the first lecture from the first week
            if (course.weeks && course.weeks.length > 0) {
              const firstWeek = course.weeks[0];
              if (firstWeek.lectures && firstWeek.lectures.length > 0) {
                const firstLectureId = firstWeek.lectures[0]._id;
                console.log("Navigating to first lecture:", firstLectureId);
                // Navigate directly to the first lecture
                navigate(`/my-course/${courseId}/1/${firstLectureId}`, { replace: true });
                return; // Exit early after navigation
              }
            }
          }
          // If we get here, something went wrong, navigate to course overview
          console.log("No lecture found, navigating to course overview");
          navigate(`/my-course/${courseId}`, { replace: true });
          return;
        }

        // If we have a lectureId, fetch the lecture data
        const response = await axios.get(`http://localhost:3009/api/lecture/${lectureId}`);
        console.log("Lecture API Response:", response.data);
        
        if (response.data && response.data.data) {
          setLecture(response.data.data);
        } else {
          setError('Lecture not found');
        }
      } catch (err) {
        console.error("Error fetching lecture:", err);
        setError(err.response?.data?.message || 'Failed to fetch lecture');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, weekNumber, lectureId, navigate]);

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
          Loading content...
          <br />
          Course: {courseId}
          <br />
          Week: {weekNumber}
          <br />
          Lecture: {lectureId || 'Loading first lecture...'}
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
          Lecture: {lectureId || 'Loading first lecture...'}
        </div>
      );
    }

    // If we have a lecture, show lecture content
    if (lecture) {
      return (
        <div className="main-content">
          <h2 className="lecture-title">
            {lecture.title || `Lecture ${lectureId}`}
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
    }

    // If we have course data but no lecture, show course overview
    if (course) {
      return (
        <div className="main-content">
          <h2 className="lecture-title">Course Overview</h2>
          <div className="course-description">
            <p>{course.description}</p>
          </div>
          <div className="course-meta">
            <p>Instructor: {course.instructor}</p>
            <div className="course-tags">
              {course.tags?.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="course-overview">
            <h3>Course Overview</h3>
            <p>{course.overview}</p>
          </div>
          <div className="course-objectives">
            <h3>Course Objectives</h3>
            <ul>
              {course.objectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="loading-spinner">
        Loading first lecture...
        <br />
        Course: {courseId}
        <br />
        Week: {weekNumber}
        <br />
        Lecture: {lectureId || 'Loading...'}
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

