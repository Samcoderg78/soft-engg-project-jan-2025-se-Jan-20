import { useState } from "react";
import '../../styles/addTask.css';

export default function AddTaskForm({ onAdd, onClose }) {
  const [task, setTask] = useState({
    name: "",
    subject: "",
    deadline: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    setError(null);
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      setError("User not found. Please log in.");
      setLoading(false);
      return;
    }
  
    const taskWithUser = { ...task, userId: user._id };
  
    try {
      const response = await fetch("http://localhost:3009/api/dr/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskWithUser),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add task");
      }
  
      onAdd(data);
  
      // Reset form state only if successfully added
      setTask({ name: "", subject: "", deadline: "", priority: "Medium" });
  
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Add Task</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Task Name</label>
          <input
            type="text"
            className="form-control"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            required
          />

          <label>Subject</label>
          <input
            type="text"
            className="form-control"
            value={task.subject}
            onChange={(e) => setTask({ ...task, subject: e.target.value })}
            required
          />

          <label>Deadline</label>
          <input
            type="date"
            className="form-control"
            value={task.deadline}
            onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            required
          />

          <label>Priority</label>
          <select
            className="form-select"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button type="submit" className="btn btn-success mt-3" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
