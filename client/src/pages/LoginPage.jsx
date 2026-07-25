import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import NavDock from '../components/NavDock';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="page-container">
      <NavDock />
      
      <main className="auth-page-wrapper">
        <div className="dropzone-background-grid" />
        <div className="auth-glow" />
        
        <div className="auth-card">
          <h3 className="auth-title">Welcome Back</h3>
          <p className="auth-subtitle">Sign in to your account to continue</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="auth-btn-wrapper">
              <button
                type="submit"
                className="starthack-btn"
                style={{ width: '100%' }}
              >
                Sign In
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
