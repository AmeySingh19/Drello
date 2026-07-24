import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

function TaskCard({ task, index, columns = [], onDelete, onMove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(task.title === '+');
  const [editedTitle, setEditedTitle] = useState(task.title === '+' ? '' : task.title);

  const handleUpdate = async () => {
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== task.title) {
      await onUpdate(task._id, newTitle);
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
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div 
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.1)' : undefined,
          }}
        >
          <div className="task-card-content">
            {isEditing ? (
              <input
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', outline: 'none', fontFamily: 'monospace', fontSize: '0.82rem' }}
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
              <span className="task-title" onDoubleClick={() => {
                setIsEditing(true);
                setEditedTitle(task.title === '+' ? '' : task.title);
              }}>
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
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
