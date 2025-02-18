import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Sidebar from './Sidebar';
import QuizSummary from './QuizSummary';
import WeeklyPerformance from './WeeklyPerformance';
import QuestionAnalysis from './QuestionAnalysis';
import QuizDifficulty from './QuizDifficulty';
import StudentScores from './StudentScores';

function QuizPerformanceReview() {
  return (
    <div className="bg-white text-black">
      {/* Header */}
      <Header />

      <div className="container-fluid pt-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 bg-light p-3">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            <div className="container py-4" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
              {/* Quiz Summary */}
              <QuizSummary />
              {/* Ensure components are rendering */}
              <div className="debug-section mt-4">
                <WeeklyPerformance />
                <QuestionAnalysis />
                <QuizDifficulty />
                <StudentScores />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPerformanceReview;
