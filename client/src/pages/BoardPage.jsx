import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      // Automatically add a task placeholder with "+" sign interaction as per requirements
      await createTask(newCol._id, '+');
      await fetchBoardData(boardData.board._id);
    } catch (err) {
      alert(err.message || 'Failed to add column');
    }
  };

  const handleDeleteColumn = async () => {
    if (!boardData?.columns || boardData.columns.length === 0) {
      alert('No columns available to delete.');
      return;
    }

    const columnListStr = boardData.columns
      .map((col, idx) => `${idx + 1}. ${col.title}`)
      .join('\n');

    const input = prompt(
      `Enter the number or title of the column to delete:\n\n${columnListStr}`
    );

    if (!input || !input.trim()) return;

    const trimmedInput = input.trim().toLowerCase();
    const colIndex = parseInt(trimmedInput, 10) - 1;
    const targetColumn =
      !isNaN(colIndex) && colIndex >= 0 && colIndex < boardData.columns.length
        ? boardData.columns[colIndex]
        : boardData.columns.find((col) => col.title.toLowerCase() === trimmedInput);

    if (!targetColumn) {
      alert('Column not found.');
      return;
    }

    try {
      await deleteColumn(targetColumn._id);
      await fetchBoardData(boardData.board._id);
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

  const handleMoveTask = async (taskId, columnId) => {
    try {
      await moveTask(taskId, columnId);
      if (boardData?.board?._id) {
        await fetchBoardData(boardData.board._id);
      }
    } catch (err) {
      alert(err.message || 'Failed to move task');
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
          <button className="btn-mono-action btn-mono-danger" onClick={handleDeleteColumn}>
            Delete a column
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
          <div className="columns-wrapper">
            {boardData?.columns && boardData.columns.length > 0 ? (
              boardData.columns.map((column) => (
                <Column
                  key={column._id}
                  column={column}
                  columns={boardData.columns}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onMoveTask={handleMoveTask}
                  onUpdateColumn={handleUpdateColumn}
                  onUpdateTask={handleUpdateTask}
                />
              ))
            ) : (
              <div className="empty-board-message">
                No columns initialized. Click <strong>"Add a column"</strong> to start.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Monospace 11px Footer matching wireframe links */}
      <Footer />
    </div>
  );
}

export default BoardPage;
