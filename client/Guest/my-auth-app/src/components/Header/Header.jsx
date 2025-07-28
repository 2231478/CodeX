import React, { useState } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import mountainLogo from '../../assets/logo.png';

function Header({ onReserveNow }) {
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
            <a onClick={() => handleNavLinkClick('/', 'hero')} className={styles.navLink}>HOME</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavLinkClick('/', 'history-section')} className={styles.navLink}>HISTORY</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavLinkClick('/', 'services-section')} className={styles.navLink}>SERVICES</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavLinkClick('/', 'faq-section')} className={styles.navLink}>FAQS</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavLinkClick('/', 'footer')} className={styles.navLink}>CONTACTS</a>
          </li>
          <li className={styles.mobileOnlyNavItem}>
            <button className={styles.reserveNowButtonMobile} onClick={() => { setIsMenuOpen(false); onReserveNow(); }}>
              Reserve Now!
            </button>
          </li>
        </ul>
      </nav>

      <div className={styles.desktopActions}>
        <button className={styles.reserveNowButton} onClick={onReserveNow}>
          Reserve Now!
        </button>
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

export default Header;