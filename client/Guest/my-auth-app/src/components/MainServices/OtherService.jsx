import React, { useEffect, useState } from 'react';
import styles from './OtherService.module.css';

// const otherServicesData = [
//   { item: 'LCD Projector', price: 'P 1,800.00/day' },
//   { item: 'LED Wall', price: 'P 19,500.00/day' },
//   { item: 'Sound System', price: 'P 1,200.00/day' },
//   { item: 'Videoke', price: 'P 1,300.00/day' },
//   { item: 'Television (55")', price: 'P 1,800.00/day' },
//   { item: 'Television (32")', price: 'P 1,200.00/day' },
//   { item: 'Monobloc Chairs', price: 'P 35.00/day' },
//   { item: 'Conference Table', price: 'P 70.00/day' },
//   { item: 'Table Cloth', price: 'P 30.00/pc' },
//   { item: 'Seat Cover', price: 'P 20.00/pc' },
//   { item: 'Parachute', price: 'P 1,200.00/day' },
//   { item: 'Parachute 1/Set up', price: 'P 4,000.00/day' },
//   { item: 'Towel/Pillow/Blanket', price: 'P 70.00/pc' },
//   { item: 'Electricity Fee', price: 'P 360.00/day/1000watts' },
//   { item: 'Corkage Fee', price: 'P 2,500.00 - 8,500.00/day' },
//   { item: 'FAX Machine', price: 'P 40.00/pc' },
//   { item: 'Telephone', price: 'P 5.00/call/5mins.' },
//   { item: 'Certification Fee', price: 'P 200.00/certificate' },
// ];

function MainServicesOtherService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/special-service/get-all-special-services')
      .then(res => res.json())
      .then(data => {
        setServices(data.specialServices || []);
        setLoading(false);
      })
      .catch(() => {
        setServices([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.otherServiceSection}>
      <h2 className={styles.sectionTitle}>SPECIAL SERVICES</h2>

      <div className={styles.servicesContainer}>
        <div className={styles.servicesHeader}>
          <h3 className={styles.headerColumn}>EQUIPMENTS</h3>
          <h3 className={`${styles.headerColumn} ${styles.headerPriceColumn}`}>PRICE</h3>
        </div>
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceItem}>
              <span className={styles.serviceName}>{service.name}</span>
              <span className={styles.servicePrice}>₱{Number(service.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              /{service.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainServicesOtherService;