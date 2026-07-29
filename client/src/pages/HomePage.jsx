import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../api/boardApi';
import Footer from '../components/Footer';
import NavDock from '../components/NavDock';
import AuthContext from '../context/AuthContext';

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleCreateBoard = async () => {
    try {
      setLoading(true);
      const newBoard = await createBoard('Board');
      navigate(`/board/${newBoard._id}`);
    } catch (err) {
      alert(err.message || 'Error creating board');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };


  return (
    <div className="page-container starthack-hero-main">
      <NavDock />

      <main 
        className="dropzone-container" 
        onClick={handleCreateBoard}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="dropzone-background-grid" />
        
        {isHovering && (
          <div 
            className="custom-cursor-tooltip"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y 
            }}
          >
            Click to create board
          </div>
        )}
        
        <div 
          className="hero-text-block"
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsHovering(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsHovering(true);
          }}
        >
          <h3 className="hero-h3">DROP YOUR</h3>
          <h4 className="hero-h4">TASKS</h4>
          
          <p className="hero-p">
            and manage your workflow with intuitive drag-and-drop boards — structure your project execution effortlessly before you even start.
          </p>

          <button
            type="button"
            className="starthack-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateBoard();
            }}
            disabled={loading}
          >
            {loading ? 'Creating Board...' : 'Click to Create Board'}
          </button>

          <button
            type="button"
            className="starthack-link-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateBoard();
            }}
          >
            How it works →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
