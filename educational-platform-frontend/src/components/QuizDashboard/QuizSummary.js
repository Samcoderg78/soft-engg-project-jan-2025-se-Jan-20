import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function QuizSummary() {
  return (
    <div className="container text-center mt-5">
      {/* Quiz Summary Header */}
      <div className="my-5">
        <h2 className="fw-bold">Quiz 1 Summary</h2>
        <p className="text-muted">Summary of student performance on Quiz 1</p>
      </div>

      {/* Performance Chart Section */}
      <div className="card mx-auto p-4 shadow-sm border-light" style={{ maxWidth: '1000px' }}>
        <h5 className="fw-medium">Quiz 1 Performance by Week</h5>
        <p className="text-muted">Number of Questions</p>
        <div className="d-flex justify-content-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/914181d2c267c11644775be751f97be8d9bf05f17ef6828f1a4b9e7bfa51994b?placeholderIfAbsent=true&apiKey=0d51f1f18565485c956201973431f7db"
            alt="Quiz 1 Performance by Week Chart"
            className="img-fluid"
          />
        </div>
        <p className="text-end mt-3 text-muted">Week</p>
      </div>

      {/* Summary Stats */}
      <div className="row mt-5 justify-content-center">
        <div className="col-md-4">
          <div className="card p-3 border-light text-center shadow-sm">
            <p className="text-muted mb-1">Total Students Attempted</p>
            <h3 className="fw-bold">150</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-light text-center shadow-sm">
            <p className="text-muted mb-1">Students Passed</p>
            <h3 className="fw-bold">120</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSummary;
