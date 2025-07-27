import React from 'react';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
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
import MainServicesServiceDetail from './ServiceDetail';


function MainServices() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReserveNow = () => {
    console.log("Reserve Now clicked from MainServices page!");
    navigate('/auth/login');
  };

  const isDetailViewOrOtherService = 
    (location.pathname.includes('/dormitories/') && location.pathname.split('/').length > 3) ||
    (location.pathname.includes('/cottages/') && location.pathname.split('/').length > 3) ||
    (location.pathname.includes('/conference/') && location.pathname.split('/').length > 3) ||
    location.pathname.includes('/otherservice');

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

            <Route path=":type/:id" element={<MainServicesServiceDetail />} />
          </Routes>

          {!isDetailViewOrOtherService && <MainServicesRates />}
        </div>
      </main>

      <Footer onReserveNow={handleReserveNow} />
    </div>
  );
}

export default MainServices;