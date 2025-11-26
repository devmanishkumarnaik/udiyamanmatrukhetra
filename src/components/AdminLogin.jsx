import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Popup from './Popup';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const navigate = useNavigate();

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type, show: true });
  };

  const closePopup = () => {
    setPopup({ message: '', type: '', show: false });
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === 'sarita' && credentials.password === 'sarita10') {
      localStorage.setItem('adminAuth', 'true');
      showPopup('Login successful! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="admin-icon">
              <img src="/images/srimaa.png" alt="Admin" className="admin-profile-image" />
            </div>
            <h2>Admin Login</h2>
            <p>Udiyamanmatrukhetra</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default AdminLogin;
