import { Category, GuestType, Status, UserRole, FacilityStatus, ServiceType } from '../constants.js';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage();
const bucket = storage.bucket(process.env.PRIVATE_BUCKET_NAME);

const reservationModule = {
  addReservation: async (dbHelper, data, file, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error on booking reservation'
    };

    try {
      let {
        guestName, homeAddress, officeAddress, category, guestType,
        telephone, officeTelephone, numberOfAdults, numberOfChildren, numberOfPwds,
        emergencyContact, dateOfArrival, dateOfDeparture, facility, 
        serviceType, timeOfArrival, otherRequests
      } = data;

      guestName = guestName.trim();
      homeAddress = homeAddress.trim();
      officeAddress = officeAddress.trim();
      category = category.trim();
      guestType = guestType.trim();
      telephone = telephone.trim();
      officeTelephone = officeTelephone.trim();
      numberOfAdults = numberOfAdults.trim();
      numberOfChildren = numberOfChildren.trim();
      numberOfPwds = numberOfPwds.trim();
      emergencyContact = emergencyContact.trim();
      dateOfArrival = dateOfArrival.trim();
      dateOfDeparture = dateOfDeparture.trim();
      timeOfArrival = timeOfArrival.trim();
      otherRequests = otherRequests.trim();
      serviceType = serviceType.trim();

      if (
        !isPresent(guestName) ||
        !isPresent(homeAddress) ||
        !isPresent(category) ||
        !isPresent(telephone) ||
        !isPresent(numberOfAdults) ||
        !isPresent(emergencyContact) ||
        !isPresent(dateOfArrival) ||
        !isPresent(dateOfDeparture) ||
        !isPresent(timeOfArrival) ||
        !isPresent(facility) ||        
        !isPresent(serviceType)
      ) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing required fields';
        return responseData;
      }

      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if (!file) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing Letter of Intent file';
        return responseData;
      }

      if (!isValidPhone(telephone)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid phone number';
        return responseData;
      }

      if (!isValidPhone(emergencyContact)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid emergency contact number';
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

      if(!isValidTime(timeOfArrival)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid time format';
        return responseData;
      }

      if (!isValidGuestType(guestType)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid guest type';
        return responseData;
      }

      if (!isValidServiceType(serviceType)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid service type';
        return responseData;
      }

      if (!isValidLength((otherRequests || '').trim(), 500)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Requests must be 500 characters or less';
        return responseData;
      }

      if (!isValidFile(file)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid or missing Letter of Intent file';
        return responseData;
      }

      if (
        !isNonNegativeInteger(numberOfAdults) ||
        !isNonNegativeInteger(numberOfChildren) ||
        !isNonNegativeInteger(numberOfPwds)
      ) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Guest counts must be non-negative integers';
        return responseData;
      }

      const adults = parseInt(numberOfAdults) || 0;
      const children = parseInt(numberOfChildren) || 0;
      const pwds = parseInt(numberOfPwds) || 0;
      const total = adults + children + pwds;

      if (total <= 0) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'At least one guest is required';
        return responseData;
      }

      const facilityDoc = await dbHelper.findOne('facility', { _id: facility });
      if (!facilityDoc) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Selected facility does not exist';
        return responseData;
      }

      if (facilityDoc.status !== FacilityStatus.AVAILABLE) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Facility is not available for booking.';
        return responseData;
      }

      const userOverlapping = await dbHelper.findOne('reservation', {
        userId: user._id,
        facility: facility,
        $or: [
          {
            dateOfArrival: { $lte: new Date(dateOfDeparture) },
            dateOfDeparture: { $gte: new Date(dateOfArrival) }
          }
        ]
      });

      if (userOverlapping) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'You already have a reservation for this facility that overlaps with these dates.';
        return responseData;
      }

      const overlapping = await dbHelper.findOne('reservation', {
        facility: facility, 
        $or: [
          {
            dateOfArrival: { $lte: new Date(dateOfDeparture) },
            dateOfDeparture: { $gte: new Date(dateOfArrival) }
          }
        ]
      });

      if (overlapping) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Facility is not available for the selected dates.';
        return responseData;
      }

      if (total > facilityDoc.capacity) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = `Number of guests (${total}) exceeds the facility capacity (${facilityDoc.capacity}).`;
        return responseData;
      }

      let letterOfIntentUrl = null;
      if (file) {
      try {
        const filename = `letter_of_intent/${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;
        const blob = bucket.file(filename);
        await new Promise((resolve, reject) => {
          const stream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
          });
          stream.on('error', reject);
          stream.on('finish', resolve);
          stream.end(file.buffer);
        });
        letterOfIntentUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      } catch (err) {
        responseData.status = Status.INTERNAL_SERVER_ERROR;
        responseData.error = 'Letter of Intent upload failed: ' + err.message;
        return responseData;
      }
    }

      const reservationData = {
        guestName,
        homeAddress,
        officeAddress,
        category,
        guestType,
        telephone,
        officeTelephone,
        numberOfGuests: {
          total: total,
          adult: adults,
          children: children,
          pwds: pwds
        },
        emergencyContact,
        dateOfArrival: normalizeDateOnly(dateOfArrival),
        dateOfDeparture: normalizeDateOnly(dateOfDeparture),
        timeOfArrival,
        facility: facilityDoc._id,  
        serviceType,
        otherRequests,
        letterOfIntentFile: letterOfIntentUrl,
        totalEstimatedAmount: total * facilityDoc.ratePerPerson,
        userId: user.userId,
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

function isValidGuestType(type) {
    return Object.values(GuestType).includes(type);
}

function isNonNegativeInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 0;
}

function isValidDate(dateStr) {
    if (!dateStr) return false;

    const dateOnly = dateStr.split('T')[0].split(' ')[0];

    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(dateOnly)) return false;

    const date = new Date(dateOnly);
    return !isNaN(date.getTime());
}


function isValidDateRange(dateOfArrival, dateOfDeparture) {
    if (!isValidDate(dateOfArrival) || !isValidDate(dateOfDeparture)) return false;

    const arrival = new Date(dateOfArrival.split('T')[0].split(' ')[0]);
    const departure = new Date(dateOfDeparture.split('T')[0].split(' ')[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Optional: add max window, eg, 6 months from today
    const maxAdvance = new Date(today); maxAdvance.setMonth(today.getMonth() + 6);

    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) return false;
    if (arrival < tomorrow) return false;        
    if (departure <= arrival) return false;
    // if (arrival > maxAdvance) return false;       // Uncomment if you want to limit how far in advance

    return true;
}

function normalizeDateOnly(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const datePart = dateStr.split('T')[0].split(' ')[0];
  const normalized = new Date(datePart + "T00:00:00");
  return isNaN(normalized.getTime()) ? null : normalized;
}

function isValidTime(timeStr) {
    const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeFormatRegex.test(timeStr);
}

function isValidServiceType(type) {
    return Object.values(ServiceType).includes(type);
}

function isValidLength(value, maxLength) {
  if (!value) return true; 
  return value.length <= maxLength;
}

function isValidFile(file) {
  if (!file) return false;
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  return allowedTypes.includes(file.mimetype) && file.size <= maxFileSize;
}

function isPresent(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
}