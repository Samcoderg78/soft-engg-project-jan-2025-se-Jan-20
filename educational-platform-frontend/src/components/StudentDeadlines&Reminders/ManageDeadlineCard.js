export default function ManageDeadlineCard({ task }) {
    return (
      <div className="deadline-card">
        <h5>{task.name}</h5>
        <p><strong>Subject:</strong> {task.subject}</p>
        <p><strong>Deadline:</strong> {task.deadline}</p>
      </div>
    );
  }
  