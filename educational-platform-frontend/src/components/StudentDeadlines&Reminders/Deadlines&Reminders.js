import { useState, useEffect } from "react";
import Sidebar from "../StudentDashboard/Sidebar";
import Header from "../StudentDashboard/Header";
import SelectDateRange from "./SelectDateRange";
import TaskCard from "./TaskCard";
import ManageDeadlineCard from "./ManageDeadlineCard";
import AddTaskForm from "./AddTaskForm";
import "../../styles/deadlineReminder.css";

export default function DeadlinesReminders() {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progAssignments, setProgAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;
    const userId = user._id;

    fetchEnrolledCourses(userId);
    fetchTasks(userId);
    fetchRecentSubmissions(userId);

  }, []);

  const fetchEnrolledCourses = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3009/api/enrollments/user/${userId}/courses`);
        const data = await response.json();

        console.log("Fetched Enrolled Courses:", data); // Should be an array of course IDs

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("User is not enrolled in any courses.");
            return;
        }

        fetchAssignments(data); // Pass data directly as it's already an array
    } catch (error) {
        console.error(" Error fetching enrolled courses:", error);
    }
};

const fetchAssignments = async (courseIds) => {
  console.log("Calling fetchAssignments with Course IDs:", courseIds);
  try {
      const allAssignments = [];
      const allProgAssignments = [];

      for (const courseId of courseIds) {
          console.log(`Fetching deadlines for Course ID: ${courseId}`);
          const response = await fetch(`http://localhost:3009/api/gd/deadlines?course_id=${courseId}`);
          const data = await response.json();

          if (data.assignments) allAssignments.push(...data.assignments);
          if (data.progAssignments) allProgAssignments.push(...data.progAssignments);
      }

      console.log("Fetched Assignments:", allAssignments);
      console.log("Fetched Programming Assignments:", allProgAssignments);

      setAssignments(allAssignments);
      setProgAssignments(allProgAssignments);
  } catch (error) {
      console.error("Error fetching assignment deadlines:", error);
  }
};

const fetchRecentSubmissions = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3009/api/rs/recent_submissions/${userId}`);
    const data = await response.json();
    setRecentSubmissions(data.assignmentSubmissions || []);
  } catch (error) {
    console.error("Error fetching recent submissions:", error);
  }
};

const fetchTasks = async (userId) => {
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:3009/api/dr/${userId}`);
    const data = await response.json();

    setTasks(data); // Replace tasks instead of adding duplicates

  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  setLoading(false);
};



const addTask = async (newTask) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      console.error("User not found");
      return;
    }

    newTask.userId = user._id;

    const response = await fetch("http://localhost:3009/api/dr/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    const addedTask = await response.json();

    // ✅ Check if task already exists before adding
    setTasks((prevTasks) => {
      const taskExists = prevTasks.some((task) => task._id === addedTask._id);
      return taskExists ? prevTasks : [...prevTasks, addedTask];
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

  console.log("Attempting to delete task:", { userId: user._id, taskId });

  try {
    const response = await fetch(`http://localhost:3009/api/dr/${user._id}/${taskId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Task deleted successfully:", result);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
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
          <h2 className="section-title">Select Date Range</h2>
          <SelectDateRange onApply={(start, end) => console.log("Filtering tasks from:", start, "to", end)} />
          
          <h2 className="section-title">Upcoming Tasks</h2>
          {loading ? <p>Loading tasks...</p> : (
            <div className="task-card-wrapper">
              <div className="card mb-3">
                <div className="card-body">
                  {tasks.map((task) => (
                    <div key={task._id} className="task-item d-flex justify-content-between align-items-center">
                      <TaskCard task={task} />
                      <span className="task-deadline">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      <button className="btn btn-danger ml-3" onClick={() => deleteTask(task._id)}>Delete</button>
                    </div>
                  ))}
                </div>
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
                      {assignment.title} - Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No upcoming assignments found.</li>
                )}
              </ul>
            </div>
          </div>
          
          <h2 className="section-title">Meet Deadlines by making custom tasks</h2>
          <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
            Add Task
          </button>
          
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
                    <li key={index} className="list-group-item">
                      {submission.assignment_id} - Due: {new Date(submission.deadline).toLocaleDateString()} -
                      <span className={submission.status === "Submitted" ? "text-success" : "text-danger"}>
                        {submission.status}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No recent submissions found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
