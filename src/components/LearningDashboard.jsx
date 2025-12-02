import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUsers, FaChalkboardTeacher, FaBook, FaChartBar, FaUser, FaBell, FaAward, FaDownload, FaVideo, FaFilePdf, FaEnvelope, FaPaperPlane, FaSync, FaClipboardCheck, FaCalendarAlt, FaCheck, FaTimes, FaMoneyBillWave, FaEye, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import { useSocket } from '../contexts/SocketContext.jsx';
import { MarkAttendanceModal, MyAttendanceModal, ViewAttendanceModal } from './AttendanceModals';
import { generateMarkCardPDF, generateProgressCardPDF } from '../utils/pdfGenerator';
import './LearningDashboard.css';

// Helper function to calculate grade based on percentage
const getGrade = (percentage) => {
  if (percentage >= 90) return 'A1';
  if (percentage >= 80) return 'A2';
  if (percentage >= 70) return 'B1';
  if (percentage >= 60) return 'B2';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  if (percentage >= 33) return 'E';
  return 'F';
};

const LearningDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [members, setMembers] = useState([]);
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
  // Attendance states
  const [attendance, setAttendance] = useState([]);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showMyAttendance, setShowMyAttendance] = useState(false);
  const [showViewAttendance, setShowViewAttendance] = useState(false);
  // Teacher attendance states
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [showMyTeacherAttendance, setShowMyTeacherAttendance] = useState(false);
  const [selectedTeacherYear, setSelectedTeacherYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Teacher exam result states
  const [showAddResult, setShowAddResult] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [resultFormData, setResultFormData] = useState({
    studentName: '',
    rollNumber: '',
    class: '',
    testType: '',
    subjects: [{ name: '', marks: 0, maxMarks: 100 }]
  });
  // Fees state
  const [studentFees, setStudentFees] = useState(null);
  // Progress Card state
  const [myProgressCard, setMyProgressCard] = useState(null);
  const [showProgressCardModal, setShowProgressCardModal] = useState(false);
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
        setMembers(allUsers.filter(u => u.userType === 'member'));
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

    const loadAttendance = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (user.userType === 'student') {
          // For students, load their own attendance
          const response = await axios.get(`/attendance/student/${user.id || user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttendance(response.data);
        } else {
          // For teachers, load all attendance (they might need to see it)
          const response = await axios.get('/attendance', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttendance(response.data);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    const loadFees = async () => {
      try {
        if (user.userType === 'student') {
          const token = localStorage.getItem('userToken');
          const response = await axios.get(`/fees/student/${user.id || user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStudentFees(response.data);
        }
      } catch (error) {
        console.error('Error fetching fees:', error);
      }
    };

    const loadMyProgressCard = async () => {
      try {
        if (user.userType === 'student') {
          const token = localStorage.getItem('userToken');
          const response = await axios.get('/my-progress-card', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyProgressCard(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching progress card:', error);
        // No progress card or not published - that's okay
        setMyProgressCard(null);
      }
    };

    const loadTeacherAttendance = async () => {
      try {
        if (user.userType === 'teacher') {
          const token = localStorage.getItem('userToken');
          const response = await axios.get(`/teacher-attendance/teacher/${user.id || user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTeacherAttendance(response.data);
        }
      } catch (error) {
        console.error('Error fetching teacher attendance:', error);
      }
    };

    loadUsers();
    loadNotifications();
    loadQuizStatus();
    loadExamResults();
    loadVideos();
    loadNotes();
    loadAttendance();
    loadFees();
    loadMyProgressCard();
    loadTeacherAttendance();

    // Check for mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    
    // Refresh the whole page
    window.location.reload();
  };

  const handleActivationOk = () => {
    // Reload the page to reflect activation status
    window.location.reload();
  };

  // Teacher Exam Result Handlers
  const handleAddSubject = () => {
    setResultFormData({
      ...resultFormData,
      subjects: [...resultFormData.subjects, { name: '', marks: 0, maxMarks: 100 }]
    });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = resultFormData.subjects.filter((_, i) => i !== index);
    setResultFormData({ ...resultFormData, subjects: newSubjects });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...resultFormData.subjects];
    newSubjects[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setResultFormData({ ...resultFormData, subjects: newSubjects });
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    
    if (!resultFormData.studentName.trim() || !resultFormData.rollNumber.trim() || !resultFormData.class.trim()) {
      alert('Please fill in Student Name, Roll Number, and Class');
      return;
    }

    if (!resultFormData.testType.trim()) {
      alert('Please select Type of Test');
      return;
    }

    if (resultFormData.subjects.some(s => !s.name.trim())) {
      alert('Please fill in all subject names');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      
      if (editingResult) {
        // Update existing result
        await axios.put(`/exam-results/${editingResult}`, resultFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Exam result updated successfully!');
      } else {
        // Add new result
        await axios.post('/exam-results', resultFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Exam result added successfully!');
      }
      
      setShowAddResult(false);
      setEditingResult(null);
      setResultFormData({
        studentName: '',
        rollNumber: '',
        class: '',
        testType: '',
        subjects: [{ name: '', marks: 0, maxMarks: 100 }]
      });
      
      // Reload exam results
      const response = await axios.get('/exam-results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExamResults(response.data);
    } catch (error) {
      console.error('Error saving result:', error);
      alert(error.response?.data?.message || 'Failed to save result');
    }
  };

  const handleEditResult = (result) => {
    setEditingResult(result._id);
    setResultFormData({
      studentName: result.studentName,
      rollNumber: result.rollNumber,
      class: result.class,
      testType: result.testType || '',
      subjects: result.subjects.map(s => ({ ...s }))
    });
    setShowAddResult(true);
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`/exam-results/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Result deleted successfully!');
      
      // Reload exam results
      const response = await axios.get('/exam-results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExamResults(response.data);
    } catch (error) {
      console.error('Error deleting result:', error);
      alert('Failed to delete result');
    }
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
              <p className="user-role">{user.userType === 'teacher' ? 'Teacher' : user.userType === 'member' ? 'Member' : 'Student'} Dashboard</p>
            </div>
            <div className="header-actions">
              {user.userType === 'teacher' && (
                <button 
                  onClick={() => setShowMarkAttendance(true)} 
                  className="attendance-btn"
                  title="Mark student attendance"
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    marginRight: '0.5rem'
                  }}
                >
                  <FaClipboardCheck /> Mark Attendance
                </button>
              )}
              
              {user.userType === 'student' && (
                <button 
                  onClick={() => setShowMyAttendance(true)} 
                  className="attendance-btn"
                  title="View my attendance"
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#764ba2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    marginRight: '0.5rem'
                  }}
                >
                  <FaCalendarAlt /> My Attendance
                </button>
              )}
              
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
              <p>
                {user.userType === 'teacher' || user.userType === 'member' 
                  ? user.email 
                  : `Roll No: ${user.rollNumber}, Class: ${user.class}`
                }
              </p>
            </div>
            {user.userType === 'teacher' && (
              <>
                <button
                  onClick={() => setShowAddResult(true)}
                  className="add-result-btn"
                  title="Add student exam result"
                  style={{
                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                    backgroundColor: '#764ba2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    marginLeft: 'auto',
                    marginRight: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(118, 75, 162, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 75, 162, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(118, 75, 162, 0.3)';
                  }}
                >
                  <FaChartBar /> {isMobile ? 'Add Result' : 'Add Student Exam Result'}
                </button>
                <button
                  onClick={() => setShowMyTeacherAttendance(true)}
                  className="view-my-attendance-btn"
                  title="View my attendance"
                  style={{
                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    marginRight: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(243, 156, 18, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(243, 156, 18, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(243, 156, 18, 0.3)';
                  }}
                >
                  <FaClipboardCheck /> {isMobile ? 'My Attendance' : 'View My Attendance'}
                </button>
                <button
                  onClick={() => setShowViewAttendance(true)}
                  className="view-attendance-btn"
                  title="View student attendance"
                  style={{
                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <FaEye /> {isMobile ? 'Attendance' : 'View Student Attendance'}
                </button>
              </>
            )}
            {user.userType === 'student' && studentFees && (
              <div className="fees-info" style={{
                display: 'flex',
                gap: '1rem',
                marginLeft: 'auto',
                alignItems: 'center'
              }}>
                {studentFees.totalFees === 0 ? (
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6c757d', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaMoneyBillWave /> Fees not declared yet
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Fees Description */}
                    {studentFees.transactions && studentFees.transactions.length > 0 && studentFees.transactions[studentFees.transactions.length - 1].description && (
                      <div style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        border: '2px solid #ffc107',
                        minWidth: '400px',
                        maxWidth: '600px'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#856404', marginBottom: '0.5rem', fontWeight: '600' }}>Message from Admin</div>
                        <div style={{ fontSize: '0.95rem', color: '#856404', lineHeight: '1.5' }}>
                          {studentFees.transactions[studentFees.transactions.length - 1].description}
                        </div>
                      </div>
                    )}
                    <div style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>Total Fees</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaMoneyBillWave /> ₹{studentFees.totalFees}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#d4edda',
                      borderRadius: '8px',
                      border: '2px solid #c3e6cb'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#155724', marginBottom: '0.25rem' }}>Deposit</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#155724', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaMoneyBillWave /> ₹{studentFees.deposit}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8d7da',
                      borderRadius: '8px',
                      border: '2px solid #f5c6cb'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#721c24', marginBottom: '0.25rem' }}>Dues</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaMoneyBillWave /> ₹{Math.max(0, studentFees.dues)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {user.userType === 'student' && myProgressCard && (
              <button
                onClick={() => setShowProgressCardModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  whiteSpace: 'nowrap',
                  marginLeft: '1rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                }}
                title="View your progress card"
              >
                <FaChartBar /> My Progress Card
              </button>
            )}
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
            {user.userType === 'member' && (
              <button 
                className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                <FaUsers /> All Members
              </button>
            )}
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

            {activeTab === 'members' && user.userType === 'member' && (
              <div className="tab-panel">
                <h2><FaUsers /> All Members ({members.length})</h2>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : members.length === 0 ? (
                  <p className="no-data">No activated members yet</p>
                ) : (
                  <div className="scroll-container">
                    <div className="scroll-content">
                      {members.map(member => (
                        <div key={member._id} className="user-card">
                          <img src={member.photo} alt={member.firstName} />
                          <h3>{member.firstName} {member.lastName}</h3>
                          <p className="user-detail">{member.email}</p>
                        </div>
                      ))}
                      {/* Duplicate for seamless loop */}
                      {members.map(member => (
                        <div key={`dup-${member._id}`} className="user-card">
                          <img src={member.photo} alt={member.firstName} />
                          <h3>{member.firstName} {member.lastName}</h3>
                          <p className="user-detail">{member.email}</p>
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
                                        src={(() => {
                                          if (video.videoType === 'drive' && video.videoId) {
                                            return `https://drive.google.com/file/d/${video.videoId}/preview`;
                                          } else if (video.videoId) {
                                            return `https://www.youtube.com/embed/${video.videoId}?playsinline=1`;
                                          }
                                          return '';
                                        })()}
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
                                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span className="video-category">{video.category}</span>
                                      </div>
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
                    <p>Exam results will appear here once {user.userType === 'teacher' ? 'you add them' : 'the admin adds them'}.</p>
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
                          // For teachers, show all results. For students/members, show only published
                          const isVisible = user.userType === 'teacher' ? true : result.isPublished === true;
                          return nameMatch && classMatch && isVisible;
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
                            <h3 style={{ color: '#667eea', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                              {result.testType || 'Exam Results'}
                            </h3>
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
                          <p><strong>Grade:</strong> {getGrade(result.percentage)}</p>
                          <p><strong>Percentage:</strong> {result.percentage}%</p>
                          <p><strong>Exam Result Date:</strong> {new Date(result.examDate).toLocaleDateString()}</p>
                          {user.userType === 'teacher' && (
                            <p><strong>Status:</strong> <span style={{ 
                              color: result.isPublished ? '#28a745' : '#ffc107',
                              fontWeight: '600'
                            }}>{result.isPublished ? 'Published' : 'Not Published'}</span></p>
                          )}
                        </div>

                        <table className="student-result-table">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Marks Obtained</th>
                              <th>Max Marks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.subjects.map((subject, index) => (
                              <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.marks}</td>
                                <td>{subject.maxMarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {user.userType === 'teacher' && (
                            <>
                              <button
                                onClick={() => handleEditResult(result)}
                                className="action-btn"
                                style={{
                                  backgroundColor: '#ffa751',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(255, 167, 81, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(255, 167, 81, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 2px 8px rgba(255, 167, 81, 0.3)';
                                }}
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteResult(result._id)}
                                className="action-btn"
                                style={{
                                  backgroundColor: '#ff5f6d',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(255, 95, 109, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(255, 95, 109, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 2px 8px rgba(255, 95, 109, 0.3)';
                                }}
                              >
                                <FaTrash /> Delete
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => generateMarkCardPDF(result)}
                            className="action-btn"
                            style={{
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              padding: '0.8rem 1.5rem',
                              fontSize: '1rem',
                              fontWeight: '600',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(23, 162, 184, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(23, 162, 184, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(23, 162, 184, 0.3)';
                            }}
                          >
                            <FaDownload /> Download Mark Sheet
                          </button>
                        </div>
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

      {/* Attendance Modals */}
      {showMarkAttendance && user.userType === 'teacher' && (
        <MarkAttendanceModal
          students={students}
          onClose={() => setShowMarkAttendance(false)}
          onSuccess={() => {
            // Reload attendance data
            const loadAttendance = async () => {
              try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get('/attendance', {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setAttendance(response.data);
              } catch (error) {
                console.error('Error fetching attendance:', error);
              }
            };
            loadAttendance();
          }}
        />
      )}

      {showMyAttendance && user.userType === 'student' && (
        <MyAttendanceModal
          user={user}
          attendance={attendance}
          onClose={() => setShowMyAttendance(false)}
        />
      )}

      {showViewAttendance && user.userType === 'teacher' && (
        <ViewAttendanceModal
          students={students}
          attendance={attendance}
          onClose={() => setShowViewAttendance(false)}
        />
      )}

      {/* Teacher Attendance Modal */}
      {showMyTeacherAttendance && user.userType === 'teacher' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaClipboardCheck /> My Attendance Records
              </h2>
              <button
                onClick={() => setShowMyTeacherAttendance(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {teacherAttendance.length === 0 ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: '#6c757d',
                fontSize: '1.1rem'
              }}>
                <FaClipboardCheck style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                <p>No attendance records found</p>
              </div>
            ) : (
              <>
                {/* Year Selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ marginRight: '1rem', fontWeight: '600' }}>Year:</label>
                  <select
                    value={selectedTeacherYear}
                    onChange={(e) => setSelectedTeacherYear(parseInt(e.target.value))}
                    style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>

                {/* Summary Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#d4edda',
                    borderRadius: '10px',
                    border: '2px solid #c3e6cb',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#155724', marginBottom: '0.5rem', fontWeight: '600' }}>Total Present</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                      {teacherAttendance.filter(a => {
                        const recordYear = new Date(a.date).getFullYear();
                        return recordYear === selectedTeacherYear && a.status === 'present';
                      }).length}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    borderRadius: '10px',
                    border: '2px solid #f5c6cb',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#721c24', marginBottom: '0.5rem', fontWeight: '600' }}>Total Absent</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                      {teacherAttendance.filter(a => {
                        const recordYear = new Date(a.date).getFullYear();
                        return recordYear === selectedTeacherYear && a.status === 'absent';
                      }).length}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#d1ecf1',
                    borderRadius: '10px',
                    border: '2px solid #bee5eb',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#0c5460', marginBottom: '0.5rem', fontWeight: '600' }}>Total Days</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                      {teacherAttendance.filter(a => {
                        const recordYear = new Date(a.date).getFullYear();
                        return recordYear === selectedTeacherYear;
                      }).length}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '10px',
                    border: '2px solid #ffeeba',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#856404', marginBottom: '0.5rem', fontWeight: '600' }}>Attendance %</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
                      {(() => {
                        const yearRecords = teacherAttendance.filter(a => {
                          const recordYear = new Date(a.date).getFullYear();
                          return recordYear === selectedTeacherYear;
                        });
                        const presentCount = yearRecords.filter(a => a.status === 'present').length;
                        return yearRecords.length > 0
                          ? ((presentCount / yearRecords.length) * 100).toFixed(1)
                          : 0;
                      })()}%
                    </div>
                  </div>
                </div>

                {/* Calendar View */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Attendance Calendar</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[...Array(12)].map((_, monthIndex) => {
                      const monthDate = new Date(selectedTeacherYear, monthIndex, 1);
                      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
                      const daysInMonth = new Date(selectedTeacherYear, monthIndex + 1, 0).getDate();
                      const firstDayOfMonth = new Date(selectedTeacherYear, monthIndex, 1).getDay();

                      return (
                        <div key={monthIndex} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem' }}>
                          <h4 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>{monthName}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', fontSize: '11px' }}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                              <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666', padding: '4px' }}>{day}</div>
                            ))}
                            {[...Array(firstDayOfMonth)].map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {[...Array(daysInMonth)].map((_, dayIndex) => {
                              const day = dayIndex + 1;
                              const dateStr = new Date(selectedTeacherYear, monthIndex, day);
                              
                              const attendanceRecord = teacherAttendance.find(a => 
                                new Date(a.date).toDateString() === dateStr.toDateString()
                              );

                              let bgColor = 'transparent';
                              if (attendanceRecord) {
                                bgColor = attendanceRecord.status === 'present' ? '#4CAF50' : '#f44336';
                              }

                              return (
                                <div
                                  key={day}
                                  style={{
                                    textAlign: 'center',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: bgColor,
                                    color: bgColor !== 'transparent' ? 'white' : '#333',
                                    fontWeight: bgColor !== 'transparent' ? 'bold' : 'normal',
                                    fontSize: '11px'
                                  }}
                                  title={attendanceRecord ? `${attendanceRecord.status === 'present' ? 'Present' : 'Absent'} - ${new Date(attendanceRecord.date).toLocaleDateString()}` : 'No record'}
                                >
                                  {day}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#4CAF50', borderRadius: '3px' }} />
                      <span style={{ fontSize: '0.9rem' }}>Present</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '15px', height: '15px', backgroundColor: '#f44336', borderRadius: '3px' }} />
                      <span style={{ fontSize: '0.9rem' }}>Absent</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => setShowMyTeacherAttendance(false)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Result Modal for Teachers */}
      {showAddResult && user.userType === 'teacher' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaChartBar /> {editingResult ? 'Edit' : 'Add'} Student Exam Result
            </h2>

            <form onSubmit={handleSubmitResult}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Student Name *</label>
                  <input
                    type="text"
                    value={resultFormData.studentName}
                    onChange={(e) => setResultFormData({ ...resultFormData, studentName: e.target.value })}
                    placeholder="Enter student name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Roll Number *</label>
                  <input
                    type="text"
                    value={resultFormData.rollNumber}
                    onChange={(e) => setResultFormData({ ...resultFormData, rollNumber: e.target.value })}
                    placeholder="Enter roll number"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Class *</label>
                  <select
                    value={resultFormData.class}
                    onChange={(e) => setResultFormData({ ...resultFormData, class: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Class</option>
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
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Type of Test *</label>
                  <input
                    type="text"
                    value={resultFormData.testType}
                    onChange={(e) => setResultFormData({ ...resultFormData, testType: e.target.value })}
                    placeholder="e.g., Mid Term, Final Exam, Unit Test"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#2c3e50', fontSize: '1.2rem' }}>Subject Marks</h3>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <FaPlus /> Add Subject
                  </button>
                </div>

                {resultFormData.subjects.map((subject, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Marks Obtained"
                      value={subject.marks}
                      onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                      min="0"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max Marks"
                      value={subject.maxMarks}
                      onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)}
                      min="1"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    {resultFormData.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddResult(false);
                    setEditingResult(null);
                    setResultFormData({
                      studentName: '',
                      rollNumber: '',
                      class: '',
                      testType: '',
                      subjects: [{ name: '', marks: 0, maxMarks: 100 }]
                    });
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #6c757d',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#6c757d',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaCheck /> {editingResult ? 'Update' : 'Submit'} Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Card Modal */}
      {showProgressCardModal && myProgressCard && (
        <div className="progress-card-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div className="progress-card-modal-content" style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="progress-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>My Progress Card</h2>
              <div className="progress-card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => generateProgressCardPDF(myProgressCard)}
                  className="progress-card-btn"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaDownload /> Download PDF
                </button>
                <button
                  onClick={() => setShowProgressCardModal(false)}
                  className="progress-card-btn"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <FaTimes /> Close
                </button>
              </div>
            </div>

            {/* Progress Card Display */}
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '10px' }}>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>{myProgressCard.year || 'Academic Year'}</h3>
                <div className="progress-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong>Student Name:</strong> {myProgressCard.studentName}
                  </div>
                  <div>
                    <strong>Roll No:</strong> {myProgressCard.rollNumber}
                  </div>
                  <div>
                    <strong>Class:</strong> {myProgressCard.class}
                  </div>
                  <div>
                    <strong>Aadhaar:</strong> {myProgressCard.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="progress-table-container" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table className="progress-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Subject</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>1st Unit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>2nd Unit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Half Yearly</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>3rd Unit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Annual</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProgressCard.subjects.map((subject, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: '600' }}>{subject.name}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{subject.test1Marks}/{subject.test1FM}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{subject.test2Marks}/{subject.test2FM}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{subject.halfYearlyMarks}/{subject.halfYearlyFM}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{subject.test3Marks}/{subject.test3FM}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{subject.annualMarks}/{subject.annualFM}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontStyle: 'italic' }}>{subject.remarks || '-'}</td>
                      </tr>
                    ))}
                    {(() => {
                      const test1Total = myProgressCard.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
                      const test1FM = myProgressCard.subjects.reduce((sum, s) => sum + s.test1FM, 0);
                      const test2Total = myProgressCard.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
                      const test2FM = myProgressCard.subjects.reduce((sum, s) => sum + s.test2FM, 0);
                      const halfYearlyTotal = myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
                      const halfYearlyFM = myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
                      const test3Total = myProgressCard.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
                      const test3FM = myProgressCard.subjects.reduce((sum, s) => sum + s.test3FM, 0);
                      const annualTotal = myProgressCard.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
                      const annualFM = myProgressCard.subjects.reduce((sum, s) => sum + s.annualFM, 0);
                      
                      return (
                        <tr style={{ background: '#f8f9fa', fontWeight: 'bold', borderTop: '3px solid #667eea' }}>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>GRAND TOTAL</td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', color: '#667eea' }}>
                            {test1Total}/{test1FM}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', color: '#667eea' }}>
                            {test2Total}/{test2FM}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', color: '#667eea' }}>
                            {halfYearlyTotal}/{halfYearlyFM}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', color: '#667eea' }}>
                            {test3Total}/{test3FM}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', color: '#667eea' }}>
                            {annualTotal}/{annualFM}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#495057', fontStyle: 'italic' }}>
                            {myProgressCard.remarks || ''}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Attendance Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>Attendance</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Exam</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Total Working Days</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Days Present</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: '600' }}>Half Yearly</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{myProgressCard.halfYearlyWorkingDays || 0}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{myProgressCard.halfYearlyDaysPresent || 0}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                        {myProgressCard.halfYearlyWorkingDays > 0 
                          ? ((myProgressCard.halfYearlyDaysPresent / myProgressCard.halfYearlyWorkingDays) * 100).toFixed(2) 
                          : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: '600' }}>Annual</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{myProgressCard.annualWorkingDays || 0}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>{myProgressCard.annualDaysPresent || 0}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                        {myProgressCard.annualWorkingDays > 0 
                          ? ((myProgressCard.annualDaysPresent / myProgressCard.annualWorkingDays) * 100).toFixed(2) 
                          : 0}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Test-wise Performance */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>Test-wise Performance</h4>
                <div className="progress-test-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div className="progress-test-card" style={{ padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'center', border: '2px solid #e9ecef' }}>
                    <div className="progress-test-label" style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>1st Unit Test</div>
                    <div className="progress-test-marks" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test1Marks, 0)}/
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test1FM, 0)}
                    </div>
                    <div className="progress-test-grade" style={{ fontSize: '0.75rem', color: '#28a745', marginTop: '0.25rem' }}>
                      {(() => {
                        const percentage = (myProgressCard.subjects.reduce((sum, s) => sum + s.test1Marks, 0) / 
                          myProgressCard.subjects.reduce((sum, s) => sum + s.test1FM, 0)) * 100;
                        const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' : 
                                     percentage >= 61 ? 'B2' : percentage >= 51 ? 'C' : percentage >= 33 ? 'D' : 'E';
                        return `${percentage.toFixed(1)}% (${grade})`;
                      })()}
                    </div>
                  </div>
                  <div className="progress-test-card" style={{ padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'center', border: '2px solid #e9ecef' }}>
                    <div className="progress-test-label" style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>2nd Unit Test</div>
                    <div className="progress-test-marks" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test2Marks, 0)}/
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test2FM, 0)}
                    </div>
                    <div className="progress-test-grade" style={{ fontSize: '0.75rem', color: '#28a745', marginTop: '0.25rem' }}>
                      {(() => {
                        const percentage = (myProgressCard.subjects.reduce((sum, s) => sum + s.test2Marks, 0) / 
                          myProgressCard.subjects.reduce((sum, s) => sum + s.test2FM, 0)) * 100;
                        const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' : 
                                     percentage >= 61 ? 'B2' : percentage >= 51 ? 'C' : percentage >= 33 ? 'D' : 'E';
                        return `${percentage.toFixed(1)}% (${grade})`;
                      })()}
                    </div>
                  </div>
                  <div className="progress-test-card" style={{ padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'center', border: '2px solid #e9ecef' }}>
                    <div className="progress-test-label" style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>Half Yearly</div>
                    <div className="progress-test-marks" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0)}/
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0)}
                    </div>
                    <div className="progress-test-grade" style={{ fontSize: '0.75rem', color: '#28a745', marginTop: '0.25rem' }}>
                      {(() => {
                        const percentage = (myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0) / 
                          myProgressCard.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0)) * 100;
                        const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' : 
                                     percentage >= 61 ? 'B2' : percentage >= 51 ? 'C' : percentage >= 33 ? 'D' : 'E';
                        return `${percentage.toFixed(1)}% (${grade})`;
                      })()}
                    </div>
                  </div>
                  <div className="progress-test-card" style={{ padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'center', border: '2px solid #e9ecef' }}>
                    <div className="progress-test-label" style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>3rd Unit Test</div>
                    <div className="progress-test-marks" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test3Marks, 0)}/
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.test3FM, 0)}
                    </div>
                    <div className="progress-test-grade" style={{ fontSize: '0.75rem', color: '#28a745', marginTop: '0.25rem' }}>
                      {(() => {
                        const percentage = (myProgressCard.subjects.reduce((sum, s) => sum + s.test3Marks, 0) / 
                          myProgressCard.subjects.reduce((sum, s) => sum + s.test3FM, 0)) * 100;
                        const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' : 
                                     percentage >= 61 ? 'B2' : percentage >= 51 ? 'C' : percentage >= 33 ? 'D' : 'E';
                        return `${percentage.toFixed(1)}% (${grade})`;
                      })()}
                    </div>
                  </div>
                  <div className="progress-test-card" style={{ padding: '1rem', background: 'white', borderRadius: '8px', textAlign: 'center', border: '2px solid #e9ecef' }}>
                    <div className="progress-test-label" style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>Annual Exam</div>
                    <div className="progress-test-marks" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.annualMarks, 0)}/
                      {myProgressCard.subjects.reduce((sum, s) => sum + s.annualFM, 0)}
                    </div>
                    <div className="progress-test-grade" style={{ fontSize: '0.75rem', color: '#28a745', marginTop: '0.25rem' }}>
                      {(() => {
                        const percentage = (myProgressCard.subjects.reduce((sum, s) => sum + s.annualMarks, 0) / 
                          myProgressCard.subjects.reduce((sum, s) => sum + s.annualFM, 0)) * 100;
                        const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' : 
                                     percentage >= 61 ? 'B2' : percentage >= 51 ? 'C' : percentage >= 33 ? 'D' : 'E';
                        return `${percentage.toFixed(1)}% (${grade})`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Performance */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', color: '#6c757d', marginBottom: '0.5rem' }}>Promotion Status</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: myProgressCard.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545' }}>
                    {myProgressCard.promotionStatus === 'Promoted' ? '✓ Promoted' : '✗ Not Promoted'}
                  </div>
                </div>
              </div>

              {/* Grading Scale */}
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
                <h4 style={{ color: '#667eea', marginBottom: '0.75rem', textAlign: 'center' }}>Grading Scale</h4>
                <div className="progress-grading-scale" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#28a745' }}>A1</strong> : 91-100%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#28a745' }}>A2</strong> : 81-90%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#17a2b8' }}>B1</strong> : 71-80%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#17a2b8' }}>B2</strong> : 61-70%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#ffc107' }}>C</strong> : 51-60%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#dc3545' }}>D</strong> : 33-50%
                  </div>
                  <div className="progress-grading-item" style={{ padding: '0.5rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
                    <strong style={{ color: '#dc3545' }}>E</strong> : Below 33%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningDashboard;
