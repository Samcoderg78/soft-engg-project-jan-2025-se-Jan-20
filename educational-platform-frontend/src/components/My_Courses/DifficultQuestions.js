import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DifficultQuestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering"; // Course name for TopBar
  const difficultsQuestions = [
    {
      week: 1,
      Questions: [
        { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
        { Question: 'Question 2', Answars: ['option_1', 'option_2', 'option_3'] },
      ]
    },
    {
      week: 2,
      Questions: [
        { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
        { Question: 'Question 4', Answars: ['option_1', 'option_2', 'option_3'] }
      ]
    }
  ];

  return (
    <div className="difficult-questions-page" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar */}
      <Topbar courseName={courseName} />
      
      <div className="content" style={{ display: "flex", flex: 1 }}>
        {/* Sidebar with setActiveLecture passed as prop */}
        <Sidebar setActiveLecture={setActiveLecture} />
        
        <div className="main-content" style={{ flex: 1, padding: "20px" }}>
          <div className="assignment difficultqus">
            <div className="container mt-5 text-center">
              <h2>Difficult Questions</h2>
            </div>
            {difficultsQuestions.map((w, wIndex) => (
              <div key={wIndex} className="container mt-5">
                <div className="container p-2 mb-3 border rounded text-center">
                  <h4>Week {w.week}</h4>
                </div>
                <form>
                  {w.Questions.map((q, index) => (
                    <div
                      key={index}
                      className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
                    >
                      {index + 1}. {q.Question}
                      <div className="mb-2">
                        {q.Answars.map((a, i) => (
                          <div key={i} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`question-${wIndex}-${index}`}
                              id={`option-${wIndex}-${index}-${i}`}
                            />
                            {a}
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between w-100">
                        <Link to="/suggestions" state={{ q: q.Question }} className="text-primary">
                          Click here to get suggestions
                        </Link>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`difficult-${wIndex}-${index}`}
                          />
                          <label className="form-check-label ms-2" htmlFor={`difficult-${wIndex}-${index}`}>
                            Unmark as difficult
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultQuestions;