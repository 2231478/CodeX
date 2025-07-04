import { Category, FacilityType } from '../constants.js';

const reservationModule = {
  createReservation: async (dbHelper, userId, data) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error on booking reservation'
    };

    try {
      const {
        guestName, homeAddress, officeAddress, category, telephone,
        officeTelephone, numberOfGuests, numberOfAdults, numberOfPwds, numberOfChildren,
        emergencyContact, dateOfArrival, dateOfDeparture, facilityType, facilityName,
        functionType, timeOfArrival, specialRequest, letterOfIntentFile, agreedToTerms
      } = data;

      if (
        !isPresent(guestName) ||
        !isPresent(homeAddress) ||
        !isPresent(officeAddress) ||
        !isPresent(category) ||
        !isPresent(telephone) ||
        !isPresent(officeTelephone) ||
        !isPresent(numberOfGuests) ||
        !isPresent(numberOfAdults) ||
        !isPresent(numberOfPwds) ||
        !isPresent(numberOfChildren) ||
        !isPresent(emergencyContact) ||
        !isPresent(dateOfArrival) ||
        !isPresent(dateOfDeparture) ||
        !isPresent(facilityType) ||
        !isPresent(facilityName) ||
        !isPresent(functionType) ||
        !isPresent(timeOfArrival) ||
        !isPresent(letterOfIntentFile) ||
        !agreedToTerms
      ) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing required fields';
        return responseData;
      }

      if (!userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if(!isValidPhone(telephone)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid phone number';
        return responseData;
      }

      if (!isValidCategory(category)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid category';
        return responseData;
      }
      if (!isValidDate(dateOfArrival) || !isValidDate(dateOfDeparture)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid date format';
        return responseData;
      }
      if (!isValidDateRange(dateOfArrival, dateOfDeparture)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid date range: ensure arrival is today or later, and departure is after arrival';
        return responseData;
      }
      if (!isValidFacilityType(facilityType)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid facility type';
        return responseData;
      }

      const adults = parseInt(numberOfAdults) || 0;
      const children = parseInt(numberOfChildren) || 0;
      const pwds = parseInt(numberOfPwds) || 0;
      const manualTotal = parseInt(numberOfGuests) || 0;
      const computedTotal = adults + children + pwds;

      if (manualTotal !== computedTotal) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'The total number of guests does not match the breakdown of guests';
        return responseData;
      }
      if (computedTotal <= 0) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'At least one guest is required';
        return responseData;
      }

      const overlapping = await dbHelper.findOne('reservation', {
        facility: data.facility, // Make sure this is the facility's ObjectId as in your input
        $or: [
            {
            dateOfArrival: { $lte: new Date(data.dateOfDeparture) },
            dateOfDeparture: { $gte: new Date(data.dateOfArrival) }
            }
        ]
        });
        
        if (overlapping) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Facility is not available for the selected dates.';
        return responseData;
        }

      const reservationData = {
        guestName, homeAddress, officeAddress, category, telephone, officeTelephone,
        numberOfGuests: manualTotal, numberOfAdults: adults, numberOfChildren: children, numberOfPwds: pwds,
        emergencyContact, dateOfArrival, dateOfDeparture, facilityType, facilityName,
        functionType, timeOfArrival, specialRequest, letterOfIntentFile,
        agreedToTerms, userId,
        createdAt: new Date()
      };

      const reservation = await dbHelper.create('reservation', reservationData);

      responseData.status = Status.CREATED;
      responseData.error = null;
      responseData.message = 'Reservation submitted successfully';
      responseData.reservationId = reservation._id.toString();
    } catch (error) {
      console.error('Error creating reservation:', error);
      responseData.error = error.message;
    }
    return responseData;
  }
};

export default reservationModule;

function isValidPhone(number) {
    return /^(\+63|0)9\d{9}$/.test(number);
}

function isValidCategory(category) {
    return Object.values(Category).includes(category);
}

function isValidDate(dateStr) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

function isValidDateRange(dateOfArrival, dateOfDeparture) {
    if (!isValidDate(dateOfArrival) || !isValidDate(dateOfDeparture)) return false;

    const arrival = new Date(dateOfArrival);
    const departure = new Date(dateOfDeparture);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Optional: add max window, eg, 6 months from today
    // const maxAdvance = new Date(today); maxAdvance.setMonth(today.getMonth() + 6);

    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) return false;
    if (arrival < tomorrow) return false;        
    if (departure <= arrival) return false;
    // if (arrival > maxAdvance) return false;       // Uncomment if you want to limit how far in advance

    return true;
}

function isValidFacilityType(type) {
    return Object.values(FacilityType).includes(type);
}

function isPresent(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
}