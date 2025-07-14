import React from 'react';
import styles from './Header.module.css';
import mountainLogo from '../../assets/logo.png'; 

function Header({ onReserveNow }) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoGroup}>
        <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.headerLogo} />
        <p className={styles.headerLogoText}>BTC</p>
      </div>

      <nav className={styles.navbarNav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}><a href="#" className={styles.navLink}>HOME</a></li>
          <li className={styles.navItem}><a href="#history-section" className={styles.navLink}>HISTORY</a></li>
          <li className={styles.navItem}><a href="#services-section" className={styles.navLink}>SERVICES</a></li>
          <li className={styles.navItem}><a href="#" className={styles.navLink}>FAQS</a></li>
          <li className={styles.navItem}><a href="#" className={styles.navLink}>CONTACTS</a></li>
        </ul>
      </nav>

      <button className={styles.reserveNowButton} onClick={onReserveNow}>
        Reserve Now!
      </button>
    </header>
  );
}

export default Header;