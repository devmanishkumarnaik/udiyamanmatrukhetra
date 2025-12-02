import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaUsers, FaEnvelope, FaChartLine, FaChalkboardTeacher, FaEdit, FaTrash, 
  FaCheck, FaTimes, FaBell, FaPaperPlane, FaPlus, FaAward, FaTachometerAlt, 
  FaUserGraduate, FaQuestionCircle, FaChartBar, FaCommentAlt, FaVideo, FaFilePdf, FaDownload, FaSync,
  FaImages, FaMusic, FaImage, FaUpload, FaClock, FaCamera, FaFileAlt, FaClipboard, FaEye, FaMoneyBillWave,
  FaCalendarAlt
} from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Popup from './Popup';
import ConfirmPopup from './ConfirmPopup';
import { useSocket } from '../contexts/SocketContext.jsx';
import { generateMarkCardPDF, generateProgressCardPDF } from '../utils/pdfGenerator';
import './AdminDashboard.css';
import './AdminDashboard.premium.css';

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

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: 1
  });
  const [quizResults, setQuizResults] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultFormData, setResultFormData] = useState({
    studentName: '',
    rollNumber: '',
    class: '',
    testType: '',
    subjects: [{ name: '', marks: 0, maxMarks: 100 }]
  });
  const [editingResult, setEditingResult] = useState(null);
  const [searchResultQuery, setSearchResultQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchTeacherQuery, setSearchTeacherQuery] = useState('');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    category: 'General'
  });
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteFormData, setNoteFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    pdfUrl: ''
  });
  const [searchAdminVideoQuery, setSearchAdminVideoQuery] = useState('');
  const [visibleAdminVideoCount, setVisibleAdminVideoCount] = useState(10);
  const [searchAdminNoteQuery, setSearchAdminNoteQuery] = useState('');
  const [visibleAdminNoteCount, setVisibleAdminNoteCount] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryMedia, setEditingGalleryMedia] = useState(null);
  const [galleryFormData, setGalleryFormData] = useState({
    type: 'image',
    title: '',
    description: '',
    url: '',
    thumbnail: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchGalleryQuery, setSearchGalleryQuery] = useState('');
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(10);
  const [activeExamSession, setActiveExamSession] = useState(null);
  const [startingExam, setStartingExam] = useState(false);
  const [showExamTimerModal, setShowExamTimerModal] = useState(false);
  const [examDuration, setExamDuration] = useState(60); // Default 60 minutes
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    description: '',
    fileType: '',
    fileUrl: '',
    fileName: ''
  });
  const [uploadingNoticeImage, setUploadingNoticeImage] = useState(false);
  const [noticeImagePreview, setNoticeImagePreview] = useState(null);
  // Attendance states
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({ name: '', class: '' });
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedAttendanceClass, setSelectedAttendanceClass] = useState('All');
  const [attendanceCalendarStudent, setAttendanceCalendarStudent] = useState(null);
  const [showAttendanceCalendar, setShowAttendanceCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);
  // Teacher Attendance states
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [selectedTeacherAttendanceDate, setSelectedTeacherAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTeacherAttendanceCalendar, setShowTeacherAttendanceCalendar] = useState(false);
  const [attendanceCalendarTeacher, setAttendanceCalendarTeacher] = useState(null);
  const [selectedTeacherYear, setSelectedTeacherYear] = useState(new Date().getFullYear());
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const [confirmPopup, setConfirmPopup] = useState({ message: '', show: false, onConfirm: null });
  // Fees states
  const [fees, setFees] = useState([]);
  const [selectedFeesClass, setSelectedFeesClass] = useState('All');
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feesFormData, setFeesFormData] = useState({
    totalFees: 0,
    deposit: 0,
    description: ''
  });
  const [searchFeesQuery, setSearchFeesQuery] = useState('');
  const [publicTeachers, setPublicTeachers] = useState([]);
  const [publicMembers, setPublicMembers] = useState([]);
  const [searchPublicMemberQuery, setSearchPublicMemberQuery] = useState('');
  const [showPublicTeacherForm, setShowPublicTeacherForm] = useState(false);
  const [showPublicMemberForm, setShowPublicMemberForm] = useState(false);
  const [searchPublicTeacherQuery, setSearchPublicTeacherQuery] = useState('');
  const [publicTeacherFormData, setPublicTeacherFormData] = useState({
    name: '',
    subject: '',
    qualification: '',
    experience: '',
    gmail: '',
    mobile: '',
    image: ''
  });
  const [publicMemberFormData, setPublicMemberFormData] = useState({
    name: '',
    designation: '',
    gmail: '',
    phone: '',
    image: ''
  });
  const [editingPublicTeacher, setEditingPublicTeacher] = useState(null);
  const [editingPublicMember, setEditingPublicMember] = useState(null);
  const [uploadingPublicTeacherImage, setUploadingPublicTeacherImage] = useState(false);
  const [uploadingPublicMemberImage, setUploadingPublicMemberImage] = useState(false);
  // Progress Card states
  const [progressCards, setProgressCards] = useState([]);
  const [showProgressCardForm, setShowProgressCardForm] = useState(false);
  const [progressCardFormData, setProgressCardFormData] = useState({
    class: '',
    studentId: '',
    studentName: '',
    rollNumber: '',
    aadhaarNumber: '',
    fatherName: '',
    motherName: '',
    subjects: [],
    remarks: ''
  });
  const [editingProgressCard, setEditingProgressCard] = useState(null);
  const [searchProgressCardQuery, setSearchProgressCardQuery] = useState('');
  const [selectedProgressClass, setSelectedProgressClass] = useState('All');
  const navigate = useNavigate();
  const { socket, isConnected, joinAdminRoom, on, off } = useSocket();

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type, show: true });
  };

  const closePopup = () => {
    setPopup({ message: '', type: '', show: false });
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmPopup({ message, show: true, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmPopup({ message: '', show: false, onConfirm: null });
  };

  const handleConfirm = () => {
    if (confirmPopup.onConfirm) {
      confirmPopup.onConfirm();
    }
    closeConfirm();
  };

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin/login');
      return () => window.removeEventListener('resize', checkMobile);
    }

    const loadMessages = async () => {
      try {
        const response = await axios.get('/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const loadUsers = async () => {
      try {
        const response = await axios.get('/users');
        const teachersList = response.data.filter(user => user.userType === 'teacher');
        const studentsList = response.data.filter(user => user.userType === 'student');
        const membersList = response.data.filter(user => user.userType === 'member');
        setTeachers(teachersList);
        setStudents(studentsList);
        setMembers(membersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const loadNotifications = async () => {
      try {
        const response = await axios.get('/admin/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const loadQuizQuestions = async () => {
      try {
        const response = await axios.get('/admin/quiz/questions');
        setQuizQuestions(response.data);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    const loadQuizResults = async () => {
      try {
        const response = await axios.get('/admin/quiz/results');
        setQuizResults(response.data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    const loadExamResults = async () => {
      try {
        const response = await axios.get('/exam-results');
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

    const loadGalleryMedia = async () => {
      try {
        const response = await axios.get('/gallery');
        setGalleryMedia(response.data);
      } catch (error) {
        console.error('Error fetching gallery media:', error);
      }
    };

    const loadActiveExamSession = async () => {
      try {
        const response = await axios.get('/exam-session/active');
        if (response.data.isActive) {
          setActiveExamSession(response.data.session);
        }
      } catch (error) {
        console.error('Error fetching active exam session:', error);
      }
    };

    const loadNotices = async () => {
      try {
        const response = await axios.get('/admin/notices');
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    const loadSubjects = async () => {
      try {
        const response = await axios.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    const loadAttendance = async () => {
      try {
        const response = await axios.get('/attendance');
        setAttendance(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    const loadFees = async () => {
      try {
        const response = await axios.get('/fees');
        setFees(response.data);
      } catch (error) {
        console.error('Error fetching fees:', error);
      }
    };

    const loadPublicTeachers = async () => {
      try {
        const response = await axios.get('/public-teachers');
        setPublicTeachers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching public teachers:', error);
      }
    };

    const loadPublicMembers = async () => {
      try {
        const response = await axios.get('/public-members');
        setPublicMembers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching public members:', error);
      }
    };

    const loadProgressCards = async () => {
      try {
        const response = await axios.get('/progress-cards');
        setProgressCards(response.data.data || []);
      } catch (error) {
        console.error('Error fetching progress cards:', error);
      }
    };

    const loadTeacherAttendance = async () => {
      try {
        const response = await axios.get('/teacher-attendance');
        setTeacherAttendance(response.data);
      } catch (error) {
        console.error('Error fetching teacher attendance:', error);
      }
    };

    loadMessages();
    loadUsers();
    loadNotifications();
    loadQuizQuestions();
    loadQuizResults();
    loadExamResults();
    loadVideos();
    loadNotes();
    loadGalleryMedia();
    loadActiveExamSession();
    loadNotices();
    loadSubjects();
    loadAttendance();
    loadTeacherAttendance();
    loadFees();
    loadPublicTeachers();
    loadPublicMembers();
    loadProgressCards();
    
    // Notify server that admin is connected and reload messages when socket connects
    if (socket && isConnected) {
      joinAdminRoom();
      // Reload messages when socket connects to get any new messages
      loadMessages();
    }
    
    // Listen for real-time updates
    const handleUserActivationUpdated = (data) => {
      const { userId, isActivated, userName } = data;
      
      // Update teachers list
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher._id === userId ? { ...teacher, isActivated } : teacher
        )
      );
      
      // Update students list
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === userId ? { ...student, isActivated } : student
        )
      );
      
      // Update members list
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member._id === userId ? { ...member, isActivated } : member
        )
      );
      
      // Show notification
      const statusText = isActivated ? 'activated' : 'deactivated';
      showPopup(`${userName}'s account has been ${statusText}`, 'success');
    };
    
    const handleUserExamEligibilityUpdated = (data) => {
      const { userId, isExamEligible } = data;
      
      // Update teachers list
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher._id === userId ? { ...teacher, isExamEligible } : teacher
        )
      );
      
      // Update students list
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === userId ? { ...student, isExamEligible } : student
        )
      );
      
      // Update members list
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member._id === userId ? { ...member, isExamEligible } : member
        )
      );
    };
    
    const handleNewNotification = (notification) => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
    };
    
    const handleNotificationUpdated = (notification) => {
      setNotifications(prevNotifications => 
        prevNotifications.map(n => n._id === notification._id ? notification : n)
      );
    };
    
    const handleNotificationDeleted = (data) => {
      const { notificationId } = data;
      // Remove from local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n._id !== notificationId)
      );
    };
    
    const handleNewUserRegistered = (data) => {
      const { user } = data;
      if (user.userType === 'teacher') {
        setTeachers(prevTeachers => [user, ...prevTeachers]);
      } else {
        setStudents(prevStudents => [user, ...prevStudents]);
      }
    };
    
    const handleUserDeleted = (data) => {
      const { userId } = data;
      setTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher._id !== userId)
      );
      setStudents(prevStudents => 
        prevStudents.filter(student => student._id !== userId)
      );
    };
    
    const handleNewMessage = (message) => {
      setMessages(prevMessages => [message, ...prevMessages]);
      showPopup('New message received!', 'info');
    };
    
    const handleMessageDeleted = (data) => {
      const { messageId } = data;
      setMessages(prevMessages => 
        prevMessages.filter(m => m._id !== messageId)
      );
    };
    
    if (socket && on && off) {
      on('user-activation-updated', handleUserActivationUpdated);
      on('user-exam-eligibility-updated', handleUserExamEligibilityUpdated);
      on('new-notification', handleNewNotification);
      on('notification-updated', handleNotificationUpdated);
      on('notification-deleted', handleNotificationDeleted);
      on('new-user-registered', handleNewUserRegistered);
      on('user-deleted', handleUserDeleted);
      on('new-message', handleNewMessage);
      on('message-deleted', handleMessageDeleted);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (socket && off) {
        off('user-activation-updated', handleUserActivationUpdated);
        off('user-exam-eligibility-updated', handleUserExamEligibilityUpdated);
        off('new-notification', handleNewNotification);
        off('notification-updated', handleNotificationUpdated);
        off('notification-deleted', handleNotificationDeleted);
        off('new-user-registered', handleNewUserRegistered);
        off('user-deleted', handleUserDeleted);
        off('new-message', handleNewMessage);
        off('message-deleted', handleMessageDeleted);
      }
    };
  }, [navigate, socket, isConnected]);

  const handleLogout = () => {
    showConfirm('Are you sure you want to logout from admin panel?', () => {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Refresh the whole page
    window.location.reload();
  };

  const handleDelete = async (userId, userType) => {
    showConfirm('Are you sure you want to delete this user?', async () => {
      try {
        await axios.delete(`/users/${userId}`);
        
        // Refresh the user list
        if (userType === 'teacher') {
          setTeachers(teachers.filter(teacher => teacher._id !== userId));
        } else if (userType === 'member') {
          setMembers(members.filter(member => member._id !== userId));
        } else {
          setStudents(students.filter(student => student._id !== userId));
        }
        showPopup('User deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        showPopup('Failed to delete user', 'error');
      }
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      phone: user.phone || '',
      rollNumber: user.rollNumber || '',
      class: user.class || '',
      fatherName: user.fatherName || '',
      motherName: user.motherName || '',
      parentsMobile: user.parentsMobile || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e, userId) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showPopup('Photo size must be under 1MB', 'error');
        return;
      }
      setSelectedPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setUploadingPhoto(userId);
    }
  };

  const handleUploadPhoto = async (userId, userType) => {
    if (!selectedPhotoFile) {
      showPopup('Please select a photo first', 'error');
      return;
    }

    setUploadingPhoto(userId);
    try {
      const formData = new FormData();
      formData.append('photo', selectedPhotoFile);

      const response = await axios.put(`/users/${userId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update the local state
      if (userType === 'teacher') {
        setTeachers(teachers.map(teacher => 
          teacher._id === userId ? response.data.user : teacher
        ));
      } else if (userType === 'member') {
        setMembers(members.map(member => 
          member._id === userId ? response.data.user : member
        ));
      } else {
        setStudents(students.map(student => 
          student._id === userId ? response.data.user : student
        ));
      }

      showPopup('Photo updated successfully!', 'success');
      setUploadingPhoto(null);
      setSelectedPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      showPopup(error.response?.data?.message || 'Failed to upload photo', 'error');
      setUploadingPhoto(null);
    }
  };

  const handleCancelPhotoUpload = () => {
    setUploadingPhoto(null);
    setSelectedPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSaveEdit = async (userId, userType) => {
    try {
      const response = await axios.put(`/users/${userId}`, editFormData);
      
      // Update the local state
      if (userType === 'teacher') {
        setTeachers(teachers.map(teacher => 
          teacher._id === userId ? response.data : teacher
        ));
      } else if (userType === 'member') {
        setMembers(members.map(member => 
          member._id === userId ? response.data : member
        ));
      } else {
        setStudents(students.map(student => 
          student._id === userId ? response.data : student
        ));
      }
      
      setEditingUser(null);
      setEditFormData({});
      showPopup('User updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showPopup('Failed to update user', 'error');
    }
  };

  const handleToggleActivation = async (userId, userType) => {
    try {
      const response = await axios.put(`/users/${userId}/activate`);
      
      // Update the local state
      if (userType === 'teacher') {
        setTeachers(teachers.map(teacher => 
          teacher._id === userId ? response.data.user : teacher
        ));
      } else if (userType === 'member') {
        setMembers(members.map(member => 
          member._id === userId ? response.data.user : member
        ));
      } else {
        setStudents(students.map(student => 
          student._id === userId ? response.data.user : student
        ));
      }
    } catch (error) {
      console.error('Error toggling activation:', error);
      showPopup('Failed to update activation status', 'error');
    }
  };

  const handleToggleExamEligibility = async (userId) => {
    try {
      const response = await axios.put(`/users/${userId}/exam-eligibility`);
      
      // Update all user lists (teachers, students, and members)
      setTeachers(teachers.map(teacher => 
        teacher._id === userId ? response.data.user : teacher
      ));
      setStudents(students.map(student => 
        student._id === userId ? response.data.user : student
      ));
      setMembers(members.map(member => 
        member._id === userId ? response.data.user : member
      ));
    } catch (error) {
      console.error('Error toggling exam eligibility:', error);
      showPopup(error.response?.data?.message || 'Failed to update exam eligibility', 'error');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationMessage.trim()) {
      showPopup('Please enter a notification message', 'error');
      return;
    }

    try {
      if (editingNotification) {
        // Update existing notification
        const response = await axios.put(`/notifications/${editingNotification}`, {
          message: notificationMessage
        });
        setNotifications(notifications.map(n => 
          n._id === editingNotification ? response.data.data : n
        ));
        showPopup('Notification updated successfully!', 'success');
      } else {
        // Create new notification
        const response = await axios.post('/notifications', {
          message: notificationMessage
        });
        setNotifications([response.data.data, ...notifications]);
        showPopup('Notification sent successfully!', 'success');
      }
      
      setNotificationMessage('');
      setShowNotificationForm(false);
      setEditingNotification(null);
    } catch (error) {
      console.error('Error sending notification:', error);
      showPopup('Failed to save notification', 'error');
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification._id);
    setNotificationMessage(notification.message);
    setShowNotificationForm(true);
  };

  const handleCancelNotification = () => {
    setShowNotificationForm(false);
    setEditingNotification(null);
    setNotificationMessage('');
  };

  const handleDeleteNotification = async (notificationId) => {
    showConfirm('Are you sure you want to permanently delete this notification?', async () => {
      try {
        await axios.delete(`/notifications/${notificationId}`);
        // Remove from local state
        setNotifications(notifications.filter(n => n._id !== notificationId));
        showPopup('Notification deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting notification:', error);
        showPopup('Failed to delete notification', 'error');
      }
    });
  };

  // Quiz Question Handlers
  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    setQuestionFormData({
      ...questionFormData,
      [name]: name === 'correctOption' ? parseInt(value) : value
    });
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: 1
    });
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question._id);
    setQuestionFormData({
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correctOption: question.correctOption
    });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();

    try {
      if (editingQuestion) {
        // Update existing question
        const response = await axios.put(
          `/quiz/questions/${editingQuestion}`,
          questionFormData
        );
        setQuizQuestions(quizQuestions.map(q => 
          q._id === editingQuestion ? response.data.data : q
        ));
        showPopup('Question updated successfully!', 'success');
      } else {
        // Add new question
        const response = await axios.post('/quiz/questions', questionFormData);
        setQuizQuestions([response.data.data, ...quizQuestions]);
        showPopup('Question added successfully!', 'success');
      }
      
      setShowQuestionForm(false);
      setEditingQuestion(null);
      setQuestionFormData({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 1
      });
    } catch (error) {
      console.error('Error saving question:', error);
      showPopup('Failed to save question', 'error');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    showConfirm('Are you sure you want to delete this question?', async () => {
      try {
        await axios.delete(`/quiz/questions/${questionId}`);
        setQuizQuestions(quizQuestions.filter(q => q._id !== questionId));
        showPopup('Question deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting question:', error);
        showPopup('Failed to delete question', 'error');
      }
    });
  };

  const handleResetQuiz = async (userId, userName) => {
    showConfirm(`Are you sure you want to reset all quiz attempts for ${userName}? This will allow them to retake the exam.`, async () => {
      try {
        await axios.delete(`/admin/quiz/reset/${userId}`);
        setQuizResults(quizResults.filter(r => r.userId !== userId));
        showPopup('Quiz attempts reset successfully!', 'success');
      } catch (error) {
        console.error('Error resetting quiz:', error);
        showPopup('Failed to reset quiz attempts', 'error');
      }
    });
  };

  // Exam Result Handlers
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
      showPopup('Please fill in Student Name, Roll Number, and Class', 'error');
      return;
    }

    if (!resultFormData.testType.trim()) {
      showPopup('Please select Type of Test', 'error');
      return;
    }

    if (resultFormData.subjects.some(s => !s.name.trim())) {
      showPopup('Please fill in all subject names', 'error');
      return;
    }

    try {
      if (editingResult) {
        // Update existing result
        const response = await axios.put(`/exam-results/${editingResult}`, {
          studentName: resultFormData.studentName,
          rollNumber: resultFormData.rollNumber,
          class: resultFormData.class,
          testType: resultFormData.testType,
          subjects: resultFormData.subjects
        });
        setExamResults(examResults.map(r => r._id === editingResult ? response.data.data : r));
        showPopup('Exam result updated successfully!', 'success');
      } else {
        // Add new result
        const response = await axios.post('/exam-results', resultFormData);
        setExamResults([response.data.data, ...examResults]);
        showPopup('Exam result added successfully!', 'success');
      }
      
      setShowResultForm(false);
      setEditingResult(null);
      setResultFormData({
        studentName: '',
        rollNumber: '',
        class: '',
        testType: '',
        subjects: [{ name: '', marks: 0, maxMarks: 100 }]
      });
    } catch (error) {
      console.error('Error saving result:', error);
      showPopup(error.response?.data?.message || 'Failed to save result', 'error');
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
    setShowResultForm(true);
  };

  const handleDeleteResult = async (resultId) => {
    showConfirm('Are you sure you want to delete this result?', async () => {
      try {
        await axios.delete(`/exam-results/${resultId}`);
        setExamResults(examResults.filter(r => r._id !== resultId));
        showPopup('Result deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting result:', error);
        showPopup('Failed to delete result', 'error');
      }
    });
  };

  const handlePublishAllResults = async () => {
    const unpublishedResults = examResults.filter(r => !r.isPublished);
    const unpublishedCount = unpublishedResults.length;
    
    if (unpublishedCount === 0) {
      showPopup('No unpublished results to publish', 'info');
      return;
    }
    
    // Create a list of unpublished student names
    const unpublishedStudentsList = unpublishedResults
      .map(r => `${r.studentName} (Roll: ${r.rollNumber}, Class: ${r.class})`)
      .join('\n');
    
    const confirmMessage = `The following ${unpublishedCount} student(s) result(s) are not yet public and will be published:

${unpublishedStudentsList}

Are you sure you want to publish them? They will be visible to students.`;
    
    showConfirm(confirmMessage, async () => {
      try {
        const response = await axios.post('/exam-results/publish-all');
        // Refresh exam results
        const updatedResults = await axios.get('/exam-results');
        setExamResults(updatedResults.data);
        showPopup(response.data.message, 'success');
      } catch (error) {
        console.error('Error publishing results:', error);
        showPopup('Failed to publish results', 'error');
      }
    });
  };

  const handleUnpublishAllResults = async () => {
    const publishedResults = examResults.filter(r => r.isPublished);
    const publishedCount = publishedResults.length;
    
    if (publishedCount === 0) {
      showPopup('No published results to unpublish', 'info');
      return;
    }
    
    showConfirm(`Are you sure you want to unpublish all ${publishedCount} exam result(s)? They will be hidden from students.`, async () => {
      try {
        const response = await axios.post('/exam-results/unpublish-all');
        // Refresh exam results
        const updatedResults = await axios.get('/exam-results');
        setExamResults(updatedResults.data);
        showPopup(response.data.message, 'success');
      } catch (error) {
        console.error('Error unpublishing results:', error);
        showPopup('Failed to unpublish results', 'error');
      }
    });
  };

  const handleTogglePublishResult = async (resultId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publish' : 'unpublish';
    const result = examResults.find(r => r._id === resultId);
    
    showConfirm(
      `Are you sure you want to ${action} the result for ${result.studentName} (Roll: ${result.rollNumber})? ${newStatus ? 'It will be visible to the student.' : 'It will be hidden from the student.'}`,
      async () => {
        try {
          const response = await axios.put(`/exam-results/${resultId}`, {
            isPublished: newStatus
          });
          
          // Update local state
          setExamResults(examResults.map(r => 
            r._id === resultId ? response.data.data : r
          ));
          
          showPopup(`Result ${action}ed successfully!`, 'success');
        } catch (error) {
          console.error(`Error ${action}ing result:`, error);
          showPopup(`Failed to ${action} result`, 'error');
        }
      }
    );
  };

  // Video Handlers
  const handleVideoChange = (e) => {
    setVideoFormData({
      ...videoFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    
    if (!videoFormData.title.trim() || !videoFormData.videoUrl.trim()) {
      showPopup('Please fill in required fields', 'error');
      return;
    }

    try {
      if (editingVideo) {
        const response = await axios.put(`/videos/${editingVideo}`, videoFormData);
        setVideos(videos.map(v => v._id === editingVideo ? response.data.data : v));
        showPopup('Video updated successfully!', 'success');
      } else {
        const response = await axios.post('/videos', videoFormData);
        setVideos([response.data.data, ...videos]);
        showPopup('Video added successfully!', 'success');
      }
      
      setShowVideoForm(false);
      setEditingVideo(null);
      setVideoFormData({ title: '', description: '', videoUrl: '', category: 'General' });
    } catch (error) {
      console.error('Error saving video:', error);
      showPopup(error.response?.data?.message || 'Failed to save video', 'error');
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video._id);
    setVideoFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      category: video.category
    });
    setShowVideoForm(true);
  };

  const handleDeleteVideo = async (videoId) => {
    showConfirm('Are you sure you want to delete this video?', async () => {
      try {
        await axios.delete(`/videos/${videoId}`);
        setVideos(videos.filter(v => v._id !== videoId));
        showPopup('Video deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting video:', error);
        showPopup('Failed to delete video', 'error');
      }
    });
  };

  // Note Handlers
  const handleNoteChange = (e) => {
    setNoteFormData({
      ...noteFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleNoteSave = async () => {
    if (!noteFormData.title || !noteFormData.pdfUrl) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }

    try {
      // Convert Google Drive link to direct download link if needed
      let pdfUrl = noteFormData.pdfUrl;
      if (pdfUrl.includes('drive.google.com')) {
        // Extract file ID from various Google Drive URL formats
        const fileIdMatch = pdfUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || 
                           pdfUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          pdfUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      }

      const noteData = {
        title: noteFormData.title,
        description: noteFormData.description,
        category: noteFormData.category,
        pdfUrl: pdfUrl,
        publicId: '', // Not needed for Google Drive
        fileSize: 0 // Not applicable for Google Drive links
      };

      if (editingNote) {
        // Update existing note
        const updateResponse = await axios.put(
          `/notes/${editingNote}`,
          noteData
        );
        setNotes(notes.map(n => n._id === editingNote ? updateResponse.data.data : n));
        showPopup('Note updated successfully!', 'success');
      } else {
        // Create new note
        const createResponse = await axios.post('/notes', noteData);
        setNotes([createResponse.data.data, ...notes]);
        showPopup('Note added successfully!', 'success');
      }

      setShowNoteForm(false);
      setEditingNote(null);
      setNoteFormData({ title: '', description: '', category: 'General', pdfUrl: '' });
    } catch (error) {
      console.error('Error saving note:', error);
      showPopup(error.response?.data?.message || 'Failed to save note', 'error');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note._id);
    setNoteFormData({
      title: note.title,
      description: note.description || '',
      category: note.category,
      pdfUrl: note.pdfUrl || ''
    });
    setShowNoteForm(true);
  };

  const handleDeleteMessage = async (messageId) => {
    showConfirm('Are you sure you want to delete this message?', async () => {
      try {
        await axios.delete(`/messages/${messageId}`);
        setMessages(messages.filter(msg => msg._id !== messageId));
        showPopup('Message deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting message:', error);
        showPopup('Failed to delete message', 'error');
      }
    });
  };

  // Public Teachers Handlers
  const handlePublicTeacherImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      showPopup('Image size must be under 1MB', 'error');
      return;
    }

    setUploadingPublicTeacherImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/public-teachers/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPublicTeacherFormData({
        ...publicTeacherFormData,
        image: response.data.data.url
      });
      showPopup('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showPopup('Failed to upload image', 'error');
    } finally {
      setUploadingPublicTeacherImage(false);
    }
  };

  const handlePublicTeacherSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicTeacherFormData.image) {
      showPopup('Please upload a teacher image', 'error');
      return;
    }

    try {
      if (editingPublicTeacher) {
        const response = await axios.put(`/public-teachers/${editingPublicTeacher._id}`, publicTeacherFormData);
        setPublicTeachers(publicTeachers.map(t => t._id === editingPublicTeacher._id ? response.data.data : t));
        showPopup('Teacher updated successfully!', 'success');
      } else {
        const response = await axios.post('/public-teachers', publicTeacherFormData);
        setPublicTeachers([...publicTeachers, response.data.data]);
        showPopup('Teacher added successfully!', 'success');
      }
      
      setShowPublicTeacherForm(false);
      setEditingPublicTeacher(null);
      setPublicTeacherFormData({
        name: '',
        subject: '',
        qualification: '',
        experience: '',
        gmail: '',
        mobile: '',
        image: ''
      });
    } catch (error) {
      console.error('Error saving teacher:', error);
      showPopup('Failed to save teacher', 'error');
    }
  };

  const handleDeletePublicTeacher = async (teacherId) => {
    showConfirm('Are you sure you want to delete this teacher?', async () => {
      try {
        await axios.delete(`/public-teachers/${teacherId}`);
        setPublicTeachers(publicTeachers.filter(t => t._id !== teacherId));
        showPopup('Teacher deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        showPopup('Failed to delete teacher', 'error');
      }
    });
  };

  // Public Members Handlers
  const handlePublicMemberImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      showPopup('Image size must be under 1MB', 'error');
      return;
    }

    setUploadingPublicMemberImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/public-members/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPublicMemberFormData({
        ...publicMemberFormData,
        image: response.data.data.url
      });
      showPopup('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showPopup('Failed to upload image', 'error');
    } finally {
      setUploadingPublicMemberImage(false);
    }
  };

  const handlePublicMemberSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicMemberFormData.image) {
      showPopup('Please upload a member image', 'error');
      return;
    }

    try {
      if (editingPublicMember) {
        const response = await axios.put(`/public-members/${editingPublicMember._id}`, publicMemberFormData);
        setPublicMembers(publicMembers.map(m => m._id === editingPublicMember._id ? response.data.data : m));
        showPopup('Member updated successfully!', 'success');
      } else {
        const response = await axios.post('/public-members', publicMemberFormData);
        setPublicMembers([...publicMembers, response.data.data]);
        showPopup('Member added successfully!', 'success');
      }
      
      setShowPublicMemberForm(false);
      setEditingPublicMember(null);
      setPublicMemberFormData({
        name: '',
        designation: '',
        gmail: '',
        phone: '',
        image: ''
      });
    } catch (error) {
      console.error('Error saving member:', error);
      showPopup('Failed to save member', 'error');
    }
  };

  const handleDeletePublicMember = async (memberId) => {
    showConfirm('Are you sure you want to delete this member?', async () => {
      try {
        await axios.delete(`/public-members/${memberId}`);
        setPublicMembers(publicMembers.filter(m => m._id !== memberId));
        showPopup('Member deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting member:', error);
        showPopup('Failed to delete member', 'error');
      }
    });
  };

  // Teacher Attendance Handlers
  const handleMarkTeacherAttendance = async () => {
    const attendanceData = teachers
      .filter(teacher => teacher.isActivated)
      .map(teacher => ({
        teacherId: teacher._id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        date: selectedTeacherAttendanceDate,
        status: document.getElementById(`teacher-status-${teacher._id}`)?.value || 'present'
      }));

    if (attendanceData.length === 0) {
      showPopup('No activated teachers to mark attendance for', 'info');
      return;
    }

    try {
      const response = await axios.post('/teacher-attendance/mark', {
        attendanceRecords: attendanceData
      });
      
      // Reload attendance to get updated data
      const attendanceResponse = await axios.get('/teacher-attendance');
      setTeacherAttendance(attendanceResponse.data);
      
      // Reset all dropdowns to 'present' for next marking
      teachers.filter(t => t.isActivated).forEach(teacher => {
        const dropdown = document.getElementById(`teacher-status-${teacher._id}`);
        if (dropdown) dropdown.value = 'present';
      });
      
      showPopup(`Attendance marked successfully for ${response.data.data?.length || attendanceData.length} teacher(s)!`, 'success');
    } catch (error) {
      console.error('Error marking teacher attendance:', error);
      showPopup(error.response?.data?.message || 'Failed to mark teacher attendance', 'error');
    }
  };

  const handleDeleteTeacherAttendance = async (attendanceId) => {
    showConfirm('Are you sure you want to delete this attendance record?', async () => {
      try {
        await axios.delete(`/teacher-attendance/${attendanceId}`);
        setTeacherAttendance(teacherAttendance.filter(a => a._id !== attendanceId));
        showPopup('Attendance record deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting attendance record:', error);
        showPopup('Failed to delete attendance record', 'error');
      }
    });
  };

  // Progress Card Handlers
  const handleProgressClassChange = (e) => {
    setProgressCardFormData({
      ...progressCardFormData,
      class: e.target.value,
      studentId: '',
      studentName: '',
      rollNumber: '',
      aadhaarNumber: '',
      fatherName: '',
      motherName: '',
      subjects: []
    });
  };

  const handleProgressStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find(s => s._id === studentId);
    
    if (student) {
      setProgressCardFormData({
        ...progressCardFormData,
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        subjects: []
      });
    }
  };

  const handleAddProgressSubject = () => {
    setProgressCardFormData({
      ...progressCardFormData,
      subjects: [...progressCardFormData.subjects, {
        name: '',
        test1FM: 20,
        test1Marks: 0,
        test2FM: 20,
        test2Marks: 0,
        halfYearlyFM: 100,
        halfYearlyMarks: 0,
        test3FM: 20,
        test3Marks: 0,
        annualFM: 100,
        annualMarks: 0,
        remarks: ''
      }]
    });
  };

  const handleRemoveProgressSubject = (index) => {
    const newSubjects = progressCardFormData.subjects.filter((_, i) => i !== index);
    setProgressCardFormData({ ...progressCardFormData, subjects: newSubjects });
  };

  const handleProgressSubjectChange = (index, field, value) => {
    const newSubjects = [...progressCardFormData.subjects];
    // Keep name and remarks as strings, convert others to numbers
    newSubjects[index][field] = (field === 'name' || field === 'remarks') ? value : parseFloat(value) || 0;
    setProgressCardFormData({ ...progressCardFormData, subjects: newSubjects });
  };

  const handleDownloadProgressCard = (card) => {
    generateProgressCardPDF(card);
  };

  const handleEditProgressCard = (card) => {
    setEditingProgressCard(card._id);
    setProgressCardFormData({
      year: card.year || '',
      class: card.class,
      studentId: card.studentId,
      studentName: card.studentName,
      rollNumber: card.rollNumber,
      aadhaarNumber: card.aadhaarNumber,
      fatherName: card.fatherName || '',
      motherName: card.motherName || '',
      subjects: card.subjects.map(s => ({
        ...s,
        remarks: s.remarks || ''
      })),
      remarks: card.remarks || '',
      promotionStatus: card.promotionStatus || '',
      halfYearlyWorkingDays: card.halfYearlyWorkingDays || 0,
      halfYearlyDaysPresent: card.halfYearlyDaysPresent || 0,
      annualWorkingDays: card.annualWorkingDays || 0,
      annualDaysPresent: card.annualDaysPresent || 0
    });
    setShowProgressCardForm(true);
  };

  const handleDeleteProgressCard = async (cardId) => {
    showConfirm('Are you sure you want to delete this progress card?', async () => {
      try {
        await axios.delete(`/progress-cards/${cardId}`);
        setProgressCards(progressCards.filter(c => c._id !== cardId));
        showPopup('Progress card deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting progress card:', error);
        showPopup('Failed to delete progress card', 'error');
      }
    });
  };

  const handlePublishProgressCard = async (cardId) => {
    try {
      await axios.put(`/progress-cards/${cardId}/publish`);
      const response = await axios.get('/progress-cards');
      setProgressCards(response.data.data || []);
      showPopup('Progress card published successfully!', 'success');
    } catch (error) {
      console.error('Error publishing progress card:', error);
      showPopup('Failed to publish progress card', 'error');
    }
  };

  const handleUnpublishProgressCard = async (cardId) => {
    try {
      await axios.put(`/progress-cards/${cardId}/unpublish`);
      const response = await axios.get('/progress-cards');
      setProgressCards(response.data.data || []);
      showPopup('Progress card unpublished successfully!', 'success');
    } catch (error) {
      console.error('Error unpublishing progress card:', error);
      showPopup('Failed to unpublish progress card', 'error');
    }
  };

  const handlePublishAllProgressCards = async () => {
    showConfirm('Are you sure you want to publish all progress cards?', async () => {
      try {
        await axios.put('/progress-cards/publish-all');
        const response = await axios.get('/progress-cards');
        setProgressCards(response.data.data || []);
        showPopup('All progress cards published successfully!', 'success');
      } catch (error) {
        console.error('Error publishing all progress cards:', error);
        showPopup('Failed to publish all progress cards', 'error');
      }
    });
  };

  const handleUnpublishAllProgressCards = async () => {
    showConfirm('Are you sure you want to unpublish all progress cards?', async () => {
      try {
        await axios.put('/progress-cards/unpublish-all');
        const response = await axios.get('/progress-cards');
        setProgressCards(response.data.data || []);
        showPopup('All progress cards unpublished successfully!', 'success');
      } catch (error) {
        console.error('Error unpublishing all progress cards:', error);
        showPopup('Failed to unpublish all progress cards', 'error');
      }
    });
  };

  const handleSubmitProgressCard = async (e) => {
    e.preventDefault();
    
    if (!progressCardFormData.class || !progressCardFormData.studentId) {
      showPopup('Please select class and student', 'error');
      return;
    }

    if (!progressCardFormData.aadhaarNumber || progressCardFormData.aadhaarNumber.length !== 12) {
      showPopup('Please enter a valid 12-digit Aadhaar Number', 'error');
      return;
    }

    if (progressCardFormData.subjects.length === 0) {
      showPopup('Please add at least one subject', 'error');
      return;
    }

    if (progressCardFormData.subjects.some(s => !s.name.trim())) {
      showPopup('Please fill in all subject names', 'error');
      return;
    }

    try {
      const progressCardData = {
        ...progressCardFormData,
        subjects: progressCardFormData.subjects.map(subject => {
          const totalFM = subject.test1FM + subject.test2FM + subject.halfYearlyFM + subject.test3FM + subject.annualFM;
          const obtainedMarks = subject.test1Marks + subject.test2Marks + subject.halfYearlyMarks + subject.test3Marks + subject.annualMarks;
          
          return {
            ...subject,
            totalMarks: totalFM,
            obtainedMarks: obtainedMarks,
            remarks: subject.remarks || ''
          };
        })
      };

      // Calculate overall stats
      const totalMaxMarks = progressCardData.subjects.reduce((sum, s) => sum + s.totalMarks, 0);
      const totalObtained = progressCardData.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
      const percentage = ((totalObtained / totalMaxMarks) * 100).toFixed(2);

      progressCardData.totalMarks = totalMaxMarks;
      progressCardData.obtainedMarks = totalObtained;
      progressCardData.percentage = parseFloat(percentage);
      progressCardData.grade = getGrade(parseFloat(percentage));

      if (editingProgressCard) {
        await axios.put(`/progress-cards/${editingProgressCard}`, progressCardData);
        showPopup('Progress card updated successfully!', 'success');
      } else {
        await axios.post('/progress-cards', progressCardData);
        showPopup('Progress card added successfully!', 'success');
      }

      // Reload progress cards
      const response = await axios.get('/progress-cards');
      setProgressCards(response.data.data || []);

      setShowProgressCardForm(false);
      setEditingProgressCard(null);
      setProgressCardFormData({
        year: '',
        class: '',
        studentId: '',
        studentName: '',
        rollNumber: '',
        aadhaarNumber: '',
        fatherName: '',
        motherName: '',
        subjects: [],
        remarks: '',
        promotionStatus: '',
        halfYearlyWorkingDays: 0,
        halfYearlyDaysPresent: 0,
        annualWorkingDays: 0,
        annualDaysPresent: 0
      });
    } catch (error) {
      console.error('Error saving progress card:', error);
      showPopup(error.response?.data?.message || 'Failed to save progress card', 'error');
    }
  };

  const handleDeleteNote = async (noteId, publicId) => {
    showConfirm('Are you sure you want to delete this note?', async () => {
      try {
        await axios.delete(`/notes/${noteId}`);
        
        // Delete from Cloudinary
        try {
          await axios.post('https://api.cloudinary.com/v1_1/ddmanp1xi/destroy', {
            public_id: publicId,
            resource_type: 'raw'
          });
        } catch (cloudinaryError) {
          console.error('Cloudinary deletion error:', cloudinaryError);
        }

        setNotes(notes.filter(n => n._id !== noteId));
        showPopup('Note deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting note:', error);
        showPopup('Failed to delete note', 'error');
      }
    });
  };

  // Notice Handlers
  const handleNoticeChange = (e) => {
    setNoticeFormData({
      ...noticeFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleNoticeSave = async () => {
    // Validate based on notice type
    if (!noticeFormData.title || !noticeFormData.fileType) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }

    // For PDF and Image, fileUrl is required
    if ((noticeFormData.fileType === 'pdf' || noticeFormData.fileType === 'image') && !noticeFormData.fileUrl) {
      showPopup('File URL is required for PDF and Image notices', 'error');
      return;
    }

    // For Text, description is required
    if (noticeFormData.fileType === 'text' && !noticeFormData.description) {
      showPopup('Text content is required for Text notices', 'error');
      return;
    }

    try {
      const noticeData = {
        title: noticeFormData.title,
        description: noticeFormData.description,
        fileType: noticeFormData.fileType,
        fileUrl: noticeFormData.fileType === 'text' ? 'text-notice' : noticeFormData.fileUrl, // Placeholder for text notices
        fileName: noticeFormData.fileName
      };

      if (editingNotice) {
        // Update existing notice
        const response = await axios.put(`/notices/${editingNotice}`, noticeData);
        setNotices(notices.map(n => n._id === editingNotice ? response.data.data : n));
        showPopup('Notice updated successfully!', 'success');
      } else {
        // Create new notice
        const response = await axios.post('/notices', noticeData);
        setNotices([response.data.data, ...notices]);
        showPopup('Notice added successfully!', 'success');
      }

      setShowNoticeForm(false);
      setEditingNotice(null);
      setNoticeFormData({ title: '', description: '', fileType: '', fileUrl: '', fileName: '' });
      setNoticeImagePreview(null);
      setUploadingNoticeImage(false);
    } catch (error) {
      console.error('Error saving notice:', error);
      showPopup(error.response?.data?.message || 'Failed to save notice', 'error');
    }
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice._id);
    setNoticeFormData({
      title: notice.title,
      description: notice.description || '',
      fileType: notice.fileType,
      fileUrl: notice.fileUrl,
      fileName: notice.fileName || ''
    });
    setShowNoticeForm(true);
  };

  const handleDeleteNotice = async (noticeId) => {
    showConfirm('Are you sure you want to delete this notice?', async () => {
      try {
        await axios.delete(`/notices/${noticeId}`);
        setNotices(notices.filter(n => n._id !== noticeId));
        showPopup('Notice deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting notice:', error);
        showPopup('Failed to delete notice', 'error');
      }
    });
  };

  const handleCancelNoticeForm = () => {
    setShowNoticeForm(false);
    setEditingNotice(null);
    setNoticeFormData({ title: '', description: '', fileType: '', fileUrl: '', fileName: '' });
    setNoticeImagePreview(null);
    setUploadingNoticeImage(false);
  };

  const handleNoticeImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      showPopup('Image size must be under 2MB', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showPopup('Please upload an image file', 'error');
      return;
    }

    setUploadingNoticeImage(true);
    setNoticeImagePreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/notices/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNoticeFormData({
        ...noticeFormData,
        fileUrl: response.data.data.url
      });
      showPopup('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showPopup('Failed to upload image', 'error');
      setNoticeImagePreview(null);
    } finally {
      setUploadingNoticeImage(false);
    }
  };

  // Gallery Media Handlers
  const handleGalleryFormChange = (e) => {
    setGalleryFormData({
      ...galleryFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/gallery/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setGalleryFormData({
        ...galleryFormData,
        url: response.data.data.url,
        thumbnail: response.data.data.url
      });
      showPopup('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showPopup('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitGalleryMedia = async (e) => {
    e.preventDefault();
    
    if (!galleryFormData.title.trim() || !galleryFormData.url.trim()) {
      showPopup('Please fill in required fields', 'error');
      return;
    }

    try {
      if (editingGalleryMedia) {
        const response = await axios.put(`/gallery/${editingGalleryMedia}`, galleryFormData);
        setGalleryMedia(galleryMedia.map(m => m._id === editingGalleryMedia ? response.data.data : m));
        showPopup('Gallery media updated successfully!', 'success');
      } else {
        const response = await axios.post('/gallery', galleryFormData);
        setGalleryMedia([response.data.data, ...galleryMedia]);
        showPopup('Media added to gallery successfully!', 'success');
      }
      
      setShowGalleryForm(false);
      setEditingGalleryMedia(null);
      setGalleryFormData({ type: 'image', title: '', description: '', url: '', thumbnail: '' });
    } catch (error) {
      console.error('Error saving gallery media:', error);
      showPopup(error.response?.data?.message || 'Failed to save media', 'error');
    }
  };

  const handleEditGalleryMedia = (media) => {
    setEditingGalleryMedia(media._id);
    setGalleryFormData({
      type: media.type,
      title: media.title,
      description: media.description || '',
      url: media.url,
      thumbnail: media.thumbnail || ''
    });
    setShowGalleryForm(true);
  };

  const handleDeleteGalleryMedia = async (mediaId) => {
    showConfirm('Are you sure you want to delete this media from gallery?', async () => {
      try {
        await axios.delete(`/gallery/${mediaId}`);
        setGalleryMedia(galleryMedia.filter(m => m._id !== mediaId));
        showPopup('Gallery media deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting gallery media:', error);
        showPopup('Failed to delete gallery media', 'error');
      }
    });
  };

  const handleStartExam = async () => {
    if (quizQuestions.length === 0) {
      showPopup('Please add quiz questions before starting the exam', 'error');
      return;
    }

    // Show timer selection modal
    setShowExamTimerModal(true);
  };

  const handleConfirmStartExam = async () => {
    setShowExamTimerModal(false);
    
    showConfirm(`Are you sure you want to start the exam for ${examDuration} minutes? All eligible users will be notified.`, async () => {
      setStartingExam(true);
      try {
        const response = await axios.post('/exam-session/start', {
          durationMinutes: examDuration
        });
        setActiveExamSession(response.data.session);
        showPopup(`Exam started successfully for ${examDuration} minutes! All eligible users have been notified.`, 'success');
      } catch (error) {
        console.error('Error starting exam:', error);
        showPopup(error.response?.data?.message || 'Failed to start exam', 'error');
      } finally {
        setStartingExam(false);
      }
    });
  };

  const handleStopExam = async () => {
    showConfirm('Are you sure you want to stop the exam? This will immediately end the exam for all participants.', async () => {
      try {
        await axios.post(`/exam-session/end/${activeExamSession._id}`, {
          isSuspended: true
        });
        setActiveExamSession(null);
        showPopup('Exam stopped successfully. All participants have been notified.', 'success');
      } catch (error) {
        console.error('Error stopping exam:', error);
        showPopup('Failed to stop exam', 'error');
      }
    });
  };

  // Attendance & Subject Handlers
  const handleAttendanceSubjectChange = (e) => {
    setSubjectFormData({
      ...subjectFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAttendanceSubjectSave = async (e) => {
    e.preventDefault();
    if (!subjectFormData.name || !subjectFormData.class) {
      showPopup('Please fill in all fields', 'error');
      return;
    }

    try {
      if (editingSubject) {
        const response = await axios.put(`/subjects/${editingSubject}`, subjectFormData);
        setSubjects(subjects.map(s => s._id === editingSubject ? response.data.data : s));
        showPopup('Subject updated successfully!', 'success');
      } else {
        const response = await axios.post('/subjects', subjectFormData);
        setSubjects([response.data.data, ...subjects]);
        showPopup('Subject added successfully!', 'success');
      }
      setShowSubjectForm(false);
      setEditingSubject(null);
      setSubjectFormData({ name: '', class: '' });
    } catch (error) {
      console.error('Error saving subject:', error);
      showPopup(error.response?.data?.message || 'Failed to save subject', 'error');
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject._id);
    setSubjectFormData({
      name: subject.name,
      class: subject.class
    });
    setShowSubjectForm(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    showConfirm('Are you sure you want to delete this subject? All attendance records for this subject will also be deleted.', async () => {
      try {
        await axios.delete(`/subjects/${subjectId}`);
        setSubjects(subjects.filter(s => s._id !== subjectId));
        setAttendance(attendance.filter(a => a.subjectId._id !== subjectId));
        showPopup('Subject deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting subject:', error);
        showPopup('Failed to delete subject', 'error');
      }
    });
  };

  const handleShowAttendanceCalendar = (student) => {
    setAttendanceCalendarStudent(student);
    setShowAttendanceCalendar(true);
  };

  const handleEditAttendance = (attendanceRecord) => {
    setEditingAttendance(attendanceRecord);
    setShowEditAttendanceModal(true);
  };

  const handleUpdateAttendance = async (newStatus) => {
    if (!editingAttendance) return;

    try {
      await axios.put(`/attendance/${editingAttendance._id}`, { status: newStatus });
      
      // Update local state
      setAttendance(attendance.map(a => 
        a._id === editingAttendance._id ? { ...a, status: newStatus } : a
      ));
      
      showPopup('Attendance updated successfully!', 'success');
      setShowEditAttendanceModal(false);
      setEditingAttendance(null);
    } catch (error) {
      console.error('Error updating attendance:', error);
      showPopup('Failed to update attendance', 'error');
    }
  };

  const handleDeleteAttendance = async (attendanceId) => {
    showConfirm('Are you sure you want to permanently delete this attendance record?', async () => {
      try {
        await axios.delete(`/attendance/${attendanceId}`);
        
        // Remove from local state
        setAttendance(attendance.filter(a => a._id !== attendanceId));
        
        showPopup('Attendance record deleted successfully!', 'success');
        setShowEditAttendanceModal(false);
        setEditingAttendance(null);
      } catch (error) {
        console.error('Error deleting attendance:', error);
        showPopup('Failed to delete attendance', 'error');
      }
    });
  };

  // Fees Handlers
  const handleUpdateFees = async () => {
    if (!selectedStudent) return;

    try {
      const response = await axios.put(`/fees/${selectedStudent._id}`, {
        totalFees: parseFloat(feesFormData.totalFees) || 0,
        deposit: parseFloat(feesFormData.deposit) || 0,
        description: feesFormData.description || ''
      });

      // Update local fees state
      const updatedFees = response.data.data;
      setFees(prevFees => {
        const existingIndex = prevFees.findIndex(f => f.studentId === selectedStudent._id);
        if (existingIndex >= 0) {
          const newFees = [...prevFees];
          newFees[existingIndex] = updatedFees;
          return newFees;
        } else {
          return [...prevFees, updatedFees];
        }
      });

      showPopup('Fees updated successfully!', 'success');
      setShowFeesModal(false);
      setSelectedStudent(null);
      setFeesFormData({ totalFees: 0, deposit: 0, description: '' });
    } catch (error) {
      console.error('Error updating fees:', error);
      showPopup(error.response?.data?.message || 'Failed to update fees', 'error');
    }
  };

  const handleResetFees = async (student) => {
    showConfirm(`Are you sure you want to reset all fees for ${student.firstName} ${student.lastName}? This will set total fees, deposit, and dues to ₹0.`, async () => {
      try {
        const response = await axios.put(`/fees/${student._id}`, {
          totalFees: 0,
          deposit: 0,
          description: 'Fees reset by admin'
        });

        // Update local fees state
        const updatedFees = response.data.data;
        setFees(prevFees => {
          const existingIndex = prevFees.findIndex(f => f.studentId === student._id);
          if (existingIndex >= 0) {
            const newFees = [...prevFees];
            newFees[existingIndex] = updatedFees;
            return newFees;
          } else {
            return [...prevFees, updatedFees];
          }
        });

        showPopup('Fees reset successfully!', 'success');
      } catch (error) {
        console.error('Error resetting fees:', error);
        showPopup(error.response?.data?.message || 'Failed to reset fees', 'error');
      }
    });
  };

  return (
    <>
      {isMobile ? (
        <div className="mobile-block">
          <div className="mobile-block-content">
            <FaUsers className="mobile-block-icon" />
            <h2>Desktop Only</h2>
            <p>Admin Dashboard is only accessible on desktop devices for better management experience.</p>
            <p>Please switch to a desktop or laptop computer to access the admin panel.</p>
          </div>
        </div>
      ) : (
        <div className="admin-dashboard-premium">
          {/* Sidebar Navigation */}
          <div className="admin-sidebar">
            <div className="sidebar-header">
              <h2>Admin Panel</h2>
            </div>
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveSection('dashboard')}
              >
                <FaTachometerAlt /> Dashboard
              </button>
              <button 
                className={`nav-item ${activeSection === 'gallery-management' ? 'active' : ''}`}
                onClick={() => setActiveSection('gallery-management')}
              >
                <FaImages /> Gallery Management
              </button>
              <button 
                className={`nav-item ${activeSection === 'teachers' ? 'active' : ''}`}
                onClick={() => setActiveSection('teachers')}
              >
                <FaChalkboardTeacher /> Teachers
              </button>
              <button 
                className={`nav-item ${activeSection === 'teacher-attendance' ? 'active' : ''}`}
                onClick={() => setActiveSection('teacher-attendance')}
              >
                <FaClipboard /> Teacher Attendance
              </button>
              <button 
                className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
                onClick={() => setActiveSection('students')}
              >
                <FaUserGraduate /> Students
              </button>
              <button 
                className={`nav-item ${activeSection === 'members' ? 'active' : ''}`}
                onClick={() => setActiveSection('members')}
              >
                <FaUsers /> Members
              </button>
              <button 
                className={`nav-item ${activeSection === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveSection('attendance')}
              >
                <FaClipboard /> Attendance
              </button>
              <button 
                className={`nav-item ${activeSection === 'fees' ? 'active' : ''}`}
                onClick={() => setActiveSection('fees')}
              >
                <FaMoneyBillWave /> Fees
              </button>
              <button 
                className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <FaBell /> Notifications
              </button>
              <button 
                className={`nav-item ${activeSection === 'notices' ? 'active' : ''}`}
                onClick={() => setActiveSection('notices')}
              >
                <FaClipboard /> Notices
              </button>
              <button 
                className={`nav-item ${activeSection === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveSection('quiz')}
              >
                <FaQuestionCircle /> Quiz Questions
              </button>
              <button 
                className={`nav-item ${activeSection === 'quiz-results' ? 'active' : ''}`}
                onClick={() => setActiveSection('quiz-results')}
              >
                <FaAward /> Quiz Results
              </button>
              <button 
                className={`nav-item ${activeSection === 'exam-results' ? 'active' : ''}`}
                onClick={() => setActiveSection('exam-results')}
              >
                <FaChartBar /> Exam Results
              </button>
              <button 
                className={`nav-item ${activeSection === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveSection('videos')}
              >
                <FaVideo /> Study Videos
              </button>
              <button 
                className={`nav-item ${activeSection === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveSection('notes')}
              >
                <FaFilePdf /> Study Notes
              </button>
              <button 
                className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveSection('messages')}
              >
                <FaCommentAlt /> Messages
              </button>
              <button 
                className={`nav-item ${activeSection === 'public-teachers' ? 'active' : ''}`}
                onClick={() => setActiveSection('public-teachers')}
              >
                <FaChalkboardTeacher /> Public Teachers
              </button>
              <button 
                className={`nav-item ${activeSection === 'public-members' ? 'active' : ''}`}
                onClick={() => setActiveSection('public-members')}
              >
                <FaUsers /> Public Members
              </button>
              <button 
                className={`nav-item ${activeSection === 'progress-card' ? 'active' : ''}`}
                onClick={() => setActiveSection('progress-card')}
              >
                <FaFileAlt /> Progress Card
              </button>
            </nav>
            <button onClick={handleLogout} className="sidebar-logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Main Content Area */}
          <div className="admin-main-content">
            <div className="dashboard-header-premium">
              <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}</h1>
              <button 
                onClick={handleRefresh} 
                className="refresh-btn"
                disabled={isRefreshing}
                title="Refresh all data"
              >
                <FaSync className={isRefreshing ? 'spinning' : ''} />
                {isRefreshing ? ' Refreshing...' : ' Refresh'}
              </button>
            </div>

            <div className="content-wrapper">
              {/* Dashboard Section */}
              {activeSection === 'dashboard' && (
                <>
                  <div className="dashboard-stats">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaEnvelope />
                      </div>
                      <div className="stat-info">
                        <h3>{messages.length}</h3>
                        <p>Total Messages</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaChalkboardTeacher />
                      </div>
                      <div className="stat-info">
                        <h3>{teachers.length}</h3>
                        <p>Teachers</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaUsers />
                      </div>
                      <div className="stat-info">
                        <h3>{students.length}</h3>
                        <p>Students</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaUsers />
                      </div>
                      <div className="stat-info">
                        <h3>{members.length}</h3>
                        <p>Members</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaChartLine />
                      </div>
                      <div className="stat-info">
                        <h3>98%</h3>
                        <p>Success Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="dashboard-charts">
                    {/* Teachers Chart */}
                    <div className="chart-card">
                      <div className="chart-header">
                        <div>
                          <h3><FaChalkboardTeacher /> Teachers Overview</h3>
                          <p className="chart-subtitle">Total: {teachers.length}</p>
                        </div>
                        <div className="chart-trend">
                          <span className="trend-value positive">
                            ↑ {Math.floor(Math.random() * 15 + 5)}%
                          </span>
                          <span className="trend-label">vs last month</span>
                        </div>
                      </div>
                      <div className="chart-body">
                        <div className="bar-chart">
                          <div className="chart-bars">
                            <div className="bar-group">
                              <div 
                                className="bar bar-primary"
                                style={{ height: `${Math.min((teachers.filter(t => t.isActivated).length / Math.max(teachers.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{teachers.filter(t => t.isActivated).length}</span>
                              </div>
                              <span className="bar-name">Activated</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-info"
                                style={{ height: `${Math.min((teachers.filter(t => t.isExamEligible).length / Math.max(teachers.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{teachers.filter(t => t.isExamEligible).length}</span>
                              </div>
                              <span className="bar-name">Exam Eligible</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-warning"
                                style={{ height: `${Math.min((teachers.filter(t => !t.isActivated).length / Math.max(teachers.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{teachers.filter(t => !t.isActivated).length}</span>
                              </div>
                              <span className="bar-name">Pending</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-success"
                                style={{ height: `${Math.min((teachers.length / Math.max(teachers.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{teachers.length}</span>
                              </div>
                              <span className="bar-name">Total</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Students Chart */}
                    <div className="chart-card">
                      <div className="chart-header">
                        <div>
                          <h3><FaUsers /> Students Overview</h3>
                          <p className="chart-subtitle">Total: {students.length}</p>
                        </div>
                        <div className="chart-trend">
                          <span className="trend-value positive">
                            ↑ {Math.floor(Math.random() * 20 + 10)}%
                          </span>
                          <span className="trend-label">vs last month</span>
                        </div>
                      </div>
                      <div className="chart-body">
                        <div className="bar-chart">
                          <div className="chart-bars">
                            <div className="bar-group">
                              <div 
                                className="bar bar-primary"
                                style={{ height: `${Math.min((students.filter(s => s.isActivated).length / Math.max(students.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{students.filter(s => s.isActivated).length}</span>
                              </div>
                              <span className="bar-name">Activated</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-info"
                                style={{ height: `${Math.min((students.filter(s => s.isExamEligible).length / Math.max(students.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{students.filter(s => s.isExamEligible).length}</span>
                              </div>
                              <span className="bar-name">Exam Eligible</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-warning"
                                style={{ height: `${Math.min((students.filter(s => !s.isActivated).length / Math.max(students.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{students.filter(s => !s.isActivated).length}</span>
                              </div>
                              <span className="bar-name">Pending</span>
                            </div>
                            <div className="bar-group">
                              <div 
                                className="bar bar-success"
                                style={{ height: `${Math.min((students.length / Math.max(students.length, 1)) * 100, 100)}%` }}
                              >
                                <span className="bar-label">{students.length}</span>
                              </div>
                              <span className="bar-name">Total</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Gallery Management Section */}
              {activeSection === 'gallery-management' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaImages /> Public Gallery Management</h2>
                    <button 
                      onClick={() => {
                        setShowGalleryForm(!showGalleryForm);
                        if (showGalleryForm) {
                          setEditingGalleryMedia(null);
                          setGalleryFormData({ type: 'image', title: '', description: '', url: '', thumbnail: '' });
                        }
                      }}
                      className="add-btn"
                    >
                      <FaPlus /> {editingGalleryMedia ? 'Cancel Edit' : showGalleryForm ? 'Cancel' : 'Add Media'}
                    </button>
                  </div>

                  {/* Search Box */}
                  <div className="search-container-admin">
                    <input
                      type="text"
                      placeholder="Search by title or description..."
                      value={searchGalleryQuery}
                      onChange={(e) => {
                        setSearchGalleryQuery(e.target.value);
                        setVisibleGalleryCount(10);
                      }}
                      className="search-input-admin"
                    />
                  </div>

                  {showGalleryForm && (
                    <div className="form-container">
                      <form className="result-form" onSubmit={handleSubmitGalleryMedia}>
                        <div className="form-group">
                          <label>Media Type *</label>
                          <select
                            name="type"
                            value={galleryFormData.type}
                            onChange={handleGalleryFormChange}
                            className="video-input"
                            required
                          >
                            <option value="image">Image</option>
                            <option value="video">Video (YouTube)</option>
                            <option value="audio">Audio</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={galleryFormData.title}
                            onChange={handleGalleryFormChange}
                            placeholder="Enter media title"
                            required
                            className="video-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Description (Optional)</label>
                          <textarea
                            name="description"
                            value={galleryFormData.description}
                            onChange={handleGalleryFormChange}
                            placeholder="Enter media description"
                            rows="3"
                            className="video-input"
                          />
                        </div>

                        {galleryFormData.type === 'image' && (
                          <div className="form-group">
                            <label>Upload Image * (Max 2MB)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="video-input"
                            />
                            <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                              Supported formats: JPEG, JPG, PNG, WEBP (Maximum size: 2MB)
                            </small>
                            {galleryFormData.url && (
                              <div style={{ marginTop: '1rem' }}>
                                <img src={galleryFormData.url} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #e0e0e0' }} />
                              </div>
                            )}
                            {uploadingImage && <p style={{ color: '#667eea', marginTop: '0.5rem', fontWeight: '600' }}>⏳ Uploading to Cloudinary...</p>}
                          </div>
                        )}

                        {galleryFormData.type === 'video' && (
                          <div className="form-group">
                            <label>Video URL * (YouTube or Google Drive)</label>
                            <input
                              type="url"
                              name="url"
                              value={galleryFormData.url}
                              onChange={handleGalleryFormChange}
                              placeholder="Paste YouTube or Google Drive video link"
                              required
                              className="video-input"
                            />
                            <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                              Supports: YouTube (watch, embed, short link) or Google Drive shareable video link
                            </small>
                          </div>
                        )}

                        {galleryFormData.type === 'audio' && (
                          <div className="form-group">
                            <label>Audio URL * (Direct Link or Google Drive)</label>
                            <input
                              type="url"
                              name="url"
                              value={galleryFormData.url}
                              onChange={handleGalleryFormChange}
                              placeholder="Paste audio file URL or Google Drive link"
                              required
                              className="video-input"
                            />
                            <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                              Supports: Direct MP3/Audio URLs or Google Drive shareable audio files
                            </small>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="action-btn save-btn"
                          style={{ marginTop: '1rem' }}
                          disabled={galleryFormData.type === 'image' && !galleryFormData.url}
                        >
                          {editingGalleryMedia ? 'Update Media' : 'Add to Gallery'}
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="gallery-media-grid">
                    {(() => {
                      // Filter by search query
                      const searchedGallery = searchGalleryQuery.trim() === ''
                        ? galleryMedia
                        : galleryMedia.filter(media =>
                            media.title.toLowerCase().includes(searchGalleryQuery.toLowerCase()) ||
                            (media.description && media.description.toLowerCase().includes(searchGalleryQuery.toLowerCase()))
                          );

                      // Limit visible items
                      const displayedGallery = searchedGallery.slice(0, visibleGalleryCount);

                      if (displayedGallery.length === 0) {
                        return (
                          <p className="no-contacts">
                            {searchGalleryQuery ? `No results found for "${searchGalleryQuery}"` : 'No media in gallery yet'}
                          </p>
                        );
                      }

                      return (
                        <>
                          <div className="gallery-admin-grid">
                            {displayedGallery.map((media) => (
                          <div key={media._id} className="gallery-media-card">
                            <div className="gallery-media-type-badge">
                              {media.type === 'image' && <FaImage />}
                              {media.type === 'video' && <FaVideo />}
                              {media.type === 'audio' && <FaMusic />}
                              <span>{media.type.toUpperCase()}</span>
                            </div>
                            
                            {media.type === 'image' && (
                              <div className="gallery-media-preview">
                                <img src={media.url} alt={media.title} />
                              </div>
                            )}
                            
                            {media.type === 'video' && (
                              <div className="gallery-media-preview">
                                <iframe
                                  src={(() => {
                                    const url = media.url;
                                    // YouTube URLs
                                    if (url.includes('youtube.com/watch')) {
                                      return url.replace('watch?v=', 'embed/');
                                    }
                                    if (url.includes('youtu.be')) {
                                      return `https://www.youtube.com/embed/${url.split('/').pop()}`;
                                    }
                                    if (url.includes('youtube.com/embed')) {
                                      return url;
                                    }
                                    // Google Drive URLs
                                    if (url.includes('drive.google.com')) {
                                      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
                                      if (fileIdMatch && fileIdMatch[1]) {
                                        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
                                      }
                                    }
                                    return url;
                                  })()}
                                  title={media.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                  allowFullScreen
                                  style={{ width: '100%', height: '100%' }}
                                ></iframe>
                              </div>
                            )}
                            
                            {media.type === 'audio' && (
                              <div className="gallery-media-preview audio-preview">
                                <div className="audio-icon-large">
                                  <FaMusic />
                                </div>
                                {media.url.includes('drive.google.com') ? (
                                  <iframe
                                    src={(() => {
                                      const url = media.url;
                                      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
                                      if (fileIdMatch && fileIdMatch[1]) {
                                        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
                                      }
                                      return url;
                                    })()}
                                    title={media.title}
                                    frameBorder="0"
                                    allow="autoplay"
                                    style={{ width: '100%', height: '150px', marginTop: '1rem', border: 'none' }}
                                  ></iframe>
                                ) : (
                                  <audio controls style={{ width: '100%', marginTop: '1rem' }}>
                                    <source src={media.url} type="audio/mpeg" />
                                  </audio>
                                )}
                              </div>
                            )}
                            
                            <div className="gallery-media-info">
                              <h4>{media.title}</h4>
                              {media.description && (
                                <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
                                  {media.description}
                                </p>
                              )}
                              <span className="gallery-date">
                                {new Date(media.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="gallery-media-actions">
                              <button
                                onClick={() => handleEditGalleryMedia(media)}
                                className="action-btn edit-btn"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryMedia(media._id)}
                                className="action-btn delete-btn"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Load More Button */}
                      {searchedGallery.length > visibleGalleryCount && (
                        <div className="load-more-container-admin">
                          <button
                            onClick={() => setVisibleGalleryCount(prev => prev + 10)}
                            className="load-more-btn"
                          >
                            Load More ({searchedGallery.length - visibleGalleryCount} remaining)
                          </button>
                        </div>
                      )}

                      {/* Results Counter */}
                      <div className="results-counter-admin">
                        Showing {displayedGallery.length} of {searchedGallery.length} media item(s)
                      </div>
                    </>
                  );
                })()}
                  </div>
                </div>
              )}

              {/* Teachers Section */}
              {activeSection === 'teachers' && (
                <div className="contacts-section">
                  <h2>Registered Teachers</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search teachers by name..."
                      value={searchTeacherQuery}
                      onChange={(e) => setSearchTeacherQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="contacts-table">
                    {teachers.length === 0 ? (
                      <p className="no-contacts">No teachers registered yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Exam Eligible</th>
                            <th>Registered Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.filter(teacher => 
                              teacher.firstName.toLowerCase().includes(searchTeacherQuery.toLowerCase()) || 
                              teacher.lastName.toLowerCase().includes(searchTeacherQuery.toLowerCase())
                            ).map((teacher) => (
                            <tr key={teacher._id}>
                              <td>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <img src={photoPreview && uploadingPhoto === teacher._id ? photoPreview : teacher.photo} alt={teacher.firstName} className="user-photo" />
                                  {uploadingPhoto === teacher._id ? (
                                    <div style={{ marginTop: '5px' }}>
                                      <button onClick={() => handleUploadPhoto(teacher._id, 'teacher')} className="action-btn save-btn" style={{ fontSize: '11px', padding: '4px 8px' }}>Upload</button>
                                      <button onClick={handleCancelPhotoUpload} className="action-btn cancel-btn" style={{ fontSize: '11px', padding: '4px 8px', marginLeft: '4px' }}>Cancel</button>
                                    </div>
                                  ) : (
                                    <label style={{ cursor: 'pointer', display: 'block', marginTop: '5px', fontSize: '11px', color: '#4CAF50' }}>
                                      <FaCamera style={{ marginRight: '3px' }} /> Change Photo
                                      <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, teacher._id)} style={{ display: 'none' }} />
                                    </label>
                                  )}
                                </div>
                              </td>
                              {editingUser === teacher._id ? (
                                <>
                                  <td><input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="tel" name="phone" value={editFormData.phone} onChange={handleEditChange} className="edit-input" /></td>
                                  <td>
                                    <span className={`status-badge ${teacher.isActivated ? 'active' : 'pending'}`}>
                                      {teacher.isActivated ? 'Activated' : 'Pending'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${teacher.isExamEligible ? 'active' : 'pending'}`}>
                                      {teacher.isExamEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                  </td>
                                  <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleSaveEdit(teacher._id, 'teacher')} className="action-btn save-btn">Save</button>
                                    <button onClick={handleCancelEdit} className="action-btn cancel-btn">Cancel</button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{teacher.firstName}</td>
                                  <td>{teacher.lastName}</td>
                                  <td>{teacher.email}</td>
                                  <td>{teacher.phone}</td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleActivation(teacher._id, 'teacher')} 
                                      className={`status-toggle ${teacher.isActivated ? 'activated' : 'deactivated'}`}
                                    >
                                      {teacher.isActivated ? <><FaCheck /> Activated</> : <><FaTimes /> Pending</>}
                                    </button>
                                  </td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleExamEligibility(teacher._id)} 
                                      className={`status-toggle ${teacher.isExamEligible ? 'activated' : 'deactivated'}`}
                                    >
                                      {teacher.isExamEligible ? <><FaCheck /> Eligible</> : <><FaTimes /> Not Eligible</>}
                                    </button>
                                  </td>
                                  <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleEdit(teacher)} className="action-btn edit-btn"><FaEdit /></button>
                                    <button onClick={() => handleDelete(teacher._id, 'teacher')} className="action-btn delete-btn"><FaTrash /></button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Teacher Attendance Section */}
              {activeSection === 'teacher-attendance' && (
                <div className="contacts-section">
                  <h2><FaClipboard /> Teacher Daily Attendance</h2>
                  
                  <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Mark Attendance for Date:</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="date"
                        value={selectedTeacherAttendanceDate}
                        onChange={(e) => setSelectedTeacherAttendanceDate(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                      />
                      <button 
                        onClick={handleMarkTeacherAttendance}
                        className="add-btn"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '0.5rem 1.5rem' }}
                      >
                        <FaCheck /> Mark Attendance
                      </button>
                    </div>
                  </div>

                  <div className="contacts-table">
                    <h3 style={{ marginBottom: '1rem' }}>Teachers List ({teachers.filter(t => t.isActivated).length} activated)</h3>
                    {teachers.filter(t => t.isActivated).length === 0 ? (
                      <p className="no-contacts">No activated teachers to mark attendance</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Teacher Name</th>
                            <th>Email</th>
                            <th>Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.filter(t => t.isActivated).map((teacher) => (
                            <tr key={teacher._id}>
                              <td>{teacher.firstName} {teacher.lastName}</td>
                              <td>{teacher.email}</td>
                              <td>
                                <select
                                  id={`teacher-status-${teacher._id}`}
                                  defaultValue="present"
                                  style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="section-header" style={{ marginTop: '3rem' }}>
                    <h3>Attendance Records</h3>
                  </div>

                  <div className="contacts-table" style={{ marginTop: '1rem' }}>
                    {teacherAttendance.length === 0 ? (
                      <p className="no-contacts">No attendance records yet</p>
                    ) : (
                      <div>
                        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Teachers Attendance Summary</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Teacher Name</th>
                              <th>Email</th>
                              <th>Total Days</th>
                              <th>Present</th>
                              <th>Absent</th>
                              <th>Attendance %</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teachers.filter(t => t.isActivated).map((teacher) => {
                              // Handle both string and object teacherId formats
                              const teacherRecords = teacherAttendance.filter(a => {
                                const recordTeacherId = typeof a.teacherId === 'object' && a.teacherId?._id 
                                  ? a.teacherId._id 
                                  : a.teacherId;
                                return recordTeacherId === teacher._id || recordTeacherId?.toString() === teacher._id.toString();
                              });
                              const presentCount = teacherRecords.filter(a => a.status === 'present').length;
                              const absentCount = teacherRecords.filter(a => a.status === 'absent').length;
                              const totalDays = teacherRecords.length;
                              const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0;

                              return (
                                <tr key={teacher._id}>
                                  <td>{teacher.firstName} {teacher.lastName}</td>
                                  <td>{teacher.email}</td>
                                  <td>
                                    <span style={{
                                      padding: '5px 10px',
                                      borderRadius: '5px',
                                      backgroundColor: '#17a2b8',
                                      color: 'white',
                                      fontWeight: '600'
                                    }}>
                                      {totalDays}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      padding: '5px 10px',
                                      borderRadius: '5px',
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      fontWeight: '600'
                                    }}>
                                      {presentCount}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      padding: '5px 10px',
                                      borderRadius: '5px',
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      fontWeight: '600'
                                    }}>
                                      {absentCount}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      padding: '8px 15px',
                                      borderRadius: '5px',
                                      backgroundColor: percentage >= 75 ? '#4CAF50' : percentage >= 50 ? '#ff9800' : '#f44336',
                                      color: 'white',
                                      fontWeight: '700',
                                      fontSize: '14px'
                                    }}>
                                      {percentage}%
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => {
                                        setAttendanceCalendarTeacher(teacher);
                                        setShowTeacherAttendanceCalendar(true);
                                      }}
                                      className="action-btn"
                                      style={{
                                        backgroundColor: '#667eea',
                                        color: 'white',
                                        fontSize: '13px',
                                        padding: '8px 12px'
                                      }}
                                      title="View attendance calendar"
                                    >
                                      <FaCalendarAlt /> View Calendar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Students Section */}
              {activeSection === 'students' && (
                <div className="contacts-section">
                  <h2>Registered Students</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search students by name..."
                      value={searchStudentQuery}
                      onChange={(e) => setSearchStudentQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="contacts-table">
                    {students.length === 0 ? (
                      <p className="no-contacts">No students registered yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Roll Number</th>
                            <th>Father's Name</th>
                            <th>Mother's Name</th>
                            <th>Parent's Mobile Number</th>
                            <th>Email</th>
                            <th>Class</th>
                            <th>Status</th>
                            <th>Exam Eligible</th>
                            <th>Registered Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.filter(student => 
                              student.firstName.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
                              student.lastName.toLowerCase().includes(searchStudentQuery.toLowerCase())
                            ).map((student) => (
                            <tr key={student._id}>
                              <td>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <img src={photoPreview && uploadingPhoto === student._id ? photoPreview : student.photo} alt={student.firstName} className="user-photo" />
                                  {uploadingPhoto === student._id ? (
                                    <div style={{ marginTop: '5px' }}>
                                      <button onClick={() => handleUploadPhoto(student._id, 'student')} className="action-btn save-btn" style={{ fontSize: '11px', padding: '4px 8px' }}>Upload</button>
                                      <button onClick={handleCancelPhotoUpload} className="action-btn cancel-btn" style={{ fontSize: '11px', padding: '4px 8px', marginLeft: '4px' }}>Cancel</button>
                                    </div>
                                  ) : (
                                    <label style={{ cursor: 'pointer', display: 'block', marginTop: '5px', fontSize: '11px', color: '#4CAF50' }}>
                                      <FaCamera style={{ marginRight: '3px' }} /> Change Photo
                                      <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, student._id)} style={{ display: 'none' }} />
                                    </label>
                                  )}
                                </div>
                              </td>
                              {editingUser === student._id ? (
                                <>
                                  <td><input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="rollNumber" value={editFormData.rollNumber} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="fatherName" value={editFormData.fatherName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="motherName" value={editFormData.motherName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="tel" name="parentsMobile" value={editFormData.parentsMobile} onChange={handleEditChange} className="edit-input" maxLength="10" /></td>
                                  <td><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="class" value={editFormData.class} onChange={handleEditChange} className="edit-input" /></td>
                                  <td>
                                    <span className={`status-badge ${student.isActivated ? 'active' : 'pending'}`}>
                                      {student.isActivated ? 'Activated' : 'Pending'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${student.isExamEligible ? 'active' : 'pending'}`}>
                                      {student.isExamEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                  </td>
                                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleSaveEdit(student._id, 'student')} className="action-btn save-btn">Save</button>
                                    <button onClick={handleCancelEdit} className="action-btn cancel-btn">Cancel</button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{student.firstName}</td>
                                  <td>{student.lastName}</td>
                                  <td>{student.rollNumber}</td>
                                  <td>{student.fatherName || 'N/A'}</td>
                                  <td>{student.motherName || 'N/A'}</td>
                                  <td>{student.parentsMobile || 'N/A'}</td>
                                  <td>{student.email || 'N/A'}</td>
                                  <td>{student.class}</td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleActivation(student._id, 'student')} 
                                      className={`status-toggle ${student.isActivated ? 'activated' : 'deactivated'}`}
                                    >
                                      {student.isActivated ? <><FaCheck /> Activated</> : <><FaTimes /> Pending</>}
                                    </button>
                                  </td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleExamEligibility(student._id)} 
                                      className={`status-toggle ${student.isExamEligible ? 'activated' : 'deactivated'}`}
                                    >
                                      {student.isExamEligible ? <><FaCheck /> Eligible</> : <><FaTimes /> Not Eligible</>}
                                    </button>
                                  </td>
                                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleEdit(student)} className="action-btn edit-btn"><FaEdit /></button>
                                    <button onClick={() => handleDelete(student._id, 'student')} className="action-btn delete-btn"><FaTrash /></button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Members Section */}
              {activeSection === 'members' && (
                <div className="contacts-section">
                  <h2>Registered Members</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search members by name..."
                      value={searchMemberQuery}
                      onChange={(e) => setSearchMemberQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="contacts-table">
                    {members.length === 0 ? (
                      <p className="no-contacts">No members registered yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Exam Eligible</th>
                            <th>Registered Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.filter(member => 
                              member.firstName.toLowerCase().includes(searchMemberQuery.toLowerCase()) || 
                              member.lastName.toLowerCase().includes(searchMemberQuery.toLowerCase())
                            ).map((member) => (
                            <tr key={member._id}>
                              <td>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <img src={photoPreview && uploadingPhoto === member._id ? photoPreview : member.photo} alt={member.firstName} className="user-photo" />
                                  {uploadingPhoto === member._id ? (
                                    <div style={{ marginTop: '5px' }}>
                                      <button onClick={() => handleUploadPhoto(member._id, 'member')} className="action-btn save-btn" style={{ fontSize: '11px', padding: '4px 8px' }}>Upload</button>
                                      <button onClick={handleCancelPhotoUpload} className="action-btn cancel-btn" style={{ fontSize: '11px', padding: '4px 8px', marginLeft: '4px' }}>Cancel</button>
                                    </div>
                                  ) : (
                                    <label style={{ cursor: 'pointer', display: 'block', marginTop: '5px', fontSize: '11px', color: '#4CAF50' }}>
                                      <FaCamera style={{ marginRight: '3px' }} /> Change Photo
                                      <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, member._id)} style={{ display: 'none' }} />
                                    </label>
                                  )}
                                </div>
                              </td>
                              {editingUser === member._id ? (
                                <>
                                  <td><input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="edit-input" /></td>
                                  <td><input type="tel" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} className="edit-input" placeholder="Optional" /></td>
                                  <td>
                                    <span className={`status-badge ${member.isActivated ? 'active' : 'pending'}`}>
                                      {member.isActivated ? 'Activated' : 'Pending'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${member.isExamEligible ? 'active' : 'pending'}`}>
                                      {member.isExamEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                  </td>
                                  <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleSaveEdit(member._id, 'member')} className="action-btn save-btn">Save</button>
                                    <button onClick={handleCancelEdit} className="action-btn cancel-btn">Cancel</button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{member.firstName}</td>
                                  <td>{member.lastName}</td>
                                  <td>{member.email}</td>
                                  <td>{member.phone || 'N/A'}</td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleActivation(member._id, 'member')} 
                                      className={`status-toggle ${member.isActivated ? 'activated' : 'deactivated'}`}
                                    >
                                      {member.isActivated ? <><FaCheck /> Activated</> : <><FaTimes /> Pending</>}
                                    </button>
                                  </td>
                                  <td>
                                    <button 
                                      onClick={() => handleToggleExamEligibility(member._id)} 
                                      className={`status-toggle ${member.isExamEligible ? 'activated' : 'deactivated'}`}
                                    >
                                      {member.isExamEligible ? <><FaCheck /> Eligible</> : <><FaTimes /> Not Eligible</>}
                                    </button>
                                  </td>
                                  <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <button onClick={() => handleEdit(member)} className="action-btn edit-btn"><FaEdit /></button>
                                    <button onClick={() => handleDelete(member._id, 'member')} className="action-btn delete-btn"><FaTrash /></button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Attendance Section */}
              {activeSection === 'attendance' && (
                <div className="contacts-section">
                  <h2><FaClipboard /> Daily Attendance Management</h2>
                  
                  {/* Attendance Records */}
                  <div className="section-header" style={{ marginTop: '2rem' }}>
                    <h3>Student Daily Attendance Records</h3>
                    <select
                      value={selectedAttendanceClass}
                      onChange={(e) => setSelectedAttendanceClass(e.target.value)}
                      className="class-filter"
                      style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    >
                      <option value="All">All Classes</option>
                      {[...new Set(students.map(s => s.class))].sort().map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div className="contacts-table" style={{ marginTop: '1rem' }}>
                    {students.length === 0 ? (
                      <p className="no-contacts">No students registered yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Class</th>
                            <th>Total Days</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Attendance %</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter(student => selectedAttendanceClass === 'All' || student.class === selectedAttendanceClass)
                            .map((student) => {
                              // Calculate overall attendance stats for this student
                              const studentAttendance = attendance.filter(
                                a => a.studentId._id === student._id
                              );
                              const presentCount = studentAttendance.filter(a => a.status === 'present').length;
                              const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
                              const totalCount = studentAttendance.length;
                              const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

                              return (
                                <tr key={student._id}>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>{student.rollNumber}</td>
                                  <td>{student.class}</td>
                                  <td style={{ textAlign: 'center', fontWeight: '600' }}>{totalCount}</td>
                                  <td style={{ textAlign: 'center', color: '#4CAF50', fontWeight: '600' }}>{presentCount}</td>
                                  <td style={{ textAlign: 'center', color: '#f44336', fontWeight: '600' }}>{absentCount}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span style={{
                                      padding: '5px 10px',
                                      borderRadius: '5px',
                                      backgroundColor: percentage >= 75 ? '#4CAF50' : percentage >= 50 ? '#ff9800' : '#f44336',
                                      color: 'white',
                                      fontWeight: '600'
                                    }}>
                                      {percentage}%
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => handleShowAttendanceCalendar(student, null)}
                                      className="action-btn"
                                      style={{
                                        backgroundColor: '#667eea',
                                        color: 'white',
                                        fontSize: '12px',
                                        padding: '5px 10px'
                                      }}
                                      title="View attendance calendar"
                                    >
                                      <FaEye /> View Calendar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Fees Section */}
              {activeSection === 'fees' && (
                <div className="contacts-section">
                  <h2><FaMoneyBillWave /> Fees Management</h2>
                  
                  <div className="section-header" style={{ marginTop: '2rem' }}>
                    <h3>Student Fees by Class</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search by student name..."
                        value={searchFeesQuery}
                        onChange={(e) => setSearchFeesQuery(e.target.value)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          border: '1px solid #ddd',
                          minWidth: '250px',
                          fontSize: '0.95rem'
                        }}
                      />
                      <select
                        value={selectedFeesClass}
                        onChange={(e) => setSelectedFeesClass(e.target.value)}
                        className="class-filter"
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                      >
                        <option value="All">All Classes</option>
                        {[...new Set(students.map(s => s.class))].sort().map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="contacts-table" style={{ marginTop: '1rem' }}>
                    {students.length === 0 ? (
                      <p className="no-contacts">No students registered yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Class</th>
                            <th>Total Fees</th>
                            <th>Deposit</th>
                            <th>Dues</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter(student => {
                              // Filter by class
                              const classMatch = selectedFeesClass === 'All' || student.class === selectedFeesClass;
                              // Filter by name
                              const nameMatch = searchFeesQuery === '' || 
                                `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchFeesQuery.toLowerCase());
                              return classMatch && nameMatch;
                            })
                            .map((student) => {
                              // Find fees for this student
                              const studentFees = fees.find(f => f.studentId === student._id) || {
                                totalFees: 0,
                                deposit: 0,
                                dues: 0
                              };
                              const feesNotDeclared = !fees.find(f => f.studentId === student._id) || studentFees.totalFees === 0;
                              // Ensure dues is always positive
                              const duesAmount = Math.max(0, studentFees.dues);
                              // Get latest description from transactions
                              const latestDescription = studentFees.transactions && studentFees.transactions.length > 0 
                                ? studentFees.transactions[studentFees.transactions.length - 1].description 
                                : '';

                              return (
                                <tr key={student._id}>
                                  <td>
                                    <img 
                                      src={student.photo} 
                                      alt={student.firstName}
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                      }}
                                    />
                                  </td>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>{student.rollNumber}</td>
                                  <td>{student.class}</td>
                                  <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                    {feesNotDeclared ? (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Not declared yet</span>
                                    ) : (
                                      `₹${studentFees.totalFees}`
                                    )}
                                  </td>
                                  <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                                    {feesNotDeclared ? (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>-</span>
                                    ) : (
                                      `₹${studentFees.deposit}`
                                    )}
                                  </td>
                                  <td style={{ 
                                    fontWeight: 'bold', 
                                    color: '#dc3545'
                                  }}>
                                    {feesNotDeclared ? (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>-</span>
                                    ) : (
                                      `₹${duesAmount}`
                                    )}
                                  </td>
                                  <td style={{ maxWidth: '300px' }}>
                                    {feesNotDeclared ? (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>-</span>
                                    ) : !latestDescription || latestDescription.trim() === '' ? (
                                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Empty Message</span>
                                    ) : (
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: '#495057',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'normal'
                                      }}>
                                        {latestDescription}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button
                                        onClick={() => {
                                          setSelectedStudent(student);
                                          setFeesFormData({
                                            totalFees: studentFees.totalFees || 0,
                                            deposit: 0,
                                            description: ''
                                          });
                                          setShowFeesModal(true);
                                        }}
                                        className="action-btn edit-btn"
                                        title="Manage Fees"
                                      >
                                        <FaMoneyBillWave /> Manage
                                      </button>
                                      <button
                                        onClick={() => handleResetFees(student)}
                                        className="action-btn delete-btn"
                                        title="Reset Fees"
                                      >
                                        <FaSync /> Reset
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaBell /> Notifications</h2>
                    <button 
                      onClick={() => setShowNotificationForm(!showNotificationForm)} 
                      className="add-notification-btn"
                    >
                      <FaPaperPlane /> Send Notification
                    </button>
                  </div>

                  {showNotificationForm && (
                    <div className="notification-form-card">
                      <form onSubmit={handleSendNotification} className="notification-form">
                        <textarea
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          placeholder="Enter notification message for all users..."
                          rows="4"
                          required
                        />
                        <div className="form-actions">
                          <button type="submit" className="send-btn">
                            <FaPaperPlane /> {editingNotification ? 'Update Notification' : 'Send to All Users'}
                          </button>
                          <button 
                            type="button" 
                            onClick={handleCancelNotification}
                            className="cancel-form-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="notifications-list">
                    <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                      📋 All Notifications ({notifications.length} total)
                    </h3>
                    {notifications.length === 0 ? (
                      <p className="no-contacts">No notifications sent yet</p>
                    ) : (
                      <div className="notification-cards">
                        {notifications.map((notification) => (
                          <div key={notification._id} className="notification-card">
                            <div className="notification-card-header">
                              <span className="notification-date">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <div className="notification-actions">
                                <button 
                                  onClick={() => handleEditNotification(notification)} 
                                  className="edit-notification-btn"
                                  title="Edit notification"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => handleDeleteNotification(notification._id)} 
                                  className="delete-notification-btn"
                                  title="Delete notification"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <p className="notification-card-message">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Questions Section */}
              {activeSection === 'quiz' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaChartLine /> Quiz Questions Management</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {activeExamSession ? (
                        <>
                          <div style={{ 
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
                            color: 'white', 
                            padding: '0.75rem 1.5rem', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600'
                          }}>
                            <FaClock /> Exam Running...
                          </div>
                          <button 
                            onClick={handleStopExam} 
                            className="add-notification-btn"
                            style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}
                          >
                            <FaTimes /> Stop Exam
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={handleStartExam} 
                          className="add-notification-btn"
                          disabled={startingExam}
                          style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
                        >
                          <FaClock /> {startingExam ? 'Starting...' : 'Start Exam Now'}
                        </button>
                      )}
                      <button onClick={handleAddQuestion} className="add-notification-btn">
                        <FaPlus /> Add New Question
                      </button>
                    </div>
                  </div>

                  {showQuestionForm && (
                    <div className="notification-form-card">
                      <form onSubmit={handleSaveQuestion} className="quiz-question-form">
                        <div className="form-group-full">
                          <label>Question</label>
                          <textarea
                            name="question"
                            value={questionFormData.question}
                            onChange={handleQuestionFormChange}
                            placeholder="Enter the question..."
                            rows="3"
                            required
                          />
                        </div>

                        <div className="options-grid-form">
                          <div className="form-group-full">
                            <label>Option 1</label>
                            <input
                              type="text"
                              name="option1"
                              value={questionFormData.option1}
                              onChange={handleQuestionFormChange}
                              placeholder="Option 1"
                              required
                            />
                          </div>

                          <div className="form-group-full">
                            <label>Option 2</label>
                            <input
                              type="text"
                              name="option2"
                              value={questionFormData.option2}
                              onChange={handleQuestionFormChange}
                              placeholder="Option 2"
                              required
                            />
                          </div>

                          <div className="form-group-full">
                            <label>Option 3</label>
                            <input
                              type="text"
                              name="option3"
                              value={questionFormData.option3}
                              onChange={handleQuestionFormChange}
                              placeholder="Option 3"
                              required
                            />
                          </div>

                          <div className="form-group-full">
                            <label>Option 4</label>
                            <input
                              type="text"
                              name="option4"
                              value={questionFormData.option4}
                              onChange={handleQuestionFormChange}
                              placeholder="Option 4"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group-full">
                          <label>Correct Answer</label>
                          <select
                            name="correctOption"
                            value={questionFormData.correctOption}
                            onChange={handleQuestionFormChange}
                            required
                          >
                            <option value={1}>Option 1</option>
                            <option value={2}>Option 2</option>
                            <option value={3}>Option 3</option>
                            <option value={4}>Option 4</option>
                          </select>
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="send-btn">
                            {editingQuestion ? 'Update Question' : 'Add Question'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowQuestionForm(false);
                              setEditingQuestion(null);
                            }}
                            className="cancel-form-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="quiz-questions-list">
                    {quizQuestions.length === 0 ? (
                      <p className="no-contacts">No quiz questions added yet</p>
                    ) : (
                      <div className="questions-grid">
                        {quizQuestions.map((question, index) => (
                          <div key={question._id} className="question-card-admin">
                            <div className="question-card-header">
                              <span className="question-number">Q{index + 1}</span>
                              <div className="question-actions">
                                <button
                                  onClick={() => handleEditQuestion(question)}
                                  className="action-btn edit-btn"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(question._id)}
                                  className="action-btn delete-btn"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <p className="question-text-admin">{question.question}</p>
                            <div className="options-list">
                              <div className={`option-item ${question.correctOption === 1 ? 'correct' : ''}`}>
                                <span className="option-label">A:</span> {question.option1}
                              </div>
                              <div className={`option-item ${question.correctOption === 2 ? 'correct' : ''}`}>
                                <span className="option-label">B:</span> {question.option2}
                              </div>
                              <div className={`option-item ${question.correctOption === 3 ? 'correct' : ''}`}>
                                <span className="option-label">C:</span> {question.option3}
                              </div>
                              <div className={`option-item ${question.correctOption === 4 ? 'correct' : ''}`}>
                                <span className="option-label">D:</span> {question.option4}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Results Section */}
              {activeSection === 'quiz-results' && (
                <div className="contacts-section">
                  <h2><FaAward /> Quiz Results & Reset</h2>
                  <div className="quiz-results-table">
                    {quizResults.length === 0 ? (
                      <p className="no-contacts">No quiz results yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>Score</th>
                            <th>Percentage</th>
                            <th>Status</th>
                            <th>Completed Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizResults.map((result) => (
                            <tr key={result._id}>
                              <td>{result.userName}</td>
                              <td>{result.score} / {result.totalQuestions}</td>
                              <td>
                                {result.isSuspended ? (
                                  <span className="percentage-badge" style={{ background: '#6c757d' }}>
                                    Suspended
                                  </span>
                                ) : (
                                  <span className={`percentage-badge ${result.passed ? 'passed' : 'failed'}`}>
                                    {result.percentage}%
                                  </span>
                                )}
                              </td>
                              <td>
                                {result.isSuspended ? (
                                  <span className="status-badge" style={{ background: '#ffc107', color: '#000' }}>
                                    Exam Suspended
                                  </span>
                                ) : (
                                  <span className={`status-badge ${result.passed ? 'active' : 'pending'}`}>
                                    {result.passed ? 'Passed' : 'Failed'}
                                  </span>
                                )}
                              </td>
                              <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  {result.passed && !result.isSuspended && (
                                    <button
                                      onClick={() => navigate(`/certificate/${result._id}`)}
                                      className="action-btn edit-btn"
                                      title="View Certificate"
                                    >
                                      <FaAward /> Certificate
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleResetQuiz(result.userId, result.userName)}
                                    className="action-btn delete-btn"
                                    title="Reset Quiz"
                                  >
                                    <FaTrash /> Reset
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Exam Results Section */}
              {activeSection === 'exam-results' && (
                <div className="contacts-section" style={{ maxWidth: '100%', width: '100%' }}>
                  <div className="section-header">
                    <h2><FaChartLine /> Exam Results Management</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {examResults.filter(r => !r.isPublished).length > 0 && (
                        <button 
                          onClick={handlePublishAllResults}
                          className="add-btn"
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                          <FaCheck /> Publish All ({examResults.filter(r => !r.isPublished).length})
                        </button>
                      )}
                      {examResults.filter(r => r.isPublished).length > 0 && (
                        <button 
                          onClick={handleUnpublishAllResults}
                          className="add-btn"
                          style={{ background: '#6c757d' }}
                        >
                          <FaTimes /> Unpublish All ({examResults.filter(r => r.isPublished).length})
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setShowResultForm(!showResultForm);
                          if (showResultForm) {
                            setEditingResult(null);
                            setResultFormData({
                              studentName: '',
                              rollNumber: '',
                              class: '',
                              testType: '',
                              subjects: [{ name: '', marks: 0, maxMarks: 100 }]
                            });
                          }
                        }}
                        className="add-btn"
                      >
                        <FaPlus /> {editingResult ? 'Cancel Edit' : showResultForm ? 'Cancel' : 'Add Result'}
                      </button>
                    </div>
                  </div>

                  {showResultForm && (
                    <div className="form-container" style={{ maxWidth: '100%', width: '100%' }}>
                      <form onSubmit={handleSubmitResult} className="result-form">
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label>Student Name *</label>
                            <input
                              type="text"
                              value={resultFormData.studentName}
                              onChange={(e) => setResultFormData({ ...resultFormData, studentName: e.target.value })}
                              placeholder="Enter student name"
                              required
                              className="video-input"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Roll Number *</label>
                            <input
                              type="text"
                              value={resultFormData.rollNumber}
                              onChange={(e) => setResultFormData({ ...resultFormData, rollNumber: e.target.value })}
                              placeholder="Enter roll number"
                              required
                              className="video-input"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Class *</label>
                            <select
                              value={resultFormData.class}
                              onChange={(e) => setResultFormData({ ...resultFormData, class: e.target.value })}
                              required
                              className="video-input"
                            >
                              <option value="">-- Select Class --</option>
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

                          <div className="form-group">
                            <label>Type of Test *</label>
                            <input
                              type="text"
                              value={resultFormData.testType}
                              onChange={(e) => setResultFormData({ ...resultFormData, testType: e.target.value })}
                              placeholder="Enter type of test (e.g., Mid Term, Unit Test)"
                              required
                              className="video-input"
                            />
                          </div>
                        </div>

                        <div className="subjects-section">
                          <div className="subjects-header">
                            <h3>Subject Marks</h3>
                            <button 
                              type="button" 
                              onClick={handleAddSubject}
                              className="add-subject-btn"
                            >
                              <FaPlus /> Add Subject
                            </button>
                          </div>

                          {resultFormData.subjects.map((subject, index) => (
                            <div key={index} className="subject-row">
                              <input
                                type="text"
                                placeholder="Subject Name"
                                value={subject.name}
                                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                                required
                              />
                              <input
                                type="number"
                                placeholder="Marks Obtained"
                                value={subject.marks}
                                onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                                min="0"
                                required
                              />
                              <input
                                type="number"
                                placeholder="Max Marks"
                                value={subject.maxMarks}
                                onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)}
                                min="1"
                                required
                              />
                              {resultFormData.subjects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubject(index)}
                                  className="remove-subject-btn"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="submit-btn">
                            <FaCheck /> {editingResult ? 'Update Result' : 'Submit Result'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {!showResultForm && examResults.length > 0 && (
                    <div className="filter-section">
                      <div className="class-filter">
                        <label>Filter by Class:</label>
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
                  )}

                  <div className="exam-results-table" style={{ maxWidth: '100%', width: '100%' }}>
                    {examResults.length === 0 ? (
                      <p className="no-contacts">No exam results added yet</p>
                    ) : (
                      <div className="results-grid" style={{ maxWidth: '100%', width: '100%' }}>
                        {(() => {
                          const filteredResults = examResults.filter(result => {
                            const nameMatch = result.studentName.toLowerCase().includes(searchResultQuery.toLowerCase());
                            const classMatch = selectedClass === 'All' || result.class === selectedClass;
                            return nameMatch && classMatch;
                          });

                          if (filteredResults.length === 0) {
                            return <p className="no-contacts">No results found for the selected filters</p>;
                          }

                          return filteredResults.map((result) => (
                          <div 
                            key={result._id} 
                            className="result-card"
                            style={{
                              position: 'relative',
                              background: !result.isPublished 
                                ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)' 
                                : 'white',
                              border: !result.isPublished ? '2px solid #ffc107' : '1px solid #e0e0e0'
                            }}
                          >
                            {/* Publish Status Indicator */}
                            <div 
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: result.isPublished ? '#28a745' : '#dc3545',
                                color: 'white',
                                fontSize: '1.2rem',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                zIndex: 10
                              }}
                              title={result.isPublished ? 'Published' : 'Not Published'}
                            >
                              {result.isPublished ? <FaCheck /> : <FaTimes />}
                            </div>

                            <div className="result-header">
                              <div>
                                <h3 style={{ marginBottom: '0.5rem', color: '#667eea', fontSize: '1.1rem' }}>
                                  {result.testType || 'Exam Result'}
                                </h3>
                                <h3>
                                  {result.studentName}
                                  {!result.isPublished && (
                                    <span 
                                      style={{ 
                                        marginLeft: '0.5rem', 
                                        fontSize: '0.75rem', 
                                        padding: '0.25rem 0.6rem', 
                                        background: '#ffc107', 
                                        color: '#000', 
                                        borderRadius: '20px',
                                        fontWeight: '600'
                                      }}
                                    >
                                      DRAFT
                                    </span>
                                  )}
                                  {result.isPublished && (
                                    <span 
                                      style={{ 
                                        marginLeft: '0.5rem', 
                                        fontSize: '0.75rem', 
                                        padding: '0.25rem 0.6rem', 
                                        background: '#28a745', 
                                        color: '#fff', 
                                        borderRadius: '20px',
                                        fontWeight: '600'
                                      }}
                                    >
                                      PUBLISHED
                                    </span>
                                  )}
                                </h3>
                                <p className="result-meta">
                                  Roll: {result.rollNumber} | Class: {result.class}
                                </p>
                              </div>
                              <div className="result-actions">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}>
                                  <span style={{ 
                                    fontSize: '1.2rem', 
                                    fontWeight: '700',
                                    color: result.percentage >= 60 ? '#28a745' : '#dc3545'
                                  }}>
                                    Grade: {getGrade(result.percentage)}
                                  </span>
                                  <span className={`percentage-badge ${result.percentage >= 60 ? 'passed' : 'failed'}`}>
                                    {result.percentage}%
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleTogglePublishResult(result._id, result.isPublished)}
                                  className="action-btn"
                                  style={{
                                    backgroundColor: result.isPublished ? '#28a745' : '#ffc107',
                                    color: result.isPublished ? 'white' : '#000',
                                    fontWeight: '600'
                                  }}
                                  title={result.isPublished ? 'Click to unpublish (hide from student)' : 'Click to publish (show to student)'}
                                >
                                  {result.isPublished ? <><FaCheck /> Published</> : <><FaTimes /> Unpublished</>}
                                </button>
                                <button
                                  onClick={() => handleEditResult(result)}
                                  className="action-btn edit-btn"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => generateMarkCardPDF(result)}
                                  className="action-btn"
                                  style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    fontWeight: '600'
                                  }}
                                  title="Download Mark Sheet"
                                >
                                  <FaDownload /> Download
                                </button>
                                <button
                                  onClick={() => handleDeleteResult(result._id)}
                                  className="action-btn delete-btn"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>

                            <table className="subjects-table">
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
                                <tr className="total-row">
                                  <td><strong>Total</strong></td>
                                  <td><strong>{result.obtainedMarks}</strong></td>
                                  <td><strong>{result.totalMarks}</strong></td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="result-footer">
                              <p>Exam Result Date: {new Date(result.examDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {activeSection === 'videos' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaVideo /> Study Videos Management</h2>
                    <button 
                      onClick={() => {
                        setShowVideoForm(!showVideoForm);
                        if (showVideoForm) {
                          setEditingVideo(null);
                          setVideoFormData({ title: '', description: '', videoUrl: '', category: 'General' });
                        }
                      }}
                      className="add-btn"
                    >
                      <FaPlus /> {editingVideo ? 'Cancel Edit' : showVideoForm ? 'Cancel' : 'Add Video'}
                    </button>
                  </div>

                  {showVideoForm && (
                    <div className="form-container">
                      <form onSubmit={handleSubmitVideo} className="result-form">
                        <div className="form-group">
                          <label>Video Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={videoFormData.title}
                            onChange={handleVideoChange}
                            placeholder="Enter video title"
                            required
                            className="video-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={videoFormData.description}
                            onChange={handleVideoChange}
                            placeholder="Enter video description (optional)"
                            rows="3"
                            className="video-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Video URL * (YouTube or Google Drive)</label>
                          <input
                            type="text"
                            name="videoUrl"
                            value={videoFormData.videoUrl}
                            onChange={handleVideoChange}
                            placeholder="Paste YouTube or Google Drive video link"
                            required
                            className="video-input"
                          />
                          <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            Supports: YouTube (watch, embed, short link) or Google Drive shareable video link
                          </small>
                        </div>

                        <div className="form-group">
                          <label>Category</label>
                          <select
                            name="category"
                            value={videoFormData.category}
                            onChange={handleVideoChange}
                            className="video-input"
                          >
                            <option value="General">General</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="submit-btn">
                            <FaCheck /> {editingVideo ? 'Update Video' : 'Add Video'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Search Box */}
                  <div className="search-container-admin">
                    <input
                      type="text"
                      placeholder="Search videos by title, description, or category..."
                      value={searchAdminVideoQuery}
                      onChange={(e) => {
                        setSearchAdminVideoQuery(e.target.value);
                        setVisibleAdminVideoCount(10); // Reset count when searching
                      }}
                      className="search-input-admin"
                    />
                    <FaVideo className="search-icon-admin" />
                  </div>

                  <div className="videos-grid">
                    {videos.length === 0 ? (
                      <p className="no-contacts">No videos added yet</p>
                    ) : (
                      (() => {
                        const filteredVideos = videos.filter(video => {
                          const searchLower = searchAdminVideoQuery.toLowerCase();
                          return (
                            video.title.toLowerCase().includes(searchLower) ||
                            (video.description && video.description.toLowerCase().includes(searchLower)) ||
                            video.category.toLowerCase().includes(searchLower)
                          );
                        });

                        const displayedVideos = filteredVideos.slice(0, visibleAdminVideoCount);

                        if (filteredVideos.length === 0) {
                          return <p className="no-contacts">No videos match your search</p>;
                        }

                        return (
                          <>
                            {displayedVideos.map((video) => (
                              <div key={video._id} className="video-card">
                                <div className="video-thumbnail">
                                  <iframe
                                    src={(() => {
                                      if (video.videoType === 'drive' && video.videoId) {
                                        return `https://drive.google.com/file/d/${video.videoId}/preview`;
                                      } else if (video.videoId) {
                                        return `https://www.youtube.com/embed/${video.videoId}`;
                                      }
                                      return '';
                                    })()}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                  />
                                </div>
                                <div className="video-info">
                                  <h3>{video.title}</h3>
                                  {video.description && <p>{video.description}</p>}
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className="video-category">{video.category}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#666', backgroundColor: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                      {video.videoType === 'drive' ? 'Google Drive' : 'YouTube'}
                                    </span>
                                  </div>
                                </div>
                                <div className="video-actions">
                                  <button
                                    onClick={() => handleEditVideo(video)}
                                    className="action-btn edit-btn"
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVideo(video._id)}
                                    className="action-btn delete-btn"
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Load More Button */}
                            {filteredVideos.length > visibleAdminVideoCount && (
                              <div className="load-more-container-admin">
                                <button
                                  onClick={() => setVisibleAdminVideoCount(prev => prev + 10)}
                                  className="load-more-btn"
                                >
                                  Load More Videos ({filteredVideos.length - visibleAdminVideoCount} remaining)
                                </button>
                              </div>
                            )}

                            {/* Results Counter */}
                            <div className="results-counter-admin">
                              Showing {displayedVideos.length} of {filteredVideos.length} video(s)
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {activeSection === 'notes' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaFilePdf /> Study Notes (PDF) Management</h2>
                    <button 
                      onClick={() => {
                        setShowNoteForm(!showNoteForm);
                        if (showNoteForm) {
                          setEditingNote(null);
                          setNoteFormData({ title: '', description: '', category: 'General', pdfUrl: '' });
                        }
                      }}
                      className="add-btn"
                    >
                      <FaPlus /> {editingNote ? 'Cancel Edit' : showNoteForm ? 'Cancel' : 'Add Note'}
                    </button>
                  </div>

                  {showNoteForm && (
                    <div className="form-container">
                      <form className="result-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                          <label>Note Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={noteFormData.title}
                            onChange={handleNoteChange}
                            placeholder="Enter note title"
                            required
                            className="video-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={noteFormData.description}
                            onChange={handleNoteChange}
                            placeholder="Enter note description (optional)"
                            rows="3"
                            className="video-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Category</label>
                          <select
                            name="category"
                            value={noteFormData.category}
                            onChange={handleNoteChange}
                            className="video-input"
                          >
                            <option value="General">General</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Google Drive PDF Link *</label>
                          <input
                            type="url"
                            name="pdfUrl"
                            value={noteFormData.pdfUrl || ''}
                            onChange={handleNoteChange}
                            placeholder="Enter Google Drive shareable link"
                            required
                            className="video-input"
                          />
                          <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            Tip: Upload PDF to Google Drive, click Share, and paste the link here
                          </small>
                        </div>

                        <button
                          onClick={handleNoteSave}
                          className="action-btn save-btn"
                          style={{ marginTop: '1rem' }}
                        >
                          {editingNote ? 'Update Note' : 'Add Note'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Search Box */}
                  <div className="search-container" style={{ marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="Search notes by title, description, or category..."
                      value={searchAdminNoteQuery}
                      onChange={(e) => {
                        setSearchAdminNoteQuery(e.target.value);
                        setVisibleAdminNoteCount(10); // Reset count when searching
                      }}
                      className="search-input"
                    />
                  </div>

                  <div className="notes-grid">
                    {notes.length === 0 ? (
                      <p className="no-contacts">No notes added yet</p>
                    ) : (
                      (() => {
                        const filteredNotes = notes.filter(note => {
                          const searchLower = searchAdminNoteQuery.toLowerCase();
                          return (
                            note.title.toLowerCase().includes(searchLower) ||
                            (note.description && note.description.toLowerCase().includes(searchLower)) ||
                            note.category.toLowerCase().includes(searchLower)
                          );
                        });

                        const displayedNotes = filteredNotes.slice(0, visibleAdminNoteCount);

                        if (filteredNotes.length === 0) {
                          return <p className="no-contacts">No notes match your search.</p>;
                        }

                        return (
                          <>
                            {displayedNotes.map((note) => (
                              <div key={note._id} className="note-card">
                                <div className="note-icon">
                                  <FaFilePdf />
                                </div>
                                <div className="note-info">
                                  <h4>{note.title}</h4>
                                  {note.description && <p>{note.description}</p>}
                                  <span className="note-category">{note.category}</span>
                                </div>
                                <div className="note-footer">
                                  <a 
                                    href={note.pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="download-note-btn"
                                  >
                                    <FaDownload /> View PDF
                                  </a>
                                </div>
                                <div className="note-actions">
                                  <button
                                    onClick={() => handleEditNote(note)}
                                    className="action-btn edit-btn"
                                  >
                                    <FaEdit /> Edit Info
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(note._id, note.publicId)}
                                    className="action-btn delete-btn"
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Load More Button */}
                            {filteredNotes.length > visibleAdminNoteCount && (
                              <div className="load-more-container-admin" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                <button
                                  onClick={() => setVisibleAdminNoteCount(prev => prev + 10)}
                                  className="load-more-btn"
                                >
                                  Load More Notes ({filteredNotes.length - visibleAdminNoteCount} remaining)
                                </button>
                              </div>
                            )}

                            {/* Results Counter */}
                            <div className="results-counter-admin" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                              Showing {displayedNotes.length} of {filteredNotes.length} note(s)
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* Notices Section */}
              {activeSection === 'notices' && (
                <div className="contacts-section">
                  <div className="section-header">
                    <h2><FaClipboard /> Notice Board Management</h2>
                    <button 
                      onClick={() => setShowNoticeForm(!showNoticeForm)} 
                      className="add-notification-btn"
                    >
                      <FaPlus /> Add Notice
                    </button>
                  </div>

                  {showNoticeForm && (
                    <div className="notification-form-card">
                      <h3>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h3>
                      <div className="notice-form">
                        {/* File Type Selection - Always shown first */}
                        <div className="form-group">
                          <label>Notice Type *</label>
                          <select
                            name="fileType"
                            value={noticeFormData.fileType}
                            onChange={handleNoticeChange}
                            required
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: '600',
                              padding: '1rem',
                              background: noticeFormData.fileType ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                              color: noticeFormData.fileType ? 'white' : '#495057',
                              border: noticeFormData.fileType ? 'none' : '2px solid #e0e0e0'
                            }}
                          >
                            <option value="">-- Select Notice Type --</option>
                            <option value="pdf">📄 PDF Document</option>
                            <option value="image">🖼️ Image</option>
                            <option value="text">📝 Text Document</option>
                          </select>
                        </div>

                        {/* Show form fields only after selecting type */}
                        {noticeFormData.fileType && (
                          <>
                            <div className="form-group">
                              <label>Title *</label>
                              <input
                                type="text"
                                name="title"
                                value={noticeFormData.title}
                                onChange={handleNoticeChange}
                                placeholder="Enter notice title"
                                required
                              />
                            </div>

                            {/* Description - Only for Text type (this IS the text content) */}
                            {noticeFormData.fileType === 'text' && (
                              <div className="form-group">
                                <label>Text Content *</label>
                                <textarea
                                  name="description"
                                  value={noticeFormData.description}
                                  onChange={handleNoticeChange}
                                  placeholder="Enter the text content for this notice"
                                  rows="6"
                                  required
                                />
                                <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                  This text will be displayed as the notice content
                                </small>
                              </div>
                            )}

                            {/* URL Field - Only for PDF type */}
                            {noticeFormData.fileType === 'pdf' && (
                              <div className="form-group">
                                <label>📄 PDF File URL *</label>
                                <input
                                  type="url"
                                  name="fileUrl"
                                  value={noticeFormData.fileUrl}
                                  onChange={handleNoticeChange}
                                  placeholder="Enter PDF URL (Google Drive, Dropbox, etc.)"
                                  required
                                />
                                <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                  Tip: For Google Drive, use share link and ensure viewing permissions are set to "Anyone with the link"
                                </small>
                              </div>
                            )}

                            {/* Image Upload - Only for Image type */}
                            {noticeFormData.fileType === 'image' && (
                              <div className="form-group">
                                <label>🖼️ Upload Image *</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleNoticeImageUpload}
                                  disabled={uploadingNoticeImage}
                                  style={{
                                    padding: '0.75rem',
                                    border: '2px dashed #667eea',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                  Maximum file size: 2MB. Supported formats: JPG, PNG, GIF, WEBP
                                </small>
                                {uploadingNoticeImage && (
                                  <div style={{ marginTop: '1rem', textAlign: 'center', color: '#667eea' }}>
                                    <FaUpload style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                                    <p>Uploading image...</p>
                                  </div>
                                )}
                                {noticeImagePreview && !uploadingNoticeImage && (
                                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                    <img
                                      src={noticeImagePreview}
                                      alt="Preview"
                                      style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        borderRadius: '8px',
                                        border: '2px solid #e0e0e0'
                                      }}
                                    />
                                    <p style={{ color: '#28a745', marginTop: '0.5rem', fontWeight: '600' }}>
                                      ✓ Image uploaded successfully
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="form-actions">
                              <button 
                                type="button" 
                                onClick={handleNoticeSave}
                                className="send-btn"
                              >
                                <FaPaperPlane /> {editingNotice ? 'Update Notice' : 'Add Notice'}
                              </button>
                              <button 
                                type="button" 
                                onClick={handleCancelNoticeForm}
                                className="cancel-form-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        )}

                        {/* Show instruction when no type selected */}
                        {!noticeFormData.fileType && (
                          <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            background: '#f8f9fa',
                            borderRadius: '10px',
                            marginTop: '1rem'
                          }}>
                            <p style={{ color: '#6c757d', fontSize: '1rem', margin: 0 }}>
                              👆 Please select a notice type to continue
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="notes-grid">
                    {notices.length === 0 ? (
                      <p className="no-contacts">No notices added yet</p>
                    ) : (
                      notices.map((notice) => (
                        <div key={notice._id} className="note-card">
                          <div className="note-header">
                            <div className="note-type">
                              {notice.fileType === 'pdf' && <FaFilePdf className="file-icon pdf-icon" />}
                              {notice.fileType === 'image' && <FaImage className="file-icon image-icon" />}
                              {notice.fileType === 'text' && <FaFileAlt className="file-icon text-icon" />}
                              <span className="file-type-badge">{notice.fileType.toUpperCase()}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, flex: 1 }}>{notice.title}</h3>
                            {notice.fileType === 'pdf' && (
                              <a
                                href={notice.fileUrl}
                                download
                                className="action-btn view-btn"
                                style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                              >
                                <FaDownload /> Download
                              </a>
                            )}
                            {notice.fileType === 'image' && (
                              <a
                                href={notice.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn view-btn"
                                style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
                              >
                                <FaEye /> View
                              </a>
                            )}
                          </div>
                          {notice.description && (
                            <p className="note-description">{notice.description}</p>
                          )}
                          <div className="note-meta">
                            <span>📅 {new Date(notice.createdAt).toLocaleDateString()}</span>
                            {notice.fileName && (
                              <span>📎 {notice.fileName}</span>
                            )}
                          </div>
                          <div className="note-actions">
                            <button
                              onClick={() => handleEditNotice(notice)}
                              className="action-btn edit-btn"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice._id)}
                              className="action-btn delete-btn"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Messages Section */}
              {activeSection === 'messages' && (
                <div className="contacts-section">
                  <h2>Student & Teacher Messages</h2>
                  <div className="contacts-table">
                    {messages.length === 0 ? (
                      <p className="no-contacts">No messages yet</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>User Type</th>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((msg) => (
                            <tr key={msg._id}>
                              <td>
                                <span className={`user-type-badge ${msg.userType}`}>
                                  {msg.userType === 'student' ? 'Student' : 'Teacher'}
                                </span>
                              </td>
                              <td>{msg.userName}</td>
                              <td>{msg.subject}</td>
                              <td className="message-cell">{msg.message}</td>
                              <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="delete-btn"
                                  title="Delete message"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Public Teachers Section */}
              {activeSection === 'public-teachers' && (
                <div className="public-teachers-section">
                  <div className="section-header-with-btn">
                    <h2>Public Teachers</h2>
                    <button 
                      className="add-btn"
                      onClick={() => {
                        setShowPublicTeacherForm(true);
                        setEditingPublicTeacher(null);
                        setPublicTeacherFormData({
                          name: '',
                          subject: '',
                          qualification: '',
                          experience: '',
                          gmail: '',
                          mobile: '',
                          image: ''
                        });
                      }}
                    >
                      <FaPlus /> Add Teacher
                    </button>
                  </div>

                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search teachers by name..."
                      value={searchPublicTeacherQuery}
                      onChange={(e) => setSearchPublicTeacherQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  {showPublicTeacherForm && (
                    <div className="form-modal">
                      <div className="form-container">
                        <h3>{editingPublicTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                        <form onSubmit={handlePublicTeacherSubmit}>
                          <div className="form-group">
                            <label>Teacher Image * (Max 1 MB)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePublicTeacherImageChange}
                              disabled={uploadingPublicTeacherImage}
                            />
                            {uploadingPublicTeacherImage && <p>Uploading image...</p>}
                            {publicTeacherFormData.image && (
                              <img 
                                src={publicTeacherFormData.image} 
                                alt="Preview" 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                              />
                            )}
                          </div>

                          <div className="form-group">
                            <label>Name *</label>
                            <input
                              type="text"
                              value={publicTeacherFormData.name}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, name: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>Subject</label>
                            <input
                              type="text"
                              value={publicTeacherFormData.subject}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, subject: e.target.value})}
                            />
                          </div>

                          <div className="form-group">
                            <label>Qualification</label>
                            <input
                              type="text"
                              value={publicTeacherFormData.qualification}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, qualification: e.target.value})}
                            />
                          </div>

                          <div className="form-group">
                            <label>Experience</label>
                            <input
                              type="text"
                              value={publicTeacherFormData.experience}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, experience: e.target.value})}
                              placeholder="e.g., 5 Years"
                            />
                          </div>

                          <div className="form-group">
                            <label>Gmail</label>
                            <input
                              type="email"
                              value={publicTeacherFormData.gmail}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, gmail: e.target.value})}
                              placeholder="teacher@gmail.com"
                            />
                          </div>

                          <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                              type="tel"
                              value={publicTeacherFormData.mobile}
                              onChange={(e) => setPublicTeacherFormData({...publicTeacherFormData, mobile: e.target.value})}
                              placeholder="Enter 10-digit mobile number"
                              maxLength="10"
                              pattern="[0-9]{10}"
                            />
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={uploadingPublicTeacherImage}>
                              {editingPublicTeacher ? 'Update' : 'Add'} Teacher
                            </button>
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => {
                                setShowPublicTeacherForm(false);
                                setEditingPublicTeacher(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="public-teachers-grid">
                    {(() => {
                      const filteredTeachers = publicTeachers.filter(teacher =>
                        teacher.name.toLowerCase().includes(searchPublicTeacherQuery.toLowerCase())
                      );
                      const displayedTeachers = searchPublicTeacherQuery ? filteredTeachers : filteredTeachers.slice(0, 20);
                      
                      if (displayedTeachers.length === 0) {
                        return <p className="no-data">{searchPublicTeacherQuery ? 'No teachers match your search.' : 'No public teachers added yet'}</p>;
                      }
                      
                      return (
                        <>
                          {!searchPublicTeacherQuery && publicTeachers.length > 20 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', marginBottom: '1rem' }}>
                              Showing 20 of {publicTeachers.length} teachers
                            </p>
                          )}
                          {searchPublicTeacherQuery && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', marginBottom: '1rem' }}>
                              Found {filteredTeachers.length} teacher(s)
                            </p>
                          )}
                          {displayedTeachers.map((teacher) => (
                            <div key={teacher._id} className="public-teacher-card">
                              <div className="teacher-image">
                                <img src={teacher.image} alt={teacher.name} />
                              </div>
                              <div className="teacher-details">
                                <h3>{teacher.name}</h3>
                                {teacher.subject && <p><strong>Subject:</strong> {teacher.subject}</p>}
                                {teacher.qualification && <p><strong>Qualification:</strong> {teacher.qualification}</p>}
                                {teacher.experience && <p><strong>Experience:</strong> {teacher.experience}</p>}
                                {teacher.gmail && <p><strong>Gmail:</strong> {teacher.gmail}</p>}
                                {teacher.mobile && <p><strong>Mobile:</strong> {teacher.mobile}</p>}
                              </div>
                              <div className="teacher-actions">
                                <button 
                                  className="edit-btn"
                                  onClick={() => {
                                    setEditingPublicTeacher(teacher);
                                    setPublicTeacherFormData(teacher);
                                    setShowPublicTeacherForm(true);
                                  }}
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button 
                                  className="delete-btn"
                                  onClick={() => handleDeletePublicTeacher(teacher._id)}
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Public Members Section */}
              {activeSection === 'public-members' && (
                <div className="public-members-section">
                  <div className="section-header-with-btn">
                    <h2>Public Members</h2>
                    <button 
                      className="add-btn"
                      onClick={() => {
                        setShowPublicMemberForm(true);
                        setEditingPublicMember(null);
                        setPublicMemberFormData({
                          name: '',
                          designation: '',
                          gmail: '',
                          phone: '',
                          image: ''
                        });
                      }}
                    >
                      <FaPlus /> Add Member
                    </button>
                  </div>

                  {showPublicMemberForm && (
                    <div className="form-modal">
                      <div className="form-container">
                        <h3>{editingPublicMember ? 'Edit Member' : 'Add New Member'}</h3>
                        <form onSubmit={handlePublicMemberSubmit}>
                          <div className="form-group">
                            <label>Member Image * (Max 1 MB)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePublicMemberImageChange}
                              disabled={uploadingPublicMemberImage}
                            />
                            {uploadingPublicMemberImage && <p>Uploading image...</p>}
                            {publicMemberFormData.image && (
                              <img 
                                src={publicMemberFormData.image} 
                                alt="Preview" 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                              />
                            )}
                          </div>

                          <div className="form-group">
                            <label>Name *</label>
                            <input
                              type="text"
                              value={publicMemberFormData.name}
                              onChange={(e) => setPublicMemberFormData({...publicMemberFormData, name: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>Designation</label>
                            <input
                              type="text"
                              value={publicMemberFormData.designation}
                              onChange={(e) => setPublicMemberFormData({...publicMemberFormData, designation: e.target.value})}
                              placeholder="e.g., President, Secretary"
                            />
                          </div>

                          <div className="form-group">
                            <label>Gmail</label>
                            <input
                              type="email"
                              value={publicMemberFormData.gmail}
                              onChange={(e) => setPublicMemberFormData({...publicMemberFormData, gmail: e.target.value})}
                              placeholder="member@gmail.com"
                            />
                          </div>

                          <div className="form-group">
                            <label>Phone Number</label>
                            <input
                              type="tel"
                              value={publicMemberFormData.phone}
                              onChange={(e) => setPublicMemberFormData({...publicMemberFormData, phone: e.target.value})}
                              placeholder="Enter 10-digit phone number"
                              maxLength="10"
                              pattern="[0-9]{10}"
                            />
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={uploadingPublicMemberImage}>
                              {editingPublicMember ? 'Update' : 'Add'} Member
                            </button>
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => {
                                setShowPublicMemberForm(false);
                                setEditingPublicMember(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search members by name..."
                      value={searchPublicMemberQuery}
                      onChange={(e) => setSearchPublicMemberQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="public-members-grid">
                    {(() => {
                      const filteredMembers = publicMembers.filter(member =>
                        member.name.toLowerCase().includes(searchPublicMemberQuery.toLowerCase())
                      );
                      const displayedMembers = searchPublicMemberQuery ? filteredMembers : filteredMembers.slice(0, 20);
                      
                      return (
                        <>
                          {!searchPublicMemberQuery && publicMembers.length > 20 && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                              Showing 20 of {publicMembers.length} members
                            </p>
                          )}
                          {searchPublicMemberQuery && (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                              Found {filteredMembers.length} member(s)
                            </p>
                          )}
                          {displayedMembers.length === 0 ? (
                            <p className="no-data" style={{ gridColumn: '1 / -1' }}>No members found</p>
                          ) : (
                            displayedMembers.map((member) => (
                              <div key={member._id} className="public-member-card">
                                <div className="member-image">
                                  <img src={member.image} alt={member.name} />
                                </div>
                                <div className="member-details">
                                  <h3>{member.name}</h3>
                                  {member.designation && <p><strong>Designation:</strong> {member.designation}</p>}
                                  {member.gmail && <p><strong>Gmail:</strong> {member.gmail}</p>}
                                  {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
                                </div>
                                <div className="member-actions">
                                  <button 
                                    className="edit-btn"
                                    onClick={() => {
                                      setEditingPublicMember(member);
                                      setPublicMemberFormData(member);
                                      setShowPublicMemberForm(true);
                                    }}
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button 
                                    className="delete-btn"
                                    onClick={() => handleDeletePublicMember(member._id)}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Progress Card Section */}
              {activeSection === 'progress-card' && (
                <div className="contacts-section" style={{ maxWidth: '100%', width: '100%' }}>
                  <div className="section-header">
                    <h2><FaFileAlt /> Progress Card Management</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!showProgressCardForm && progressCards.length > 0 && (
                        <>
                          <button 
                            onClick={handlePublishAllProgressCards}
                            style={{ padding: '0.6rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                            title="Publish all progress cards"
                          >
                            <FaCheck /> Publish All
                          </button>
                          <button 
                            onClick={handleUnpublishAllProgressCards}
                            style={{ padding: '0.6rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                            title="Unpublish all progress cards"
                          >
                            <FaTimes /> Unpublish All
                          </button>
                        </>
                      )}
                      <button 
                      onClick={() => {
                        setShowProgressCardForm(!showProgressCardForm);
                        if (showProgressCardForm) {
                          setEditingProgressCard(null);
                          setProgressCardFormData({
                            year: '',
                            class: '',
                            studentId: '',
                            studentName: '',
                            rollNumber: '',
                            aadhaarNumber: '',
                            fatherName: '',
                            motherName: '',
                            subjects: [],
                            remarks: '',
                            promotionStatus: '',
                            halfYearlyWorkingDays: 0,
                            halfYearlyDaysPresent: 0,
                            annualWorkingDays: 0,
                            annualDaysPresent: 0
                          });
                        }
                      }}
                      className="add-btn"
                    >
                      <FaPlus /> {editingProgressCard ? 'Cancel Edit' : showProgressCardForm ? 'Cancel' : 'Add Progress Card'}
                    </button>
                    </div>
                  </div>

                  {showProgressCardForm && (
                    <div className="form-container" style={{ maxWidth: '100%', width: '100%' }}>
                      <form onSubmit={handleSubmitProgressCard} className="result-form">
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label>Academic Year *</label>
                            <input
                              type="text"
                              value={progressCardFormData.year || ''}
                              onChange={(e) => setProgressCardFormData({ ...progressCardFormData, year: e.target.value })}
                              placeholder="e.g., 2024-2025"
                              required
                              className="video-input"
                            />
                          </div>

                          <div className="form-group">
                            <label>Select Class *</label>
                            <select
                              value={progressCardFormData.class}
                              onChange={handleProgressClassChange}
                              required
                              disabled={editingProgressCard !== null}
                              className="video-input"
                            >
                              <option value="">-- Select Class --</option>
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

                          <div className="form-group">
                            <label>Select Student *</label>
                            <select
                              value={progressCardFormData.studentId}
                              onChange={handleProgressStudentChange}
                              required
                              disabled={!progressCardFormData.class || editingProgressCard !== null}
                              className="video-input"
                            >
                              <option value="">-- Select Student --</option>
                              {students.filter(s => s.class === progressCardFormData.class).map(student => (
                                <option key={student._id} value={student._id}>
                                  {student.firstName} {student.lastName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {progressCardFormData.studentId && (
                          <>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                              <div>
                                <strong>Student Name:</strong> {progressCardFormData.studentName}
                              </div>
                              <div>
                                <strong>Roll No:</strong> {progressCardFormData.rollNumber}
                              </div>
                              <div>
                                <strong>Father's Name:</strong> {progressCardFormData.fatherName}
                              </div>
                              <div>
                                <strong>Mother's Name:</strong> {progressCardFormData.motherName}
                              </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                              <label>Aadhaar Number *</label>
                              <input
                                type="text"
                                value={progressCardFormData.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                  if (value.length <= 12) {
                                    setProgressCardFormData({
                                      ...progressCardFormData,
                                      aadhaarNumber: value
                                    });
                                  }
                                }}
                                placeholder="1234 5678 9012"
                                maxLength="14"
                                required
                                className="video-input"
                                style={{ fontSize: '1rem', letterSpacing: '1px' }}
                              />
                              <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>
                                {progressCardFormData.aadhaarNumber.length}/12 digits
                              </small>
                            </div>
                          </>
                        )}

                        {progressCardFormData.studentId && (
                          <div className="subjects-section" style={{ marginTop: '2rem' }}>
                            <div className="subjects-header">
                              <h3>Add Subjects</h3>
                              <button 
                                type="button" 
                                onClick={handleAddProgressSubject}
                                className="add-subject-btn"
                              >
                                <FaPlus /> Add Subject
                              </button>
                            </div>

                            {progressCardFormData.subjects.map((subject, index) => (
                              <div key={index} style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px solid #e0e0e0', borderRadius: '10px', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                  <input
                                    type="text"
                                    placeholder="Subject Name"
                                    value={subject.name}
                                    onChange={(e) => handleProgressSubjectChange(index, 'name', e.target.value)}
                                    required
                                    style={{ width: '250px', padding: '0.6rem', border: '2px solid #ddd', borderRadius: '5px', fontSize: '1rem', fontWeight: '600' }}
                                  />
                                  {progressCardFormData.subjects.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveProgressSubject(index)}
                                      className="remove-subject-btn"
                                    >
                                      <FaTimes /> Remove
                                    </button>
                                  )}
                                </div>

                                {/* 1st Unit Test */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                  <h4 style={{ marginBottom: '1rem', color: '#495057' }}>1st Unit Test</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Full Marks (FM)</label>
                                      <input
                                        type="number"
                                        value={subject.test1FM}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test1FM', e.target.value)}
                                        min="0"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Marks Obtained</label>
                                      <input
                                        type="number"
                                        value={subject.test1Marks}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test1Marks', e.target.value)}
                                        min="0"
                                        max={subject.test1FM}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 2nd Unit Test */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                  <h4 style={{ marginBottom: '1rem', color: '#495057' }}>2nd Unit Test</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Full Marks (FM)</label>
                                      <input
                                        type="number"
                                        value={subject.test2FM}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test2FM', e.target.value)}
                                        min="0"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Marks Obtained</label>
                                      <input
                                        type="number"
                                        value={subject.test2Marks}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test2Marks', e.target.value)}
                                        min="0"
                                        max={subject.test2FM}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Half Yearly */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                                  <h4 style={{ marginBottom: '1rem', color: '#856404' }}>Half Yearly</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Full Marks (FM)</label>
                                      <input
                                        type="number"
                                        value={subject.halfYearlyFM}
                                        onChange={(e) => handleProgressSubjectChange(index, 'halfYearlyFM', e.target.value)}
                                        min="0"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Marks Obtained</label>
                                      <input
                                        type="number"
                                        value={subject.halfYearlyMarks}
                                        onChange={(e) => handleProgressSubjectChange(index, 'halfYearlyMarks', e.target.value)}
                                        min="0"
                                        max={subject.halfYearlyFM}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 3rd Unit Test */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                  <h4 style={{ marginBottom: '1rem', color: '#495057' }}>3rd Unit Test</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Full Marks (FM)</label>
                                      <input
                                        type="number"
                                        value={subject.test3FM}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test3FM', e.target.value)}
                                        min="0"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Marks Obtained</label>
                                      <input
                                        type="number"
                                        value={subject.test3Marks}
                                        onChange={(e) => handleProgressSubjectChange(index, 'test3Marks', e.target.value)}
                                        min="0"
                                        max={subject.test3FM}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Annual */}
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#d1ecf1', borderRadius: '8px' }}>
                                  <h4 style={{ marginBottom: '1rem', color: '#0c5460' }}>Annual</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Full Marks (FM)</label>
                                      <input
                                        type="number"
                                        value={subject.annualFM}
                                        onChange={(e) => handleProgressSubjectChange(index, 'annualFM', e.target.value)}
                                        min="0"
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Marks Obtained</label>
                                      <input
                                        type="number"
                                        value={subject.annualMarks}
                                        onChange={(e) => handleProgressSubjectChange(index, 'annualMarks', e.target.value)}
                                        min="0"
                                        max={subject.annualFM}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Remarks */}
                                <div style={{ marginTop: '1rem' }}>
                                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#495057' }}>Remarks (Optional)</label>
                                  <textarea
                                    value={subject.remarks || ''}
                                    onChange={(e) => handleProgressSubjectChange(index, 'remarks', e.target.value)}
                                    placeholder="Enter remarks for this subject..."
                                    className="video-input"
                                    rows="2"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
                                  />
                                </div>
                              </div>
                            ))}

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                              <label>General Remarks (Optional)</label>
                              <textarea
                                value={progressCardFormData.remarks}
                                onChange={(e) => setProgressCardFormData({ ...progressCardFormData, remarks: e.target.value })}
                                placeholder="Enter general remarks about student's overall performance..."
                                className="video-input"
                                rows="3"
                              />
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Promotion Status *</label>
                              <div style={{ display: 'flex', gap: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.5rem', border: '2px solid #ddd', borderRadius: '8px', background: progressCardFormData.promotionStatus === 'Promoted' ? '#d4edda' : 'white', borderColor: progressCardFormData.promotionStatus === 'Promoted' ? '#28a745' : '#ddd' }}>
                                  <input
                                    type="radio"
                                    name="promotionStatus"
                                    value="Promoted"
                                    checked={progressCardFormData.promotionStatus === 'Promoted'}
                                    onChange={(e) => setProgressCardFormData({ ...progressCardFormData, promotionStatus: e.target.value })}
                                    required
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '1rem', fontWeight: '600', color: progressCardFormData.promotionStatus === 'Promoted' ? '#28a745' : '#495057' }}>✓ Promoted to Next Higher Class</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.5rem', border: '2px solid #ddd', borderRadius: '8px', background: progressCardFormData.promotionStatus === 'Not Promoted' ? '#f8d7da' : 'white', borderColor: progressCardFormData.promotionStatus === 'Not Promoted' ? '#dc3545' : '#ddd' }}>
                                  <input
                                    type="radio"
                                    name="promotionStatus"
                                    value="Not Promoted"
                                    checked={progressCardFormData.promotionStatus === 'Not Promoted'}
                                    onChange={(e) => setProgressCardFormData({ ...progressCardFormData, promotionStatus: e.target.value })}
                                    required
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                  />
                                  <span style={{ fontSize: '1rem', fontWeight: '600', color: progressCardFormData.promotionStatus === 'Not Promoted' ? '#dc3545' : '#495057' }}>✗ Not Promoted</span>
                                </label>
                              </div>
                            </div>
                            
                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>Attendance Information</label>
                              
                              {/* Half Yearly Attendance */}
                              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
                                <h4 style={{ marginBottom: '1rem', color: '#856404', fontSize: '0.95rem' }}>Half Yearly Attendance</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Total Working Days</label>
                                    <input
                                      type="number"
                                      value={progressCardFormData.halfYearlyWorkingDays}
                                      onChange={(e) => setProgressCardFormData({ ...progressCardFormData, halfYearlyWorkingDays: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                      min="0"
                                      required
                                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Days Present</label>
                                    <input
                                      type="number"
                                      value={progressCardFormData.halfYearlyDaysPresent}
                                      onChange={(e) => setProgressCardFormData({ ...progressCardFormData, halfYearlyDaysPresent: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                      min="0"
                                      max={progressCardFormData.halfYearlyWorkingDays || 0}
                                      required
                                      style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                    />
                                  </div>
                                </div>
                                {progressCardFormData.halfYearlyWorkingDays > 0 && (
                                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#667eea', fontWeight: '600' }}>
                                    Attendance: {((progressCardFormData.halfYearlyDaysPresent / progressCardFormData.halfYearlyWorkingDays) * 100).toFixed(2)}%
                                  </div>
                                )}
                              </div>

                              {/* Annual Attendance */}
                              <div style={{ padding: '1rem', background: '#d1ecf1', borderRadius: '8px', border: '2px solid #17a2b8' }}>
                                <h4 style={{ marginBottom: '1rem', color: '#0c5460', fontSize: '0.95rem' }}>Annual Attendance</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#6c757d' }}>Total Working Days</label>
                                    <input
                                      type="number"
                                      value={progressCardFormData.annualWorkingDays}
                                      onChange={(e) => setProgressCardFormData({ ...progressCardFormData, annualWorkingDays: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                      min="0"
                                      required
                                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#28a745' }}>Days Present</label>
                                    <input
                                      type="number"
                                      value={progressCardFormData.annualDaysPresent}
                                      onChange={(e) => setProgressCardFormData({ ...progressCardFormData, annualDaysPresent: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                      min="0"
                                      max={progressCardFormData.annualWorkingDays || 0}
                                      required
                                      style={{ width: '100%', padding: '0.5rem', border: '2px solid #28a745', borderRadius: '5px', fontWeight: '600' }}
                                    />
                                  </div>
                                </div>
                                {progressCardFormData.annualWorkingDays > 0 && (
                                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#667eea', fontWeight: '600' }}>
                                    Attendance: {((progressCardFormData.annualDaysPresent / progressCardFormData.annualWorkingDays) * 100).toFixed(2)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="form-actions" style={{ marginTop: '2rem' }}>
                          <button type="submit" className="submit-btn">
                            <FaCheck /> {editingProgressCard ? 'Update Progress Card' : 'Save Progress Card'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Progress Cards List */}
                  {!showProgressCardForm && progressCards.length > 0 && (
                    <div style={{ marginTop: '2rem', width: '100%', maxWidth: '100%' }}>
                      <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Saved Progress Cards</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                        {progressCards.map((card) => (
                          <div key={card._id} className="result-card" style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '1.5rem', width: '100%', maxWidth: '100%' }}>
                            <div className="result-header" style={{ marginBottom: '1rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '1rem' }}>
                              <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.2rem' }}>
                                {card.studentName}
                              </h3>
                              <p className="result-meta" style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                {card.year && <span style={{ fontWeight: '600', color: '#667eea' }}>{card.year} | </span>}
                                Roll: {card.rollNumber} | Class: {card.class}
                              </p>
                            </div>

                            <div style={{ marginBottom: '1rem', overflowX: 'auto' }}>
                              <table className="subjects-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                  <tr style={{ background: '#667eea', color: 'white' }}>
                                    <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>Subject Name</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>1st Unit Test</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>2nd Unit Test</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>Half Yearly</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>3rd Unit Test</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>Annual Exam</th>
                                    <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {card.subjects.map((subject, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                      <td style={{ padding: '0.6rem', fontWeight: '600' }}>{subject.name}</td>
                                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                        {subject.test1Marks}/{subject.test1FM}
                                      </td>
                                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                        {subject.test2Marks}/{subject.test2FM}
                                      </td>
                                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                        {subject.halfYearlyMarks}/{subject.halfYearlyFM}
                                      </td>
                                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                        {subject.test3Marks}/{subject.test3FM}
                                      </td>
                                      <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                        {subject.annualMarks}/{subject.annualFM}
                                      </td>
                                      <td style={{ padding: '0.6rem', color: '#495057' }}>
                                        {subject.remarks || ''}
                                      </td>
                                    </tr>
                                  ))}
                                  {(() => {
                                    const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
                                    const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
                                    const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
                                    const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
                                    const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
                                    const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
                                    const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
                                    const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
                                    const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
                                    const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
                                    
                                    return (
                                      <tr style={{ background: '#f8f9fa', fontWeight: 'bold', borderTop: '3px solid #667eea' }}>
                                        <td style={{ padding: '0.6rem' }}>GRAND TOTAL</td>
                                        <td style={{ padding: '0.6rem', textAlign: 'center', color: '#667eea' }}>
                                          {test1Total}/{test1FM}
                                        </td>
                                        <td style={{ padding: '0.6rem', textAlign: 'center', color: '#667eea' }}>
                                          {test2Total}/{test2FM}
                                        </td>
                                        <td style={{ padding: '0.6rem', textAlign: 'center', color: '#667eea' }}>
                                          {halfYearlyTotal}/{halfYearlyFM}
                                        </td>
                                        <td style={{ padding: '0.6rem', textAlign: 'center', color: '#667eea' }}>
                                          {test3Total}/{test3FM}
                                        </td>
                                        <td style={{ padding: '0.6rem', textAlign: 'center', color: '#667eea' }}>
                                          {annualTotal}/{annualFM}
                                        </td>
                                        <td style={{ padding: '0.6rem', color: '#495057', fontStyle: 'italic' }}>
                                          {card.remarks || ''}
                                        </td>
                                      </tr>
                                    );
                                  })()}
                                </tbody>
                              </table>
                            </div>

                            <div className="result-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                {(() => {
                                  const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
                                  const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
                                  const test1Percentage = ((test1Total / test1FM) * 100).toFixed(2);
                                  const test1Grade = getGrade(parseFloat(test1Percentage));

                                  const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
                                  const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
                                  const test2Percentage = ((test2Total / test2FM) * 100).toFixed(2);
                                  const test2Grade = getGrade(parseFloat(test2Percentage));

                                  const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
                                  const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
                                  const halfYearlyPercentage = ((halfYearlyTotal / halfYearlyFM) * 100).toFixed(2);
                                  const halfYearlyGrade = getGrade(parseFloat(halfYearlyPercentage));

                                  const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
                                  const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
                                  const test3Percentage = ((test3Total / test3FM) * 100).toFixed(2);
                                  const test3Grade = getGrade(parseFloat(test3Percentage));

                                  const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
                                  const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
                                  const annualPercentage = ((annualTotal / annualFM) * 100).toFixed(2);
                                  const annualGrade = getGrade(parseFloat(annualPercentage));

                                  return (
                                    <>
                                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                                          <strong style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>1st Unit Test</strong>
                                          <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#667eea' }}>Grade: {test1Grade}</span>
                                            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#495057' }}>({test1Percentage}%)</span>
                                          </div>
                                        </div>

                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                                          <strong style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>2nd Unit Test</strong>
                                          <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#667eea' }}>Grade: {test2Grade}</span>
                                            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#495057' }}>({test2Percentage}%)</span>
                                          </div>
                                        </div>

                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                                          <strong style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>Half Yearly</strong>
                                          <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#667eea' }}>Grade: {halfYearlyGrade}</span>
                                            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#495057' }}>({halfYearlyPercentage}%)</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                                          <strong style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>3rd Unit Test</strong>
                                          <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#667eea' }}>Grade: {test3Grade}</span>
                                            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#495057' }}>({test3Percentage}%)</span>
                                          </div>
                                        </div>

                                        <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                                          <strong style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>Annual Exam</strong>
                                          <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#667eea' }}>Grade: {annualGrade}</span>
                                            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#495057' }}>({annualPercentage}%)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              
                              {/* Promotion Status Display */}
                              {card.promotionStatus && (
                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', border: '2px solid ' + (card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'), background: card.promotionStatus === 'Promoted' ? '#d4edda' : '#f8d7da' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem', color: card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545' }}>
                                      {card.promotionStatus === 'Promoted' ? '✓' : '✗'}
                                    </span>
                                    <span style={{ fontSize: '1rem', fontWeight: '700', color: card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545' }}>
                                      {card.promotionStatus === 'Promoted' ? 'Promoted to Next Higher Class' : 'Not Promoted'}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {card.isPublished ? (
                                  <button
                                    onClick={() => handleUnpublishProgressCard(card._id)}
                                    className="action-btn"
                                    style={{ backgroundColor: '#6c757d', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    title="Unpublish Progress Card"
                                  >
                                    <FaTimes /> Unpublish
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handlePublishProgressCard(card._id)}
                                    className="action-btn"
                                    style={{ backgroundColor: '#28a745', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    title="Publish Progress Card"
                                  >
                                    <FaCheck /> Publish
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditProgressCard(card)}
                                  className="action-btn edit-btn"
                                  style={{ backgroundColor: '#ffc107', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                  title="Edit Progress Card"
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProgressCard(card._id)}
                                  className="action-btn delete-btn"
                                  style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                  title="Delete Progress Card"
                                >
                                  <FaTrash /> Delete
                                </button>
                                <button
                                  onClick={() => handleDownloadProgressCard(card)}
                                  className="action-btn"
                                  style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                  title="Download Progress Card PDF"
                                >
                                  <FaDownload /> Download
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!showProgressCardForm && progressCards.length === 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <p className="no-contacts">No progress cards yet. Click "Add Progress Card" to create one.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={closePopup}
        />
      )}
      {confirmPopup.show && (
        <ConfirmPopup
          message={confirmPopup.message}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
      
      {/* Exam Timer Modal */}
      {showExamTimerModal && (
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
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              <FaClock style={{ marginRight: '0.5rem', color: '#28a745' }} />
              Set Exam Duration
            </h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={examDuration}
                onChange={(e) => setExamDuration(parseInt(e.target.value) || 60)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <small style={{ color: '#6c757d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                Default: 60 minutes (1 hour). Range: 1-180 minutes.
              </small>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowExamTimerModal(false);
                  setExamDuration(60);
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
                onClick={handleConfirmStartExam}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                }}
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Calendar Modal */}
      {showAttendanceCalendar && attendanceCalendarStudent && (
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
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              {attendanceCalendarStudent.firstName} {attendanceCalendarStudent.lastName} - Daily Attendance
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Class: {attendanceCalendarStudent.class} | Roll: {attendanceCalendarStudent.rollNumber}
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ marginRight: '1rem', fontWeight: '600' }}>Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            {/* Calendar Grid - 12 months */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[...Array(12)].map((_, monthIndex) => {
                const monthDate = new Date(selectedYear, monthIndex, 1);
                const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
                const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
                const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay();

                return (
                  <div key={monthIndex} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '0.75rem', color: '#2c3e50' }}>{monthName}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '12px' }}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>{day}</div>
                      ))}
                      {[...Array(firstDayOfMonth)].map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {[...Array(daysInMonth)].map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dateStr = new Date(selectedYear, monthIndex, day);
                        
                        // Find attendance for this date
                        const attendanceRecord = attendance.find(a => 
                          a.studentId._id === attendanceCalendarStudent._id &&
                          new Date(a.date).toDateString() === dateStr.toDateString()
                        );

                        let bgColor = 'transparent';
                        if (attendanceRecord) {
                          bgColor = attendanceRecord.status === 'present' ? '#4CAF50' : '#f44336';
                        }

                        return (
                          <div
                            key={day}
                            onClick={() => attendanceRecord && handleEditAttendance(attendanceRecord)}
                            style={{
                              textAlign: 'center',
                              padding: '6px',
                              borderRadius: '4px',
                              backgroundColor: bgColor,
                              color: bgColor !== 'transparent' ? 'white' : '#333',
                              fontWeight: bgColor !== 'transparent' ? 'bold' : 'normal',
                              cursor: attendanceRecord ? 'pointer' : 'default',
                              transition: 'all 0.2s',
                              border: attendanceRecord ? '2px solid transparent' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (attendanceRecord) {
                                e.currentTarget.style.border = '2px solid #2c3e50';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (attendanceRecord) {
                                e.currentTarget.style.border = '2px solid transparent';
                                e.currentTarget.style.transform = 'scale(1)';
                              }
                            }}
                            title={attendanceRecord ? `${attendanceRecord.status === 'present' ? 'Present' : 'Absent'} - Marked by ${attendanceRecord.markedBy}\nClick to edit or delete` : 'No record'}
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

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#4CAF50', borderRadius: '4px' }} />
                <span>Present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#f44336', borderRadius: '4px' }} />
                <span>Absent</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setShowAttendanceCalendar(false);
                  setAttendanceCalendarStudent(null);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#6c757d',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditAttendanceModal && editingAttendance && (
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
          zIndex: 10001
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaEdit /> Edit Attendance
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ margin: '0.5rem 0' }}><strong>Student:</strong> {editingAttendance.studentName}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Roll Number:</strong> {editingAttendance.rollNumber}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Class:</strong> {editingAttendance.class}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Date:</strong> {new Date(editingAttendance.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Current Status:</strong> 
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  backgroundColor: editingAttendance.status === 'present' ? '#4CAF50' : '#f44336',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {editingAttendance.status.toUpperCase()}
                </span>
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                <strong>Marked by:</strong> {editingAttendance.markedBy}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', fontWeight: '600', color: '#2c3e50' }}>Change Status To:</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleUpdateAttendance('present')}
                  disabled={editingAttendance.status === 'present'}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: editingAttendance.status === 'present' ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: editingAttendance.status === 'present' ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaCheck /> Present
                </button>
                <button
                  onClick={() => handleUpdateAttendance('absent')}
                  disabled={editingAttendance.status === 'absent'}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: editingAttendance.status === 'absent' ? '#ccc' : '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: editingAttendance.status === 'absent' ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaTimes /> Absent
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button
                onClick={() => handleDeleteAttendance(editingAttendance._id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #dc3545',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaTrash /> Delete Record
              </button>
              <button
                onClick={() => {
                  setShowEditAttendanceModal(false);
                  setEditingAttendance(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #6c757d',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#6c757d',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Attendance Calendar Modal */}
      {showTeacherAttendanceCalendar && attendanceCalendarTeacher && (
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
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              {attendanceCalendarTeacher.firstName} {attendanceCalendarTeacher.lastName} - Daily Attendance
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Email: {attendanceCalendarTeacher.email}
            </p>
            
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

            {/* Calendar Grid - 12 months */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[...Array(12)].map((_, monthIndex) => {
                const monthDate = new Date(selectedTeacherYear, monthIndex, 1);
                const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
                const daysInMonth = new Date(selectedTeacherYear, monthIndex + 1, 0).getDate();
                const firstDayOfMonth = new Date(selectedTeacherYear, monthIndex, 1).getDay();

                return (
                  <div key={monthIndex} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '0.75rem', color: '#2c3e50' }}>{monthName}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '12px' }}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>{day}</div>
                      ))}
                      {[...Array(firstDayOfMonth)].map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {[...Array(daysInMonth)].map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dateStr = new Date(selectedTeacherYear, monthIndex, day);
                        
                        // Find attendance for this date - handle both string and object teacherId
                        const attendanceRecord = teacherAttendance.find(a => {
                          const recordTeacherId = typeof a.teacherId === 'object' && a.teacherId?._id 
                            ? a.teacherId._id 
                            : a.teacherId;
                          const teacherIdMatch = recordTeacherId === attendanceCalendarTeacher._id || 
                            recordTeacherId?.toString() === attendanceCalendarTeacher._id.toString();
                          return teacherIdMatch && new Date(a.date).toDateString() === dateStr.toDateString();
                        });

                        let bgColor = 'transparent';
                        if (attendanceRecord) {
                          bgColor = attendanceRecord.status === 'present' ? '#4CAF50' : '#f44336';
                        }

                        return (
                          <div
                            key={day}
                            style={{
                              textAlign: 'center',
                              padding: '6px',
                              borderRadius: '4px',
                              backgroundColor: bgColor,
                              color: bgColor !== 'transparent' ? 'white' : '#333',
                              fontWeight: bgColor !== 'transparent' ? 'bold' : 'normal',
                              cursor: 'default',
                              transition: 'all 0.2s'
                            }}
                            title={attendanceRecord ? `${attendanceRecord.status === 'present' ? 'Present' : 'Absent'} - Marked by ${attendanceRecord.markedBy}` : 'No record'}
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

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#4CAF50', borderRadius: '4px' }} />
                <span>Present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#f44336', borderRadius: '4px' }} />
                <span>Absent</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setShowTeacherAttendanceCalendar(false);
                  setAttendanceCalendarTeacher(null);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#6c757d',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fees Management Modal */}
      {showFeesModal && selectedStudent && (
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
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              <FaMoneyBillWave style={{ marginRight: '0.5rem' }} />
              Manage Fees - {selectedStudent.firstName} {selectedStudent.lastName}
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Roll Number: {selectedStudent.rollNumber} | Class: {selectedStudent.class}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                Total Fees (₹)
              </label>
              <input
                type="number"
                min="0"
                value={feesFormData.totalFees}
                onChange={(e) => setFeesFormData({ ...feesFormData, totalFees: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                Add Deposit (₹)
              </label>
              <input
                type="number"
                min="0"
                value={feesFormData.deposit}
                onChange={(e) => setFeesFormData({ ...feesFormData, deposit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057' }}>
                Description (Optional)
              </label>
              <textarea
                value={feesFormData.description}
                onChange={(e) => setFeesFormData({ ...feesFormData, description: e.target.value })}
                placeholder="Add a note about this transaction..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowFeesModal(false);
                  setSelectedStudent(null);
                  setFeesFormData({ totalFees: 0, deposit: 0, description: '' });
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
                onClick={handleUpdateFees}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                }}
              >
                Update Fees
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
