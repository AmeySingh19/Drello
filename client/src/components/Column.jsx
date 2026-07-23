import { useState } from 'react';
import TaskCard from './TaskCard';

function Column({ column, columns, onAddTask, onDeleteTask, onMoveTask, onUpdateColumn, onUpdateTask }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleUpdateTitle = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      onUpdateColumn(column._id, editedTitle.trim());
    } else {
      setEditedTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    onAddTask(column._id, '+');
  };


  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-box">
          {isEditingTitle ? (
            <input
              className="column-title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle();
                if (e.key === 'Escape') {
                  setEditedTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
            />
          ) : (
            <h3 className="column-title" onDoubleClick={() => setIsEditingTitle(true)} title="Double click to edit">
              {column.title || 'add column name'}
            </h3>
          )}
        </div>
      </div>

      <div className="column-tasks">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              columns={columns}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              onUpdate={onUpdateTask}
            />
          ))
        ) : null}
        <div 
          className="add-task-btn" 
          onClick={handleAddTask} 
        >
          <span>+</span>
        </div>
      </div>
    </div>
  );
}

export default Column;
