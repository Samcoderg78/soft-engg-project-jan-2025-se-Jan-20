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
    
    if (loading) return;
    setLoading(true);
    setError(null);
  
    try {
      // Validate the form data
      if (!task.name || !task.subject || !task.deadline) {
        throw new Error("Please fill all required fields");
      }
  
      // Call the parent component's addTask function
      await onAdd({
        name: task.name,
        subject: task.subject,
        deadline: task.deadline,
        priority: task.priority
      });
  
      // Reset form only if successful
      setTask({
        name: "",
        subject: "",
        deadline: "",
        priority: "Medium"
      });
  
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
