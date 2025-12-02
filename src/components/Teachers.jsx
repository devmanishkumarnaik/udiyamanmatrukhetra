import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import { FaChalkboardTeacher, FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';
import './Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await axios.get('/public-teachers');
        setTeachers(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only first 20 if no search query
  const displayedTeachers = searchQuery ? filteredTeachers : filteredTeachers.slice(0, 20);

  return (
    <div className="teachers-page">
      <Navbar />
      
      <section className="teachers-section">
        <div className="container">
          <div className="section-header">
            <h1><FaChalkboardTeacher /> Our Teachers</h1>
            <p>Meet our dedicated and experienced teaching staff</p>
          </div>

          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search teachers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            {!searchQuery && teachers.length > 20 && (
              <p className="showing-count">Showing 20 of {teachers.length} teachers</p>
            )}
            {searchQuery && (
              <p className="showing-count">Found {filteredTeachers.length} teacher(s)</p>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading teachers...</p>
            </div>
          ) : displayedTeachers.length === 0 ? (
            <div className="no-teachers">
              <FaChalkboardTeacher className="no-data-icon" />
              <h3>No Teachers Found</h3>
              <p>{searchQuery ? 'No teachers match your search criteria.' : 'There are currently no teachers registered in our system.'}</p>
            </div>
          ) : (
            <div className="teachers-grid">
              {displayedTeachers.map((teacher) => (
                <div key={teacher._id} className="teacher-card">
                  <div className="teacher-photo">
                    <img src={teacher.image} alt={teacher.name} />
                  </div>
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <div className="teacher-details">
                      {teacher.subject && (
                        <div className="detail-item">
                          <strong>Subject:</strong> {teacher.subject}
                        </div>
                      )}
                      {teacher.qualification && (
                        <div className="detail-item">
                          <strong>Qualification:</strong> {teacher.qualification}
                        </div>
                      )}
                      {teacher.experience && (
                        <div className="detail-item">
                          <strong>Experience:</strong> {teacher.experience}
                        </div>
                      )}
                      {teacher.gmail && (
                        <div className="detail-item">
                          <FaEnvelope className="detail-icon" />
                          <span>{teacher.gmail}</span>
                        </div>
                      )}
                      {teacher.mobile && (
                        <div className="detail-item">
                          <FaPhone className="detail-icon" />
                          <span>{teacher.mobile}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Teachers;
