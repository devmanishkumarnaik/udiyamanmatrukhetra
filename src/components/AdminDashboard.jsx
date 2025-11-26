import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, FaUsers, FaEnvelope, FaChartLine, FaChalkboardTeacher, FaEdit, FaTrash, 
  FaCheck, FaTimes, FaBell, FaPaperPlane, FaPlus, FaAward, FaTachometerAlt, 
  FaUserGraduate, FaQuestionCircle, FaChartBar, FaCommentAlt, FaVideo, FaFilePdf, FaDownload, FaSync,
  FaImages, FaMusic, FaImage, FaUpload, FaClock, FaCamera
} from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Popup from './Popup';
import ConfirmPopup from './ConfirmPopup';
import { useSocket } from '../contexts/SocketContext.jsx';
import './AdminDashboard.css';
import './AdminDashboard.premium.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
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
    subjects: [{ name: '', marks: 0, maxMarks: 100 }]
  });
  const [editingResult, setEditingResult] = useState(null);
  const [searchResultQuery, setSearchResultQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchTeacherQuery, setSearchTeacherQuery] = useState('');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
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
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const [confirmPopup, setConfirmPopup] = useState({ message: '', show: false, onConfirm: null });
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
        setTeachers(teachersList);
        setStudents(studentsList);
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
      navigate('/admin/login');
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Reload all data
      const [usersRes, messagesRes, notificationsRes, quizQuestionsRes, quizResultsRes, examResultsRes, videosRes, notesRes, galleryRes] = await Promise.all([
        axios.get('/users'),
        axios.get('/messages'),
        axios.get('/admin/notifications'),
        axios.get('/admin/quiz/questions'),
        axios.get('/admin/quiz/results'),
        axios.get('/exam-results'),
        axios.get('/videos'),
        axios.get('/notes'),
        axios.get('/gallery')
      ]);

      // Update all states
      const teachersList = usersRes.data.filter(user => user.userType === 'teacher');
      const studentsList = usersRes.data.filter(user => user.userType === 'student');
      setTeachers(teachersList);
      setStudents(studentsList);
      setMessages(messagesRes.data);
      setNotifications(notificationsRes.data);
      setQuizQuestions(quizQuestionsRes.data);
      setQuizResults(quizResultsRes.data);
      setExamResults(examResultsRes.data);
      setVideos(videosRes.data);
      setNotes(notesRes.data);
      setGalleryMedia(galleryRes.data);

      showPopup('All data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showPopup('Failed to refresh data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (userId, userType) => {
    showConfirm('Are you sure you want to delete this user?', async () => {
      try {
        await axios.delete(`/users/${userId}`);
        
        // Refresh the user list
        if (userType === 'teacher') {
          setTeachers(teachers.filter(teacher => teacher._id !== userId));
        } else {
          setStudents(students.filter(student => student._id !== userId));
        }
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
      } else {
        setStudents(students.map(student => 
          student._id === userId ? response.data : student
        ));
      }
      
      setEditingUser(null);
      setEditFormData({});
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
      
      // Update both teachers and students lists
      setTeachers(teachers.map(teacher => 
        teacher._id === userId ? response.data.user : teacher
      ));
      setStudents(students.map(student => 
        student._id === userId ? response.data.user : student
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
    const unpublishedCount = examResults.filter(r => !r.isPublished).length;
    
    if (unpublishedCount === 0) {
      showPopup('No unpublished results to publish', 'info');
      return;
    }
    
    showConfirm(`Are you sure you want to publish ${unpublishedCount} exam result(s)? They will be visible to students.`, async () => {
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

  // Video Handlers
  const handleVideoChange = (e) => {
    setVideoFormData({
      ...videoFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    
    if (!videoFormData.title.trim() || !videoFormData.youtubeUrl.trim()) {
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
      setVideoFormData({ title: '', description: '', youtubeUrl: '', category: 'General' });
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
      youtubeUrl: video.youtubeUrl,
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
                className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
                onClick={() => setActiveSection('students')}
              >
                <FaUserGraduate /> Students
              </button>
              <button 
                className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <FaBell /> Notifications
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
                <div className="contacts-section">
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
                      <button 
                        onClick={() => {
                          setShowResultForm(!showResultForm);
                          if (showResultForm) {
                            setEditingResult(null);
                            setResultFormData({
                              studentName: '',
                              rollNumber: '',
                              class: '',
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
                    <div className="form-container">
                      <form onSubmit={handleSubmitResult} className="result-form">
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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

                  <div className="exam-results-table">
                    {examResults.length === 0 ? (
                      <p className="no-contacts">No exam results added yet</p>
                    ) : (
                      <div className="results-grid">
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
                          <div key={result._id} className="result-card">
                            <div className="result-header">
                              <div>
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
                                <span className={`percentage-badge ${result.percentage >= 60 ? 'passed' : 'failed'}`}>
                                  {result.percentage}%
                                </span>
                                <button
                                  onClick={() => handleEditResult(result)}
                                  className="action-btn edit-btn"
                                  title="Edit"
                                >
                                  <FaEdit />
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
                          setVideoFormData({ title: '', description: '', youtubeUrl: '', category: 'General' });
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
                          <label>YouTube URL *</label>
                          <input
                            type="text"
                            name="youtubeUrl"
                            value={videoFormData.youtubeUrl}
                            onChange={handleVideoChange}
                            placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                            required
                            className="video-input"
                          />
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
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                <div className="video-info">
                                  <h3>{video.title}</h3>
                                  {video.description && <p>{video.description}</p>}
                                  <span className="video-category">{video.category}</span>
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
    </>
  );
};

export default AdminDashboard;
