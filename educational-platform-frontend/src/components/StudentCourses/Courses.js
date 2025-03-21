import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../StudentDashboard/Sidebar";
import Header from "./../StudentDashboard/Header";
import CourseCard from "./CourseCard";
import axios from "axios";
// import "./../../styles/dashboard.css";
import "./../../styles/courses.css"; // New CSS file for styling

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3009/api/course/${user._id}`);
        if (response.data && response.data.data) {
          setCourses(response.data.data);
        } else {
          setError('No courses found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = async (courseId) => {
    try {
      // First, fetch the weeks for the course
      const weeksResponse = await axios.get(`http://localhost:3009/api/week/course/${courseId}`);
      console.log("Weeks API Response:", weeksResponse.data);
      console.log("Weeks Response Type:", typeof weeksResponse.data);
      console.log("Is Weeks Response Array?", Array.isArray(weeksResponse.data));
      
      if (weeksResponse.data && weeksResponse.data.length > 0) {
        // Get the first week
        const firstWeek = weeksResponse.data[0];
        console.log("First Week:", firstWeek);
        console.log("First Week Type:", typeof firstWeek);
        console.log("Week Number:", firstWeek.weekNumber);
        
        // Then, fetch the lectures for the first week using the weekNumber from the response
        const lecturesResponse = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${firstWeek.weekNumber}`);
        console.log("Lectures API Response:", lecturesResponse.data);
        console.log("Lectures Response Type:", typeof lecturesResponse.data);
        console.log("Is Lectures Response Array?", Array.isArray(lecturesResponse.data));
        
        if (lecturesResponse.data && lecturesResponse.data.length > 0) {
          // Get the first lecture
          const firstLecture = lecturesResponse.data[0];
          console.log("First Lecture:", firstLecture);
          console.log("First Lecture ID:", firstLecture._id);
          // Navigate directly to the first lecture using the weekNumber from the response
          navigate(`/my-course/${courseId}/${firstWeek.weekNumber}/${firstLecture._id}`, { replace: true });
          return; // Exit early after navigation
        } else {
          console.log("No lectures found in response");
        }
      } else {
        console.log("No weeks found in response");
      }
      
      // If we get here, something went wrong, navigate to course overview
      console.log("No lecture found, navigating to course overview");
      navigate(`/my-course/${courseId}`, { replace: true });
    } catch (err) {
      console.error("Error fetching course details:", err);
      // If there's an error, navigate to course overview
      navigate(`/my-course/${courseId}`, { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <Header />
        <div className="loading-spinner">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <Header />
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <section className="welcome-section">
            <h1 className="welcome-text">Welcome 23fxxxxxx</h1>
            <p className="sub-text">
              Stay organized and on track with your courses and assignments.
            </p>
          </section>

          <section className="courses-container">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                title={course.title}
                description={course.description}
                tags={course.tags || []}
                professor={course.instructor || 'Not Assigned'}
                image={course.image || 'https://via.placeholder.com/300x200'}
                handleClick={() => handleCourseClick(course._id)}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Courses;
