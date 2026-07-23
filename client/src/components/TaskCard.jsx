import { useState } from 'react';

function TaskCard({ task, columns = [], onDelete, onMove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(task.title === '+');
  const [editedTitle, setEditedTitle] = useState(task.title === '+' ? '' : task.title);

  const handleMoveChange = (e) => {
    const newColumnId = e.target.value;
    if (newColumnId && newColumnId !== task.columnId) {
      onMove(task._id, newColumnId);
    }
  };

  const handleUpdate = () => {
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== task.title) {
      onUpdate(task._id, newTitle);
    } else if (!newTitle && task.title === '+') {
      // Keep it editable or reset to empty
      setIsEditing(true);
      return;
    } else {
      setEditedTitle(task.title === '+' ? '' : task.title);
    }
    setIsEditing(false);
  };

  return (
    <div className="task-card">
      <div className="task-card-content">
        {isEditing ? (
          <input
            style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: 'inherit', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem' }}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate();
              if (e.key === 'Escape') {
                setEditedTitle(task.title === '+' ? '' : task.title);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <span className="task-title" onDoubleClick={() => setIsEditing(true)}>
            {task.title === '+' ? 'New Task' : task.title}
          </span>
        )}
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
