import { FaStar, FaAward, FaHeart, FaShieldAlt } from 'react-icons/fa';
import './WhyChoose.css';

const WhyChoose = () => {
  const reasons = [
    {
      icon: <FaStar />,
      title: 'Excellence in Academics',
      description: 'Consistently high academic performance with proven track record of student success and achievements.'
    },
    {
      icon: <FaAward />,
      title: 'Award-Winning Institution',
      description: 'Recognized nationally for our innovative teaching methods and outstanding educational standards.'
    },
    {
      icon: <FaHeart />,
      title: 'Caring Environment',
      description: 'Nurturing atmosphere where students feel safe, valued, and encouraged to reach their full potential.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Safe & Secure',
      description: 'Complete security measures with CCTV surveillance and trained staff ensuring student safety.'
    }
  ];

  return (
    <section id="why-choose" className="why-choose">
      <div className="container">
        <div className="section-title">
          <h2>Why Choose Us</h2>
          <p>Discover what makes us the preferred choice for thousands of families</p>
        </div>

        <div className="why-choose-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon-wrapper">
                <div className="reason-icon">{reason.icon}</div>
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h3 className="stat-number">5000+</h3>
            <p>Happy Students</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">200+</h3>
            <p>Expert Teachers</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">25+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">98%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
