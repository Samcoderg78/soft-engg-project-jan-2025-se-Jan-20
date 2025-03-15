// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// const Sidebar = () => {
//   const [week1Open, setWeek1Open] = useState(false);
//   const [week2Open, setWeek2Open] = useState(false);

//   const toggleWeek1 = () => setWeek1Open(!week1Open);
//   const toggleWeek2 = () => setWeek2Open(!week2Open);

//   return (
//     <aside className="bg-light vh-100 p-3">
//       <ul className="list-unstyled">
//         <li>
//           <div onClick={toggleWeek1} className="sidebar-item">
//             Week 1
//           </div>
//           {week1Open && (
//             <ul className="list-unstyled pl-3">
//               <li>
//                 <NavLink to="/week1/lecture1" className="nav-link">
//                   Lecture 1
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week1/lecture2" className="nav-link">
//                   Lecture 2
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week1/programming-assignment" className="nav-link">
//                   Programming Assignment
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week1/graded-assignment" className="nav-link">
//                   Graded Assignment
//                 </NavLink>
//               </li>
//             </ul>
//           )}
//         </li>
//         <li>
//           <div onClick={toggleWeek2} className="sidebar-item">
//             Week 2
//           </div>
//           {week2Open && (
//             <ul className="list-unstyled pl-3">
//               <li>
//                 <NavLink to="/week2/lecture1" className="nav-link">
//                   Lecture 1
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week2/lecture2" className="nav-link">
//                   Lecture 2
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week2/programming-assignment" className="nav-link">
//                   Programming Assignment
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/week2/graded-assignment" className="nav-link">
//                   Graded Assignment
//                 </NavLink>
//               </li>
//             </ul>
//           )}
//         </li>
//         <li>
//           <NavLink to="/difficult-questions" className="nav-link">
//             Difficult Questions
//           </NavLink>
//         </li>
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./Sidebar.css"; // Import custom CSS

const Sidebar = () => {
  const [week1Open, setWeek1Open] = useState(false);
  const [week2Open, setWeek2Open] = useState(false);

  const toggleWeek1 = () => setWeek1Open(!week1Open);
  const toggleWeek2 = () => setWeek2Open(!week2Open);

  return (
    <div className="custom-sidebar-wrapper">
      <aside className="custom-sidebar">
        <ul className="custom-sidebar-menu">
          <li>
            <div onClick={toggleWeek1} className="custom-sidebar-item">
              Week 1
            </div>
            {week1Open && (
              <ul className="custom-sidebar-submenu">
                <li>
                  <NavLink
                    to="/week1/lecture1"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Lecture 1
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week1/lecture2"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Lecture 2
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week1/programming-assignment"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Programming Assignment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week1/graded-assignment"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Graded Assignment
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <div onClick={toggleWeek2} className="custom-sidebar-item">
              Week 2
            </div>
            {week2Open && (
              <ul className="custom-sidebar-submenu">
                <li>
                  <NavLink
                    to="/week2/lecture1"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Lecture 1
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week2/lecture2"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Lecture 2
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week2/programming-assignment"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Programming Assignment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/week2/graded-assignment"
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Graded Assignment
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/difficult-questions"
              className={({ isActive }) =>
                isActive ? "custom-nav-link active" : "custom-nav-link"
              }
            >
              Difficult Questions
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
