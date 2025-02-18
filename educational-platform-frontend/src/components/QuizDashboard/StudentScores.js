import React from 'react';

function StudentScores() {
  const scoreRanges = [
    { range: '0-50%', percentage: '20%' },
    { range: '51-75%', percentage: '40%' },
    { range: '76-100%', percentage: '40%' },
  ];

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 col-12">
          <div className="text-center">
            <h2 className="h2 font-weight-bold">Student Scores Overview</h2>
            <p className="mt-3">Distribution of student scores</p>
          </div>

          <div className="row mt-5">
            {scoreRanges.map((range, index) => (
              <div key={index} className="col-md-4 col-12 mb-4">
                <div className="card p-3 border border-light">
                  <div className="text-center">
                    <div className="h5">{range.range}</div>
                    <div className="h2 font-weight-bold">{range.percentage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="card p-4 border border-light">
            <h4 className="h4 font-weight-medium">Student Score Distribution</h4>
            <p className="mt-3">Percentage</p>
            <img
              loading="lazy"
              src="https://via.placeholder.com/600x400.png?text=Student+Score+Distribution+Chart"
              alt="Student Score Distribution Chart"
              className="img-fluid mt-3"
            />
            <p className="text-right mt-3">Score Range</p>
          </div>
        </div>
      </div>
      <img
        loading="lazy"
        src="https://via.placeholder.com/1440x200.png?text=Background+Image"
        alt=""
        className="img-fluid position-absolute bottom-0 w-100"
      />
    </div>
  );
}

export default StudentScores;
