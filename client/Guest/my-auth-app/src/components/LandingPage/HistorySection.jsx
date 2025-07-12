import React from 'react';
import styles from './HistorySection.module.css';
import historyImage from '../../assets/homepage.png'; // to be change

function HistorySection() {
  return (
    <section className={styles.historySection} id="history-section"> 
      <h2 className={styles.sectionTitle}>HISTORY</h2>
      <div className={styles.historyContent}>
        <div className={styles.historyText}>
          <p>
            Nestled in the heart of Baguio City, Teachers’ Camp stands as a historic retreat and training ground for
            educators across the country. Established in 1908 during the American colonial period, the camp was
            envisioned as a place where teachers could gather, learn, and rejuvenate.
          </p>
          <p>
            Originally, it served as a summer training site for Filipino and American educators, providing them
            with an environment conducive to professional development programs. Over the years, the camp evolved into a
            haven for nurturing lessons, camaraderie, and personal growth.
          </p>
          <p>
            Surrounded by lush pine trees and cool mountain air, Teachers’ Camp continues to be a cherished landmark,
            offering not just training, but a remarkable historical ambiance. It remains a timeless retreat dedicated to
            nurturing educators, truly embodying its mission of providing a serene environment for learning and growth.
          </p>
        </div>
        <div className={styles.historyImageContainer}>
          <img src={historyImage} alt="Baguio Teachers Camp 1908" className={styles.historyImage} />
          <p className={styles.imageCaption}>BAGUIO TEACHERS CAMP<br/>1908</p>
        </div>
      </div>
    </section>
  );
}

export default HistorySection;