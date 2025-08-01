 import React from 'react';
import HeaderHome from '../HeaderHome/HeaderHome'; 
import LandingHero from '../LandingHero/LandingHero';
import AccommodationsSection from './Accommodations';
import BoardLodgingSection from '../LandingPage/BoardLodgingSection';
import FooterHome from '../FooterHome/FooterHome';
import styles from './Homepage.module.css';
import { useNavigate } from 'react-router-dom';

function HomePage({ onReserveNow, isLoggedIn }) { 
  const navigate = useNavigate();

  const handleChatButtonClick = () => {
    console.log("Floating Chat button clicked!");
  };

  return (
    <div className={styles.homePage}>
      <HeaderHome  />
      <LandingHero onReserveNow={onReserveNow} isLoggedIn={isLoggedIn} />
      <AccommodationsSection />
      <BoardLodgingSection />
      <FooterHome />


      <button className={styles.chatButton} onClick={handleChatButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </button>
    </div>
  );
}

export default HomePage;