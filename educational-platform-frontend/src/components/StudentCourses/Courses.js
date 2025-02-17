import React, { useState, useEffect } from "react";
import Sidebar from "./../StudentDashboard/Sidebar";
import Header from "./../StudentDashboard/Header";
import CourseCard from "./CourseCard";
// import "./../../styles/dashboard.css";
import "./../../styles/courses.css"; // New CSS file for styling

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
      {
        id: 2,
        title: "Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, and React to build dynamic web applications.",
        tags: ["Web Dev", "React", "JavaScript"],
        professor: "Prof. Johnson",
        image: "https://prh.imgix.net/articles/top10-nonfiction-1600x800-1.jpg",
      },
      {
        id: 3,
        title: "Data Science Fundamentals",
        description: "Explore Python, data analysis, and machine learning in this hands-on course.",
        tags: ["Data Science", "Python", "ML"],
        professor: "Dr. Emily Davis",
        image: "https://www.nli.ie/sites/default/files/styles/image_with_caption_narrow/public/2022-10/nli-oct-screen-res-56.webp?h=78aab1d8&itok=qDrjbLV4",
      },
      {
        id: 4,
        title: "Business Analytics & Strategy",
        description: "Leverage data-driven decision-making for business growth and success.",
        tags: ["Business", "Analytics", "Strategy"],
        professor: "Prof. Michael Brown",
        image: "https://ichef.bbci.co.uk/images/ic/1200x675/p0gl91h1.jpg",
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
