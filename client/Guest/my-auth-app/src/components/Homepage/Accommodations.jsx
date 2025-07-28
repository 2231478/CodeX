import React from 'react';
import styles from './Accommodations.module.css'; // Assuming this is your CSS module

function AccommodationsSection() {
  return (
    <section className={styles.accommodationsSection}>
      <h2 className={styles.sectionTitle}>ACCOMMODATIONS</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>HALL NAME</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>DORMITORY</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>COTTAGES</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>HALL NAME</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>DORMITORY</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
        <div className={styles.accommodationCard}>
          <div className={styles.cardImagePlaceholder}></div>
          <h3 className={styles.cardTitle}>COTTAGES</h3>
          <p className={styles.cardPrice}>Price</p>
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomText}>
          <p>Your Ideal Stay Awaits.</p>
          <p>Find the Perfect Space for You!</p>
        </div>
        <button className={styles.exploreMoreButton}>Explore More</button>
      </div>
    </section>
  );
}

export default AccommodationsSection;