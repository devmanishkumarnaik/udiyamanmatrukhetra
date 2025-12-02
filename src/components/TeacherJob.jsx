import { useState } from 'react';
import { FaChalkboardTeacher, FaUser, FaPhone, FaEnvelope, FaGraduationCap } from 'react-icons/fa';
import Popup from './Popup';
import './TeacherJob.css';

const TeacherJob = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gmail: '',
    qualification: ''
  });

  const [popup, setPopup] = useState({ message: '', type: '', show: false });

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type, show: true });
  };

  const closePopup = () => {
    setPopup({ message: '', type: '', show: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number: only accept digits and max 10 digits
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: phoneValue
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.phone || !formData.gmail || !formData.qualification) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }

    // Validate phone number
    if (formData.phone.length !== 10) {
      showPopup('Phone number must be exactly 10 digits', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.gmail)) {
      showPopup('Please enter a valid email address', 'error');
      return;
    }

    // Create mailto link
    const subject = encodeURIComponent(`Teacher Job Application - ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Gmail: ${formData.gmail}\n` +
      `Qualification: ${formData.qualification}\n\n` +
      `This is an application for a teaching position at Udiyaman Matrukhetra.`
    );
    
    const mailtoLink = `mailto:udiyamanmatrukhetra1973@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message and clear form
    showPopup('Opening your email client... Please send the email to complete your application.', 'success');
    setFormData({ name: '', phone: '', gmail: '', qualification: '' });
  };

  return (
    <section id="teacher-job" className="teacher-job">
      <div className="container">
        <div className="section-title">
          <h2>Apply for Teacher Position</h2>
          <p>Join our team of dedicated educators and make a difference</p>
        </div>

        <div className="teacher-job-content">
          <div className="job-info">
            <div className="job-header">
              <FaChalkboardTeacher className="job-icon" />
              <h3>We're Hiring Teachers!</h3>
            </div>
            <p className="job-description">
              We are looking for passionate and qualified teachers to join our educational institution. 
              If you have the dedication to shape young minds and contribute to academic excellence, 
              we would love to hear from you.
            </p>
            <div className="job-benefits">
              <h4>What We Offer:</h4>
              <ul>
                <li>Competitive salary package</li>
                <li>Professional development opportunities</li>
                <li>Collaborative work environment</li>
                <li>Modern teaching facilities</li>
              </ul>
            </div>
          </div>

          <div className="job-form-wrapper">
            <form className="teacher-job-form" onSubmit={handleSubmit}>
              <h3>Application Form</h3>
              
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
                {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                  <small className="error-text">
                    Phone number must be 10 digits ({formData.phone.length}/10)
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gmail">
                  <FaEnvelope /> Gmail Address *
                </label>
                <input
                  type="email"
                  id="gmail"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="qualification">
                  <FaGraduationCap /> Qualification *
                </label>
                <textarea
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your educational qualifications and teaching experience"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={closePopup}
        />
      )}
    </section>
  );
};

export default TeacherJob;
