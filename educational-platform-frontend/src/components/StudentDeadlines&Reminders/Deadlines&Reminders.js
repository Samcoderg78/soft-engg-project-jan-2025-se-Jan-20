import { useState } from "react";
import Sidebar from "../StudentDashboard/Sidebar";
import Header from "../StudentDashboard/Header";
import SelectDateRange from "./SelectDateRange";
import TaskCard from "./TaskCard";
import ManageDeadlineCard from "./ManageDeadlineCard";
import AddTaskForm from "./AddTaskForm";
import "../../styles/deadlineReminder.css";

export default function DeadlinesReminders() {
  const [tasks, setTasks] = useState([
    {
      name: "Meeting Presentation",
      subject: "AI",
      deadline: "2025-02-20",
      priority: "High",
      assignee: "John Doe",
    },
    {
      name: "Project Deadline",
      subject: "ML",
      deadline: "2025-02-18",
      priority: "Medium",
      assignee: "Jane Smith",
    },
    {
      name: "Report Submission",
      subject: "Data Science",
      deadline: "2025-02-22",
      priority: "Low",
      assignee: "Jane Smith",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const addTask = (newTask) => {
    setTasks((prevTasks) =>
      [...prevTasks, newTask].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      )
    );
    setShowForm(false);
  };

  return (
    <div className="dashboard-container deadlines-dashboard">
      <Header />
      <div className="dashboard-layout deadlines-layout">
        <div className="sidebar-container deadlines-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content deadlines-content">
          {/* Select Date Range */}
          <h2 className="section-title">Select Date Range</h2>
          <SelectDateRange
            onApply={(start, end) =>
              console.log("Filtering tasks from:", start, "to", end)
            }
          />

          {/* Upcoming Deadlines & Tasks */}
          <h2 className="section-title">Upcoming Deadlines & Tasks</h2>
          <div className="task-card-wrapper">
            <div className="card mb-3">
              <div className="card-body">
                {tasks.map((task, index) => (
                  <TaskCard key={index} task={task} />
                ))}
              </div>
            </div>
          </div>

          {/* Manage Deadlines */}
          <h2 className="section-title">Manage Deadlines</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowForm(true)}
          >
            Add Task
          </button>

          {/* Modal for Adding Task */}
          {showForm && (
            <div
              className="modal-overlay"
              onClick={() => setShowForm(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <AddTaskForm
                  onAdd={addTask}
                  onClose={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* Manage Deadlines Cards */}
          <div className="manage-deadlines-container">
            {tasks.map((task, index) => (
              <ManageDeadlineCard key={index} task={task} />
            ))}
          </div>

          {/* Recent Submissions */}
          <h2 className="section-title">Recent Submissions</h2>
          <div className="card">
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  Project A - Due: 12/15/2021 -{" "}
                  <span className="text-success">Submitted</span>
                </li>
                <li className="list-group-item">
                  Report B - Due: 12/20/2021 -{" "}
                  <span className="text-danger">Pending</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
