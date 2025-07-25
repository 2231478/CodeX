// src/components/Header/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import mountainLogo from '../../assets/logo.png';

function Header({ onReserveNow }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavLinkClick = (path, sectionId) => {
    if (location.pathname === path || (location.pathname === '/' && path === '/')) { // Adjusted condition for home path
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

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoGroup}>
        <a onClick={() => handleNavLinkClick('/', 'hero')} className={styles.headerLogoLink}>
          <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.headerLogo} />
          <p className={styles.headerLogoText}>BTC</p>
        </a>
      </div>

      <nav className={styles.navbarNav}>
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
        </ul>
      </nav>

      <button className={styles.reserveNowButton} onClick={onReserveNow}>
        Reserve Now!
      </button>
    </header>
  );
}

export default Header;