import React from 'react';
import styles from './Dormitories.module.css';
import dormitoryPlaceholder from '../../assets/conference.jpg'; 
import { useNavigate } from 'react-router-dom';

const dormitoryData = [
  { id: 1, name: 'QUIRINO HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 2, name: 'ROXAS HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 3, name: 'RECTO HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 4, name: 'ESCODA ROOM 104', capacity: '20 pax', rate: 'P 375' },
  { id: 5, name: 'PAGES HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 6, name: 'SQ MEDICAL', capacity: '20 pax', rate: 'P 375' },
  { id: 7, name: 'HERNANDEZ HALL 1-7A', capacity: '20 pax', rate: 'P 375' },
  { id: 8, name: 'SQ MAIN 101-102', capacity: '20 pax', rate: 'P 375' },
  { id: 9, name: 'ESCODA HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 10, name: 'BACHELORS HALL', capacity: '20 pax', rate: 'P 375' },
  { id: 11, name: 'STAFFHOUSE', capacity: '20 pax', rate: 'P 375' },
  { id: 12, name: 'MAGSAYSAY', capacity: '20 pax', rate: 'P 375' },
  { id: 13, name: 'SQ ANNEX', capacity: '20 pax', rate: 'P 375' },
  { id: 14, name: 'SQ MAIN', capacity: '20 pax', rate: 'P 375' },
  { id: 15, name: 'HERNANDEZ', capacity: '20 pax', rate: 'P 375' },
];

function MainServicesDormitories() {
  return (
    <section className={styles.dormitoriesSection}>
      <h2 className={styles.sectionTitle}>DORMITORIES</h2>
      <div className={styles.dormitoryGrid}>
        {dormitoryData.map((dorm) => (
          <div key={dorm.id} className={styles.dormitoryCard}>
            <div className={styles.dormitoryImagePlaceholder} style={{ backgroundImage: `url(${dormitoryPlaceholder})` }}>
            </div>
            <h3 className={styles.dormitoryName}>{dorm.name}</h3>
            <p className={styles.dormitoryInfo}>Capacity: {dorm.capacity}</p>
            <p className={styles.dormitoryRate}>Rates per Person : {dorm.rate}</p>
            <button className={styles.checkButton}>Check</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesDormitories;