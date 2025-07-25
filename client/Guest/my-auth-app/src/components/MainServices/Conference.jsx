import React from 'react';
import styles from './Conference.module.css';
import placeholderImage from '../../assets/conference.jpg';

const conferenceData = [
  { id: 1, name: 'BENITEZ HALL', capacity: '400 guest', price: 'P 22,000' },
  { id: 2, name: 'QUEZON HALL MAIN', capacity: '180 guest', price: 'P 7,000' },
  { id: 3, name: 'QUEZON HALL DOWN', capacity: '40 guest', price: 'P 3,200' },
  { id: 4, name: 'QUIRINO CONF HALL', capacity: '100 guest', price: 'P 12,050' },
  { id: 5, name: 'CARLOS P. ROMULO', capacity: '250 guest', price: 'P 30,000' },
  { id: 6, name: 'QUIRINO MINI HALL', capacity: '20 guest', price: 'P 2,500' },
  { id: 7, name: 'PAGES CONF HALL', capacity: '50 guest', price: 'P 2,930' },
  { id: 8, name: 'ABADA HALL', capacity: '200 guest', price: 'P 7,000' },
  { id: 9, name: 'ORING-AO HALL', capacity: '20 guest', price: 'P 2,000' },
  { id: 10, name: 'ROXAS AVR', capacity: '150 guest', price: 'P 8,000' },
  { id: 11, name: 'ALBERT HALL MAIN', capacity: '100 guest', price: 'P 26,000' },
  { id: 12, name: 'ALBERT HALL (L-R)', capacity: '50 guest', price: 'P 3,000' },
  { id: 13, name: 'GROUNDS', capacity: 'Duration: Whole Day', price: 'P 2,000' },
  { id: 14, name: 'GROUNDS', capacity: 'Duration: Half Day', price: 'P 1,000' },
];

function MainServicesConference() {
  return (
    <section className={styles.conferenceSection}>
      <h2 className={styles.sectionTitle}>CONFERENCE HALLS</h2>

      <div className={styles.conferenceGrid}>
        {conferenceData.map(hall => (
          <div key={hall.id} className={styles.conferenceCard}>
            <div className={styles.conferenceImagePlaceholder}>
              <img src={placeholderImage} alt={hall.name} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.conferenceName}>{hall.name}</h3>
              <p className={styles.conferenceCapacity}>Capacity: {hall.capacity}</p>
              <p className={styles.conferencePrice}>Price : {hall.price}</p>
              <button className={styles.checkButton}>Check</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesConference;