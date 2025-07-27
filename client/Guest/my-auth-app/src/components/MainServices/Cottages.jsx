import React from 'react';
import styles from './Cottages.module.css'; 
import placeholderImage from '../../assets/conference.jpg';
import { Link } from 'react-router-dom';

const cottageData = [
  { id: 1, name: 'COTTAGE (4-5pax)', rate: '2,600' },
  { id: 2, name: 'COTTAGE (6-8pax)', rate: '3,650' },
  { id: 3, name: 'COTTAGE (9-11pax)', rate: '5,250' },
  { id: 4, name: 'COTTAGE (12-14pax)', rate: '6,650' },
  { id: 5, name: 'COTTAGE (15-18pax)', rate: '8,350' },
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
              <p className={styles.cottageRate}>Rates per Person : ₱ {cottage.rate}</p> {/* */}
              <Link to={`/services/cottages/${cottage.id}`} className={styles.checkButton}>Check</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesCottages;