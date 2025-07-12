import React from 'react';
import styles from './ServicesSection.module.css';

function ServicesSection() {
  return (
    <section className={styles.servicesSection} id="services-section">
      <h2 className={styles.sectionTitle}>DISCOVER OUR SERVICES</h2>
      <p>Content about your services will go here.</p>
      {/* add more detailed service cards, images, etc., here later */}
    </section>
  );
}

export default ServicesSection;