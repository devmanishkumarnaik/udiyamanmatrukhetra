import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title">
          <h2>About Us</h2>
        </div>
        <div className="about-content">
          <p className="about-description">
            <strong>
              Welcome to Udiyaman Matrukhetra, a beacon of educational excellence dedicated to nurturing young minds and shaping future leaders. Our institution stands committed to providing quality education that combines traditional values with modern teaching methodologies. We believe in holistic development, fostering not just academic excellence but also character building, creativity, and critical thinking in every student.
            </strong>
          </p>
          <p className="about-description">
            <strong>
              With a team of highly qualified and passionate educators, state-of-the-art facilities, and a curriculum designed to meet global standards, we strive to create an environment where every student can thrive and reach their full potential. Our mission is to empower students with knowledge, skills, and values that will serve them throughout their lives.
            </strong>
          </p>
          <div className="about-footer">
            <p className="since-text">--Since 1999 Sept 9</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
