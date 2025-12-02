import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import './ConfirmPopup.css';

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className="confirm-popup-overlay" onClick={onCancel}>
      <div className="confirm-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-popup-close" onClick={onCancel}>
          <FaTimes />
        </button>
        <div className="confirm-popup-content">
          <FaQuestionCircle className="confirm-popup-icon" />
          <p className="confirm-popup-message" style={{ whiteSpace: 'pre-line', textAlign: 'left', maxHeight: '400px', overflowY: 'auto' }}>
            {message}
          </p>
          <div className="confirm-popup-actions">
            <button className="confirm-btn cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-btn ok-btn" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
