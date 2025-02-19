import React, { useState, useEffect } from "react";
// import Sidebar from "./../StudentDashboard/Sidebar";
// import Header from "./../StudentDashboard/Header";
import CourseCard from "./CourseCard";
// import "./../../styles/dashboard.css";
// import "./../../styles/courses.css"; // New CSS file for styling
import "../../styles/courses.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchedCourses = [
      {
        id: 1,
        title: "Introduction to Marketing",
        description: "Master the core concepts of marketing, branding, and consumer behavior.",
        tags: ["Marketing", "Branding"],
        professor: "Prof. Smith",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTudN8Com396LDgdLI1R57J7754r1KnnFWHAA&s",
      },
    ];

    setCourses(fetchedCourses);
  }, []);

  // Handle Click Event
  const handleCourseClick = (title, description, professor) => {
    alert(`📚 Course: ${title}\n📝 Description: ${description}\n👨‍🏫 Instructor: ${professor}`);
  };

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
                key={course.id}
                title={course.title}
                description={course.description}
                tags={course.tags}
                professor={course.professor}
                image={course.image}
                handleClick={handleCourseClick} // Pass handler function
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Courses;
