import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

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
    <div className="auth-page-wrapper">
      <div className="auth-split-left">
        <div className="auth-split-left-overlay"></div>
        <div className="auth-split-left-content">
          <h1 className="auth-brand-text">
            Drello_<span>Your Missions, Organized</span>
          </h1>
        </div>
      </div>
      
      <div className="auth-split-right">
        <button onClick={() => navigate('/')} className="auth-close-btn" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
        
        <div className="auth-form-container">
          <div className="auth-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
          </div>
          
          <h2 className="auth-title">Sign in to Drello</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="auth-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Email"
                required
              />
            </div>
            
            <div className="auth-input-group" style={{ marginBottom: '8px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Password"
                required
              />
            </div>
            
            <div className="auth-options">
              <Link to="#" className="auth-link-small">Forgot Password?</Link>
            </div>
            
            <button type="submit" className="auth-submit-btn">
              Continue
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
