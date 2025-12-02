import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">Udiyaman Matrukhetra</h3>
            <p className="footer-description">
              Empowering minds, shaping futures, and nurturing the leaders of tomorrow through excellence in education.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#why-choose">Why Choose Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="#services">Quality Education</a></li>
              <li><a href="#services">Expert Faculty</a></li>
              <li><a href="#services">Modern Facilities</a></li>
              <li><a href="#services">Extracurricular Activities</a></li>
              <li><a href="#services">Small Class Sizes</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Dedarnuapali, Sambalpur - 768112</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+918280160435</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>udiyamanmatrukhetra1973@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Udiyaman Matrukhetra School. All rights reserved. | Designed with ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
