// import React, { useState } from 'react';
// import { Link } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import './difficultQuestion.css'

// const DifficultQuestions = () => {
//   const [activeLecture, setActiveLecture] = useState(null);
//   const courseName = "Software Engineering"; // Course name for TopBar
//   const difficultsQuestions = [
//     {
//       week: 1,
//       Questions: [
//         { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
//         { Question: 'Question 2', Answars: ['option_1', 'option_2', 'option_3'] },
//       ]
//     },
//     {
//       week: 2,
//       Questions: [
//         { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
//         { Question: 'Question 4', Answars: ['option_1', 'option_2', 'option_3'] }
//       ]
//     }
//   ];

//   return (
//     <div className="difficult-questions-page">
//   <Topbar courseName={courseName} />
  
//   <div className="content">
//     <Sidebar setActiveLecture={setActiveLecture} />
    
//     <div className="main-content">
//       <div className="assignment difficultqus">
//         <div className="container-title">
//           <h2>Difficult Questions</h2>
//         </div>
//         {difficultsQuestions.map((w, wIndex) => (
//           <div key={wIndex} className="week-container">
//             <div className="week-title">
//               <h4>Week {w.week}</h4>
//             </div>
//             <form>
//               {w.Questions.map((q, index) => (
//                 <div key={index} className="question-container">
//                   {index + 1}. {q.Question}
//                   <div className="answer-options">
//                     {q.Answars.map((a, i) => (
//                       <div key={i} className="form-check">
//                         <input type="radio" name={`question-${wIndex}-${index}`} id={`option-${wIndex}-${index}-${i}`} />
//                         {a}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="actions">
//                     <Link to="/suggestions" state={{ q: q.Question }} className="suggestion-link">
//                       Click here to get suggestions
//                     </Link>
//                     <div className="form-check">
//                       <input type="checkbox" id={`difficult-${wIndex}-${index}`} />
//                       <label htmlFor={`difficult-${wIndex}-${index}`}>Unmark as difficult</label>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </form>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };

// export default DifficultQuestions;


import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import './difficultQuestion.css';

const DifficultQuestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering";

  const difficultsQuestions = [
    {
      week: 1,
      Questions: [
        { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
        { Question: 'Question 2', Answars: ['option_1', 'option_2', 'option_3'] },
      ]
    },
    {
      week: 2,
      Questions: [
        { Question: 'Question 1', Answars: ['option_1', 'option_2', 'option_3', 'option_4'] },
        { Question: 'Question 4', Answars: ['option_1', 'option_2', 'option_3'] }
      ]
    }
  ];

  return (
    <>
      <Topbar courseName={courseName} />
      <div className="content">
        <Sidebar setActiveLecture={setActiveLecture} />
        
          <div className="assignment">
            <h2 className="container-title">Difficult Questions</h2>
            {difficultsQuestions.map((w, wIndex) => (
              <div key={wIndex} className="week-container">
                <div className="week-title">Week {w.week}</div>
                <form>
                  {w.Questions.map((q, index) => (
                    <div key={index} className="question-container">
                      <p>{index + 1}. {q.Question}</p>
                      <div className="answer-options">
                        {q.Answars.map((a, i) => (
                          <label key={i} className="form-check">
                            <input type="radio" name={`question-${wIndex}-${index}`} />
                            {a}
                          </label>
                        ))}
                      </div>
                      <div className="actions">
                        <Link to="/suggestions" state={{ q: q.Question }} className="suggestion-link">
                          Click here to get suggestions
                        </Link>
                        <label className="form-check">
                          <input type="checkbox" id={`difficult-${wIndex}-${index}`} />
                          Unmark as difficult
                        </label>
                      </div>
                    </div>
                  ))}
                </form>
              </div>
            ))}
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default DifficultQuestions;

