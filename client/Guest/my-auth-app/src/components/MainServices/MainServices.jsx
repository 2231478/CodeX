import React from 'react';
import Navbar from '../Header/Header';
import Footer from '../Footer/Footer';
import Header from './Header';
import styles from './MainServices.module.css';
import NavSearch from './NavSearch';
import Dormitories from './Dormitories';
import ServicesRates from './ServicesRates';
import { useNavigate } from 'react-router-dom'; 


function MainServices() {
  const navigate = useNavigate();
  const handleReserveNow = () => {
    console.log("Reserve Now clicked from MainServices page!");
    navigate('/auth/login');
  };

  return (
    <div className={styles.mainServicesPageContainer}>
      <Navbar onReserveNow={handleReserveNow} />

      <main className={styles.mainContent}>
        <Header />
        <div className={styles.contentWrapper}> 
          <NavSearch />
          <Dormitories />
          <ServicesRates />
        </div>
      </main>

      <Footer onReserveNow={handleReserveNow} /> 
    </div>
  );
}

export default MainServices;