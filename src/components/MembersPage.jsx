import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import Navbar from './Navbar';
import { FaUsers, FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';
import './MembersPage.css';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await axios.get('/public-members');
        setMembers(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  // Filter members based on search query
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only first 20 if no search query
  const displayedMembers = searchQuery ? filteredMembers : filteredMembers.slice(0, 20);

  return (
    <div className="members-page">
      <Navbar />
      
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h1><FaUsers /> Our Members</h1>
            <p>Meet our valued community members</p>
          </div>

          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            {!searchQuery && members.length > 20 && (
              <p className="showing-count">Showing 20 of {members.length} members</p>
            )}
            {searchQuery && (
              <p className="showing-count">Found {filteredMembers.length} member(s)</p>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p className="loading-text">Loading members...</p>
            </div>
          ) : displayedMembers.length === 0 ? (
            <div className="no-members">
              <FaUsers className="no-data-icon" />
              <h3>No Members Found</h3>
              <p>{searchQuery ? 'No members match your search criteria.' : 'There are currently no members registered in our system.'}</p>
            </div>
          ) : (
            <div className="members-grid">
              {displayedMembers.map((member) => (
                <div key={member._id} className="member-card">
                  <div className="member-photo">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <div className="member-details">
                      {member.designation && (
                        <div className="detail-item">
                          <strong>Designation:</strong> {member.designation}
                        </div>
                      )}
                      {member.gmail && (
                        <div className="detail-item">
                          <FaEnvelope className="detail-icon" />
                          <span>{member.gmail}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="detail-item">
                          <FaPhone className="detail-icon" />
                          <span>{member.phone}</span>
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

export default MembersPage;
