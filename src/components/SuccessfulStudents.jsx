import { FaTrophy, FaStar } from 'react-icons/fa';
import './SuccessfulStudents.css';

const SuccessfulStudents = () => {
  const students = [
    {
      name: 'Sarita Naik',
      result: '95.6%',
      photo: '/images/student1.jpg',
      achievement: 'School Topper'
    },
    {
      name: 'Priya Patel',
      result: '94.2%',
      photo: '/images/student2.jpg',
      achievement: 'District Rank 3'
    },
    {
      name: 'Amit Kumar',
      result: '93.8%',
      photo: '/images/student3.jpg',
      achievement: 'Excellence Award'
    },
    {
      name: 'Sneha Singh',
      result: '92.5%',
      photo: '/images/student1.jpg',
      achievement: 'Outstanding Performance'
    }
  ];

  return (
    <section id="successful-students" className="successful-students">
      <div className="container">
        <div className="section-title">
          <h2>Our Successful Students</h2>
          <p>Celebrating excellence and outstanding achievements in 10th Board Examinations</p>
        </div>

        <div className="students-grid">
          {students.slice(0, 3).map((student, index) => (
            <div key={index} className="student-card" data-index={index}>
              <div className="congratulations-badge">
                <FaTrophy /> Congratulations!
              </div>
              
              <div className="student-photo-wrapper">
                <div className="student-photo">
                  <img src={student.photo} alt={student.name} className="student-img" />
                  <div className="photo-overlay">
                    <FaStar className="star-icon" />
                  </div>
                </div>
              </div>

              <div className="student-info">
                <h3 className="student-name">{student.name}</h3>
                <div className="result-badge">
                  <div className="result-label">10th Result</div>
                  <div className="result-percentage">{student.result}</div>
                </div>
                <p className="achievement">{student.achievement}</p>
              </div>

              <div className="success-decoration">
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessfulStudents;
