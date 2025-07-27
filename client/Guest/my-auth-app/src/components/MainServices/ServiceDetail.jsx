import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';
import placeholderImage from '../../assets/conference.jpg';

const allServiceData = {
  dormitories: [
    { id: 1, name: 'QUIRINO HALL', capacity: '20 pax', rate: '375' },
    { id: 2, name: 'ROXAS HALL', capacity: '20 pax', rate: '375' },
    { id: 3, name: 'RECTO HALL', capacity: '20 pax', rate: '375' },
    { id: 4, name: 'ESCODA ROOM 104', capacity: '20 pax', rate: '375' },
    { id: 5, name: 'PAGES HALL', capacity: '20 pax', rate: '375' },
    { id: 6, name: 'SQ MEDICAL', capacity: '20 pax', rate: '375' },
    { id: 7, name: 'HERNANDEZ HALL 1-7A', capacity: '20 pax', rate: '375' },
    { id: 8, name: 'SQ MAIN 101-102', capacity: '20 pax', rate: '375' },
    { id: 9, name: 'ESCODA HALL', capacity: '20 pax', rate: '375' },
    { id: 10, name: 'BACHELORS HALL', capacity: '20 pax', rate: '375' },
    { id: 11, name: 'STAFFHOUSE', capacity: '20 pax', rate: '375' },
    { id: 12, name: 'MAGSAYSAY', capacity: '20 pax', rate: '375' },
    { id: 13, name: 'SQ ANNEX', capacity: '20 pax', rate: '375' },
    { id: 14, name: 'SQ MAIN', capacity: '20 pax', rate: '375' },
    { id: 15, name: 'HERNANDEZ', capacity: '20 pax', rate: '375' },
  ],
  cottages: [
    { id: 1, name: 'COTTAGE (4-5pax)', capacity: '4-5 pax', rate: '2,600' },
    { id: 2, name: 'COTTAGE (6-8pax)', capacity: '6-8 pax', rate: '3,650' },
    { id: 3, name: 'COTTAGE (9-11pax)', capacity: '9-11 pax', rate: '5,250' },
    { id: 4, name: 'COTTAGE (12-14pax)', capacity: '12-14 pax', rate: '6,650' },
    { id: 5, name: 'COTTAGE (15-18pax)', capacity: '15-18 pax', rate: '8,350' },
  ],
  conference: [
    { id: 1, name: 'BENITEZ HALL', capacity: '400 guest', price: '22,200' },
    { id: 2, name: 'QUEZON HALL MAIN', capacity: '180 guest', price: '7,000' },
    { id: 3, name: 'QUEZON HALL DOWN', capacity: '40 guest', price: '3,000' },
    { id: 4, name: 'QUIRINO CONF HALL', capacity: '100 guest', price: '12,350' },
    { id: 5, name: 'CARLOS P. ROMULO', capacity: '250 guest', price: '30,000' },
    { id: 6, name: 'QUIRINO MINI HALL', capacity: '27 guest', price: '2,500' },
    { id: 7, name: 'PAGES CONF HALL', capacity: '20 guest', price: '2,930' },
    { id: 8, name: 'ABADA HALL', capacity: '20 guest', price: '2,000' },
    { id: 9, name: 'ORING-AO HALL', capacity: '20 guest', price: '3,000' },
    { id: 10, name: 'ROXAS AVR', capacity: '400 guest', price: '8,000' },
    { id: 11, name: 'ALBERT HALL MAIN', capacity: '200 guest', price: '26,000' },
    { id: 12, name: 'ALBERT HALL (L-R)', capacity: '100 guest', price: '3,000' },
    { id: 13, name: 'GROUNDS', capacity: 'Whole Day', price: '12,000' },
    { id: 14, name: 'GROUNDS', capacity: 'Half Day', price: '7,000' },
  ],
};

function MainServicesServiceDetail() {
  const { type, id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentService = allServiceData[type]?.find(service => service.id === parseInt(id));

  if (!currentService) {
    return (
      <section className={styles.serviceDetailSection}>
        <h2 className={styles.sectionTitle}>Service Not Found</h2>
        <p>The requested service could not be found. Please go back to the list.</p>
        <Link to={`/services/${type}`} className={styles.backButton}>Back to {type.charAt(0).toUpperCase() + type.slice(1)}</Link>
      </section>
    );
  }

  const getCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];

    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    while (calendarDays.length < 42) {
      calendarDays.push(null);
    }

    const reservedDates = new Set();
    for (let i = 1; i <= daysInMonth; i++) {
      if (i % 3 === 0 || i % 5 === 0) {
        reservedDates.add(i);
      }
    }

    return {
      monthDisplay: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      calendarDaysGrid: calendarDays,
      reservedDates: Array.from(reservedDates),
    };
  };

  const calendarData = getCalendarData(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      return newDate;
    });
  };

  const getPriceLabel = () => {
    if (type === 'conference') {
      return 'Price';
    } else {
      return 'Rates per Person';
    }
  };

  return (
    <section className={styles.serviceDetailSection}>
      <h2 className={styles.sectionTitle}>
        {type.toUpperCase()} / DETAIL VIEW
      </h2>

      <div className={styles.detailContentContainer}>
        <div className={styles.detailCard}>
          <div className={styles.detailImage} style={{ backgroundImage: `url(${placeholderImage})` }}></div>
          <h3 className={styles.detailName}>{currentService.name}</h3>
          <p className={styles.detailCapacity}>Capacity: {currentService.capacity}</p>
          <p className={styles.detailRate}>{getPriceLabel()} : ₱ {currentService.rate || currentService.price}</p>
          <button className={styles.reserveButton}>Reserve Now!</button>
          <Link to={`/services/${type}`} className={styles.backButton}>
            Back to {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
        </div>

        <div className={styles.reservationsCalendar}>
          <h4 className={styles.calendarHeader}>Reservations Calendar</h4>
          <div className={styles.calendarMonthNav}>
            <span className={styles.navArrow} onClick={handlePrevMonth}>&lt;</span>
            <span className={styles.currentMonth}>{calendarData.monthDisplay}</span>
            <span className={styles.navArrow} onClick={handleNextMonth}>&gt;</span>
          </div>
          <div className={styles.calendarGrid}>
            {calendarData.daysOfWeek.map(day => (
              <div key={day} className={styles.calendarDayHeader}>{day}</div>
            ))}
            {calendarData.calendarDaysGrid.map((date, index) => {
              const isToday = date &&
                  date === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();
              
              const isReserved = date && calendarData.reservedDates.includes(date);

              return (
                <div
                  key={index}
                  className={`${styles.calendarDate} ${isReserved ? styles.reservedDate : ''} ${isToday ? styles.currentDay : ''}`}
                >
                  {date || ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainServicesServiceDetail;