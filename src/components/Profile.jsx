import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaIdCard, FaGraduationCap } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import LearningDashboard from './LearningDashboard';
import { useSocket } from '../contexts/SocketContext.jsx';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const navigate = useNavigate();
  const { socket, joinUserRoom } = useSocket();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/register');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await axios.get('/profile');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Only logout if it's an authentication error (401 Unauthorized)
        if (error.response?.status === 401) {
          console.log('Token expired or invalid, logging out');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userType');
          localStorage.removeItem('isActivated');
          navigate('/register');
        } else {
          // Network error or server error - show error message but don't logout
          console.log('Network or server error occurred');
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [navigate]);

  // Separate effect for socket connection - only runs when socket and user are available
  useEffect(() => {
    if (!socket || !user) return;
    
    // Join user room once when both socket and user are available
    joinUserRoom(user.id || user._id);
    
    const handleAccountStatusChanged = (data) => {
      if (data.isActivated) {
        setShowActivationModal(true);
      }
    };
    
    socket.on('account-status-changed', handleAccountStatusChanged);
    
    return () => {
      socket.off('account-status-changed', handleAccountStatusChanged);
    };
  }, [socket, user?._id, user?.id, joinUserRoom]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('isActivated');
    
    // Trigger storage event for Navbar update
    window.dispatchEvent(new Event('storage'));
    
    navigate('/register');
  };

  const handleActivationOk = () => {
    // Reload the page to show learning dashboard
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // If user is activated, show learning dashboard
  if (user && user.isActivated) {
    return <LearningDashboard user={user} onLogout={handleLogout} />;
  }

  // If not activated, show profile with pending message
  return (
    <div className="profile-page">
      <Navbar />
      
      {/* Activation Success Modal */}
      {showActivationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            maxWidth: '500px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#4CAF50', marginBottom: '15px', fontSize: '28px' }}>Account Activated!</h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
              Congratulations! Your account has been successfully activated by the administrator.
              <br />
              Click OK to access your dashboard.
            </p>
            <button
              onClick={handleActivationOk}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '15px 50px',
                fontSize: '18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}  
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <section className="profile-section">
        <div className="container">
          <div className="profile-header">
            <h1>{user.userType === 'teacher' ? 'Teacher' : user.userType === 'member' ? 'Member' : 'Student'} Profile</h1>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="profile-card">
            <div className="activation-banner pending">
              <div className="banner-icon">⏳</div>
              <div className="banner-content">
                <h3>Account Not Activated Yet</h3>
                <p>Your account is pending approval by the administrator. You will be able to access the learning dashboard once your account is activated.</p>
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  <img src={user.photo} alt={user.firstName} />
                </div>
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="user-type-badge">{user.userType === 'teacher' ? 'Teacher' : user.userType === 'member' ? 'Member' : 'Student'}</p>
              </div>

              <div className="profile-info">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <label>First Name</label>
                      <p>{user.firstName}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <label>Last Name</label>
                      <p>{user.lastName}</p>
                    </div>
                  </div>

                  {user.userType === 'teacher' || user.userType === 'member' ? (
                    <>
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <div>
                          <label>Email</label>
                          <p>{user.email}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <FaPhone className="info-icon" />
                        <div>
                          <label>Phone</label>
                          <p>{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-item">
                        <FaIdCard className="info-icon" />
                        <div>
                          <label>Roll Number</label>
                          <p>{user.rollNumber}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <FaGraduationCap className="info-icon" />
                        <div>
                          <label>Class</label>
                          <p>{user.class}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
