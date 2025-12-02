import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import Popup from './Popup';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
    if (!formData.name || !formData.email || !formData.message) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }

    // Validate phone number if provided
    if (formData.phone && formData.phone.length !== 10) {
      showPopup('Phone number must be exactly 10 digits', 'error');
      return;
    }

    // Create mailto link
    const subject = encodeURIComponent(`Contact Form Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || 'Not provided'}\n\n` +
      `Message:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:udiyamanmatrukhetra1973@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message and clear form
    showPopup('Opening your email client... Please send the email to complete your message.', 'success');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>Get in touch with us for admissions, inquiries, or any questions you may have</p>
        </div>

        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="info-card">
              <FaPhone className="info-icon" />
              <h3>Phone</h3>
              <p><a href="tel:+11234567890">+1 (123) 456-7890</a></p>
            </div>
            <div className="info-card">
              <FaEnvelope className="info-icon" />
              <h3>Email</h3>
              <p><a href="mailto:info@school.com">info@school.com</a></p>
            </div>
            <div className="info-card">
              <FaUser className="info-icon" />
              <h3>Address</h3>
              <p>123 Education Street, Learning City, 12345</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                pattern="[0-9]{10}"
              />
              {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Phone number must be 10 digits ({formData.phone.length}/10)
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
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
    </section>
  );
};

export default Contact;
