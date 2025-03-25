import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./My_Course.css";

const My_Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3009/api/course/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <div className="loading-spinner">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <div className="error-message">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-container">
        <div className="course-content">
          <div className="course-header">
            <h1>{course.title}</h1>
            <div className="course-description">
              <p>{course.description}</p>
            </div>
            <div className="course-meta">
              <p>Instructor: {course.instructor}</p>
              <div className="course-tags">
                {course.tags?.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="course-overview">
            <h2>Course Overview</h2>
            <p>{course.overview}</p>
          </div>
          <div className="course-objectives">
            <h2>Course Objectives</h2>
            <ul>
              {course.objectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default My_Course; 