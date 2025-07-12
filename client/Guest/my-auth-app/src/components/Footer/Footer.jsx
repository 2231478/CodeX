import React from 'react';
import styles from './Footer.module.css';
import mountainLogo from '../../assets/logo.png'; 

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoGroup}>
            <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.footerLogo} />
            <p className={styles.footerLogoText}>Baguio Teachers Camp</p>
          </div>
          <p className={styles.addressText}>
            <span className={styles.icon}>📍</span> C364+QGG, Leonard Wood Rd, Baguio, Benguet
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>LINKS</h3>
          <ul className={styles.linkList}>
            <li><a href="#" className={styles.footerLink}>Home</a></li>
            <li><a href="#" className={styles.footerLink}>History</a></li>
            <li><a href="#" className={styles.footerLink}>Services</a></li>
            <li><a href="#" className={styles.footerLink}>FAQs</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>CONTACTS</h3>
          <p className={styles.contactItem}><span className={styles.icon}>📞</span> (074) 442 3517</p>
          <p className={styles.contactItem}><span className={styles.icon}>✉️</span> teacherscamp@deped.gov.ph</p>
          <button className={styles.taraCampButton}>TaraCAMP!</button>
        </div>
      </div>

      <div className={styles.copyrightBar}>
        <p>Copyright @2025 By Baguio Teachers Camp | All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;