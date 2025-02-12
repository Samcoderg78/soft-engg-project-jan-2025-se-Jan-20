import React from "react";

const GradedAssignment = () => {

  const Questions = [
    {Question : 'Question 1',
    Answars : ['answar_1', 'answar_2', 'answar_3', 'answar_4']},
    {Question : 'Question 2',
      Answars : ['answar_1', 'answar_2', 'answar_3']},
    {Question : 'Question 3',
    Answars : ['answar_1', 'answar_2', 'answar_3', 'answar_4']},
    {Question : 'Question 2',
      Answars : ['answar_4', 'answar_2', 'answar_3']}
  ]

  return (
    <div>
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
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${index}`}
                  id={`option-${index}-${i}`}
                />
                {a}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between w-100">
            <a href="#" className="text-primary">
              Click here to get suggestions
            </a>
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
      <button type="submit" className="btn btn-light mt-3 d-block mx-auto">
        Submit
      </button>
    </form>
  </div>
    </div>
  );
};

export default GradedAssignment;