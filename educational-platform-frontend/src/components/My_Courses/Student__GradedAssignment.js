import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import "../../styles/assignment.css";

const GradedAssignment = () => {
  const ga = {
    ga_id: 1,
    deadline: "26 Jan, 2025"
  };

  const Questions = [
    { Question: 'Question 1 : Select one option from the options below.',
      Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4'],
      type: 'single' },
    { Question: 'Question 2 : Select one option from the options below.',
      Answars: ['Option_1', 'Option_2', 'Option_3'],
      type: 'single' },
    { Question: 'Question 3 : You can choose more than one answer for this question.',
      Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4'],
      type: 'multi' },
    { Question: 'Question 4 : You can choose more than one answer for this question',
      Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4', 'Option_5'],
      type: 'multi' }
  ];

  const submitAssignment = () => {
    alert("Assignment submission successful");
  };

  return (
    <div className="assignment">
      <Topbar courseName="React MERN Course" />
      <div className="content" style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '20px' }}>
          <div className="container mt-5 text-center">
            <h2>Graded Assignment {ga.ga_id}</h2>
            <p>Deadline : {ga.deadline}</p>
          </div>
          <div className="container mt-5">
            <form>
              {Questions.map((q, index) => (
                <div
                  key={index}
                  className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
                >
                  {index + 1} .{q.Question}
                  <div className="mb-2">
                    {q.Answars.map((a, i) => (
                      <div key={i} className="form-check">
                        {q.type === 'single' ? (
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${index}`}
                            id={`option-${index}-${i}`}
                          />
                        ) : (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name={`question-${index}`}
                            id={`option-${index}-${i}`}
                          />
                        )}
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
                        id={`difficult-${index}`}
                      />
                      <label className="form-check-label ms-2" htmlFor={`difficult-${index}`}>
                        Mark as difficult
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-light mt-3 d-block mx-auto" onClick={submitAssignment}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradedAssignment;
