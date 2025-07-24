import React, { useState, useEffect } from 'react';
import styles from './ServicesSection.module.css';

import conferenceImage from '../../assets/conference.jpg';
import lodgingImage from '../../assets/lodging.jpg';
import eventsImage from '../../assets/events.jpg';
import recreationImage from '../../assets/recreation.jpg';

const servicesData = [
  {
    id: 1,
    title: 'CONFERENCE',
    description: 'State-of-the-art facilities perfect for large conferences, seminars, and corporate events. Equipped with modern AV technology and spacious halls.',
    image: conferenceImage,
  },
  {
    id: 2,
    title: 'LODGING',
    description: 'Comfortable and affordable accommodations for individuals and groups. Enjoy serene rooms amidst Baguio’s refreshing pine-scented air.',
    image: lodgingImage,
  },
  {
    id: 3,
    title: 'EVENTS',
    description: 'Versatile venues for various social events including weddings, birthdays, and anniversaries. Our team ensures a memorable experience for your special occasion.',
    image: eventsImage,
  },
  {
    id: 4,
    title: 'RECREATION',
    description: 'Engage in various recreational activities within the camp. From lush walking trails to sports facilities, unwind and rejuvenate.',
    image: recreationImage,
  },
];

function ServicesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let imagesLoadedCount = 0;
    const totalImages = servicesData.length;

    const handleImageLoad = () => {
      imagesLoadedCount++;
      if (imagesLoadedCount === totalImages) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    const handleImageError = (e) => {
      console.error('Failed to load image:', e.target.src);
      imagesLoadedCount++;
      if (imagesLoadedCount === totalImages) {
          setTimeout(() => {
           setLoading(false);
         }, 500);
      }
    };

    servicesData.forEach(service => {
      const img = new Image();
      img.src = service.image;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % servicesData.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading, servicesData.length]);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % servicesData.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + servicesData.length) % servicesData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.servicesSection} id="services-section">
      <h2 className={styles.sectionTitle}>DISCOVER OUR SERVICES</h2>
      
      <div className={styles.carouselOuterWrapper}>
        <button className={`${styles.carouselArrow} ${styles.leftArrow}`} onClick={goToPrevSlide} disabled={loading}>
          &lt;
        </button>

        <div className={styles.carouselContainer}>
          {loading && (
            <div className={styles.loadingSpinner}>
            </div>
          )}

          <div className={`${styles.carouselContentWrapper} ${loading ? styles.hiddenContent : ''}`}>
            {servicesData.map((service, index) => (
              <div
                key={service.id}
                className={`${styles.serviceCard} ${index === currentSlide ? styles.active : ''}`}
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className={styles.cardOverlay}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                </div>
                <div className={styles.cardBottomText}>
                  <span>Click for more services</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className={`${styles.carouselArrow} ${styles.rightArrow}`} onClick={goToNextSlide} disabled={loading}>
          &gt;
        </button>
      </div>

      {!loading && (
        <div className={styles.carouselDots}>
          {servicesData.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesSection;