import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock, FaAward } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import Popup from './Popup';
import ConfirmPopup from './ConfirmPopup';
import { useSocket } from '../contexts/SocketContext.jsx';
import './QuizExam.css';

const QuizExam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Will be set from exam session
  const [popup, setPopup] = useState({ message: '', type: '', show: false });
  const [confirmPopup, setConfirmPopup] = useState({ message: '', show: false, onConfirm: null });
  const [examActive, setExamActive] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const navigate = useNavigate();
  const { socket, on, off } = useSocket();

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
    const token = localStorage.getItem('userToken');
    if (!token) {
      showPopup('Please login to take the exam', 'error');
      setTimeout(() => window.close(), 3000);
      return;
    }

    const checkEligibilityAndLoadQuestions = async () => {
      try {
        // Check eligibility first
        const eligibilityResponse = await axios.get(
          '/quiz/check-eligibility',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!eligibilityResponse.data.isEligible) {
          showPopup(
            eligibilityResponse.data.reason || 'You are not eligible for the exam',
            'error'
          );
          setTimeout(() => window.close(), 3000);
          return;
        }

        // Check if exam is active
        const activeSessionResponse = await axios.get('/exam-session/active');
        
        if (!activeSessionResponse.data.isActive) {
          setExamActive(false);
          setLoading(false);
          showPopup('Please wait for the admin to start the exam.', 'info');
          return;
        }

        // Exam is active, set timer from session duration
        const session = activeSessionResponse.data.session;
        const now = new Date();
        const endTime = new Date(session.endTime);
        const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remainingSeconds);
        
        setExamActive(true);
        const response = await axios.get('/quiz/questions');
        if (response.data.length === 0) {
          showPopup('No questions available at the moment', 'error');
          setTimeout(() => window.close(), 3000);
          return;
        }
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 403) {
          // Exam not started yet
          setExamActive(false);
          setLoading(false);
          showPopup(error.response?.data?.message || 'Exam has not started yet. Please wait.', 'info');
        } else {
          showPopup(
            error.response?.data?.message || 'Failed to load quiz',
            'error'
          );
          setTimeout(() => window.close(), 3000);
        }
      }
    };

    checkEligibilityAndLoadQuestions();

    // Listen for exam start event
    const handleExamStarted = (data) => {
      console.log('Exam started event received:', data);
      showPopup('Exam has started! Loading questions...', 'success');
      setExamActive(true);
      
      // Set timer from the exam session data
      if (data.duration) {
        setTimeLeft(data.duration);
      }
      
      // Reload questions when exam starts
      checkEligibilityAndLoadQuestions();
    };

    // Listen for exam end event
    const handleExamEnded = (data) => {
      console.log('Exam ended event received:', data);
      setExamEnded(true);
      setExamActive(false);
      if (!submitted) {
        showPopup('Exam has been ended by the administrator.', 'error');
        setTimeout(() => window.close(), 3000);
      }
    };

    if (socket && on && off) {
      on('exam-started', handleExamStarted);
      on('exam-ended', handleExamEnded);
    }

    return () => {
      if (socket && off) {
        off('exam-started', handleExamStarted);
        off('exam-ended', handleExamEnded);
      }
    };
  }, [socket, on, off, submitted]);

  useEffect(() => {
    if (loading || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit when timer ends
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionNumber) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion]._id]: optionNumber
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      showConfirm('You haven\'t answered all questions. Are you sure you want to submit?', async () => {
        await submitQuiz();
      });
      return;
    }
    await submitQuiz();
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        selectedOption: answers[q._id] || 0
      }));

      const response = await axios.post(
        '/quiz/submit',
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data.result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      showPopup('Failed to submit quiz. Please try again.', 'error');
    }
  };

  const handleViewCertificate = () => {
    navigate(`/certificate/${result.resultId}`);
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading exam questions...</p>
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
  }

  // Show waiting screen if exam is not active
  if (!examActive && !submitted && questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="result-container">
          <div className="result-card">
            <div className="result-icon" style={{ color: '#667eea' }}>
              <FaClock />
            </div>
            <h1>Exam Not Started Yet</h1>
            <p className="result-message">
              Please wait for the admin to start the exam. You will be notified when the exam begins.
            </p>
            <div className="result-actions">
              <button onClick={() => window.close()} className="close-btn">
                Close Window
              </button>
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
  }

  // Show exam ended screen
  if (examEnded && !submitted) {
    return (
      <div className="quiz-page">
        <div className="result-container">
          <div className="result-card">
            <div className="result-icon" style={{ color: '#dc3545' }}>
              <FaTimesCircle />
            </div>
            <h1>Exam Ended</h1>
            <p className="result-message">
              The exam has been ended by the administrator.
            </p>
            <div className="result-actions">
              <button onClick={() => window.close()} className="close-btn">
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="quiz-page">
        <div className="result-container">
          <div className={`result-card ${result.passed ? 'passed' : 'failed'}`}>
            <div className="result-icon">
              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <h1>{result.passed ? 'Congratulations!' : 'Better Luck Next Time!'}</h1>
            <p className="result-message">
              {result.passed 
                ? 'You have successfully passed the exam!' 
                : 'You need to score at least 60% to pass.'}
            </p>
            
            <div className="result-stats">
              <div className="stat">
                <h3>{result.score}</h3>
                <p>Correct Answers</p>
              </div>
              <div className="stat">
                <h3>{result.totalQuestions}</h3>
                <p>Total Questions</p>
              </div>
              <div className="stat">
                <h3>{result.percentage}%</h3>
                <p>Score</p>
              </div>
            </div>

            <div className="result-actions">
              {result.passed && (
                <button onClick={handleViewCertificate} className="certificate-btn">
                  <FaAward /> View Certificate
                </button>
              )}
              <button onClick={() => window.close()} className="close-btn">
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ._id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>General Knowledge Quiz</h1>
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="timer">
          <FaClock />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="quiz-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <p className="progress-text">{answeredCount} of {questions.length} answered</p>

        <div className="question-card">
          <h2 className="question-number">Question {currentQuestion + 1}</h2>
          <p className="question-text">{currentQ.question}</p>

          <div className="options-grid">
            {[1, 2, 3, 4].map(optionNum => (
              <div
                key={optionNum}
                className={`option ${selectedAnswer === optionNum ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(optionNum)}
              >
                <div className="option-number">{String.fromCharCode(64 + optionNum)}</div>
                <div className="option-text">{currentQ[`option${optionNum}`]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="nav-btn"
          >
            Previous
          </button>

          <div className="question-indicators">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentQuestion ? 'active' : ''} ${answers[questions[index]._id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              className="submit-btn"
              disabled={timeLeft > 0}
              style={{
                opacity: timeLeft > 0 ? 0.5 : 1,
                cursor: timeLeft > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {timeLeft > 0 ? `Submit (Available in ${formatTime(timeLeft)})` : 'Submit Exam'}
            </button>
          ) : (
            <button onClick={handleNext} className="nav-btn">
              Next
            </button>
          )}
        </div>
      </div>
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
    </div>
  );
};

export default QuizExam;
