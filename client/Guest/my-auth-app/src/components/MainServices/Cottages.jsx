import React, { useState, useEffect } from 'react';
import styles from './Cottages.module.css'; 
import placeholderImage from '../../assets/conference.jpg';
import { Link } from 'react-router-dom';

// const cottageData = [
//   { id: 1, name: 'COTTAGE (4-5pax)', rate: '2,600' },
//   { id: 2, name: 'COTTAGE (6-8pax)', rate: '3,650' },
//   { id: 3, name: 'COTTAGE (9-11pax)', rate: '5,250' },
//   { id: 4, name: 'COTTAGE (12-14pax)', rate: '6,650' },
//   { id: 5, name: 'COTTAGE (15-18pax)', rate: '8,350' },
// ];

function MainServicesCottages() {
  const [cottages, setCottages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/facility/get-facilities-by-type/COTTAGE')
      .then(res => res.json())
      .then(data => {
        setCottages(data.facilities || []);
        setLoading(false);
      })
      .catch(() => {
        setCottages([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.cottagesSection}>
      <h2 className={styles.sectionTitle}>COTTAGES / GUESTHOUSE</h2> {/* */}

      <div className={styles.cottageGrid}>
        {!loading && cottages.length === 0 && (
          <div className={styles.noFacilities}>
            <div className={styles.softCard}>
              <p>No cottages found.</p>
            </div>
          </div>
        )}
        {cottages.map(cottage => (
          <div key={cottage.id} className={styles.cottageCard}>
            <div className={styles.cottageImagePlaceholder}>
              <img src={cottage.image ? cottage.image : placeholderImage} alt={cottage.name} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cottageName}>{cottage.name}</h3> {/* */}
              <p className={styles.cottageRate}>Rates per Person : ₱ {Number(cottage.ratePerPerson).toLocaleString()}</p> {/* */}
              <Link to={`/services/cottages/${cottage.id}`} className={styles.checkButton}>Check</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesCottages;