import React from 'react';
import styles from './HistorySection.module.css';

function HistorySection() {
  const videoId = 'JtN4G8pdJDU';
  const youtubeVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`; 
  
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
        <div className={styles.historyVideoContainer}> 
          <iframe
            className={styles.historyVideo} 
            src={youtubeVideoUrl}
            title="Baguio Teachers Camp: Beyond Tales and History."
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <p className={styles.videoCaption}>Baguio Teachers Camp: Beyond Tales and History. (2020)</p> 
        </div>
      </div>
    </section>
  );
}

export default HistorySection;