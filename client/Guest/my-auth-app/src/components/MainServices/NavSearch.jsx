import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavSearch.module.css';

function MainServicesNavSearch({ onSearch, onClearSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const basePath = '/services';

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      onClearSearch(); 
    }
  };

  // State for filter inputs
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  // State to control the visibility of the filter overlay
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);

  // Function to handle opening the overlay
  const openFilterOverlay = () => {
    setShowFilterOverlay(true);
  };

  // Function to handle closing the overlay
  const closeFilterOverlay = () => {
    setShowFilterOverlay(false);
  };

  // Function to handle filter application
  const handleApplyFilters = () => {
    console.log('Applying Filters:');
    console.log('Min Price:', minPrice);
    console.log('Max Price:', maxPrice);
    console.log('Capacity:', capacity);
    console.log('Check-in Date:', checkInDate);
    console.log('Check-out Date:', checkOutDate);
    // TODO: pass these values up to a parent component
    // or use them to construct URL query parameters for filtering the service list.

    closeFilterOverlay();
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setCapacity('');
    setCheckInDate('');
    setCheckOutDate('');
    console.log('Filters Cleared!');
  };

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
        <input
          type="text"
          placeholder="Search by Name"
          className={styles.searchInput}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button className={styles.filterButton} onClick={openFilterOverlay}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      {showFilterOverlay && (
        <div className={styles.filterOverlayBackdrop} onClick={closeFilterOverlay}>
          <div className={styles.filterOverlayContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.overlayCloseTopButton} onClick={closeFilterOverlay}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3>Apply Filters</h3>
            <div className={styles.overlayInputsGroup}>
              <div className={styles.overlayInputRow}>
                <label htmlFor="minPrice">Min Price:</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="ex.500"
                  className={styles.overlayInput}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className={styles.overlayInputRow}>
                <label htmlFor="maxPrice">Max Price:</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="ex.10000"
                  className={styles.overlayInput}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className={styles.overlayInputRow}>
                <label htmlFor="capacity">Capacity:</label>
                <input
                  type="number"
                  id="capacity"
                  placeholder="Guests"
                  className={styles.overlayInput}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                />
              </div>
              <div className={styles.overlayInputRow}>
                <label htmlFor="checkIn">Check-in:</label>
                <input
                  type="date"
                  id="checkIn"
                  className={styles.overlayInput}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div className={styles.overlayInputRow}>
                <label htmlFor="checkOut">Check-out:</label>
                <input
                  type="date"
                  id="checkOut"
                  className={styles.overlayInput}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.overlayButtons}>
              <button className={styles.overlayClearButton} onClick={handleClearFilters}>Clear All</button>
              <button className={styles.overlayApplyButton} onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainServicesNavSearch;