import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase } from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <section id="privacy" className="privacy-policy">
      <div className="container">
        <div className="section-title">
          <h2>Privacy Policy</h2>
          <p>Your privacy and security are our top priorities</p>
        </div>

        <div className="privacy-content">
          <div className="privacy-intro">
            <p>
              We are committed to protecting your personal information and your right to privacy.
              This privacy policy explains how we collect, use, and safeguard your information.
            </p>
          </div>

          <div className="privacy-grid">
            <div className="privacy-card">
              <div className="privacy-icon">
                <FaShieldAlt />
              </div>
              <h3>Data Protection</h3>
              <p>
                We implement robust security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="privacy-card">
              <div className="privacy-icon">
                <FaLock />
              </div>
              <h3>Secure Storage</h3>
              <p>
                All sensitive data is encrypted and stored securely using industry-standard
                protocols to ensure maximum protection.
              </p>
            </div>

            <div className="privacy-card">
              <div className="privacy-icon">
                <FaUserSecret />
              </div>
              <h3>Confidentiality</h3>
              <p>
                Student and parent information is kept strictly confidential and only shared
                with authorized personnel for educational purposes.
              </p>
            </div>

            <div className="privacy-card">
              <div className="privacy-icon">
                <FaDatabase />
              </div>
              <h3>Data Collection</h3>
              <p>
                We only collect information necessary for admission, communication, and
                educational services, with your explicit consent.
              </p>
            </div>
          </div>

          <div className="privacy-details">
            <h3>Information We Collect</h3>
            <ul>
              <li>Student and parent contact information</li>
              <li>Academic records and performance data</li>
              <li>Medical and emergency contact information</li>
              <li>Communication preferences and feedback</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>To provide and improve educational services</li>
              <li>To communicate important updates and announcements</li>
              <li>To ensure student safety and well-being</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>

            <h3>Your Rights</h3>
            <ul>
              <li>Access and review your personal information</li>
              <li>Request corrections or updates to your data</li>
              <li>Opt-out of non-essential communications</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
            </ul>

            <div className="contact-privacy">
              <p>
                For any questions or concerns about our privacy policy, please contact us at{' '}
                <a href="mailto:privacy@school.com">privacy@school.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
