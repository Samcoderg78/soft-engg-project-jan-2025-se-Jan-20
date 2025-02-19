import React from "react";
import "./../../styles/coursecard.css"; // Make sure to style it properly

import { useNavigate } from "react-router-dom";

const CourseCard = ({ title, description, tags, professor, image, handleClick }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    // alert(`You selected the course: ${title}`);
    handleClick(title, description, professor);
    navigate("/my-course"); // Redirect to Course Page
  };

  return (
    <div className="course-card" onClick={handleCourseClick}>
      <img src={image} alt={title} className="course-image" />
      <div className="course-content">
        <h2 className="course-title">{title}</h2>
        <p className="course-description">{description}</p>
        <p className="course-professor">Instructor: {professor}</p>
        <div className="course-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};




export default CourseCard;
