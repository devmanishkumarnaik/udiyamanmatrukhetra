import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCamera, FaChalkboardTeacher, FaUserGraduate, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Popup from './Popup';
import Navbar from './Navbar';
import './Register.css';

const Register = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [userType, setUserType] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const navigate = useNavigate();

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type, show: true });
  };

  const closePopup = () => {
    setPopup({ message: '', type: '', show: false });
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    class: '',
    fatherName: '',
    motherName: '',
    parentsMobile: ''
  });

  const [loginData, setLoginData] = useState({
    emailOrRollNumber: '',
    password: ''
  });

  const classes = ['Nursery', 'KG1', 'KG2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setMessage({ type: 'error', text: 'Photo size must be under 1MB' });
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!userType) {
      setMessage({ type: 'error', text: 'Please select user type (Teacher, Student or Member)' });
      return;
    }

    if (!photo) {
      setMessage({ type: 'error', text: 'Please upload a photo' });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    // Validate required fields for students
    if (userType === 'student') {
      if (!registerData.rollNumber) {
        setMessage({ type: 'error', text: 'Roll number is required for students' });
        showPopup('Roll number is required for students', 'error');
        return;
      }
      if (!registerData.fatherName) {
        setMessage({ type: 'error', text: "Father's name is required for students" });
        showPopup("Father's name is required for students", 'error');
        return;
      }
      if (!registerData.motherName) {
        setMessage({ type: 'error', text: "Mother's name is required for students" });
        showPopup("Mother's name is required for students", 'error');
        return;
      }
      if (!registerData.parentsMobile) {
        setMessage({ type: 'error', text: 'Parents mobile number is required for students' });
        showPopup('Parents mobile number is required for students', 'error');
        return;
      }
      // Validate parents mobile number (must be exactly 10 digits)
      const parentsMobileDigits = registerData.parentsMobile.replace(/\D/g, '');
      if (parentsMobileDigits.length !== 10) {
        setMessage({ type: 'error', text: 'Parents mobile number must be exactly 10 digits' });
        showPopup('Parents mobile number must be exactly 10 digits', 'error');
        return;
      }
      if (!registerData.email) {
        setMessage({ type: 'error', text: 'Email is required for students' });
        showPopup('Email is required for students', 'error');
        return;
      }
      if (!registerData.class) {
        setMessage({ type: 'error', text: 'Class is required for students' });
        showPopup('Class is required for students', 'error');
        return;
      }
      if (!registerData.password) {
        setMessage({ type: 'error', text: 'Password is required' });
        showPopup('Password is required', 'error');
        return;
      }
    }
    
    // Validate required fields for teachers
    if (userType === 'teacher') {
      if (!registerData.email) {
        setMessage({ type: 'error', text: 'Email is required for teachers' });
        showPopup('Email is required for teachers', 'error');
        return;
      }
      if (!registerData.phone) {
        setMessage({ type: 'error', text: 'Phone number is required for teachers' });
        showPopup('Phone number is required for teachers', 'error');
        return;
      }
      if (!registerData.password) {
        setMessage({ type: 'error', text: 'Password is required' });
        showPopup('Password is required', 'error');
        return;
      }
      // Validate phone number for teachers (must be exactly 10 digits)
      const phoneDigits = registerData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
        showPopup('Phone number must be exactly 10 digits', 'error');
        return;
      }
    }
    
    // Validate required fields for members
    if (userType === 'member') {
      if (!registerData.email) {
        setMessage({ type: 'error', text: 'Email is required for members' });
        showPopup('Email is required for members', 'error');
        return;
      }
      if (!registerData.password) {
        setMessage({ type: 'error', text: 'Password is required' });
        showPopup('Password is required', 'error');
        return;
      }
      // Validate phone number for members if provided (must be exactly 10 digits)
      if (registerData.phone) {
        const phoneDigits = registerData.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
          setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
          showPopup('Phone number must be exactly 10 digits', 'error');
          return;
        }
      }
    }

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('userType', userType);
    formData.append('firstName', registerData.firstName);
    formData.append('lastName', registerData.lastName);
    
    if (userType === 'teacher' || userType === 'member') {
      formData.append('email', registerData.email);
      if (registerData.phone) formData.append('phone', registerData.phone); // Phone is optional for members
      formData.append('password', registerData.password);
    } else {
      formData.append('rollNumber', registerData.rollNumber);
      formData.append('fatherName', registerData.fatherName);
      formData.append('motherName', registerData.motherName);
      formData.append('parentsMobile', registerData.parentsMobile);
      formData.append('email', registerData.email);
      formData.append('class', registerData.class);
      formData.append('password', registerData.password);
    }
    
    // Debug logging
    console.log('Sending registration data:', {
      userType,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      phone: registerData.phone,
      rollNumber: registerData.rollNumber,
      class: registerData.class,
      hasPhoto: !!photo
    });

    try {
      const response = await axios.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: response.data.message });
      
      // Show success popup
      showPopup('Registration successful! Please login to access your account.', 'success');
      
      // Switch to login tab and pre-fill the identifier
      setTimeout(() => {
        setActiveTab('login');
        setLoginData({
          emailOrRollNumber: registerData.email,
          password: ''
        });
        setMessage({ type: 'success', text: 'Registration successful! Please login to access your account.' });
        
        // Reset registration form
        setUserType('');
        setPhoto(null);
        setPhotoPreview('');
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          rollNumber: '',
          class: '',
          fatherName: '',
          motherName: '',
          parentsMobile: ''
        });
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again or contact support.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        // Something else happened
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
      showPopup(errorMessage, 'error');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/login', {
        identifier: loginData.emailOrRollNumber,
        password: loginData.password
      });
      setMessage({ type: 'success', text: response.data.message });
      
      // Show success popup
      showPopup('Login successful! Redirecting to your profile...', 'success');
      
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userType', response.data.user.userType);
      localStorage.setItem('isActivated', response.data.user.isActivated);
      
      // Trigger storage event for Navbar update
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to profile
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <section id="register" className="register-section">
        <div className="container">
          <div className="section-title">
            <h2>Register / Login</h2>
            <p>Join our community of educators and students</p>
          </div>

        <div className="register-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </div>

          {activeTab === 'register' ? (
            <form className="register-form" onSubmit={handleRegisterSubmit}>
              {/* User Type Selection */}
              <div className="user-type-selection">
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'teacher' ? 'active' : ''}`}
                  onClick={() => setUserType('teacher')}
                >
                  <FaChalkboardTeacher />
                  <span>Teacher</span>
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  <FaUserGraduate />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'member' ? 'active' : ''}`}
                  onClick={() => setUserType('member')}
                >
                  <FaUsers />
                  <span>Member</span>
                </button>
              </div>

              {/* Photo Upload - Show after user type selection */}
              {userType && (
                <div className="photo-upload-section">
                  <div className="photo-preview">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" />
                    ) : (
                      <div className="photo-placeholder">
                        <FaCamera />
                        <p>Upload Photo</p>
                      </div>
                    )}
                  </div>
                  <label className="photo-upload-btn">
                    <FaCamera /> Choose Photo (Max 1MB)
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                      hidden
                    />
                  </label>
                </div>
              )}

              {/* Common Fields */}
              {userType && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        required
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        required
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  {/* Teacher Fields */}
                  {userType === 'teacher' && (
                    <>
                      <div className="form-group">
                        <label><FaEnvelope /> Email</label>
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaPhone /> Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter 10-digit phone number"
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Password</label>
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter password"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Confirm password"
                        />
                      </div>
                    </>
                  )}

                  {/* Member Fields */}
                  {userType === 'member' && (
                    <>
                      <div className="form-group">
                        <label><FaEnvelope /> Email</label>
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaPhone /> Phone (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          placeholder="Enter 10-digit phone number (optional)"
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Password</label>
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter password"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Confirm password"
                        />
                      </div>
                    </>
                  )}

                  {/* Student Fields */}
                  {userType === 'student' && (
                    <>
                      <div className="form-group">
                        <label>Roll Number</label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={registerData.rollNumber}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter roll number"
                        />
                      </div>

                      <div className="form-group">
                        <label>Father's Name</label>
                        <input
                          type="text"
                          name="fatherName"
                          value={registerData.fatherName}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter father's name"
                        />
                      </div>

                      <div className="form-group">
                        <label>Mother's Name</label>
                        <input
                          type="text"
                          name="motherName"
                          value={registerData.motherName}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter mother's name"
                        />
                      </div>

                      <div className="form-group">
                        <label>Parent's Mobile Number</label>
                        <input
                          type="tel"
                          name="parentsMobile"
                          value={registerData.parentsMobile}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter 10-digit mobile number"
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaEnvelope /> Email</label>
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="form-group">
                        <label>Class</label>
                        <select
                          name="class"
                          value={registerData.class}
                          onChange={handleRegisterChange}
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Password</label>
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Enter password"
                        />
                      </div>

                      <div className="form-group">
                        <label><FaLock /> Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          placeholder="Confirm password"
                        />
                      </div>
                    </>
                  )}

                  {message.text && activeTab === 'register' && (
                    <div className={`message ${message.type}`}>
                      {message.text}
                    </div>
                  )}

                  <button type="submit" className="submit-btn">
                    Register
                  </button>

                  {popup.show && (
                    <Popup
                      message={popup.message}
                      type={popup.type}
                      onClose={closePopup}
                    />
                  )}
                </>
              )}
            </form>
          ) : (
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label><FaUser /> Email</label>
                <input
                  type="text"
                  name="emailOrRollNumber"
                  value={loginData.emailOrRollNumber}
                  onChange={handleLoginChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label><FaLock /> Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="Enter password"
                />
              </div>

              {message.text && activeTab === 'login' && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="submit-btn">
                Login
              </button>

              {popup.show && (
                <Popup
                  message={popup.message}
                  type={popup.type}
                  onClose={closePopup}
                />
              )}
            </form>
          )}
        </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
