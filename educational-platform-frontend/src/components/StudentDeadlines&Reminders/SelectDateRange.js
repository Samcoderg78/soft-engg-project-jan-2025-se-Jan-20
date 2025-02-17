import { useState } from "react";

export default function SelectDateRange({ onApply }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="card mb-3 date-range-container">
      <div className="card-body">
        <h2 className="card-title">Select Date Range</h2>
        <div className="row">
          <div className="col-md-5">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={() => onApply(startDate, endDate)}>
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
