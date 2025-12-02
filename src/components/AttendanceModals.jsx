import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaClipboardCheck, FaSearch, FaEye } from 'react-icons/fa';
import axios from '../utils/axiosConfig';

// Mark Attendance Modal for Teachers
export const MarkAttendanceModal = ({ 
  students, 
  onClose, 
  onSuccess 
}) => {
  // Get current date in Indian timezone (IST)
  const getIndianDate = () => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
  };
  
  const [selectedDate, setSelectedDate] = useState(getIndianDate());
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [marking, setMarking] = useState(false);

  const filteredStudents = students.filter(s => 
    !selectedClass || s.class === selectedClass
  );

  const handleMarkAll = (status) => {
    const marks = {};
    filteredStudents.forEach(student => {
      marks[student._id] = status;
    });
    setAttendanceMarks(marks);
  };

  const handleSubmitAttendance = async () => {
    if (Object.keys(attendanceMarks).length === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    setMarking(true);
    try {
      const token = localStorage.getItem('userToken');
      const attendanceRecords = Object.entries(attendanceMarks).map(([studentId, status]) => ({
        studentId,
        date: selectedDate,
        status
      }));

      await axios.post('/attendance/mark', 
        { attendanceRecords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Attendance marked successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClipboardCheck /> Mark Daily Attendance
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Mark one attendance per student per day (by name, class, and roll number)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getIndianDate()}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setAttendanceMarks({});
              }}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="">Select Class</option>
              {[...new Set(students.map(s => s.class))].sort().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && filteredStudents.length > 0 && (
          <>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleMarkAll('present')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Mark All Absent
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Student Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Roll No</th>
                    <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const status = attendanceMarks[student._id];
                    return (
                      <tr key={student._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '0.75rem' }}>{student.firstName} {student.lastName}</td>
                        <td style={{ padding: '0.75rem' }}>{student.rollNumber}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => setAttendanceMarks({ ...attendanceMarks, [student._id]: 'present' })}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: status === 'present' ? '#4CAF50' : '#e0e0e0',
                                color: status === 'present' ? 'white' : '#666',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <FaCheck /> Present
                            </button>
                            <button
                              onClick={() => setAttendanceMarks({ ...attendanceMarks, [student._id]: 'absent' })}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: status === 'absent' ? '#f44336' : '#e0e0e0',
                                color: status === 'absent' ? 'white' : '#666',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <FaTimes /> Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              border: '2px solid #6c757d',
              borderRadius: '8px',
              background: 'white',
              color: '#6c757d',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitAttendance}
            disabled={marking || Object.keys(attendanceMarks).length === 0}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: marking ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: marking ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {marking ? 'Marking...' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

// My Attendance Modal for Students
export const MyAttendanceModal = ({ 
  user, 
  attendance, 
  onClose 
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter attendance for selected year
  const yearAttendance = attendance.filter(a => {
    const attendanceYear = new Date(a.date).getFullYear();
    return attendanceYear === selectedYear;
  });

  // Calculate summary
  const presentCount = yearAttendance.filter(a => a.status === 'present').length;
  const absentCount = yearAttendance.filter(a => a.status === 'absent').length;
  const totalCount = yearAttendance.length;
  const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCalendarAlt /> My Daily Attendance
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Class: {user.class} | Roll: {user.rollNumber}
        </p>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        {/* Attendance Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{presentCount}</div>
            <div>Days Present</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{absentCount}</div>
            <div>Days Absent</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#2196F3',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalCount}</div>
            <div>Total Days</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: percentage >= 75 ? '#4CAF50' : percentage >= 50 ? '#ff9800' : '#f44336',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{percentage}%</div>
            <div>Attendance</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Attendance Calendar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[...Array(12)].map((_, monthIndex) => {
            const monthDate = new Date(selectedYear, monthIndex, 1);
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
            const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay();

            return (
              <div key={monthIndex} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '14px' }}>{monthName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', fontSize: '11px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666', padding: '4px' }}>{day}</div>
                  ))}
                  {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dateStr = new Date(selectedYear, monthIndex, day);
                    
                    const attendanceRecord = attendance.find(a => 
                      new Date(a.date).toDateString() === dateStr.toDateString()
                    );

                    let bgColor = 'transparent';
                    if (attendanceRecord) {
                      bgColor = attendanceRecord.status === 'present' ? '#4CAF50' : '#f44336';
                    }

                    return (
                      <div
                        key={day}
                        style={{
                          textAlign: 'center',
                          padding: '4px',
                          borderRadius: '3px',
                          backgroundColor: bgColor,
                          color: bgColor !== 'transparent' ? 'white' : '#333',
                          fontWeight: bgColor !== 'transparent' ? 'bold' : 'normal',
                          fontSize: '10px'
                        }}
                        title={attendanceRecord ? `${attendanceRecord.status.toUpperCase()} - Marked by ${attendanceRecord.markedBy}` : 'No record'}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#4CAF50', borderRadius: '3px' }} />
            <span>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#f44336', borderRadius: '3px' }} />
            <span>Absent</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: '#6c757d',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// View Attendance Modal for Teachers
export const ViewAttendanceModal = ({ 
  students, 
  attendance, 
  onClose 
}) => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique classes from students
  const classes = ['All', ...new Set(students.map(s => s.class))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  // Filter students based on class and search query
  const filteredStudents = students.filter(student => {
    const classMatch = selectedClass === 'All' || student.class === selectedClass;
    const searchMatch = searchQuery === '' || 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && searchMatch;
  });

  // Calculate attendance statistics for a student
  const getStudentStats = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId._id === studentId);
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    const absentCount = studentAttendance.filter(a => a.status === 'absent').length;
    const totalCount = studentAttendance.length;
    const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
    return { presentCount, absentCount, totalCount, percentage };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: isMobile ? '100%' : '1200px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%',
        margin: isMobile ? '10px' : '0'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: isMobile ? '1.25rem' : '1.75rem' }}>
          <FaClipboardCheck /> Student Attendance Records
        </h2>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : `Class ${cls}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Search by Name or Roll No</label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem 0.5rem 0.5rem 2.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        <p style={{ marginBottom: '1rem', color: '#666', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
          Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </p>

        {/* Attendance Table/Cards */}
        {isMobile ? (
          // Mobile Card View
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredStudents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#999', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                No students found
              </div>
            ) : (
              filteredStudents.map(student => {
                const stats = getStudentStats(student._id);
                return (
                  <div
                    key={student._id}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '1rem',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Student Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #f0f0f0' }}>
                      <img 
                        src={student.photo} 
                        alt={student.firstName}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#2c3e50', marginBottom: '0.25rem' }}>
                          {student.firstName} {student.lastName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          Roll: {student.rollNumber} | Class: {student.class}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>Total Days</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c3e50' }}>{stats.totalCount}</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#155724', marginBottom: '0.25rem' }}>Present</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#155724' }}>{stats.presentCount}</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#721c24', marginBottom: '0.25rem' }}>Absent</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#721c24' }}>{stats.absentCount}</div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        backgroundColor: stats.percentage >= 75 ? '#d4edda' : stats.percentage >= 50 ? '#fff3cd' : '#f8d7da',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: stats.percentage >= 75 ? '#155724' : stats.percentage >= 50 ? '#856404' : '#721c24',
                          marginBottom: '0.25rem'
                        }}>Percentage</div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: stats.percentage >= 75 ? '#155724' : stats.percentage >= 50 ? '#856404' : '#721c24'
                        }}>{stats.percentage}%</div>
                      </div>
                    </div>
                    
                    {/* View Calendar Button */}
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowCalendar(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}
                    >
                      <FaEye /> View Attendance Calendar
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Desktop Table View
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ maxHeight: '500px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Student Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Roll No</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Class</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Total Days</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Present</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Absent</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Percentage</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: '700' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const stats = getStudentStats(student._id);
                    return (
                      <tr key={student._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src={student.photo} 
                              alt={student.firstName}
                              style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                            <span>{student.firstName} {student.lastName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{student.rollNumber}</td>
                        <td style={{ padding: '0.75rem' }}>{student.class}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>{stats.totalCount}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            {stats.presentCount}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            {stats.absentCount}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: stats.percentage >= 75 ? '#d4edda' : stats.percentage >= 50 ? '#fff3cd' : '#f8d7da',
                            color: stats.percentage >= 75 ? '#155724' : stats.percentage >= 50 ? '#856404' : '#721c24',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {stats.percentage}%
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowCalendar(true);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              justifyContent: 'center'
                            }}
                          >
                            <FaEye /> View Calendar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Close button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: '#6c757d',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Attendance Calendar Modal */}
      {showCalendar && selectedStudent && (
        <AttendanceCalendarModal
          student={selectedStudent}
          attendance={attendance}
          onClose={() => {
            setShowCalendar(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

// Attendance Calendar Modal for Teachers
export const AttendanceCalendarModal = ({
  student,
  attendance,
  onClose
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: isMobile ? '100%' : '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%',
        margin: isMobile ? '10px' : '0'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
          {student.firstName} {student.lastName} - Daily Attendance
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: isMobile ? '0.9rem' : '1rem' }}>
          Class: {student.class} | Roll: {student.rollNumber}
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: '600' }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        {/* Calendar Grid - 12 months */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[...Array(12)].map((_, monthIndex) => {
            const monthDate = new Date(selectedYear, monthIndex, 1);
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
            const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
            const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay();

            return (
              <div key={monthIndex} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>{monthName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', fontSize: '11px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666', padding: '4px' }}>{day}</div>
                  ))}
                  {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dateStr = new Date(selectedYear, monthIndex, day);
                    
                    // Find attendance for this date
                    const attendanceRecord = attendance.find(a => 
                      a.studentId._id === student._id &&
                      new Date(a.date).toDateString() === dateStr.toDateString()
                    );

                    let bgColor = 'transparent';
                    if (attendanceRecord) {
                      bgColor = attendanceRecord.status === 'present' ? '#4CAF50' : '#f44336';
                    }

                    return (
                      <div
                        key={day}
                        style={{
                          textAlign: 'center',
                          padding: '6px',
                          borderRadius: '4px',
                          backgroundColor: bgColor,
                          color: bgColor !== 'transparent' ? 'white' : '#333',
                          fontWeight: bgColor !== 'transparent' ? 'bold' : 'normal',
                          fontSize: '10px'
                        }}
                        title={attendanceRecord ? `${attendanceRecord.status.toUpperCase()} - Marked by ${attendanceRecord.markedBy}` : 'No record'}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#4CAF50', borderRadius: '3px' }} />
            <span>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#f44336', borderRadius: '3px' }} />
            <span>Absent</span>
          </div>
        </div>

        {/* Close button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: '#6c757d',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
