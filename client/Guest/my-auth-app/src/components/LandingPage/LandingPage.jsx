import React from 'react';
import Header from '../Header/Header';
import LandingHero from '../LandingHero/LandingHero';
import Footer from '../Footer/Footer';
import styles from './LandingPage.module.css';
import HistorySection from './HistorySection'; 
import ServicesSection from './ServicesSection';  
import BoardLodgingSection from './BoardLodgingSection';


function LandingPage({ onReserveNow }) {
  return (
    <div className={styles.landingPageContainer}>
      <Header onReserveNow={onReserveNow} />
      
      <main className={styles.mainContent}>
        <LandingHero onReserveNow={onReserveNow} />
        <HistorySection />
        <ServicesSection /> 
        <BoardLodgingSection /> 
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;