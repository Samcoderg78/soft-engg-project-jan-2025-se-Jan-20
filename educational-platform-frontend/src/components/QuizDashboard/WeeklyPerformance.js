import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Sidebar from './Sidebar';

function WeeklyPerformance() {
  const weeklyData = [
    { week: 1, questions: 10, percentage: 80 },
    { week: 2, questions: 15, percentage: 75 },
    { week: 3, questions: 12, percentage: 85 },
    { week: 4, questions: 8, percentage: 70 },
  ];

  return (
    <div className="container text-center py-5">
    <Header />
    <Sidebar />

      <h2 className="fw-bold">Weekly Quiz Performance Breakdown</h2>
      <p className="text-muted">Performance breakdown across four weeks</p>

      <div className="row mt-4">
        {weeklyData.map((week, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '80px', height: '80px', margin: '0 auto' }}>
                <span style={{ fontSize: '40px' }}>📅</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">Week {week.week}</h5>
                <p className="card-text">{week.questions} questions</p>
                <h3 className="fw-bold">{week.percentage}%</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyPerformance;
