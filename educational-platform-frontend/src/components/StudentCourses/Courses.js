import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../StudentDashboard/Sidebar";
import Header from "./../StudentDashboard/Header";
import CourseCard from "./CourseCard";
import axios from "axios";
import "./../../styles/courses.css";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

  const handleCourseClick = (courseId) => {
    // Open in new tab
    const newWindow = window.open(`/my-course/${courseId}`, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

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
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
            </div>
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;