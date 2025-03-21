import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const { courseId, weekNumber, lectureId } = useParams();
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
        const api = axios.create({
          baseURL: 'http://localhost:3009',
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        const response = await api.get(`/api/week/course/${courseId}`);
        
        if (response.data) {
          const weeksData = response.data.data || response.data;
          if (Array.isArray(weeksData)) {
            setWeeks(weeksData);
            const initialOpenWeeks = {};
            weeksData.forEach(week => {
              if (week.weekNumber) {
                initialOpenWeeks[week.weekNumber] = false;
              }
            });
            setOpenWeeks(initialOpenWeeks);

            // If no week or lecture is selected, navigate to first lecture
            if (!weekNumber || !lectureId) {
              const firstWeek = weeksData[0];
              if (firstWeek) {
                const lecturesResponse = await api.get(`/api/lecture/${courseId}/${firstWeek.weekNumber}`);
                if (lecturesResponse.data.data && lecturesResponse.data.data.length > 0) {
                  const firstLecture = lecturesResponse.data.data[0];
                  navigate(`/my-course/${courseId}/1/${firstLecture._id}`, { replace: true });
                }
              }
            }
          } else {
            setError('Invalid weeks data format');
            setWeeks([]);
          }
        } else {
          setError('No data received from server');
          setWeeks([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        if (err.code === 'ECONNREFUSED') {
          setError('Could not connect to server. Please ensure the backend server is running.');
        } else if (err.response) {
          setError(err.response.data.message || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('No response received from server. Please check your network connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
        setWeeks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [courseId, weekNumber, lectureId, navigate]);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!weeks.length) return;

      const api = axios.create({
        baseURL: 'http://localhost:3009',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const lecturesData = {};
      
      for (const week of weeks) {
        try {
          const response = await api.get(`/api/lecture/${courseId}/${week.weekNumber}`);
          if (response.data) {
            lecturesData[week.weekNumber] = response.data.data || response.data;
          }
        } catch (err) {
          console.error(`Error fetching lectures for week ${week.weekNumber}:`, err);
          lecturesData[week.weekNumber] = [];
        }
      }

      setLectures(lecturesData);
    };

    fetchLectures();
  }, [weeks, courseId]);

  const toggleWeek = (weekNumber) => {
    setOpenWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  if (loading) {
    return (
      <div className="custom-sidebar-wrapper">
        <div className="loading-spinner">Loading weeks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-sidebar-wrapper">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="custom-sidebar-wrapper">
      <aside className="custom-sidebar">
        <ul className="custom-sidebar-menu">
          {weeks && weeks.length > 0 ? (
            weeks.map((week) => (
              <li key={week.weekNumber}>
                <div 
                  onClick={() => toggleWeek(week.weekNumber)} 
                  className="custom-sidebar-item"
                >
                  Week {week.weekNumber}
                  <span className={`toggle-icon ${openWeeks[week.weekNumber] ? 'open' : ''}`}>
                    ▼
                  </span>
            </div>
                {openWeeks[week.weekNumber] && (
              <ul className="custom-sidebar-submenu">
                    {lectures[week.weekNumber]?.map((lecture, index) => (
                      <li key={lecture._id || index}>
                  <NavLink
                          to={`/my-course/${courseId}/1/${lecture._id}`}
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/my-course/${courseId}/1/${lecture._id}`, { replace: true });
                          }}
                  >
                          {lecture.title || `Lecture ${index + 1}`}
                  </NavLink>
                </li>
                    ))}
                <li>
                  <NavLink
                        to={`/my-course/${courseId}/week/${week.weekNumber}/programming-assignment`}
                    className={({ isActive }) =>
                      isActive ? "custom-nav-link active" : "custom-nav-link"
                    }
                  >
                    Programming Assignment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                        to={`/my-course/${courseId}/week/${week.weekNumber}/graded-assignment`}
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
