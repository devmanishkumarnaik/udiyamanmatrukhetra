import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    
    // Listen for storage changes to update login status
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    // Check if we're on the home page
    if (window.location.pathname !== '/') {
      // Navigate to home page first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <div className="logo">
            <h1 className="school-name">Udiyaman Matrukhetra</h1>
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <a onClick={() => scrollToSection('home')}>Home</a>
            <a onClick={() => { 
              navigate('/teachers');
              setIsMobileMenuOpen(false);
            }}>Teachers</a>
            <a onClick={() => { 
              navigate('/members');
              setIsMobileMenuOpen(false);
            }}>Members</a>
            <a onClick={() => { 
              navigate('/gallery');
              setIsMobileMenuOpen(false);
            }}>Gallery</a>
            <a onClick={() => { 
              navigate('/notice');
              setIsMobileMenuOpen(false);
            }}>Notice</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
            <a onClick={() => { 
              if (isLoggedIn) {
                navigate('/profile');
              } else {
                navigate('/register');
              }
              setIsMobileMenuOpen(false); 
            }}>
              {isLoggedIn ? 'My Account' : 'Register'}
            </a>
          </div>

          <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
