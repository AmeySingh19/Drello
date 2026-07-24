import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function Column({ column, columns, isDeleteMode, onDeleteColumn, onAddTask, onDeleteTask, onMoveTask, onUpdateColumn, onUpdateTask }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleUpdateTitle = async () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      await onUpdateColumn(column._id, editedTitle.trim());
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
            <h3 className="column-title" onDoubleClick={() => {
              setIsEditingTitle(true);
              setEditedTitle(column.title === 'add column name' ? '' : column.title);
            }} title="Double click to edit">
              {column.title || 'add column name'}
            </h3>
          )}
          {isDeleteMode && (
            <button 
              className="column-delete-btn" 
              onClick={() => onDeleteColumn(column._id)}
              title="Delete column"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column._id}>
        {(provided) => (
          <div 
            className="column-tasks"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.tasks && column.tasks.length > 0 ? (
              column.tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  columns={columns}
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                  onUpdate={onUpdateTask}
                />
              ))
            ) : null}
            {provided.placeholder}
            <div 
              className="add-task-btn" 
              onClick={handleAddTask} 
            >
              <span>+</span>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
