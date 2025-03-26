import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/weekPerformance.css';
import { useNavigate } from 'react-router-dom';

function WeeklyPerformance() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        // Get the logged-in user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id || user.role !== 'instructor') {
          console.error('User not found or not an instructor');
          navigate('/login');
          return;
        }

        // Determine course based on instructor ID
        let courseId;
        if (user.email === 'instructor1@example.com') {
          courseId = '67daa3763295e7e667a5ea6b'; // Python course ID
          setCourseName('Python Course');
        } else if (user._id === '67e44140411947fbcc46c00d') {
          courseId = '67dc543933038a94558d676b'; // PDSA course ID
          setCourseName('PDSA Course');
        } else {
          console.error('Unknown instructor');
          setLoading(false);
          return;
        }

        // Fetch assignments for the determined course
        const assignmentsResponse = await fetch(`http://localhost:3009/api/assignment/${courseId}`);
        if (!assignmentsResponse.ok) throw new Error('Error fetching assignments');
        const assignmentsData = await assignmentsResponse.json();

        // Check if assignmentsData is an array or has an assignments property
        const assignmentsArray = Array.isArray(assignmentsData) ? assignmentsData : 
                              (assignmentsData.assignments || []);

        // Process assignments into weekly data with summaries
        const processedData = await Promise.all(
          assignmentsArray.map(async (assignment, index) => {
            try {
              // Fetch summary for each assignment
              const summaryResponse = await fetch(`http://localhost:3009/api/summary/${assignment._id}`);
              if (!summaryResponse.ok) {
                return {
                  week: index + 1,
                  assignmentId: assignment._id,
                  title: assignment.title,
                  questions: assignment.questions?.length || 0,
                  percentage: 0,
                  dueDate: assignment.due_date,
                  totalStudents: 0,
                  summary: null
                };
              }
              
              const summaryData = await summaryResponse.json();
              return {
                week: index + 1,
                assignmentId: assignment._id,
                title: assignment.title,
                questions: summaryData.question_performance?.length || 0,
                percentage: Math.round(summaryData.average_score || 0),
                dueDate: assignment.due_date,
                totalStudents: summaryData.total_students || 0,
                summary: summaryData
              };
            } catch (error) {
              console.error(`Error processing assignment ${assignment._id}:`, error);
              return {
                week: index + 1,
                assignmentId: assignment._id,
                title: assignment.title,
                questions: 0,
                percentage: 0,
                dueDate: assignment.due_date,
                totalStudents: 0,
                summary: null
              };
            }
          })
        );

        setWeeklyData(processedData);
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [navigate]);

  const toggleAssignmentDetails = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  if (loading) {
    return (
      <div className="container-fluid p-0 vh-100">
        <Header />
        <div style={{ position: "fixed", top: "60px", left: "0", bottom: "0", width: "250px" }}>
          <Sidebar />
        </div>
        <div
          className="p-4"
          style={{
            marginLeft: "250px",
            marginTop: "60px",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
          }}
        >
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 vh-100">
      <Header />
      <div style={{ position: "fixed", top: "60px", left: "0", bottom: "0", width: "250px" }}>
        <Sidebar />
      </div>
      <div
        className="p-4"
        style={{
          marginLeft: "250px",
          marginTop: "60px",
          overflowY: "auto",
          height: "calc(100vh - 60px)",
        }}
      >
        <h2 className="fw-bold text-center">Weekly Quiz Performance Breakdown</h2>
        <p className="text-muted text-center">{courseName} - Performance breakdown</p>

        {weeklyData.length === 0 ? (
          <div className="alert alert-info mt-4">
            No assignments found for your course.
          </div>
        ) : (
          <div className="row mt-4">
            {weeklyData.map((week, index) => (
              <div key={index} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="cardW shadow-sm p-3 h-100">
                  <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" 
                       style={{ width: '80px', height: '80px', margin: '0 auto' }}>
                    <span style={{ fontSize: '40px' }}>📅</span>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title">Week {week.week}</h5>
                    <p className="card-text text-truncate" title={week.title}>{week.title}</p>
                    <p className="card-text">{week.questions} questions</p>
                    <p className="card-text">{week.totalStudents} students attempted</p>
                    <h3 className="fw-bold">{week.percentage}%</h3>
                    <button 
                      className="btn btn-sm btn-primary mt-2"
                      onClick={() => toggleAssignmentDetails(week.assignmentId)}
                    >
                      {expandedAssignment === week.assignmentId ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  
                  {expandedAssignment === week.assignmentId && week.summary && (
                    <div className="mt-3 p-3 border-top">
                      <h6>Detailed Performance:</h6>
                      <p><strong>Average Score:</strong> {week.percentage}%</p>
                      <p><strong>Score Distribution:</strong></p>
                      <ul className="list-unstyled">
                        {week.summary.score_distribution && Object.entries(week.summary.score_distribution).map(([range, count]) => (
                          <li key={range}>{range}: {count} students</li>
                        ))}
                      </ul>
                      <p><strong>Question Performance:</strong></p>
                      <ul className="list-unstyled">
                        {week.summary.question_performance?.map((question, qIndex) => (
                          <li key={qIndex}>
                            Q{qIndex + 1}: Avg {question.average_marks?.toFixed(1) || 0} marks
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklyPerformance;