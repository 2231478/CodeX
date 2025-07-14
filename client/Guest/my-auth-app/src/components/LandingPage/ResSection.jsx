import React from 'react';
import styles from './ResSection.module.css';

function ResSection() { 
  return (
    <section className={styles.resSection}> 
      <div className={styles.buttonContainer}>
        <button className={styles.reserveNowButton}>RESERVE NOW!</button>
      </div>
    </section>
  );
}

export default ResSection; 