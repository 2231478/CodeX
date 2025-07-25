import React from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainServices.module.css';

import MainServicesHeader from './Header';
import MainServicesNavSearch from './NavSearch';
import MainServicesDormitories from './Dormitories';
import MainServicesCottages from './Cottages';
import MainServicesRates from './ServicesRates';
import MainServicesConference from './Conference';
import MainServicesOtherService from './OtherService';

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
        <MainServicesHeader />
        <div className={styles.contentWrapper}>
          <MainServicesNavSearch />

          <Routes>
            <Route path="/" element={<Navigate to="dormitories" replace />} />
            <Route path="dormitories" element={<MainServicesDormitories />} />
            <Route path="cottages" element={<MainServicesCottages />} />
            <Route path="conference" element={<MainServicesConference />} />
            <Route path="otherservice" element={<MainServicesOtherService />} />
          </Routes>

          <MainServicesRates />
        </div>
      </main>

      <Footer onReserveNow={handleReserveNow} />
    </div>
  );
}

export default MainServices;