import React from 'react';
import styles from './BoardLodgingSection.module.css';
import mealIcon from '../../assets/mealIcon.svg'; 
import wifiIcon from '../../assets/wifiIcon.svg'; 
import amenitiesIcon from '../../assets/amenitiesIcon.png'; 

function BoardLodgingSection() {
  return (
    <section className={styles.boardLodgingSection} id="board-lodging-section">
      <div className={styles.contentWrapper}>
        <div className={styles.topContent}>
          <h2 className={styles.sectionTitle}>BOARD & LODGING</h2>
          <p className={styles.description}>
            Teachers' Camp offers a perfect blend of comfort, affordability, and convenience for educators,
            students, and guests. Whether you're attending a seminar, conducting research, or simply looking for a
            peaceful retreat, our board and lodging services provide cozy accommodations, hearty meals, and
            essential amenities to ensure a relaxing stay.
          </p>
        </div>

        <div className={styles.featuresContainer}>
          <div className={styles.featureCard}>
            <img src={mealIcon} alt="Free Meals Icon" className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Free Meals</h3>
          </div>
          <div className={styles.featureCard}>
            <img src={wifiIcon} alt="Free Wifi Icon" className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Free Wifi</h3>
          </div>
          <div className={styles.featureCard}>
            <img src={amenitiesIcon} alt="Amenities Included Icon" className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Amenities Included</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoardLodgingSection;