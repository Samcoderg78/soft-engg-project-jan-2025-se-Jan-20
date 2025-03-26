import React from "react";
import "./../../styles/coursecard.css";

const CourseCard = ({ title, description, tags, professor, image }) => {
  return (
    <div className="course-card">
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