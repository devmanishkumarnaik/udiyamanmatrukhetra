import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaImage, FaFileAlt, FaCalendar, FaDownload, FaEye, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './Notice.css';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${backendUrl}/notices`);
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf-icon" />;
      case 'image':
        return <FaImage className="file-icon image-icon" />;
      case 'text':
        return <FaFileAlt className="file-icon text-icon" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'notice';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFilePreview = (notice) => {
    switch (notice.fileType) {
      case 'pdf':
        return (
          <div className="file-preview">
            <iframe
              src={notice.fileUrl}
              title={notice.title}
              className="pdf-preview"
            />
          </div>
        );
      case 'image':
        return (
          <div className="file-preview">
            <img
              src={notice.fileUrl}
              alt={notice.title}
              className="image-preview"
            />
          </div>
        );
      case 'text':
        return (
          <div className="file-preview text-preview">
            <div className="text-content">
              {notice.description}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="notice-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading notices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-page">
      <div className="container">
        <div className="notice-header">
          <div className="header-content">
            <h1>Notice Board</h1>
            <p>Stay updated with the latest announcements and important information</p>
          </div>
          <button className="home-btn" onClick={() => navigate('/')}>
            <FaHome /> Back to Home
          </button>
        </div>

        {notices.length === 0 ? (
          <div className="no-notices">
            <FaFileAlt className="empty-icon" />
            <h3>No Notices Available</h3>
            <p>There are currently no active notices. Please check back later.</p>
          </div>
        ) : (
          <div className="notices-grid">
            {notices.map((notice) => (
              <div key={notice._id} className="notice-card">
                <div className="notice-card-header">
                  {getFileIcon(notice.fileType)}
                  <div className="notice-type-badge">{notice.fileType.toUpperCase()}</div>
                </div>
                
                <div className="notice-card-body">
                  <h3 className="notice-title">{notice.title}</h3>
                  
                  {notice.description && (
                    <p className="notice-description">{notice.description}</p>
                  )}
                  
                  <div className="notice-meta">
                    <div className="meta-item">
                      <FaCalendar />
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>
                    {notice.fileName && (
                      <div className="meta-item">
                        <span className="file-name">{notice.fileName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="notice-card-footer">
                  {notice.fileType === 'pdf' ? (
                    <button
                      className="btn-download"
                      onClick={() => handleDownload(notice.fileUrl, notice.fileName)}
                      style={{ flex: 1 }}
                    >
                      <FaDownload /> Download
                    </button>
                  ) : notice.fileType === 'image' ? (
                    <a
                      href={notice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-view"
                      style={{ flex: 1, textDecoration: 'none' }}
                    >
                      <FaEye /> View
                    </a>
                  ) : (
                    <button
                      className="btn-view"
                      onClick={() => handleViewNotice(notice)}
                      style={{ flex: 1 }}
                    >
                      <FaEye /> View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing notice */}
      {showModal && selectedNotice && (
        <div className="notice-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedNotice.title}</h2>
                {selectedNotice.description && (
                  <p className="modal-description">{selectedNotice.description}</p>
                )}
              </div>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {renderFilePreview(selectedNotice)}
            </div>
            
            <div className="modal-footer">
              {selectedNotice.fileType !== 'text' && (
                <button
                  className="btn-download-modal"
                  onClick={() => handleDownload(selectedNotice.fileUrl, selectedNotice.fileName)}
                >
                  <FaDownload /> Download
                </button>
              )}
              <button className="btn-close-modal" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;
