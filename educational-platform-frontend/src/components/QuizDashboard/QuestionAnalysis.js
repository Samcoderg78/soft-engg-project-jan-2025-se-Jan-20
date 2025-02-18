import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function QuestionAnalysis() {
  return (
    <div className="container text-center py-5">
      <h2 className="fw-bold">Question Performance Analysis</h2>
      <p className="text-muted">Insights on students' answers for each question</p>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h5 className="card-title">Question Correctness</h5>
            <p className="text-muted">Correct Percentage</p>
            <div className="d-flex justify-content-center">
              <img
                src="https://via.placeholder.com/300x150"
                alt="Question Correctness Chart"
                className="img-fluid"
              />
            </div>
            <p className="text-end mt-3">Questions</p>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4">
            <h5 className="card-title">Student Score Distribution</h5>
            <p className="text-muted">Number of Students</p>
            <div className="d-flex justify-content-center">
              <img
                src="https://via.placeholder.com/300x150"
                alt="Student Score Distribution Chart"
                className="img-fluid"
              />
            </div>
            <p className="text-end mt-3">Percentage Range</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionAnalysis;
