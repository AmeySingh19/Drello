import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../api/boardApi';
import Footer from '../components/Footer';
import NavDock from '../components/NavDock';

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="page-container starthack-hero-main">
      {/* Floating Pill Nav Dock */}
      <NavDock />

      {/* Main Full-Screen Dashed Hero Dropzone */}
      <main className="dropzone-container" onClick={handleCreateBoard}>
        <div className="dropzone-background-grid" />
        
        <div className="hero-text-block">
          <h3 className="hero-h3">DROP YOUR</h3>
          <h4 className="hero-h4">TASKS</h4>
          
          <p className="hero-p">
            and manage your workflow the way recruiters scan resumes — then structure your project execution before you start.
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

      {/* Monospace 11px Uppercase Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
