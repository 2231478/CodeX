import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavSearch.module.css';

function MainServicesNavSearch() {
  return (
    <div className={styles.navAndSearchContainer}>
      <div className={styles.navTabs}>
        <Link to="#" className={`${styles.navTab} ${styles.activeTab}`}>Dormitory</Link>
        <Link to="#" className={styles.navTab}>Cottages</Link>
        <Link to="#" className={styles.navTab}>Conference</Link>
        <Link to="#" className={styles.navTab}>Other Service</Link>
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