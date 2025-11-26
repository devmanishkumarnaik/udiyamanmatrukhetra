import { FaUserGraduate, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import './Admission.css';

const Admission = () => {
  const handleAdmissionClick = () => {
    // Replace with actual admission link
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdmUBWCbgKQMC_zEOxRwFcccbBkgNjL_v9BVNaTCScsWDMcmA/viewform?usp=dialog', '_blank');
  };

  return (
    <section id="admission" className="admission">
      <div className="container">
        <div className="section-title">
          <h2>Admissions Open</h2>
          <p>Join our institution and embark on a journey of excellence</p>
        </div>

        <div className="admission-content">
          <div className="admission-info">
            <div className="info-item">
              <div className="info-icon">
                <FaUserGraduate />
              </div>
              <h3>Quality Education</h3>
              <p>Experience world-class education with experienced faculty and modern facilities</p>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaFileAlt />
              </div>
              <h3>Easy Process</h3>
              <p>Simple and straightforward admission process with online application support</p>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaCheckCircle />
              </div>
              <h3>Limited Seats</h3>
              <p>Secure your spot now - admissions are filling up fast!</p>
            </div>
          </div>

          <div className="admission-action">
            <div className="admission-card">
              <h3>Ready to Join Us?</h3>
              <p>Take the first step towards a brighter future. Apply now and become part of our excellence community.</p>
              <button className="admission-btn" onClick={handleAdmissionClick}>
                Apply for Admission
              </button>
              <p className="admission-note">
                Click the button above to start your admission process
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admission;
