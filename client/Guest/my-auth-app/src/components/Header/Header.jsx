import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Header.module.css';
import mountainLogo from '../../assets/logo.png';

function Header({ onReserveNow }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoGroup}>
        <Link to="/" className={styles.headerLogoLink}>
          <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.headerLogo} />
          <p className={styles.headerLogoText}>BTC</p>
        </Link>
      </div>

      <nav className={styles.navbarNav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>HOME</Link>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => scrollToSection('history-section')} className={styles.navLink}>HISTORY</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => scrollToSection('services-section')} className={styles.navLink}>SERVICES</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => scrollToSection('faq-section')} className={styles.navLink}>FAQS</a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => scrollToSection('footer')} className={styles.navLink}>CONTACTS</a>
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