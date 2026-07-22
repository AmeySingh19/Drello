function TaskCard({ task, columns = [], onDelete, onMove }) {
  const handleMoveChange = (e) => {
    const newColumnId = e.target.value;
    if (newColumnId && newColumnId !== task.columnId) {
      onMove(task._id, newColumnId);
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-content">
        <span className="task-title">{task.title}</span>
        <button
          className="task-delete-btn"
          onClick={() => onDelete(task._id)}
          title="Delete Task"
          aria-label="Delete Task"
        >
          ✕
        </button>
      </div>

      {columns.length > 1 && (
        <div className="task-move-container">
          <select
            className="task-move-select"
            value={task.columnId}
            onChange={handleMoveChange}
            aria-label="Move task to column"
          >
            {columns.map((col) => (
              <option key={col._id} value={col._id}>
                Move → {col.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
