import React from 'react';
import styles from './ResSection.module.css';

function ResSection({ onReserveNow }) {
  return (
    <section className={styles.resSection}>
      <div className={styles.buttonContainer}>
        <button
          className={styles.reserveNowButton}
          onClick={onReserveNow} 
        >
          RESERVE NOW!
        </button>
      </div>
    </section>
  );
}

export default ResSection;