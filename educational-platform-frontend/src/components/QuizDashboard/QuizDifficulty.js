import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function QuizDifficulty() {
  const weeklyDifficulty = [
    { week: 1, difficulty: 'Medium' },
    { week: 2, difficulty: 'Hard' },
    { week: 3, difficulty: 'Easy' },
    { week: 4, difficulty: 'Medium' },
  ];

  return (
    <div className="container text-center py-5">
      <h2 className="fw-bold">Weekly Quiz Difficulty</h2>
      <p className="text-muted">Difficulty levels of quizzes over four weeks</p>

      <div className="row mt-4 justify-content-center">
        {weeklyDifficulty.map((week, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '80px', height: '80px', margin: '0 auto' }}>
                <span style={{ fontSize: '40px' }}>📊</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">Week {week.week}</h5>
                <h4 className="fw-bold">{week.difficulty}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizDifficulty;
