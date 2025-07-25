import React from 'react';
import styles from './Cottages.module.css'; 
import placeholderImage from '../../assets/conference.jpg';

const cottageData = [
  { id: 1, name: 'COTTAGE (4-5pax)', rate: 'P 2,600' },
  { id: 2, name: 'COTTAGE (6-8pax)', rate: 'P 3,650' },
  { id: 3, name: 'COTTAGE (9-11pax)', rate: 'P 5,250' },
  { id: 4, name: 'COTTAGE (12-14pax)', rate: 'P 6,650' },
  { id: 5, name: 'COTTAGE (15-18pax)', rate: 'P 8,350' },
];

function MainServicesCottages() {
  return (
    <section className={styles.cottagesSection}>
      <h2 className={styles.sectionTitle}>COTTAGES / GUESTHOUSE</h2> {/* */}

      <div className={styles.cottageGrid}>
        {cottageData.map(cottage => (
          <div key={cottage.id} className={styles.cottageCard}>
            <div className={styles.cottageImagePlaceholder}>
              <img src={placeholderImage} alt={cottage.name} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cottageName}>{cottage.name}</h3> {/* */}
              <p className={styles.cottageRate}>Rates per Person : {cottage.rate}</p> {/* */}
              <button className={styles.checkButton}>Check</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesCottages;