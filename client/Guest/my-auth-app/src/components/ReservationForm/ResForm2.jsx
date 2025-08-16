import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderHome from '../HeaderHome/HeaderHome'; 
import styles from './ResForm2.module.css';
import { ArrowLeft } from 'lucide-react';

function ReservationFormStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const formDataFromStep1 = location.state?.formData || {};

  const [formData, setFormData] = useState({
    dateArrival: '',
    dateDeparture: '',
    typeFacilities: '',
    facilityName: '',
    typeService: '',
    timeArrivalHour: '',
    timeArrivalAMPM: '',
    specialRequests: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handlePrevious = () => {
    navigate(-1);
  };

  const handleNext = () => {
    const combinedFormData = { ...formDataFromStep1, ...formData };
    console.log("Combined Form Data:", combinedFormData);
    // TODO: Implement logic to proceed to the next step or submit the form
  };

const getFacilityOptions = () => {
    switch (formData.typeFacilities) {
        case 'Dormitory':
            return [
                { value: 'Quirino Hall', label: 'Quirino Hall' },
                { value: 'Roxas Hall', label: 'Roxas Hall' },
                { value: 'Recto Hall', label: 'Recto Hall' },
                { value: 'Escoda Room 104', label: 'Escoda Room 104' },
                { value: 'Pages Hall', label: 'Pages Hall' },
                { value: 'SQ Medical', label: 'SQ Medical' },
                { value: 'Hernandez Hall 1-7A', label: 'Hernandez Hall 1-7A' },
                { value: 'SQ Main 101-102', label: 'SQ Main 101-102' },
                { value: 'Escoda Hall', label: 'Escoda Hall' },
                { value: 'Bachelors Hall', label: 'Bachelors Hall' },
                { value: 'Staffhouse', label: 'Staffhouse' },
                { value: 'Magsaysay', label: 'Magsaysay' },
                { value: 'SQ Annex', label: 'SQ Annex' },
                { value: 'SQ Main', label: 'SQ Main' },
                { value: 'Hernandez', label: 'Hernandez' }
            ];
        case 'Conference Hall':
            return [
                { value: 'Benitez Hall', label: 'Benitez Hall' },
                { value: 'Quezon Hall Main', label: 'Quezon Hall Main' },
                { value: 'Quezon Hall Down', label: 'Quezon Hall Down' },
                { value: 'Quirino Conf Hall', label: 'Quirino Conf Hall' },
                { value: 'Carlos P. Romulo', label: 'Carlos P. Romulo' },
                { value: 'Quirino Mini Hall', label: 'Quirino Mini Hall' },
                { value: 'Pages Conf Hall', label: 'Pages Conf Hall' },
                { value: 'Abada Hall', label: 'Abada Hall' },
                { value: 'Oring-Ao Hall', label: 'Oring-Ao Hall' },
                { value: 'Roxas AVR', label: 'Roxas AVR' },
                { value: 'Albert Hall Main', label: 'Albert Hall Main' },
                { value: 'Albert Hall (L-R)', label: 'Albert Hall (L-R)' },
                { value: 'Crounds', label: 'Crounds' }
            ];
        case 'Cottage/Guest House':
            return [
                { value: 'Cottage (4-5pax)', label: 'Cottage (4-5pax)' },
                { value: 'Cottage (6-8pax)', label: 'Cottage (6-8pax)' },
                { value: 'Cottage (9-11pax)', label: 'Cottage (9-11pax)' },
                { value: 'Cottage (12-14pax)', label: 'Cottage (12-14pax)' },
                { value: 'Cottage (15-18pax)', label: 'Cottage (15-18pax)' }
            ];
        default:
            return [];
    }
};

const getSpecialRequestOptions = () => {
  return [
    { value: 'LCD Projector', label: 'LCD Projector' },
    { value: 'LED Wall', label: 'LED Wall' },
    { value: 'Sound System', label: 'Sound System' },
    { value: 'Videoke', label: 'Videoke' },
    { value: 'Television (55")', label: 'Television (55")' },
    { value: 'Television (32")', label: 'Television (32")' },
    { value: 'Monobloc Chairs', label: 'Monobloc Chairs' },
    { value: 'Conference Table', label: 'Conference Table' },
    { value: 'Table Cloth', label: 'Table Cloth' },
    { value: 'Seat Cover', label: 'Seat Cover' },
    { value: 'Parachute', label: 'Parachute' },
    { value: 'Parachute 1/Set up', label: 'Parachute 1/Set up' },
    { value: 'Towel/Pillow/Blanket', label: 'Towel/Pillow/Blanket' },
    { value: 'Electricity Fee', label: 'Electricity Fee' },
    { value: 'Corkage Fee', label: 'Corkage Fee' },
    { value: 'FAX Machine', label: 'FAX Machine' },
    { value: 'Telephone', label: 'Telephone' },
    { value: 'Certification Fee', label: 'Certification Fee' }
  ];
};

return (
    <>
        <HeaderHome />
        <div className={styles.reservationFormContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.headerSection}>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className={styles.pageTitle}>RESERVATION FORM</h1>
                </div>
                <div className={styles.formCard}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Date of Arrival</label>
                                <input
                                    type="date"
                                    name="dateArrival"
                                    value={formData.dateArrival}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Date of Departure</label>
                                <input
                                    type="date"
                                    name="dateDeparture"
                                    value={formData.dateDeparture}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Type of Facilities</label>
                                <select
                                    name="typeFacilities"
                                    value={formData.typeFacilities}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setFormData(prev => ({ ...prev, facilityName: '' }));
                                    }}
                                    className={styles.input}
                                >
                                    <option value="">Select a facility type</option>
                                    <option value="Dormitory">Dormitory</option>
                                    <option value="Conference Hall">Conference Hall</option>
                                    <option value="Cottage/Guest House">Cottage/Guest House</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Facility Name</label>
                                <select
                                    name="facilityName"
                                    value={formData.facilityName}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    disabled={!formData.typeFacilities}
                                >
                                    <option value="">Select a facility</option>
                                    {getFacilityOptions().map(facility => (
                                        <option key={facility.value} value={facility.value}>
                                            {facility.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Type of Service</label>
                                <select
                                    name="typeService"
                                    value={formData.typeService}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                >
                                    <option value="">Select a service type</option>
                                    <option value="Meeting/Conference">Meeting/Conference</option>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Birthday Party">Birthday Party</option>
                                    <option value="Corporate Event">Corporate Event</option>
                                    <option value="Training/Seminar">Training/Seminar</option>
                                    <option value="Accommodation">Accommodation</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formData.typeService === 'Other' && (
                                    <input
                                        type="text"
                                        name="customService"
                                        value={formData.customService || ''}
                                        onChange={handleInputChange}
                                        placeholder="Please specify..."
                                        className={styles.input}
                                        style={{ marginTop: '8px' }}
                                    />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Time of Arrival</label>
                                <div className={styles.timeInput}>
                                    <input
                                        type="number"
                                        name="timeArrivalHour"
                                        value={formData.timeArrivalHour}
                                        onChange={handleInputChange}
                                        className={styles.timeInputBox}
                                        placeholder="HH"
                                        min="1"
                                        max="12"
                                    />
                                    <select
                                        name="timeArrivalAMPM"
                                        value={formData.timeArrivalAMPM}
                                        onChange={handleInputChange}
                                        className={styles.ampmSelect}
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Other Special Request or Services</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <select
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select a special service</option>
                                    {getSpecialRequestOptions().map(request => (
                                        <option key={request.value} value={request.value}>
                                            {request.label}
                                        </option>
                                    ))}
                                </select>
                                <button className={styles.addRequestButton}>+</button>
                            </div>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={handlePrevious} className={styles.previousButton}>
                                Previous
                            </button>
                            <button type="submit" onClick={handleNext} className={styles.nextButton}>
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
);
}

export default ReservationFormStep2;
