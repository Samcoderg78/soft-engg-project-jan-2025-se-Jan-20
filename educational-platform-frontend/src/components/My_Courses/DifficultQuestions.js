import React, { useState,useEffect } from 'react';
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import './difficultQuestion.css';

const DifficultQuestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering";
  const [difficultQuestions, setDifficultQuestions] = useState([]);
  const user_id = "67bcc0decdfd7ab3b0ed24a0"
  const course_id = "67bf73734846b7fd0e6a30d3"

  useEffect(() => {
    const fetchDifficultQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3011/api/difficultquestions/${user_id}/${course_id}`);
        if (!response.ok) throw new Error("Error fetching difficult questions");
        const data = await response.json();
        setDifficultQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDifficultQuestions();
  }, [user_id, course_id]);

  return (
    <>
      <Topbar courseName={courseName} />
      <div className="content">
        <Sidebar setActiveLecture={setActiveLecture} />
        
          <div className="assignment">
            <h2 className="container-title">Difficult Questions</h2>
            {/* {difficultsQuestions.map((w, wIndex) => (
              <div key={wIndex} className="week-container">
                <div className="week-title">Week {w.week}</div> */}
                <form>
                  {difficultQuestions.map((q, index) => (
                    <div key={index} className="question-container">
                      <p>{index + 1}. {q.question.question}</p>
                      <div className="answer-options">
                        {q.question.options.map((a, i) => (
                          <label key={i} className="form-check">
                            <input type="radio" name={`question-${index}`} />
                            {a}
                          </label>
                        ))}
                      </div>
                      <div className="actions">
                        <Link to="/suggestions" state={{ q: q.question.question }} className="suggestion-link">
                          Click here to get suggestions
                        </Link>
                        <label className="form-check">
                          <input type="checkbox" id={`difficult-${index}`} />
                          Unmark as difficult
                        </label>
                      </div>
                    </div>
                  ))}
                </form>
              {/* </div> */}
            {/* ))} */}
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default DifficultQuestions;