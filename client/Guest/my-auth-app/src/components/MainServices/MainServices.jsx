import React, { useState } from 'react';
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
  const [facilities, setFacilities] = useState([]);     
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const getFacilityTypeFromPath = (pathname) => {
    if (pathname.includes('/dormitories')) return 'DORMITORY';
    if (pathname.includes('/cottages')) return 'COTTAGE';
    if (pathname.includes('/conference')) return 'CONFERENCE';
    if (pathname.includes('/otherservice')) return 'OTHER SERVICE';
    return '';
  };

  const facilityType = getFacilityTypeFromPath(location.pathname);

  const handleSearch = async (query) => {
    if (!query.trim() || !facilityType) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/facility/search-facilities?type=${encodeURIComponent(facilityType)}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.status === 200) {
        setFacilities(data.facilities || []);
      } else {
        setFacilities([]);
      }
    } catch {
      setFacilities([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => setFacilities([]);

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
          <MainServicesNavSearch onSearch={handleSearch} onClearSearch={handleClearSearch}/>

          <Routes>
            <Route path="/" element={<Navigate to="dormitories" replace />} />
            <Route path="dormitories" element={<MainServicesDormitories facilities={facilities} loading={loading} />} />
            <Route path="cottages" element={<MainServicesCottages facilities={facilities} loading={loading}/>} />
            <Route path="conference" element={<MainServicesConference facilities={facilities} loading={loading}/>} />
            <Route path="otherservice" element={<MainServicesOtherService facilities={facilities} loading={loading}/>} />

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