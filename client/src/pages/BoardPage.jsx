import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  getBoard,
  getBoards,
  createBoard,
  createColumn,
  deleteColumn,
  createTask,
  deleteTask,
  moveTask,
  updateBoard,
  updateColumn,
  updateTask,
} from '../api/boardApi';
import Column from '../components/Column';
import Footer from '../components/Footer';
import NavDock from '../components/NavDock';

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [animationParent] = useAutoAnimate();

  const fetchBoardData = useCallback(async (targetId) => {
    try {
      const data = await getBoard(targetId);

      if (data.board) {
        setBoardData(data);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load board');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initBoard() {
      try {
        setLoading(true);
        if (id) {
          if (!ignore) await fetchBoardData(id);
        } else {
          // If accessing /board without id, find existing board or create one
          const boards = await getBoards();
          if (boards && boards.length > 0) {
            navigate(`/board/${boards[0]._id}`, { replace: true });
          } else {
            const newBoard = await createBoard('My Task Board');
            navigate(`/board/${newBoard._id}`, { replace: true });
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to initialize board');
          setLoading(false);
        }
      }
    }

    initBoard();

    return () => {
      ignore = true;
    };
  }, [id, navigate, fetchBoardData]);

  const handleAddColumn = async () => {
    if (!boardData?.board?._id) return;

    try {
      const order = boardData?.columns ? boardData.columns.length : 0;
      const newCol = await createColumn(boardData.board._id, 'add column name', order);
      await fetchBoardData(boardData.board._id);
    } catch (err) {
      alert(err.message || 'Failed to add column');
    }
  };

  const handleDeleteColumnById = async (columnId) => {
    try {
      await deleteColumn(columnId);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete column');
    }
  };

  const handleAddTask = async (columnId, title) => {
    try {
      await createTask(columnId, title);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleMoveTaskFallback = async (taskId, columnId) => {
    try {
      await moveTask(taskId, columnId);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to move task');
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColIndex = boardData.columns.findIndex(col => col._id === source.droppableId);
    const destColIndex = boardData.columns.findIndex(col => col._id === destination.droppableId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const newBoardData = { ...boardData };
    const sourceCol = { ...newBoardData.columns[sourceColIndex] };
    const destCol = { ...newBoardData.columns[destColIndex] };

    const sourceTasks = Array.from(sourceCol.tasks || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      sourceCol.tasks = sourceTasks;
      newBoardData.columns[sourceColIndex] = sourceCol;
      
      setBoardData(newBoardData);
      
      try {
        await Promise.all(sourceTasks.map((t, index) => moveTask(t._id, source.droppableId, index)));
      } catch (err) {
        console.error('Failed to save task order:', err);
      }
    } else {
      const destTasks = Array.from(destCol.tasks || []);
      movedTask.columnId = destination.droppableId;
      destTasks.splice(destination.index, 0, movedTask);
      
      sourceCol.tasks = sourceTasks;
      destCol.tasks = destTasks;
      newBoardData.columns[sourceColIndex] = sourceCol;
      newBoardData.columns[destColIndex] = destCol;
      
      setBoardData(newBoardData);
      
      try {
        await Promise.all(destTasks.map((t, index) => moveTask(t._id, destination.droppableId, index)));
      } catch (err) {
        console.error('Failed to save task order:', err);
      }
    }
  };

  const handleUpdateColumn = async (columnId, title) => {
    try {
      await updateColumn(columnId, title);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to update column');
    }
  };

  const handleUpdateTask = async (taskId, title) => {
    try {
      await updateTask(taskId, title);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleUpdateBoardTitle = async () => {
    if (!editedTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await updateBoard(boardData.board._id, editedTitle.trim());
      await fetchBoardData(boardData.board._id);
    } catch (err) {
      alert(err.message || 'Failed to update board title');
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="page-container starthack-board-container">
      {/* Floating Pill Nav Dock */}
      <NavDock />

      {/* Top Header Bar matching wireframe controls with hero design */}
      <header className="board-header-bar">
        <div className="board-header-left">
          <Link to="/" className="brand-mono-title">
            Drello
          </Link>
          {boardData?.board?.title && (
            isEditingTitle ? (
              <input
                className="board-mono-subtitle"
                style={{ background: 'transparent', border: '1px solid #333', color: 'inherit', outline: 'none' }}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleUpdateBoardTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateBoardTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
              />
            ) : (
              <span
                className="board-mono-subtitle"
                onDoubleClick={() => {
                  setEditedTitle(boardData.board.title);
                  setIsEditingTitle(true);
                }}
              >
                {boardData.board.title}
              </span>
            )
          )}
        </div>
        <div className="board-actions">
          <button className="btn-mono-action" onClick={handleAddColumn}>
            Add a column
          </button>
          <button 
            className={`btn-mono-action ${isDeleteMode ? '' : 'btn-mono-danger'}`} 
            onClick={() => setIsDeleteMode(!isDeleteMode)}
          >
            {isDeleteMode ? 'Done deleting' : 'Delete a column'}
          </button>
        </div>
      </header>

      {/* Dashed Hero-Style Main Board View Canvas */}
      <main className="dropzone-container board-dropzone-canvas">
        <div className="dropzone-background-grid" />
        
        {loading ? (
          <div className="status-message">Loading task board...</div>
        ) : error ? (
          <div className="status-message" style={{ color: '#fca5a5' }}>{error}</div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="columns-wrapper" ref={animationParent}>
              {boardData?.columns && boardData.columns.length > 0 ? (
                boardData.columns.map((column) => (
                  <Column
                    key={column._id}
                    column={column}
                    columns={boardData.columns}
                    isDeleteMode={isDeleteMode}
                    onDeleteColumn={handleDeleteColumnById}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    onMoveTask={handleMoveTaskFallback}
                    onUpdateColumn={handleUpdateColumn}
                    onUpdateTask={handleUpdateTask}
                  />
                ))
              ) : (
                <div className="empty-board-message">
                  Click <strong>"Add a column"</strong> to start.
                </div>
              )}
            </div>
          </DragDropContext>
        )}
      </main>

      {/* Monospace 11px Footer matching wireframe links */}
      <Footer />
    </div>
  );
}

export default BoardPage;
