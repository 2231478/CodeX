import React, { useState, useEffect } from 'react';
import styles from './Conference.module.css';
import placeholderImage from '../../assets/conference.jpg';
import { Link } from 'react-router-dom';

// const conferenceData = [
//   { id: 1, name: 'BENITEZ HALL', capacity: '400 guest', price: '22,000' },
//   { id: 2, name: 'QUEZON HALL MAIN', capacity: '180 guest', price: '7,000' },
//   { id: 3, name: 'QUEZON HALL DOWN', capacity: '40 guest', price: '3,200' },
//   { id: 4, name: 'QUIRINO CONF HALL', capacity: '100 guest', price: '12,050' },
//   { id: 5, name: 'CARLOS P. ROMULO', capacity: '250 guest', price: '30,000' },
//   { id: 6, name: 'QUIRINO MINI HALL', capacity: '20 guest', price: '2,500' },
//   { id: 7, name: 'PAGES CONF HALL', capacity: '50 guest', price: '2,930' },
//   { id: 8, name: 'ABADA HALL', capacity: '200 guest', price: '7,000' },
//   { id: 9, name: 'ORING-AO HALL', capacity: '20 guest', price: '2,000' },
//   { id: 10, name: 'ROXAS AVR', capacity: '150 guest', price: '8,000' },
//   { id: 11, name: 'ALBERT HALL MAIN', capacity: '100 guest', price: '26,000' },
//   { id: 12, name: 'ALBERT HALL (L-R)', capacity: '50 guest', price: '3,000' },
//   { id: 13, name: 'GROUNDS', capacity: 'Duration: Whole Day', price: '2,000' },
//   { id: 14, name: 'GROUNDS', capacity: 'Duration: Half Day', price: '1,000' },
// ];

function MainServicesConference() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/facility/get-facilities-by-type/CONFERENCE')
      .then(res => res.json())
      .then(data => {
        setFacilities(data.facilities || []);
        setLoading(false);
      })
      .catch(() => {
        setFacilities([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.conferenceSection}>
      <h2 className={styles.sectionTitle}>CONFERENCE HALLS</h2>
      
      <div className={styles.conferenceGrid}>
        {facilities.map(hall => (
          <div key={hall.id} className={styles.conferenceCard}>
            <div className={styles.conferenceImagePlaceholder}>
              <img src={hall.image ? hall.image : placeholderImage} alt={hall.name} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.conferenceName}>{hall.name}</h3>
              <p className={styles.conferenceCapacity}>Capacity: {hall.capacity}</p>
              <p className={styles.conferencePrice}>Price : ₱ {Number(hall.price).toLocaleString()}</p>
              <Link to={`/services/conference/${hall.id}`} className={styles.checkButton}>Check</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MainServicesConference;