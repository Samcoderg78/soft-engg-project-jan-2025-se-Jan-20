import { useState, useEffect } from "react";
import Sidebar from "../StudentDashboard/Sidebar";
import Header from "../StudentDashboard/Header";
// import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import "../../styles/deadlineReminder.css";

export default function DeadlinesReminders() {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;
    const userId = user._id;

    fetchTasks(userId);
    fetchRecentSubmissions(userId);
    fetchUserCourses(userId);
  }, []);

  const fetchUserCourses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3009/api/course/${userId}`);
      const data = await response.json();
      const userCourses = data.data;
      setCourses(userCourses);
      
      if (userCourses.length > 0) {
        fetchAllAssignments(userCourses);
      } else {
        console.warn("User is not enrolled in any courses.");
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);
      setAssignments([]);
    }
  };
  
  const fetchAllAssignments = async (userCourses) => {
    try {
      const allAssignments = [];
      
      for (const course of userCourses) {
        try {
          const courseDetailsResponse = await fetch(
            `http://localhost:3009/api/course/single/${course._id}`
          );
          const courseDetails = await courseDetailsResponse.json();
          
          // Fetch graded assignments
          const gradedResponse = await fetch(
            `http://localhost:3009/api/assignment/${course._id}`
          );
          const gradedData = await gradedResponse.json();
          
          // Fetch programming assignments
          const progResponse = await fetch(
            `http://localhost:3009/api/prog-assignment/course/${course._id}`
          );
          const progData = await progResponse.json();
          
          // Process graded assignments
          const gradedAssignments = gradedData.data || gradedData;
          if (gradedAssignments && Array.isArray(gradedAssignments)) {
            gradedAssignments.forEach(assignment => {
              if (assignment.title && assignment.due_date) {
                allAssignments.push({
                  title: assignment.title,
                  due_date: assignment.due_date,
                  courseName: courseDetails.title || 'Unknown Course',
                  type: 'graded'
                });
              }
            });
          }
          
          // Process programming assignments
          const progAssignments = progData.data || progData;
          if (progAssignments && Array.isArray(progAssignments)) {
            progAssignments.forEach(assignment => {
              if (assignment.title && assignment.due_date) {
                allAssignments.push({
                  title: assignment.title,
                  due_date: assignment.due_date,
                  courseName: courseDetails.title || 'Unknown Course',
                  type: 'programming'
                });
              }
            });
          }
        } catch (error) {
          console.error(`Error processing course ${course._id}:`, error);
        }
      }
      
      // Filter assignments with future due dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingAssignments = allAssignments.filter(assignment => {
        try {
          const dueDate = new Date(assignment.due_date);
          return dueDate >= today;
        } catch (e) {
          console.error("Invalid due date format:", assignment.due_date);
          return false;
        }
      });
      
      // Sort by due date
      upcomingAssignments.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      
      setAssignments(upcomingAssignments);
    } catch (error) {
      console.error("Error in fetchAllAssignments:", error);
      setAssignments([]);
    }
  };

  const fetchTasks = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3009/api/dr/${userId}`);
      const data = await response.json();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingTasks = data.filter(task => {
        const taskDeadline = new Date(task.deadline);
        taskDeadline.setHours(0, 0, 0, 0);
        return taskDeadline >= today;
      });
      
      setTasks(upcomingTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  const fetchRecentSubmissions = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3009/api/rs/recent_submissions/${userId}`);
      const data = await response.json();
  
      const processedSubmissions = [];
  
      // Process graded assignment submissions
      if (data.assignmentSubmissions && Array.isArray(data.assignmentSubmissions)) {
        for (const submission of data.assignmentSubmissions) {
          try {
            const assignmentResponse = await fetch(
              `http://localhost:3009/api/assignment/single/${submission.assignment_id}`
            );
            const assignmentData = await assignmentResponse.json();
            
            processedSubmissions.push({
              id: submission._id,
              assignment_id: submission.assignment_id,
              title: assignmentData.title || 'Unknown Graded Assignment',
              submitted_on: submission.submitted_on,
              status: submission.status,
              type: 'graded'
            });
          } catch (error) {
            console.error(`Error fetching graded assignment ${submission.assignment_id}:`, error);
          }
        }
      }
  
      // Process programming assignment submissions
      if (data.progAssignmentSubmissions && Array.isArray(data.progAssignmentSubmissions)) {
        for (const submission of data.progAssignmentSubmissions) {
          try {
            const assignmentResponse = await fetch(
              `http://localhost:3009/api/prog-assignment/${submission.assignment_id}`
            );
            const assignmentData = await assignmentResponse.json();
            
            processedSubmissions.push({
              id: submission._id,
              assignment_id: submission.assignment_id,
              title: assignmentData.title || 'Unknown Programming Assignment',
              submitted_on: submission.submitted_on,
              status: submission.status,
              type: 'programming'
            });
          } catch (error) {
            console.error(`Error fetching programming assignment ${submission.assignment_id}:`, error);
          }
        }
      }
  
      // Sort by submission date (newest first)
      processedSubmissions.sort((a, b) => new Date(b.submitted_on) - new Date(a.submitted_on));
  
      setRecentSubmissions(processedSubmissions);
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      setRecentSubmissions([]);
    }
  };

  const addTask = async (newTask) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        console.error("User not found");
        return;
      }

      const taskToAdd = {
        ...newTask,
        userId: user._id,
        deadline: new Date(newTask.deadline).toISOString()
      };

      const response = await fetch("http://localhost:3009/api/dr/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToAdd),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const addedTask = await response.json();
      
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, addedTask];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return updatedTasks.filter(task => {
          const taskDeadline = new Date(task.deadline);
          taskDeadline.setHours(0, 0, 0, 0);
          return taskDeadline >= today;
        });
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const deleteTask = async (taskId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      console.error("User not found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3009/api/dr/${user._id}/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      } else {
        console.error("Failed to delete task:", result.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="dashboard-container deadlines-dashboard">
      <Header />
      <div className="dashboard-layout deadlines-layout">
        <div className="sidebar-container deadlines-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content deadlines-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="section-title mb-0">Upcoming Tasks</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
            >
              Add Task
            </button>
          </div>
          
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <div className="task-card-wrapper">
              <div className="card mb-3">
                <div className="card-body">
                  {tasks.map((task) => (
                    <div key={task._id} className="task-item d-flex justify-content-between align-items-center">
                      <div className="task-info">
                        <h5>{task.name}</h5>
                        <p className="mb-0"><small>{task.subject}</small></p>
                      </div>
                      <div className="task-details">
                        <span className="task-deadline">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className={`badge priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </div>
                      <button 
                        className="btn btn-danger ml-3" 
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <p>No upcoming tasks found.</p>
                {!loading && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Add Your First Task
                  </button>
                )}
              </div>
            </div>
          )}
          
          <h2 className="section-title">Upcoming Assignment Deadlines</h2>
          <div className="card">
            <div className="card-body">
              <ul className="list-group">
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{assignment.title}</strong>
                          <div>
                            <small className="text-muted">
                              {assignment.courseName} • 
                              {assignment.type === 'graded' ? ' Graded Assignment' : ' Programming Assignment'}
                            </small>
                          </div>
                        </div>
                        <span className="text-primary">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No upcoming assignments found.</li>
                )}
              </ul>
            </div>
          </div>
          
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <AddTaskForm onAdd={addTask} onClose={() => setShowForm(false)} />
              </div>
            </div>
          )}
          
          <h2 className="section-title">Recent Submissions</h2>
          <div className="card">
            <div className="card-body">
              <ul className="list-group">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((submission, index) => (
                    <li key={submission.id || index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <strong>{submission.title}</strong>
                            <span className={`badge ${submission.type === 'graded' ? 'bg-primary' : 'bg-info'}`}>
                              {submission.type === 'graded' ? 'Graded' : 'Programming'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <small className="text-muted">
                              Submitted: {new Date(submission.submitted_on).toLocaleString()}
                            </small>
                          </div>
                        </div>
                        <div className="ms-3 text-end">
                          <span className={submission.status === "Submitted" ? "text-success fw-bold" : "text-danger fw-bold"}>
                            {submission.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">
                    <div className="text-center py-2">No recent submissions found</div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}