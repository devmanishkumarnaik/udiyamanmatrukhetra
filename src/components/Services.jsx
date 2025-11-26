import { FaGraduationCap, FaBook, FaUsers, FaChalkboardTeacher, FaLaptop, FaTrophy } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <FaGraduationCap />,
      title: 'Quality Education',
      description: 'World-class curriculum designed to nurture young minds and prepare them for future challenges.'
    },
    {
      icon: <FaBook />,
      title: 'Comprehensive Learning',
      description: 'Wide range of subjects and activities to ensure holistic development of every student.'
    },
    {
      icon: <FaUsers />,
      title: 'Small Class Sizes',
      description: 'Personalized attention with optimal student-teacher ratio for better learning outcomes.'
    },
    {
      icon: <FaChalkboardTeacher />,
      title: 'Expert Faculty',
      description: 'Highly qualified and experienced teachers dedicated to student success and growth.'
    },
    {
      icon: <FaLaptop />,
      title: 'Modern Facilities',
      description: 'State-of-the-art infrastructure with smart classrooms and advanced technology.'
    },
    {
      icon: <FaTrophy />,
      title: 'Extracurricular Activities',
      description: 'Sports, arts, music, and clubs to develop well-rounded personalities.'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>Comprehensive educational services designed to bring out the best in every student</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
