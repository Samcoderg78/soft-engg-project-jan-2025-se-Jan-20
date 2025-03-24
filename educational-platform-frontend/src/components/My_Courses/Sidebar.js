import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const { courseId, weekNumber, lectureNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [weeks, setWeeks] = useState([]);
  const [lectures, setLectures] = useState({});
  const [assignments, setAssignments] =useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openWeeks, setOpenWeeks] = useState({});

  useEffect(() => {
    const fetchWeeks = async () => {
      if (!courseId) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3009/api/week/course/${courseId}`);
        if (response.data) {
          setWeeks(response.data);
          // Set initial open state based on current week
          const initialOpenWeeks = {};
          response.data.forEach(week => {
            initialOpenWeeks[week.weekNumber] = week.weekNumber === parseInt(weekNumber);
          });
          setOpenWeeks(initialOpenWeeks);

          // Fetch lectures for the current week
          if (weekNumber) {
            fetchLectures(weekNumber);
          }
        }
      } catch (err) {
        console.error("Error fetching weeks:", err);
        setError(err.response?.data?.message || 'Failed to fetch weeks');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();

    const fetchAssignments = async() => {
      try {
        const response = await axios.get(`http://localhost:3009/api/assignment/${courseId}`);
        if (response.data) {
          const arrengeAssignmentByWeek = response.data.reduce((acc,assignment) => {
            acc[assignment.week] = assignment._id;
            return acc;
          },{})
          setAssignments(arrengeAssignmentByWeek)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchAssignments()

  }, [courseId, weekNumber]);

  const fetchLectures = async (weekNum) => {
    try {
      const response = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${weekNum}`);
      if (response.data) {
        setLectures(prev => ({
          ...prev,
          [weekNum]: response.data
        }));
      }
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError(err.response?.data?.message || 'Failed to fetch lectures');
    }
  };

  const toggleWeek = async (weekNum) => {
    // Close all other weeks
    const newOpenWeeks = {};
    Object.keys(openWeeks).forEach(key => {
      newOpenWeeks[key] = parseInt(key) === weekNum;
    });
    setOpenWeeks(newOpenWeeks);

    // Fetch lectures if not already loaded
    if (!lectures[weekNum]) {
      await fetchLectures(weekNum);
    }
  };

  if (loading) {
    return <div className="custom-sidebar-wrapper">Loading weeks...</div>;
  }

  if (error) {
    return <div className="custom-sidebar-wrapper">Error: {error}</div>;
  }

  return (
    <div className="custom-sidebar-wrapper">
      <aside className="custom-sidebar">
        <ul className="custom-sidebar-menu">
          {weeks && weeks.length > 0 ? (
            weeks.map((week) => (
              <li key={week._id}>
                <div 
                  onClick={() => toggleWeek(week.weekNumber)} 
                  className={`custom-sidebar-item ${openWeeks[week.weekNumber] ? 'active' : ''}`}
                >
                  <span>Week {week.weekNumber}</span>
                  <span className={`toggle-icon ${openWeeks[week.weekNumber] ? 'open' : ''}`}>
                    ▼
                  </span>
                </div>
                {openWeeks[week.weekNumber] && (
                  <ul className="custom-sidebar-submenu">
                    {lectures[week.weekNumber]?.map((lecture) => (
                      <li key={lecture._id}>
                        <NavLink
                          to={`/my-course/${courseId}/week/${week.weekNumber}/lecture/${lecture._id}`}
                          className={({ isActive }) =>
                            isActive ? "custom-nav-link active" : "custom-nav-link"
                          }
                        >
                          {lecture.title}
                        </NavLink>
                      </li>
                    ))}
                    <li>

                    <NavLink
                      to={`/ProgrammingAssignment/${courseId}/week/${week.weekNumber}`}
                      className={({ isActive }) => (isActive ? "custom-nav-link active" : "custom-nav-link")}
                    >
                      Programming Assignment
                    </NavLink>
                  </li>

                    <li>
                      <NavLink
                        to={`/assignment/${courseId}/${assignments[week.weekNumber]}`}
                        className={({ isActive }) =>
                          isActive ? "custom-nav-link active" : "custom-nav-link"
                        }
                      >
                        Graded Assignment
                      </NavLink>
                    </li>
                    )}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className="no-weeks-message">No weeks available</li>
          )}
          <li>
            <NavLink
              to={`/difficult-questions/${courseId}`}
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
