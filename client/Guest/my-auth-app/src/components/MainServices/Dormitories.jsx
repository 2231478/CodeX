import React, { useState, useEffect } from 'react';
import styles from './Dormitories.module.css';
import dormitoryPlaceholder from '../../assets/conference.jpg'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// const dormitoryData = [
//   { id: 1, name: 'QUIRINO HALL', capacity: '20 pax', rate: '375' },
//   { id: 2, name: 'ROXAS HALL', capacity: '20 pax', rate: '375' },
//   { id: 3, name: 'RECTO HALL', capacity: '20 pax', rate: '375' },
//   { id: 4, name: 'ESCODA ROOM 104', capacity: '20 pax', rate: '375' },
//   { id: 5, name: 'PAGES HALL', capacity: '20 pax', rate: '375' },
//   { id: 6, name: 'SQ MEDICAL', capacity: '20 pax', rate: '375' },
//   { id: 7, name: 'HERNANDEZ HALL 1-7A', capacity: '20 pax', rate: '375' },
//   { id: 8, name: 'SQ MAIN 101-102', capacity: '20 pax', rate: '375' },
//   { id: 9, name: 'ESCODA HALL', capacity: '20 pax', rate: '375' },
//   { id: 10, name: 'BACHELORS HALL', capacity: '20 pax', rate: '375' },
//   { id: 11, name: 'STAFFHOUSE', capacity: '20 pax', rate: '375' },
//   { id: 12, name: 'MAGSAYSAY', capacity: '20 pax', rate: '375' },
//   { id: 13, name: 'SQ ANNEX', capacity: '20 pax', rate: '375' },
//   { id: 14, name: 'SQ MAIN', capacity: '20 pax', rate: '375' },
//   { id: 15, name: 'HERNANDEZ', capacity: '20 pax', rate: '375' },
// ];

function MainServicesDormitories() {
  const [dormitories, setDormitories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/facility/get-facilities-by-type/DORMITORY')
      .then(res => res.json())
      .then(data => {
        setDormitories(data.facilities || []);
        setLoading(false);
      })
      .catch(() => {
        setDormitories([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.dormitoriesSection}>
      <h2 className={styles.sectionTitle}>DORMITORIES</h2>

      <div className={styles.dormitoryGrid}>
        {!loading && dormitories.length === 0 && (
          <div className={styles.noFacilities}>
            <div className={styles.softCard}>
              <p>No dormitories found.</p>
            </div>
          </div>
        )}

        {dormitories.map((dorm) => (
          <div key={dorm.id} className={styles.dormitoryCard}>
            <div className={styles.dormitoryImagePlaceholder} style={{ backgroundImage: `url(${dormitoryPlaceholder})` }}>
            </div>
            <h3 className={styles.dormitoryName}>{dorm.name}</h3>
            <p className={styles.dormitoryInfo}>Capacity: {dorm.capacity} pax</p>
            <p className={styles.dormitoryRate}>Rates per Person : ₱ {Number(dorm.ratePerPerson || 0).toLocaleString()}</p>
            <Link to={`/services/dormitories/${dorm.id}`} className={styles.checkButton}>Check</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesDormitories;