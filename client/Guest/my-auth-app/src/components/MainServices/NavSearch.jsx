import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import styles from './NavSearch.module.css';

function MainServicesNavSearch() {
  const location = useLocation(); 
  const basePath = '/services';

  return (
    <div className={styles.navAndSearchContainer}>
      <div className={styles.navTabs}>
        <Link
          to={`${basePath}/dormitories`}
          className={`${styles.navTab} ${location.pathname === `${basePath}/dormitories` ? styles.activeTab : ''}`}
        >
          Dormitory
        </Link>
        <Link
          to={`${basePath}/cottages`} 
          className={`${styles.navTab} ${location.pathname === `${basePath}/cottages` ? styles.activeTab : ''}`}
        >
          Cottages
        </Link>
        <Link
          to={`${basePath}/conference`}
          className={`${styles.navTab} ${location.pathname === `${basePath}/conference` ? styles.activeTab : ''}`}
        >
          Conference
        </Link>
        <Link
          to={`${basePath}/otherservice`}
          className={`${styles.navTab} ${location.pathname === `${basePath}/otherservice` ? styles.activeTab : ''}`}
        >
          Other Service
        </Link>
      </div>
      <div className={styles.searchFilter}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
        <button className={styles.searchButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button className={styles.filterButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>
    </div>
  );
}

export default MainServicesNavSearch;