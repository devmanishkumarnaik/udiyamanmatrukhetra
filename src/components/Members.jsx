import { FaUserTie, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import './Members.css';

const Members = () => {
  const members = [
    {
      name: 'Udit Prasad Babu',
      role: 'Managing Trustee',
      description: 'Leading with vision and commitment to educational excellence',
      photo: '/images/udit.jpg'
    },
    {
      name: 'Ramesh Ch. Suhula',
      role: 'Principal',
      description: 'Leading with vision and 20+ years of educational excellence',
      photo: '/images/member2.jpg'
    },
    {
      name: 'Prof. Meera Sharma',
      role: 'Head of Academics',
      description: 'Dedicated to curriculum innovation and student success',
      photo: '/images/member3.jpg'
    },
    {
      name: 'Mr. Arun Patel',
      role: 'Dean of Students',
      description: 'Committed to holistic development and student welfare',
      icon: <FaUserGraduate />
    }
  ];

  return (
    <section id="members" className="members">
      <div className="container">
        <div className="section-title">
          <h2>Our Members</h2>
          <p>Meet the dedicated team leading our institution to excellence</p>
        </div>

        <div className="members-grid">
          {members.slice(0, 3).map((member, index) => (
            <div key={index} className="member-card" data-index={index}>
              <div className="member-photo">
                <div className="photo-border"></div>
                <div className="photo-content">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="member-img" />
                  ) : (
                    member.icon
                  )}
                </div>
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <h4 className="member-role">{member.role}</h4>
                <p className="member-description">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Members;
