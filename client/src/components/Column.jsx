import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function Column({ column, columns, isDeleteMode, onDeleteColumn, onAddTask, onDeleteTask, onMoveTask, onUpdateColumn, onUpdateTask }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleUpdateTitle = async () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      await onUpdateColumn(column._id, editedTitle.trim(), column.color);
    } else {
      setEditedTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleUpdateColor = async (color) => {
    if (color !== column.color) {
      await onUpdateColumn(column._id, column.title, color);
    }
  };

  const COLORS = [
    { value: '', label: 'Default' },
    { value: 'rgba(234, 179, 8, 0.25)', label: 'Yellow' },
    { value: 'rgba(34, 197, 94, 0.25)', label: 'Green' },
    { value: 'rgba(59, 130, 246, 0.25)', label: 'Blue' },
    { value: 'rgba(239, 68, 68, 0.25)', label: 'Red' },
    { value: 'rgba(168, 85, 247, 0.25)', label: 'Purple' }
  ];

  const handleAddTask = () => {
    onAddTask(column._id, '+');
  };

  return (
    <div className="column">
      <div 
        className="column-header" 
        style={{ 
          background: column.color ? column.color : 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
          borderBottom: column.color ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="column-title-box">
          <div className="column-color-picker">
            {COLORS.map((c) => (
              <div 
                key={c.value}
                className={`color-swatch ${column.color === c.value ? 'active' : ''}`}
                style={{ backgroundColor: c.value || 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => handleUpdateColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
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
