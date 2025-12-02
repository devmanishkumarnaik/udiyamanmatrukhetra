import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaAward, FaDownload } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Popup from './Popup';
import { generateCertificatePDF } from '../utils/pdfGenerator';
import './Certificate.css';

const Certificate = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const certificateRef = useRef();

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type, show: true });
  };

  const closePopup = () => {
    setPopup({ message: '', type: '', show: false });
  };

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await axios.get(`/quiz/result/${resultId}`);
        setResult(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching result:', error);
        setLoading(false);
        showPopup('Failed to load certificate', 'error');
      }
    };

    loadResult();
  }, [resultId]);

  const handleDownload = () => {
    // Detect if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Use mobile-optimized PDF generator
      generateCertificatePDF(result);
    } else {
      // Use standard print for desktop
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="certificate-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!result || !result.passed) {
    return (
      <div className="certificate-page">
        <div className="error-message">
          <h2>Certificate Not Available</h2>
          <p>You need to pass the exam to receive a certificate.</p>
          <button onClick={() => window.close()} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="certificate-page">
      <div className="certificate-actions no-print">
        <button onClick={handleDownload} className="action-btn download-btn">
          <FaDownload /> Download PDF
        </button>
      </div>

      <div className="certificate-container" ref={certificateRef}>
        <div className="certificate">
          <div className="certificate-border">
            <div className="certificate-ornament top-left"></div>
            <div className="certificate-ornament top-right"></div>
            <div className="certificate-ornament bottom-left"></div>
            <div className="certificate-ornament bottom-right"></div>
            
            {/* Watermark */}
            <div className="certificate-watermark">Udiyaman Matrukhetra</div>
            
            <div className="certificate-content">
              <div className="certificate-header">
                <div className="institution-logo">
                  <div className="logo-circle">
                    <FaAward className="logo-icon" />
                  </div>
                </div>
                <h1 className="institution-name">Udiyaman Matrukhetra</h1>
                <div className="certificate-divider"></div>
                <h2 className="certificate-title">Certificate of Excellence</h2>
                <p className="certificate-subtitle">This is proudly presented to</p>
              </div>

              <div className="recipient-section">
                <div className="recipient-name">{result.userName}</div>
                <div className="name-underline"></div>
              </div>

              <div className="certificate-body">
                <p className="achievement-text">
                  For successfully demonstrating exceptional knowledge and dedication by completing the
                </p>
                <h3 className="course-name">General Knowledge Assessment</h3>
                <p className="achievement-text">
                  with outstanding performance and achieving a remarkable score of
                </p>

                <div className="score-display">
                  <div className="score-badge">
                    <div className="score-inner">
                      <span className="score-percentage">{result.percentage}%</span>
                      <span className="score-label">Excellence</span>
                    </div>
                  </div>
                </div>

                <div className="score-details">
                  <span className="score-text">
                    {result.score} correct answers out of {result.totalQuestions} questions
                  </span>
                </div>
              </div>

              <div className="certificate-footer">
                <div className="footer-left">
                  <div className="date-section">
                    <p className="footer-label">Date of Achievement</p>
                    <p className="footer-value">{completedDate}</p>
                    <div className="footer-line"></div>
                  </div>
                </div>

                <div className="footer-center">
                  <div className="seal-container">
                    <div className="premium-seal">
                      <div className="seal-inner">
                        <FaAward className="seal-icon" />
                        <span className="seal-text">CERTIFIED</span>
                        <span className="seal-year">{new Date(result.completedAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-right">
                  <div className="signature-section">
                    <p className="footer-label">Authorized By</p>
                    <div className="signature-image">
                      <span className="signature-text">Udit Prasad Babu</span>
                    </div>
                    <div className="footer-line"></div>
                    <p className="footer-title">Managing Trustee</p>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default Certificate;
