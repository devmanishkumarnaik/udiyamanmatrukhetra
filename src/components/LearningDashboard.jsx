import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUsers, FaChalkboardTeacher, FaBook, FaChartBar, FaUser, FaBell, FaAward, FaDownload, FaVideo, FaFilePdf, FaEnvelope, FaPaperPlane, FaSync } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import { useSocket } from '../contexts/SocketContext.jsx';
import './LearningDashboard.css';

const LearningDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [quizStatus, setQuizStatus] = useState(null);
  const [isExamEligible, setIsExamEligible] = useState(true);
  const [examResults, setExamResults] = useState([]);
  const [searchResultQuery, setSearchResultQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [materialTab, setMaterialTab] = useState('videos'); // 'videos' or 'notes'
  const [searchVideoQuery, setSearchVideoQuery] = useState('');
  const [visibleVideoCount, setVisibleVideoCount] = useState(10);
  const [searchNoteQuery, setSearchNoteQuery] = useState('');
  const [visibleNoteCount, setVisibleNoteCount] = useState(10);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const navigate = useNavigate();
  const { socket, joinUserRoom } = useSocket();
  const [accountStatusMessage, setAccountStatusMessage] = useState(null);
  const [isActivationMessage, setIsActivationMessage] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allUsers = response.data.filter(u => u.isActivated);
        setTeachers(allUsers.filter(u => u.userType === 'teacher'));
        setStudents(allUsers.filter(u => u.userType === 'student'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
        
        // Check for unread notifications
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        const unread = response.data.filter(n => !readNotifications.includes(n._id));
        setUnreadCount(unread.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const loadQuizStatus = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('/quiz/check-status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizStatus(response.data);

        // Also check exam eligibility
        const eligibilityResponse = await axios.get('/quiz/check-eligibility', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsExamEligible(eligibilityResponse.data.isEligible);
      } catch (error) {
        console.error('Error checking quiz status:', error);
      }
    };

    const loadExamResults = async () => {
      try {
        const token = localStorage.getItem('userToken');
        // Load all exam results to show all students' results
        const response = await axios.get('/exam-results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExamResults(response.data);
      } catch (error) {
        console.error('Error fetching exam results:', error);
      }
    };

    const loadVideos = async () => {
      try {
        const response = await axios.get('/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    const loadNotes = async () => {
      try {
        const response = await axios.get('/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    loadUsers();
    loadNotifications();
    loadQuizStatus();
    loadExamResults();
    loadVideos();
    loadNotes();
  }, []);

  // Separate effect for socket connection and real-time updates
  useEffect(() => {
    if (!socket || !user) return;

    // Notify server that user is connected - only once when both are available
    joinUserRoom(user.id || user._id);

    // Listen for real-time updates
    const handleNewNotification = (notification) => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => {
        console.log('Failed to play notification sound:', error);
      });
      
      // Update unread count
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notification._id)) {
        setUnreadCount(prevCount => prevCount + 1);
      }
    };

    const handleNotificationUpdated = (notification) => {
      setNotifications(prevNotifications => 
        prevNotifications.map(n => n._id === notification._id ? notification : n)
      );
    };

    const handleNotificationDeleted = (data) => {
      const { notificationId } = data;
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n._id !== notificationId)
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    };

    const handleUserActivationUpdated = () => {
      // Reload users if a user's activation status changed
      const loadUsers = async () => {
        try {
          const token = localStorage.getItem('userToken');
          const response = await axios.get('/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const allUsers = response.data.filter(u => u.isActivated);
          setTeachers(allUsers.filter(u => u.userType === 'teacher'));
          setStudents(allUsers.filter(u => u.userType === 'student'));
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      loadUsers();
    };

    const handleAccountStatusChanged = (data) => {
      // If account was activated, show modal
      if (data.isActivated) {
        setShowActivationModal(true);
      } else {
        // If account was deactivated, show alert and redirect
        setAccountStatusMessage(data.message);
        setIsActivationMessage(false);
        setTimeout(() => {
          setAccountStatusMessage(null);
        }, 5000);
        
        setTimeout(() => {
          alert('Your account has been deactivated. Please contact admin.');
          onLogout();
        }, 2000);
      }
    };

    const handleExamEligibilityChanged = (data) => {
      setIsExamEligible(data.isExamEligible);
      setAccountStatusMessage(data.message);
      // Show message for 5 seconds
      setTimeout(() => {
        setAccountStatusMessage(null);
      }, 5000);
    };

    socket.on('new-notification', handleNewNotification);
    socket.on('notification-updated', handleNotificationUpdated);
    socket.on('notification-deleted', handleNotificationDeleted);
    socket.on('user-activation-updated', handleUserActivationUpdated);
    socket.on('account-status-changed', handleAccountStatusChanged);
    socket.on('exam-eligibility-changed', handleExamEligibilityChanged);

    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.off('notification-updated', handleNotificationUpdated);
      socket.off('notification-deleted', handleNotificationDeleted);
      socket.off('user-activation-updated', handleUserActivationUpdated);
      socket.off('account-status-changed', handleAccountStatusChanged);
      socket.off('exam-eligibility-changed', handleExamEligibilityChanged);
    };
  }, [socket, user?._id, user?.id, joinUserRoom, onLogout]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    
    if (!showNotifications) {
      // Mark all as read when opening
      const readNotifications = notifications.map(n => n._id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      setUnreadCount(0);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageSubject.trim() || !messageText.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setMessageSending(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('/messages', {
        subject: messageSubject,
        message: messageText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Message sent successfully!');
      setMessageSubject('');
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setMessageSending(false);
    }
  };

  const handleDownloadPdf = (pdfUrl) => {
    // Open PDF in new tab (works for Google Drive links)
    window.open(pdfUrl, '_blank');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('userToken');
      
      // Reload all data
      const [usersRes, notificationsRes, quizStatusRes, eligibilityRes, examResultsRes, videosRes, notesRes] = await Promise.all([
        axios.get('/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/notifications', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/quiz/check-status', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/quiz/check-eligibility', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/exam-results', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/videos'),
        axios.get('/notes')
      ]);

      // Update all states
      const allUsers = usersRes.data.filter(u => u.isActivated);
      setTeachers(allUsers.filter(u => u.userType === 'teacher'));
      setStudents(allUsers.filter(u => u.userType === 'student'));
      setNotifications(notificationsRes.data);
      setQuizStatus(quizStatusRes.data);
      setIsExamEligible(eligibilityRes.data.isEligible);
      setExamResults(examResultsRes.data);
      setVideos(videosRes.data);
      setNotes(notesRes.data);
      setLoading(false);

      // Update unread count
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      const unread = notificationsRes.data.filter(n => !readNotifications.includes(n._id));
      setUnreadCount(unread.length);

      alert('All data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleActivationOk = () => {
    // Reload the page to reflect activation status
    window.location.reload();
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      {/* Activation Success Modal */}
      {showActivationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
              Great news! Your account has been successfully activated by the administrator.
              <br />
              Click OK to refresh and access all features.
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
      
      {/* Account Status Message */}
      {accountStatusMessage && (
        <div className="account-status-alert" style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: isActivationMessage ? '#4CAF50' : '#ff9800',
          color: 'white',
          padding: isActivationMessage ? '20px 40px' : '15px 30px',
          borderRadius: '12px',
          boxShadow: isActivationMessage 
            ? '0 8px 20px rgba(76, 175, 80, 0.4)' 
            : '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease-out',
          fontSize: isActivationMessage ? '18px' : '16px',
          fontWeight: isActivationMessage ? 'bold' : 'normal',
          textAlign: 'center',
          minWidth: isActivationMessage ? '400px' : '300px',
          border: isActivationMessage ? '3px solid #45a049' : 'none'
        }}>
          {isActivationMessage && (
            <div style={{ marginBottom: '8px', fontSize: '32px' }}>🎉</div>
          )}
          {accountStatusMessage}
        </div>
      )}
      
      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>Welcome, {user.firstName} {user.lastName}</h1>
              <p className="user-role">{user.userType === 'teacher' ? 'Teacher' : 'Student'} Dashboard</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleRefresh} 
                className="refresh-btn-user"
                disabled={isRefreshing}
                title="Refresh all data"
              >
                <FaSync className={isRefreshing ? 'spinning' : ''} />
                {isRefreshing ? ' Refreshing...' : ' Refresh'}
              </button>
              
              <div className="notification-container">
                <button onClick={handleNotificationClick} className="notification-btn">
                  <FaBell />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                
                {showNotifications && (
                  <div className="notification-popup">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="close-btn">×</button>
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <p className="no-notifications">No notifications</p>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification._id} className="notification-item">
                            <div className="notification-content">
                              <p className="notification-message">{notification.message}</p>
                              <span className="notification-time">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button onClick={onLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          <div className="user-profile-mini">
            <img src={user.photo} alt={user.firstName} className="mini-avatar" />
            <div className="mini-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.userType === 'teacher' ? user.email : `Roll No: ${user.rollNumber}, Class: ${user.class}`}</p>
            </div>
          </div>

          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <FaUser /> All Students
            </button>
            <button 
              className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <FaChalkboardTeacher /> All Teachers
            </button>
            <button 
              className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              <FaBook /> Study Material
            </button>
            <button 
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <FaChartBar /> Results
            </button>
            <button 
              className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
              onClick={() => setActiveTab('message')}
            >
              <FaEnvelope /> Message Admin
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === 'students' && (
              <div className="tab-panel">
                <h2><FaUsers /> All Students ({students.length})</h2>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : students.length === 0 ? (
                  <p className="no-data">No activated students yet</p>
                ) : (
                  <div className="scroll-container">
                    <div className="scroll-content scroll-left-to-right">
                      {students.map(student => (
                        <div key={student._id} className="user-card">
                          <img src={student.photo} alt={student.firstName} />
                          <h3>{student.firstName} {student.lastName}</h3>
                          <p className="user-detail">Roll No: {student.rollNumber}</p>
                          <p className="user-detail">Class: {student.class}</p>
                        </div>
                      ))}
                      {/* Duplicate for seamless loop */}
                      {students.map(student => (
                        <div key={`dup-${student._id}`} className="user-card">
                          <img src={student.photo} alt={student.firstName} />
                          <h3>{student.firstName} {student.lastName}</h3>
                          <p className="user-detail">Roll No: {student.rollNumber}</p>
                          <p className="user-detail">Class: {student.class}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className="tab-panel">
                <h2><FaChalkboardTeacher /> All Teachers ({teachers.length})</h2>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : teachers.length === 0 ? (
                  <p className="no-data">No activated teachers yet</p>
                ) : (
                  <div className="scroll-container">
                    <div className="scroll-content">
                      {teachers.map(teacher => (
                        <div key={teacher._id} className="user-card">
                          <img src={teacher.photo} alt={teacher.firstName} />
                          <h3>{teacher.firstName} {teacher.lastName}</h3>
                          <p className="user-detail">{teacher.email}</p>
                        </div>
                      ))}
                      {/* Duplicate for seamless loop */}
                      {teachers.map(teacher => (
                        <div key={`dup-${teacher._id}`} className="user-card">
                          <img src={teacher.photo} alt={teacher.firstName} />
                          <h3>{teacher.firstName} {teacher.lastName}</h3>
                          <p className="user-detail">{teacher.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="tab-panel">
                <h2><FaBook /> Study Materials</h2>
                
                {/* Material Navigation Tabs */}
                <div className="material-navigation">
                  <button 
                    className={`material-nav-btn ${materialTab === 'exam' ? 'active' : ''}`}
                    onClick={() => setMaterialTab('exam')}
                  >
                    <FaAward /> Quiz Exam
                  </button>
                  <button 
                    className={`material-nav-btn ${materialTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setMaterialTab('videos')}
                  >
                    <FaVideo /> Study Videos ({videos.length})
                  </button>
                  <button 
                    className={`material-nav-btn ${materialTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setMaterialTab('notes')}
                  >
                    <FaFilePdf /> Study Notes ({notes.length})
                  </button>
                </div>

                {/* Exam Section */}
                {materialTab === 'exam' && (
                  <div className="material-content-section">
                    <div className="material-card quiz-card-fullwidth">
                      <div className="material-icon-large">
                        <FaChartBar />
                      </div>
                      <h3>General Knowledge Quiz</h3>
                      {quizStatus && quizStatus.hasPassed ? (
                        <div className="quiz-passed-section">
                          <div className="passed-badge">
                            <FaAward className="badge-icon" />
                            <span>Passed with {quizStatus.percentage}%</span>
                          </div>
                          <p className="passed-text">
                            Congratulations! You've successfully passed the quiz.
                          </p>
                          <button 
                            onClick={() => navigate(`/certificate/${quizStatus.resultId}`)}
                            className="certificate-download-btn"
                          >
                            <FaDownload /> Download Certificate
                          </button>
                          <p className="retake-note">
                            Contact admin to reset and retake the exam.
                          </p>
                        </div>
                      ) : !isExamEligible ? (
                        <div className="not-eligible-section">
                          <p className="not-eligible-text">
                            You are not eligible to take the exam at this time. Please contact the administrator for more information.
                          </p>
                        </div>
                      ) : (
                        <>
                          <p>Test your knowledge with our comprehensive quiz exam. Pass with 60% or more to get a certificate!</p>
                          <button 
                            onClick={() => window.open('/quiz-exam', '_blank')} 
                            className="take-quiz-btn"
                          >
                            Take Exam
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {materialTab === 'videos' && (
                  <div className="material-content-section full-screen-section">
                    <div className="section-header-material">
                      <h3><FaVideo /> Study Videos Library</h3>
                      <p className="section-description">Watch educational videos to enhance your learning experience</p>
                    </div>
                    {videos.length === 0 ? (
                      <div className="empty-state-large">
                        <FaVideo className="empty-icon-large" />
                        <h3>No Videos Available Yet</h3>
                        <p>Study videos will appear here once added by the administrator. Check back soon!</p>
                      </div>
                    ) : (
                      <>
                        {/* Search Box */}
                        <div className="search-container-material">
                          <input
                            type="text"
                            placeholder="Search videos by title, description, or category..."
                            value={searchVideoQuery}
                            onChange={(e) => {
                              setSearchVideoQuery(e.target.value);
                              setVisibleVideoCount(10); // Reset count when searching
                            }}
                            className="search-input-material"
                          />
                          <FaVideo className="search-icon-material" />
                        </div>

                        <div className="videos-grid-fullscreen">
                          {(() => {
                            const filteredVideos = videos.filter(video => {
                              const searchLower = searchVideoQuery.toLowerCase();
                              return (
                                video.title.toLowerCase().includes(searchLower) ||
                                (video.description && video.description.toLowerCase().includes(searchLower)) ||
                                video.category.toLowerCase().includes(searchLower)
                              );
                            });

                            const displayedVideos = filteredVideos.slice(0, visibleVideoCount);

                            if (filteredVideos.length === 0) {
                              return (
                                <div className="empty-state-large">
                                  <FaVideo className="empty-icon-large" />
                                  <h3>No Videos Found</h3>
                                  <p>No videos match your search. Try different keywords.</p>
                                </div>
                              );
                            }

                            return (
                              <>
                                {displayedVideos.map((video) => (
                                  <div key={video._id} className="video-card-large">
                                    <div className="video-thumbnail">
                                      <iframe
                                        src={`https://www.youtube.com/embed/${video.videoId}?playsinline=1`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                        playsInline
                                      />
                                    </div>
                                    <div className="video-info">
                                      <h3>{video.title}</h3>
                                      {video.description && <p>{video.description}</p>}
                                      <span className="video-category">{video.category}</span>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Load More Button */}
                                {filteredVideos.length > visibleVideoCount && (
                                  <div className="load-more-container">
                                    <button
                                      onClick={() => setVisibleVideoCount(prev => prev + 10)}
                                      className="load-more-btn"
                                    >
                                      Load More Videos ({filteredVideos.length - visibleVideoCount} remaining)
                                    </button>
                                  </div>
                                )}

                                {/* Results Counter */}
                                <div className="results-counter">
                                  Showing {displayedVideos.length} of {filteredVideos.length} video(s)
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Notes Section */}
                {materialTab === 'notes' && (
                  <div className="material-content-section full-screen-section">
                    <div className="section-header-material">
                      <h3><FaFilePdf /> Study Notes Library</h3>
                      <p className="section-description">Download PDF notes for offline studying</p>
                    </div>
                    {notes.length === 0 ? (
                      <div className="empty-state-large">
                        <FaFilePdf className="empty-icon-large" />
                        <h3>No Study Notes Available Yet</h3>
                        <p>PDF study notes will appear here once uploaded by the administrator. Check back soon!</p>
                      </div>
                    ) : (
                      <>
                        {/* Search Box */}
                        <div className="search-container-material">
                          <input
                            type="text"
                            placeholder="Search notes by title, description, or category..."
                            value={searchNoteQuery}
                            onChange={(e) => {
                              setSearchNoteQuery(e.target.value);
                              setVisibleNoteCount(10); // Reset count when searching
                            }}
                            className="search-input-material"
                          />
                          <FaFilePdf className="search-icon-material" />
                        </div>

                        <div className="notes-grid-fullscreen">
                          {(() => {
                            const filteredNotes = notes.filter(note => {
                              const searchLower = searchNoteQuery.toLowerCase();
                              return (
                                note.title.toLowerCase().includes(searchLower) ||
                                (note.description && note.description.toLowerCase().includes(searchLower)) ||
                                note.category.toLowerCase().includes(searchLower)
                              );
                            });

                            const displayedNotes = filteredNotes.slice(0, visibleNoteCount);

                            if (filteredNotes.length === 0) {
                              return (
                                <div className="empty-state-large">
                                  <FaFilePdf className="empty-icon-large" />
                                  <h3>No Notes Found</h3>
                                  <p>No notes match your search. Try different keywords.</p>
                                </div>
                              );
                            }

                            return (
                              <>
                                {displayedNotes.map((note) => (
                                  <div key={note._id} className="note-card-large">
                                    <div className="note-icon">
                                      <FaFilePdf />
                                    </div>
                                    <div className="note-info">
                                      <h4>{note.title}</h4>
                                      {note.description && <p>{note.description}</p>}
                                      <span className="note-category">{note.category}</span>
                                    </div>
                                    <div className="note-footer">
                                      <button 
                                        onClick={() => handleDownloadPdf(note.pdfUrl)}
                                        className="download-note-btn"
                                      >
                                        <FaDownload /> View PDF
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {/* Load More Button */}
                                {filteredNotes.length > visibleNoteCount && (
                                  <div className="load-more-container">
                                    <button
                                      onClick={() => setVisibleNoteCount(prev => prev + 10)}
                                      className="load-more-btn"
                                    >
                                      Load More Notes ({filteredNotes.length - visibleNoteCount} remaining)
                                    </button>
                                  </div>
                                )}

                                {/* Results Counter */}
                                <div className="results-counter">
                                  Showing {displayedNotes.length} of {filteredNotes.length} note(s)
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="tab-panel">
                <h2><FaChartBar /> Exam Results & Performance</h2>
                {examResults.length === 0 ? (
                  <div className="empty-state">
                    <FaChartBar className="empty-icon" />
                    <h3>No Results Yet</h3>
                    <p>Exam results will appear here once the admin adds them.</p>
                  </div>
                ) : (
                  <>
                    <div className="filter-section">
                      <div className="class-filter">
                        <label>Select Class:</label>
                        <select
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="class-select"
                        >
                          <option value="All">All Classes</option>
                          <option value="Nursery">Nursery</option>
                          <option value="KG1">KG1</option>
                          <option value="KG2">KG2</option>
                          <option value="1">Class 1</option>
                          <option value="2">Class 2</option>
                          <option value="3">Class 3</option>
                          <option value="4">Class 4</option>
                          <option value="5">Class 5</option>
                          <option value="6">Class 6</option>
                          <option value="7">Class 7</option>
                          <option value="8">Class 8</option>
                          <option value="9">Class 9</option>
                          <option value="10">Class 10</option>
                        </select>
                      </div>
                      <div className="search-box-container">
                        <input
                          type="text"
                          placeholder="Search by student name..."
                          value={searchResultQuery}
                          onChange={(e) => setSearchResultQuery(e.target.value)}
                          className="search-input"
                        />
                      </div>
                    </div>
                    <div className="results-container">
                      {(() => {
                        const filteredResults = examResults.filter(result => {
                          const nameMatch = result.studentName.toLowerCase().includes(searchResultQuery.toLowerCase());
                          const classMatch = selectedClass === 'All' || result.class === selectedClass;
                          const isPublished = result.isPublished === true;
                          return nameMatch && classMatch && isPublished;
                        });

                        if (filteredResults.length === 0) {
                          return (
                            <div className="empty-state">
                              <FaChartBar className="empty-icon" />
                              <h3>No Results Found</h3>
                              <p>No results match the selected filters.</p>
                            </div>
                          );
                        }

                        return filteredResults.map((result) => (
                      <div key={result._id} className="result-card-student">
                        <div className="result-card-header">
                          <div className="student-info-header">
                            <h3>Exam Results</h3>
                            <div className="student-details">
                              <p><strong>Student Name:</strong> {result.studentName}</p>
                              <p><strong>Roll No:</strong> {result.rollNumber}</p>
                              <p><strong>Class:</strong> {result.class}</p>
                            </div>
                          </div>
                          <span className={`percentage-badge-large ${result.percentage >= 60 ? 'passed' : 'failed'}`}>
                            {result.percentage}%
                          </span>
                        </div>
                        
                        <div className="result-info">
                          <p><strong>Total Marks:</strong> {result.obtainedMarks} / {result.totalMarks}</p>
                          <p><strong>Exam Result Date:</strong> {new Date(result.examDate).toLocaleDateString()}</p>
                        </div>

                        <table className="student-result-table">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Marks Obtained</th>
                              <th>Max Marks</th>
                              <th>Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.subjects.map((subject, index) => (
                              <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.marks}</td>
                                <td>{subject.maxMarks}</td>
                                <td>{((subject.marks / subject.maxMarks) * 100).toFixed(2)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                        ));
                      })()}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'message' && (
              <div className="tab-panel">
                <h2><FaEnvelope /> Message to Admin</h2>
                <div className="message-form-container">
                  <div className="message-info-card">
                    <p>Send a message directly to the admin about any issues, questions, or feedback you have.</p>
                  </div>
                  <form onSubmit={handleSendMessage} className="message-form">
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <input
                        type="text"
                        id="subject"
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Enter message subject"
                        required
                        className="message-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Describe your issue or question..."
                        rows="8"
                        required
                        className="message-textarea"
                      />
                    </div>
                    <div className="message-form-actions">
                      <button 
                        type="submit" 
                        className="send-message-btn"
                        disabled={messageSending}
                      >
                        {messageSending ? (
                          <>
                            <span className="spinner"></span> Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane /> Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningDashboard;
