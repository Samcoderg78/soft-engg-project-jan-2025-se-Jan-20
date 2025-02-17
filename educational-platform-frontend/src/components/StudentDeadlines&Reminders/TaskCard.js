export default function TaskCard({ task }) {
    return (
      <div className="card task-card mb-3">
        <div className="card-body">
          <h5 className="card-title">{task.name}</h5>
          <p className="card-text">
            <small>{task.assignee} - <span className="badge bg-secondary">{task.priority}</span></small>
          </p>
        </div>
      </div>
    );
  }
  