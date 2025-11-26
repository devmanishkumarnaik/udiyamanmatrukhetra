import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Popup.css';

const Popup = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="popup-icon success" />;
      case 'error':
        return <FaExclamationCircle className="popup-icon error" />;
      default:
        return <FaInfoCircle className="popup-icon info" />;
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="popup-content">
          {getIcon()}
          <p className="popup-message">{message}</p>
          <button className="popup-ok-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
