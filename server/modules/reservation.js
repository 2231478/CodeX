import { Category, GuestType, Status, UserRole, FacilityStatus, ServiceType, ReservationStatus } from '../constants.js';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage();
const bucket = storage.bucket(process.env.PRIVATE_BUCKET_NAME);

const reservationModule = {
  addReservation: async (dbHelper, data, file, user, userSocketMap) => {
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

      guestName = guestName?.trim();
      homeAddress = homeAddress?.trim();
      officeAddress = officeAddress?.trim();
      category = category?.trim();
      guestType = guestType?.trim();
      telephone = telephone?.trim();
      officeTelephone = officeTelephone?.trim();
      numberOfAdults = numberOfAdults?.trim();
      numberOfChildren = numberOfChildren?.trim();
      numberOfPwds = numberOfPwds?.trim();
      emergencyContact = emergencyContact?.trim();
      dateOfArrival = dateOfArrival?.trim();
      dateOfDeparture = dateOfDeparture?.trim();
      timeOfArrival = timeOfArrival?.trim();
      otherRequests = otherRequests?.trim();
      serviceType = serviceType?.trim();

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
        totalEstimatedAmount: (adults * facilityDoc.ratePerPerson) + ((children + pwds) * facilityDoc.ratePerPerson * 0.80),
        userId: user.userId,
        createdAt: new Date()
      };

      const reservation = await dbHelper.create('reservation', reservationData);

      const notification = {
        title: "Congratulations, Camper! Confirmation Successful — your reservation is now confirmed. We can't wait to welcome you!",
        message: `Thank you for choosing Teachers' Camp! Your reservation has been confirmed. We're excited to welcome you and ensure you have a comfortable and memorable stay.`,
        isRead: false,
        userId: user.userId,
        reservationId: reservation._id,
        createdAt: new Date()
      };

      await dbHelper.create('notification', notification);

      const userWs = userSocketMap.get(user.userId);
      if (userWs && userWs.readyState === 1) {
        userWs.send(JSON.stringify({
          type: 'notification',
          notification: {
            title: notification.title,
            message: notification.message,
            createdAt: notification.createdAt,
          }
        }));
      }

      const reservationObject = reservation.toObject();
      delete reservationObject.letterOfIntentUrl;
      delete reservationObject.__v;
      delete reservationObject.createdAt;
      delete reservationObject.userId;
      if (reservationObject.numberOfGuests) {
        delete reservationObject.numberOfGuests.adult;
        delete reservationObject.numberOfGuests.children;
        delete reservationObject.numberOfGuests.pwds;
      }

      responseData.status = Status.CREATED;
      responseData.error = null;
      responseData.message = 'Reservation submitted successfully';
      responseData.reservationId = reservation._id.toString();
      responseData.reservation = reservationObject;
    } catch (error) {
      console.error('Error creating reservation:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

/**
 * Fetches a reservation by its ID.
 * @param {Object} dbHelper - The database helper for database operations.
 * @param {string} reservationId - The ID of the reservation to be fetched.
 * @returns {Object} Response data with status, error, and reservation on success.
 */

  getReservationById: async (dbHelper, reservationId) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching reservation'
    };
    try {
      if (!reservationId) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Reservation ID is required';
        return responseData;
      }

      const reservation = await dbHelper.findOne('reservation', { _id: reservationId });
      if (!reservation) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Reservation not found';
        return responseData;
      }

      const objectName = reservation.letterOfIntentFile;
      let url = null;
      if (objectName) {
        try {
          [url] = await bucket.file(objectName).getSignedUrl({
            version: 'v4',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
            action: 'read',
          });
        } catch (urlError) {
          console.error('Error generating signed URL:', urlError);
          responseData.error = 'Error generating signed URL';
          return responseData;
        }
      }

      const reservationObject = reservation.toObject();
      if (reservationObject.numberOfGuests) {
        delete reservationObject.numberOfGuests.adult;
        delete reservationObject.numberOfGuests.children;
        delete reservationObject.numberOfGuests.pwds;
      }
      reservationObject.letterOfIntentFile = url;

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.reservation = reservationObject;
    } catch (error) {
      console.error('Error fetching reservation by ID:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

  /**
   * Fetches all reservations for a given user.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {Object} user - The user object containing the user ID and role.
   * @returns {Object} Response data with status, error, and reservations on success.
   */
  getReservationByUserId: async (dbHelper, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching reservations'
    };
    try {
      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }
      const reservations = await dbHelper.find('reservation', { userId: user.userId });
      responseData.status = Status.OK;
      responseData.error = null;
      responseData.reservations = reservations;
    } catch (error) {
      console.error('Error fetching reservations by user ID:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

  /**
   * Cancels a reservation.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {string} reservationId - The ID of the reservation to cancel.
   * @param {Object} user - The user object containing the user ID and role.
   * @returns {Object} Response data with status, error, message, and the updated reservation on success.
   */
  cancelBooking: async (dbHelper, reservationId, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error cancelling reservation'
    };
    try {
      if (!reservationId) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Reservation ID is required';
        return responseData;
      }
      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      const reservation = await dbHelper.findOne('reservation', { _id: reservationId });

      if (!reservation) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Reservation not found';
        return responseData;
      }

      if (reservation.userId.toString() !== user.userId.toString()) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'You are not authorized to cancel this reservation';
        return responseData;
      }

      const arrivalDate = new Date(reservation.dateOfArrival);
      const now = new Date();
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

      if (arrivalDate.getTime() - now.getTime() < twentyFourHoursInMs) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Cannot cancel reservation within 24 hours of arrival.';
        return responseData;
      }

      if (reservation.status === ReservationStatus.CANCELLED) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Reservation is already cancelled';
        return responseData;
      }

      const updatedReservation = await dbHelper.findOneAndUpdate(
        'reservation',
        { _id: reservationId },
        { status: ReservationStatus.CANCELLED },
        { new: true }
      );

      if (!updatedReservation) {
        responseData.status = Status.INTERNAL_SERVER_ERROR;
        responseData.error = 'Failed to update reservation status';
        return responseData;
      }

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.message = 'Reservation cancelled successfully';
      responseData.reservation = {
        _id: updatedReservation._id,
        status: updatedReservation.status
      };
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

  /**
   * Retrieves all reservations by the given status.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {string} status - The status of the reservations to fetch.
   * @param {Object} user - The user object containing the user ID and role.
   * @returns {Object} Response data with status, error, and an array of reservations on success.
   */
  getAllReservationsByStatus: async (dbHelper, status, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching reservations'
    };
    try {
      if (!user) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if (user.role == UserRole.GUEST) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'You are not authorized to perform this action';
        return responseData;
      }

      if (!status) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Status is required';
        return responseData;
      }

      if (!isValidReservationStatus(status)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid status';
        return responseData;
      }

      const reservations = await dbHelper.find('reservation', { status: status }, { __v: 0, createdAt: 0 });
      responseData.status = Status.OK;
      responseData.error = null;
      responseData.reservations = reservations;
    } catch (error) {
      console.error('Error fetching reservations by status:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

  approveOrDeclineReservation: async (dbHelper, reservationId, status, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error approving or declining reservation'
    };
    try {
      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if (user.role !== UserRole.ADMIN) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'You are not authorized to perform this action';
        return responseData;
      }

      if (!reservationId) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Reservation ID is required';
        return responseData;
      }

      if (!isValidReservationStatus(status)) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Invalid or missing status parameter';
        return responseData;
      }

      const updatedReservation = await dbHelper.findOneAndUpdate(
        'reservation',
        { _id: reservationId },
        { status: status },
        { new: true }
      );

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.message = 'Reservation status updated successfully';
      responseData.reservation = {
        _id: updatedReservation._id,
        status: updatedReservation.status
      };
    } catch (error) {
      console.error('Error approving or declining reservation:', error);
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

function isValidReservationStatus(status) {
  return Object.values(ReservationStatus).includes(status);
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