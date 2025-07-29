import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './FooterHome.module.css'; 
import mountainLogo from '../../assets/logo.png';
import locationIcon from '../../assets/locIcon.svg';
import phoneIcon from '../../assets/phoneIcon.svg';
import emailIcon from '../../assets/mailIcon.svg';


function Footer({ onReserveNow }) {
  const location = useLocation();
  const navigate = useNavigate();

  const address = "C364+QGG, Leonard Wood Rd, Baguio, Benguet";
  const phoneNumber = "(074) 442 3517";
  const emailAddress = "teacherscamp@deped.gov.ph";

  const formattedPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavAndScroll = (path, sectionId) => {
    if (location.pathname === path) {
      scrollToSection(sectionId);
    } else {
      navigate(path);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    }
  };

  const handleTaraCampClick = () => {
    navigate('/reservation-form');
  };


  return (
    <footer className={styles.footerContainer} id="footer">
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoGroup}>
            <img src={mountainLogo} alt="Baguio Teachers Camp Logo" className={styles.footerLogo} />
            <p className={styles.footerLogoText}>Baguio Teachers Camp</p>
          </div>
          <p className={styles.addressText}>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              <img src={locationIcon} alt="Location Icon" className={styles.contactIcon} /> {address}
            </a>
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>LINKS</h3>
          <ul className={styles.linkList}>
            <li>
              <Link to="/homepage" className={styles.footerLink}>Home</Link>
            </li>
            <li>
              <Link to="/history" className={styles.footerLink}>History</Link>
            </li>
            {/* <li>
              <Link to="/services" className={styles.footerLink}>Services</Link>
            </li>
            <li>
              <Link to="/faqs" className={styles.footerLink}>FAQs</Link>
            </li> */}
            <li>
              <Link to="/contacts" className={styles.footerLink}>Contacts</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>CONTACTS</h3>
           <p className={styles.contactItem}>
            <a href={`mailto:${emailAddress}`} className={styles.contactLink}>
              <img src={emailIcon} alt="Email Icon" className={styles.contactIcon} /> {emailAddress}
            </a>
          </p>
          <p className={styles.contactItem}>
            <a href={`tel:${formattedPhoneNumber}`} className={styles.contactLink}>
              <img src={phoneIcon} alt="Phone Icon" className={styles.contactIcon} /> {phoneNumber}
            </a>
          </p>

          <button
            className={styles.taraCampButton}
            onClick={handleTaraCampClick}
          >
            TaraCAMP!
          </button>
        </div>
      </div>

      <div className={styles.copyrightBar}>
        <p>Copyright @2025 By Baguio Teachers Camp | All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;