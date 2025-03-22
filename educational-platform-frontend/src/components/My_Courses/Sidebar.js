import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const { courseId, weekNumber, lectureNumber } = useParams();
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);
  const [lectures, setLectures] = useState({});
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
          const weeksData = response.data;
          setWeeks(weeksData);
          
          // Set initial open state for weeks
          const initialOpenWeeks = {};
          weeksData.forEach(week => {
            // Open the week that matches the current weekNumber param
            if (weekNumber) {
              initialOpenWeeks[week._id] = week.weekNumber.toString() === weekNumber.toString();
            } else {
              // If no weekNumber in URL, open first week
              initialOpenWeeks[week._id] = week === weeksData[0];
            }
          });
          setOpenWeeks(initialOpenWeeks);

          // Fetch lectures for the open week
          const targetWeek = weekNumber 
            ? weeksData.find(w => w.weekNumber.toString() === weekNumber.toString())
            : weeksData[0];
            
          if (targetWeek) {
            fetchLectures(targetWeek._id, targetWeek.weekNumber);
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
  }, [courseId, weekNumber]);

  const fetchLectures = async (weekId, weekNumber) => {
    try {
      const response = await axios.get(`http://localhost:3009/api/lecture/${courseId}/${weekNumber}`);
      if (response.data) {
        setLectures(prev => ({
          ...prev,
          [weekId]: response.data
        }));
      }
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError(err.response?.data?.message || 'Failed to fetch lectures');
    }
  };

  const toggleWeek = async (weekId, weekNumber) => {
    // Close all other weeks
    const newOpenWeeks = {};
    Object.keys(openWeeks).forEach(key => {
      newOpenWeeks[key] = key === weekId ? !openWeeks[weekId] : false;
    });
    setOpenWeeks(newOpenWeeks);

    // Fetch lectures if week is being opened and lectures haven't been loaded
    if (!openWeeks[weekId] && !lectures[weekId]) {
      await fetchLectures(weekId, weekNumber);
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
                  onClick={() => toggleWeek(week._id, week.weekNumber)} 
                  className={`custom-sidebar-item ${openWeeks[week._id] ? 'active' : ''}`}
                >
                  <span>Week {week.weekNumber}</span>
                  <span className={`toggle-icon ${openWeeks[week._id] ? 'open' : ''}`}>
                    ▼
                  </span>
                </div>
                {openWeeks[week._id] && (
                  <ul className="custom-sidebar-submenu">
                    {lectures[week._id]?.map((lecture) => (
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
                        to={`/ProgrammingAssignment/${courseId}`}
                        className={({ isActive }) =>
                          isActive ? "custom-nav-link active" : "custom-nav-link"
                        }
                      >
                        Programming Assignment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/assignment/${courseId}`}
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
