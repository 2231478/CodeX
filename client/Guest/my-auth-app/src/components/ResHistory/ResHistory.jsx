import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHome from '../HeaderHome/HeaderHome';
import styles from './ResHistory.module.css';

function ReservationHistory() {
  const navigate = useNavigate();

  // Static data for testing
  const staticReservations = [
    {
      id: 1,
      date: '04/11/2025',
      type: 'Conference Hall',
      details: {
        groupAssociation: 'Philippine Educators Association',
        address: '123 Mabini Street, Quezon City, Philippines',
        officeAddress: 'DepEd Regional Office, Manila',
        category: 'DepEd',
        phoneNo: '0912 345 6789',
        officeTelephoneNo: '(02) 8765 4321',
        numberOfGuests: '100',
        emergencyContact: '0918 765 4321',
        dateOfArrival: 'June 24, 2025',
        dateOfDeparture: 'August 5, 2025',
        typeOfFacility: 'Conference Hall',
        facilityName: 'Quirino Conf Hall',
        typeOfService: 'Events',
      },
      totalEstimatedAmount: '12,000.00',
    },
    {
      id: 2,
      date: '08/30/2024',
      type: 'Cottage',
      details: {
        groupAssociation: 'Family Vacation Group',
        address: 'N/A',
        officeAddress: 'N/A',
        category: 'Personal',
        phoneNo: '0917 123 4567',
        officeTelephoneNo: 'N/A',
        numberOfGuests: '5',
        emergencyContact: '0917 987 6543',
        dateOfArrival: 'August 28, 2024',
        dateOfDeparture: 'September 1, 2024',
        typeOfFacility: 'Cottage',
        facilityName: 'Pine Ridge Cottage',
        typeOfService: 'Accommodation',
      },
      totalEstimatedAmount: '8,500.00',
    },
    {
      id: 3,
      date: '01/30/2024',
      type: 'Albert Hall',
      details: {
        groupAssociation: 'Baguio University Alumni',
        address: 'N/A',
        officeAddress: 'N/A',
        category: 'Education',
        phoneNo: '0920 000 1111',
        officeTelephoneNo: '(074) 123 4567',
        numberOfGuests: '80',
        emergencyContact: '0920 222 3333',
        dateOfArrival: 'January 29, 2024',
        dateOfDeparture: 'January 30, 2024',
        typeOfFacility: 'Hall',
        facilityName: 'Albert Hall',
        typeOfService: 'Seminar',
      },
      totalEstimatedAmount: '6,000.00',
    },
  ];

  const [openReservationId, setOpenReservationId] = useState(staticReservations.length > 0 ? staticReservations[0].id : null);

  const handleGoBack = () => {
    navigate(-1); 
  };

  const toggleReservation = (id) => {
    setOpenReservationId(openReservationId === id ? null : id);
  };

  const handleConfirmNow = (reservationId) => {
    console.log(`Confirm Now clicked for reservation ID: ${reservationId}`);
    // TODO: Implement confirmation logic, e.g., send API request to confirm reservation
    alert(`Reservation ${reservationId} confirmed! (This is a placeholder action)`);
  };

return (
    <>
        <HeaderHome />
        <div className={styles.reservationHistoryContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.headerSection}>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <h1 className={styles.pageTitle}>RESERVATION HISTORY</h1>
                </div>

                <div className={styles.reservationList}>
                    {staticReservations.map((reservation) => (
                        <div key={reservation.id} className={styles.reservationCard}>
                            <div
                                className={styles.cardHeader}
                                onClick={() => toggleReservation(reservation.id)}
                                aria-expanded={openReservationId === reservation.id}
                            >
                                <h2 className={styles.cardTitle}>{reservation.type}</h2>
                                <span className={styles.cardDate}>{reservation.date}</span>
                                <span className={styles.toggleIcon}>
                                    {openReservationId === reservation.id ? '▲' : '▼'}
                                </span>
                            </div>

                            {openReservationId === reservation.id && (
                                <div className={styles.cardDetails}>
                                    {Object.entries(reservation.details).map(([key, value]) => (
                                        <div className={styles.detailRow} key={key}>
                                            <span className={styles.detailLabel}>
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            </span> 
                                            <span className={styles.detailSeparator}>:</span>
                                            <span className={styles.detailValue}>{value}</span>
                                        </div>
                                    ))}

                                    <div className={styles.amountSection}>
                                        <span className={styles.totalAmountLabel}>Total Estimated Amount</span>
                                        <span className={styles.totalAmountSeparator}>₱</span>
                                        <span className={styles.totalAmountValue}>{reservation.totalEstimatedAmount}</span>
                                        <button 
                                            className={`${styles.confirmButton} ${reservation.confirmed ? styles.confirmedButton : ''}`}
                                            onClick={() => handleConfirmNow(reservation.id)}
                                            disabled={reservation.confirmed}
                                        >
                                            {reservation.confirmed 
                                                ? 'Confirmed' 
                                                : reservation.details.category === 'Private' 
                                                    ? 'Pay Now!' 
                                                    : 'Confirm Now!'
                                            }
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
);
}

export default ReservationHistory;