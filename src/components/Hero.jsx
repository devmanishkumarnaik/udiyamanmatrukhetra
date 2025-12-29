import { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Sri Aurobindo Integral Education & Research Centre,Udiyaman Matrukhetra,Dedarnuapali,Sambalpur';

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 150); // 150ms delay between each letter

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <div className="logo-container">
            <img src="/images/srimaa.png" alt="Srimaa Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title">
            Welcome to <span className="highlight typing-text">{displayText}<span className="cursor">|</span></span>
          </h1>
          <p className="hero-subtitle">
            Empowering minds, shaping futures, and nurturing the leaders of tomorrow
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
