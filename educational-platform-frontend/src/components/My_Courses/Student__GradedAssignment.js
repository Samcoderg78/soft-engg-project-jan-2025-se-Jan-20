// import React, { useState } from 'react';
// import { Link } from "react-router-dom";
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';
// import "../../styles/assignment.css";

// const GradedAssignment = () => {
//   const ga = {
//     ga_id: 1,
//     deadline: "26 Jan, 2025"
//   };

//   const Questions = [
//     { Question: 'Question 1 : Select one option from the options below.',
//       Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4'],
//       type: 'single' },
//     { Question: 'Question 2 : Select one option from the options below.',
//       Answars: ['Option_1', 'Option_2', 'Option_3'],
//       type: 'single' },
//     { Question: 'Question 3 : You can choose more than one answer for this question.',
//       Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4'],
//       type: 'multi' },
//     { Question: 'Question 4 : You can choose more than one answer for this question',
//       Answars: ['Option_1', 'Option_2', 'Option_3', 'Option_4', 'Option_5'],
//       type: 'multi' }
//   ];

//   const submitAssignment = () => {
//     alert("Assignment submission successful");
//   };

//   return (
//     <div >
//       <Topbar courseName="React MERN Course" />
//       <div className="content" style={{ display: 'flex' }}>
//         <Sidebar />
//         <div className="main-content" style={{ flex: 1, padding: '20px' }}>
//           <div className="container mt-5 text-center">
//             <h2>Graded Assignment {ga.ga_id}</h2>
//             <p>Deadline : {ga.deadline}</p>
//           </div>
//           <div className="container mt-5">
//             <form>
//               {Questions.map((q, index) => (
//                 <div
//                   key={index}
//                   className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
//                 >
//                   {index + 1} .{q.Question}
//                   <div className="mb-2">
//                     {q.Answars.map((a, i) => (
//                       <div key={i} className="form-check">
//                         {q.type === 'single' ? (
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name={`question-${index}`}
//                             id={`option-${index}-${i}`}
//                           />
//                         ) : (
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             name={`question-${index}`}
//                             id={`option-${index}-${i}`}
//                           />
//                         )}
//                         {a}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="d-flex justify-content-between w-100">
//                     <Link to="/suggestions" state={{ q: q.Question }} className="text-primary">
//                       Click here to get suggestions
//                     </Link>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id={`difficult-${index}`}
//                       />
//                       <label className="form-check-label ms-2" htmlFor={`difficult-${index}`}>
//                         Mark as difficult
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button type="submit" className="btn btn-light mt-3 d-block mx-auto" onClick={submitAssignment}>
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GradedAssignment;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/assignment.css";

const GradedAssignment = () => {
  const ga = {
    ga_id: 1,
    deadline: "26 Jan, 2025",
  };

  const Questions = [
    {
      Question: "Question 1 : Select one option from the options below.",
      Answars: ["Option_1", "Option_2", "Option_3", "Option_4"],
      type: "single",
    },
    {
      Question: "Question 2 : Select one option from the options below.",
      Answars: ["Option_1", "Option_2", "Option_3"],
      type: "single",
    },
    {
      Question:
        "Question 3 : You can choose more than one answer for this question.",
      Answars: ["Option_1", "Option_2", "Option_3", "Option_4"],
      type: "multi",
    },
    {
      Question:
        "Question 4 : You can choose more than one answer for this question",
      Answars: ["Option_1", "Option_2", "Option_3", "Option_4", "Option_5"],
      type: "multi",
    },
  ];

  const submitAssignment = () => {
    alert("Assignment submission successful");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Topbar courseName="React MERN Course" />
      <div
        className="content"
        style={{ display: "flex", flex: 1, overflow: "hidden" }}
      >
        <Sidebar />
        <div
          className="main-content"
          style={{ flex: 1, padding: "20px", overflowY: "auto" }}
        >
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
                        {q.type === "single" ? (
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
                    <Link
                      to="/suggestions"
                      state={{ q: q.Question }}
                      className="text-primary"
                    >
                      Click here to get suggestions
                    </Link>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`difficult-${index}`}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={`difficult-${index}`}
                      >
                        Mark as difficult
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  display: "block",
                  margin: "20px auto",
                  textAlign: "center",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1.05)")}
                onClick={submitAssignment}
              >
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
