import TaskCard from './TaskCard';

function Column({ column, columns, onAddTask, onDeleteTask, onMoveTask }) {
  const handleAddTask = () => {
    const title = prompt('Enter task title:');
    if (title && title.trim()) {
      onAddTask(column._id, title.trim());
    }
  };

  const taskCount = column.tasks ? column.tasks.length : 0;

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-box">
          <h3 className="column-title">{column.title}</h3>
          <span className="column-count-badge">{taskCount}</span>
        </div>
        <button className="btn-mono-action" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={handleAddTask}>
          + Task
        </button>
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
            />
          ))
        ) : (
          <div className="empty-column-text">No tasks</div>
        )}
      </div>
    </div>
  );
}

export default Column;
