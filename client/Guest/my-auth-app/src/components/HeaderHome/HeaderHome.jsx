import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './HeaderHome.module.css';
import mountainLogo from '../../assets/logo.png';

function HeaderHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavLinkClick = (path, sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname === path || (location.pathname === '/' && path === '/')) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleNotificationsClick = () => {
    console.log("Notifications clicked!");
    setIsMenuOpen(false);
    // TODO: Implement notification logic, e.g., navigate to notifications page or open a notification modal
    // navigate('/notifications'); // Example if you have a notifications page
  };

  const handleMessagesClick = () => { // New handler for messages
    console.log("Messages clicked!");
    setIsMenuOpen(false);
    // TODO: Implement message logic, e.g., navigate to messages page or open a chat modal
    // navigate('/messages'); // Example if you have a messages page
  };

  const handleProfileClick = () => {
    console.log("Profile clicked!");
    setIsMenuOpen(false);
    // TODO: Implement profile logic, e.g., navigate to profile page or open a user menu
    // navigate('/profile'); // Example if you have a profile page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoGroup}>
        <a onClick={() => handleNavLinkClick('/', 'hero')} className={styles.headerLogoLink}>
          <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.headerLogo} />
          <p className={styles.headerLogoText}>BTC</p>
        </a>
      </div>

      <nav className={`${styles.navbarNav} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/homepage" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>HOME</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/history" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>HISTORY</Link>
          </li>
          {/* <li className={styles.navItem}>
            <Link to="/services" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>SERVICES</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/faqs" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>FAQS</Link>
          </li> */}
          <li className={styles.navItem}>
            <Link to="/contacts" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>CONTACTS</Link>
          </li>
    
          <li className={styles.mobileOnlyNavItem}>
            <button className={styles.iconButton} onClick={handleNotificationsClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span>Notifications</span>
            </button>
          </li>
  
          <li className={styles.mobileOnlyNavItem}>
            <button className={styles.iconButton} onClick={handleMessagesClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Messages</span>
            </button>
          </li>
          <li className={styles.mobileOnlyNavItem}>
            <button className={styles.iconButton} onClick={handleProfileClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Profile</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className={styles.desktopActions}>
        <div className={styles.userIconsGroup}>
          <button className={styles.iconButton} onClick={handleNotificationsClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <button className={styles.iconButton} onClick={handleMessagesClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>
          <button className={styles.iconButton} onClick={handleProfileClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>
        </div>
      </div>

      <button className={styles.hamburgerButton} onClick={toggleMenu}>
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </header>
  );
}

export default HeaderHome;