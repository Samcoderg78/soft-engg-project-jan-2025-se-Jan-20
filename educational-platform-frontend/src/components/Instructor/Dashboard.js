import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import "../../styles/courses.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get("http://localhost:3009/api/course");
        const allCourses = response.data;
        
        let filteredCourses = [];
        if (user.email === "instructor1@example.com") {
          filteredCourses = allCourses.filter(course => course.title === "Python");
        } else if (user.email === "instructor2@example.com") {
          filteredCourses = allCourses.filter(course => course.title === "PDSA");
        } else {
          filteredCourses = allCourses;
        }
        
        setCourses(filteredCourses);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user.email]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <section className="welcome-section">
            <h1 className="welcome-text">Welcome {user.name}</h1>
            <p className="sub-text">
              Stay organized and on track with your courses and assignments.
            </p>
          </section>

          {loading ? (
            <div className="loading-spinner">Loading courses...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <section className="courses-container">
              {courses.map((course) => (
                <div key={course._id} className="course-card-wrapper">
                  <CourseCard
                    title={course.title}
                    description={course.description}
                    tags={course.tags}
                    professor={course.professor}
                    image={course.image}
                  />
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;