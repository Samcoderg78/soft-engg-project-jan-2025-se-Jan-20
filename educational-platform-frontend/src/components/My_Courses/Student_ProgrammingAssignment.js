// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// const Question = "This is the question and you have to solve it.";

// const ProgrammingAssignment = () => {
//   const [language, setLanguage] = useState("");
//   const [code, setCode] = useState("");
//   const [testResult, setTestResult] = useState({
//     passed: 5,
//     total: 10,
//     publicTestCases: [
//       {
//         input: "Input 1",
//         expectedOutput: "Expected Output 1",
//         actualOutput: "Actual Output 1",
//       },
//     ],
//   });

//   const handleTestRun = () => {
//     alert("Test Run successful");
//   };

//   const handleSubmit = () => {
//     alert("Assignment submission successful");
//   };

//   return (
//     <div className="container-fluid p-0 vh-100">
//       {/* Topbar */}
//       <Topbar />

//       {/* Sidebar */}
//       <div style={{ position: "fixed", top: "60px", left: "0", bottom: "0", width: "250px" }}>
//         <Sidebar />
//       </div>

//       {/* Fixed Header */}
//       <div
//         className="fixed-top bg-white shadow-sm py-3 text-center"
//         style={{ top: "60px", left: "250px", right: "0" }}
//       >
//         <h2>Programming Assignment</h2>
//         <p>Deadline: 09 Feb, 2025</p>
//       </div>

//       {/* Main Content Area */}
//       <div
//         className="p-4"
//         style={{
//           marginLeft: "250px",
//           marginTop: "120px",
//           overflowY: "auto",
//           height: "calc(100vh - 120px)",
//         }}
//       >
//         <div className="problem-section border p-4 rounded mb-4">
//           <h4>Problem</h4>
//           <p>{Question}</p>
//           <select
//             className="form-select mb-3"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="" disabled>
//               Select Language
//             </option>
//             <option value="python">Python</option>
//             <option value="javascript">JavaScript</option>
//             <option value="java">Java</option>
//           </select>
//           <textarea
//             className="form-control mb-3"
//             rows="6"
//             placeholder="Write your response"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//           ></textarea>
//           <div className="d-flex gap-2">
//             <button className="btn btn-dark" onClick={handleTestRun}>
//               Test Run
//             </button>
//             <button className="btn btn-dark" onClick={handleSubmit}>
//               Submit
//             </button>
//           </div>
//         </div>

//         <div className="test-result-section border p-4 rounded mb-4">
//           <h4>Test Run Result</h4>
//           <p>
//             {testResult.passed}/{testResult.total} private cases passed
//           </p>
//           <h5>Public Test Cases</h5>
//           <div className="border rounded p-3 mb-3">
//             <div className="d-flex font-weight-bold mb-2">
//               <div className="col">
//                 <h5>Input</h5>
//               </div>
//               <div className="col">
//                 <h5>Expected Output</h5>
//               </div>
//               <div className="col">
//                 <h5>Actual Output</h5>
//               </div>
//             </div>
//             {testResult.publicTestCases.map((test, index) => (
//               <div key={index} className="d-flex mb-2">
//                 <div className="col">{test.input}</div>
//                 <div className="col">{test.expectedOutput}</div>
//                 <div className="col">{test.actualOutput}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="additional-options d-flex justify-content-between mb-4">
//           <Link to="/suggestions" state={{ Question }} className="text-primary">
//             Click here to get suggestions
//           </Link>
//           <div className="form-check">
//             <input className="form-check-input" type="checkbox" id="mark-as-difficult" />
//             <label className="form-check-label ms-2" htmlFor="mark-as-difficult">
//               Mark as difficult
//             </label>
//           </div>
//         </div>

//         <div className="feedback-section border p-4 rounded">
//           <h5>Coding Feedback (powered by AI)</h5>
//           <p>
//             Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
//             has been the industry's standard dummy text ever since the 1500s.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProgrammingAssignment;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProgrammingAssignment.css"; // Import the new CSS file

const Question = "This is the question and you have to solve it.";

const ProgrammingAssignment = () => {
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [testResult, setTestResult] = useState({
    passed: 5,
    total: 10,
    publicTestCases: [
      {
        input: "Input 1",
        expectedOutput: "Expected Output 1",
        actualOutput: "Actual Output 1",
      },
    ],
  });

  const handleTestRun = () => {
    alert("Test Run successful");
  };

  const handleSubmit = () => {
    alert("Assignment submission successful");
  };

  return (
    <div className="pa-container">
      {/* Topbar */}
      <Topbar />

      {/* Sidebar */}
      <div className="pa-sidebar">
        <Sidebar />
      </div>

      {/* Fixed Header */}
      <div className="pa-header">
        <h2>Programming Assignment</h2>
        <p>Deadline: 09 Feb, 2025</p>
      </div>

      {/* Main Content Area */}
      <div className="pa-main">
        <div className="pa-problem-section">
          <h4>Problem</h4>
          <p>{Question}</p>
          <select
            className="pa-select-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
          <textarea
            className="pa-code-editor"
            rows="6"
            placeholder="Write your response..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
          <div className="pa-buttons">
            <button className="pa-btn pa-test-run" onClick={handleTestRun}>
              Test Run
            </button>
            <button className="pa-btn pa-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        <div className="pa-test-result-section">
          <h4>Test Run Result</h4>
          <p>
            {testResult.passed}/{testResult.total} private cases passed
          </p>
          <h5>Public Test Cases</h5>
          <div className="pa-test-case-table">
            <div className="pa-test-case-header">
              <div>Input</div>
              <div>Expected Output</div>
              <div>Actual Output</div>
            </div>
            {testResult.publicTestCases.map((test, index) => (
              <div key={index} className="pa-test-case-row">
                <div>{test.input}</div>
                <div>{test.expectedOutput}</div>
                <div>{test.actualOutput}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pa-additional-options">
          <Link
            to="/suggestions"
            state={{ Question }}
            className="pa-suggestions-link"
          >
            Click here to get suggestions
          </Link>
          <div className="pa-checkbox">
            <input type="checkbox" id="mark-as-difficult" />
            <label htmlFor="mark-as-difficult">Mark as difficult</label>
          </div>
        </div>

        <button
          className="pa-feedback-section"
          onClick={() => console.log("Clicked!")}
        >
          <h5>Coding Feedback (powered by AI)</h5>
          <p>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProgrammingAssignment;
