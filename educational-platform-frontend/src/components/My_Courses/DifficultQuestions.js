import React, { useState,useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import './difficultQuestion.css';

const DifficultQuestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering";
  const [difficultQuestions, setDifficultQuestions] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const { courseId } = useParams()

  useEffect(() => {
    const fetchDifficultQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          console.error("user not found")
          return;
        }

        const response = await fetch(`http://localhost:3009/api/difficultquestions/${user._id}/${courseId}`);
        if (!response.ok) throw new Error("Error fetching difficult questions");
        const data = await response.json();
        setDifficultQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDifficultQuestions();
  }, [courseId]);

  return (
    <>
      <Topbar courseName={courseName} />
      <div className="content">
        <Sidebar setActiveLecture={setActiveLecture} />
        
          <div className="assignment" style={{ flex: 1, padding: "20px", overflowY: "auto", marginLeft: "250px" }}>
            <h2 className="container-title">Difficult Questions</h2>
            {/* {difficultsQuestions.map((w, wIndex) => (
              <div key={wIndex} className="week-container">
                <div className="week-title">Week {w.week}</div> */}
                <form>
                  {difficultQuestions.map((q, index) => (
                                  <div
                                    key={index}
                                    className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
                                  >
                                    {index + 1} .{q.question.question}
                                    <div className="mb-2">
                                      {q.question.options.map((a, i) => (
                                        <div key={i} className="form-check">
                                          {q.question.type === "single" ? (
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name={`question-${index}`}
                                              value={a}
                                              id={`option-${index}-${i}`}
                                            />
                                          ) : (
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              name={`question-${index}`}
                                              value={a}
                                              id={`option-${index}-${i}`}
                                            />
                                          )}
                                          {a}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="d-flex justify-content-between w-100">
                                      <Link
                                        to={`/${courseId}/suggestions`}
                                        state={{ q: q.question.question }}
                                        className="text-primary"
                                      >
                                        Click here to get suggestions
                                      </Link>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`difficult-${index}`}
                                        />
                                        <label
                                          className="form-check-label ms-2"
                                          htmlFor={`difficult-${index}`}
                                        >
                                          Remove from difficult
                                        </label>
                                      </div>
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