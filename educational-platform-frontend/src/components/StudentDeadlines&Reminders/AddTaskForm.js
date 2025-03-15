import { useState } from "react";
import '../../styles/addTask.css';

export default function AddTaskForm({ onAdd, onClose }) {
  const [task, setTask] = useState({
    name: "",
    subject: "",
    deadline: "",
    priority: "Medium",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.trim() && task.deadline.trim()) {
      onAdd(task);
      setTask({ name: "", subject: "", deadline: "", priority: "Medium" });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>Add Task</h2>
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

          <button type="submit" className="btn btn-success mt-3">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
