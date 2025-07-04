import { Storage } from '@google-cloud/storage';
import { Status, FacilityType, FacilityStatus, UserRole } from '../constants.js';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage();
const bucket = storage.bucket(process.env.FACILITY_BUCKET_NAME);

const facilityModule = {
  /**
   * Adds a new facility to the database.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {Object} data - The data object containing facility details like name, facilityType, capacity, ratePerPerson, and status.
   * @param {Object} file - The file object representing the facility's image.
   * @param {Object} user - The user object representing the current user, which should contain a userId and role.
   * @returns {Object} Response data with status, error, and message, including the facilityId on success.
   */
    addFacility: async (dbHelper, data, file, user) => {
      const responseData = {
          status: Status.INTERNAL_SERVER_ERROR,
          error: 'Error adding facility'
      };

      try {
          const { name, facilityType, capacity, ratePerPerson, status } = data;

          if (!isPresent(name) || !isPresent(facilityType) || !isPresent(capacity) || !file) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Missing required fields';
            return responseData;
          }

          if (!user || !user.userId) {
            responseData.status = Status.UNAUTHORIZED;
            responseData.error = 'User not logged in';
            return responseData;
          }

          if (user.role !== UserRole.CRMSTEAM) {
            responseData.status = Status.FORBIDDEN;
            responseData.error = 'Only CRMS team can add a facility';
            return responseData;
          }

          if (!isValidFacilityType(facilityType)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid facility type';
            return responseData;
          }

          if (!isValidCapacity(capacity)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid capacity';
            return responseData;
          }

          if (!isValidRate(ratePerPerson)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid rate per person';
            return responseData;
          }

          if (!isValidFacilityStatus(status)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid facility status';
            return responseData;
          }

          let imageUrl;
          try {
            const filename = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;
            const blob = bucket.file(filename);
            await new Promise((resolve, reject) => {
                const stream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
                });
                stream.on('error', reject);
                stream.on('finish', async () => {
                resolve();
                });
                stream.end(file.buffer);
            });

            imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
          } catch (err) {
            responseData.status = Status.INTERNAL_SERVER_ERROR;
            responseData.error = 'Image upload failed: ' + err.message;
            return responseData;
          }
          
          const existing = await dbHelper.findOne('facility', {
            name,
            facilityType,
          });

          if (existing) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Facility already exists';
            return responseData;
          }

          const facilityData = {
            name,
            facilityType,
            capacity: parseInt(capacity, 10),
            ratePerPerson: parseFloat(ratePerPerson) || 0,
            status: status || FacilityStatus.AVAILABLE,
            image: imageUrl 
          };

          const facility = await dbHelper.create('facility', facilityData);

          responseData.status = Status.CREATED;
          responseData.error = null;
          responseData.message = 'Facility added successfully';
          responseData.facilityId = facility._id.toString();
      } catch (error) {
          console.error('Error adding facility:', error);
          responseData.error = error.message;
      }
      return responseData;
  },

  /**
   * Fetches all facilities.
   * @param {Object} dbHelper - The database helper for database operations.
   * @returns {Object} Response data with status, error, and facilities on success.
   */
  getAllFacilities: async (dbHelper) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching facilities',
      facilities: []
    };
    try {
      const facilities = await dbHelper.find('facility', {}, { __v: 0 });

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.facilities = facilities; 
    } catch (error) {
      responseData.error = error.message;
    }
    return responseData;
  },

  /**
   * Fetches a facility by its ID.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {string} id - The ID of the facility to be fetched.
   * @returns {Object} Response data with status, error, and facility on success.
   */
  getFacilityById: async (dbHelper, id) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching facility',
      facility: null
    };
    try {
      const facility = await dbHelper.findOne('facility', id);
      if (!facility) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Facility not found';
        return responseData;
      }

      const facilityObject = facility.toObject();
            delete facilityObject.__v;

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.facility = facilityObject;
    } catch (error) {
      responseData.error = error.message;
    }
    return responseData;
  },

  /**
   * Edits a facility by its ID.
   * @param {Object} dbHelper - The database helper for database operations.
   * @param {string} id - The ID of the facility to be edited.
   * @param {Object} data - The data object containing the new values for name, facilityType, capacity, ratePerPerson, and status.
   * @param {Object} file - The file object containing the new image.
   * @param {Object} user - The user object containing the user ID and role.
   * @returns {Object} Response data with status, error, message, and facilityId on success.
   */
  updateFacility: async (dbHelper, id, data, file, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error editing facility'
    };

    try {
      if (!id) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing facility ID';
        return responseData;
      }

      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if (user.role !== UserRole.CRMSTEAM) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'Only CRMS team can edit a facility';
        return responseData;
      }

      const facility = await dbHelper.findOne('facility', { _id: id });
      if (!facility) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Facility not found';
        return responseData;
      }

      const updateData = {};
      if (isPresent(data.name)) updateData.name = data.name;
      if (isPresent(data.facilityType)) {
        if (!isValidFacilityType(data.facilityType)) {
          responseData.status = Status.BAD_REQUEST;
          responseData.error = 'Invalid facility type';
          return responseData;
        }
        updateData.facilityType = data.facilityType;
      }
      if (isPresent(data.capacity)) {
        if (!isValidCapacity(data.capacity)) {
          responseData.status = Status.BAD_REQUEST;
          responseData.error = 'Invalid capacity';
          return responseData;
        }
        updateData.capacity = parseInt(data.capacity, 10);
      }
      if (isPresent(data.ratePerPerson)) {
        if (!isValidRate(data.ratePerPerson)) {
          responseData.status = Status.BAD_REQUEST;
          responseData.error = 'Invalid rate per person';
          return responseData;
        }
        updateData.ratePerPerson = parseFloat(data.ratePerPerson) || 0;
      }
      if (isPresent(data.status)) {
        if (!isValidFacilityStatus(data.status)) {
          responseData.status = Status.BAD_REQUEST;
          responseData.error = 'Invalid facility status';
          return responseData;
        }
        updateData.status = data.status;
      }

      if (file) {
        try {
          const filename = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;
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
          updateData.image = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        } catch (err) {
          responseData.status = Status.INTERNAL_SERVER_ERROR;
          responseData.error = 'Image upload failed: ' + err.message;
          return responseData;
        }
      }

      await dbHelper.updateOne('facility', { _id: id }, { $set: updateData });
    
      responseData.status = Status.OK;
      responseData.error = null;
      responseData.message = 'Facility updated successfully';
      responseData.facilityId = id;
    } catch (error) {
      console.error('Error editing facility:', error);
      responseData.error = error.message;
    }
    return responseData;
  },

/**
 * Deletes a facility by its ID.
 * @param {Object} dbHelper - The database helper for database operations.
 * @param {string} id - The ID of the facility to be deleted.
 * @param {Object} user - The user object containing the user ID and role.
 * @returns {Object} Response data with status, error, message, and facilityId on success.
 */
  deleteFacility: async (dbHelper, id, user) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error deleting facility',
    };

    try {
      if (!id) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing facility ID';
        return responseData;
      }

      if (!user || !user.userId) {
        responseData.status = Status.UNAUTHORIZED;
        responseData.error = 'User not logged in';
        return responseData;
      }

      if (user.role !== UserRole.CRMSTEAM) {
        responseData.status = Status.FORBIDDEN;
        responseData.error = 'Only CRMS team can delete a facility';
        return responseData;
      }

      const facility = await dbHelper.findOne('facility', { _id: id });
      if (!facility) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Facility not found';
        return responseData;
      }

      if (facility.image) {
        try {
          const url = new URL(facility.image);
          const filename = decodeURIComponent(url.pathname.replace(`/${bucket.name}/`, ''));
          await bucket.file(filename).delete();
        } catch (imgErr) {
          console.warn('Failed to delete facility image:', imgErr.message);
        }
      }

      await dbHelper.deleteOne('facility', { _id: id });

      responseData.status = Status.OK;
      responseData.error = null;
      responseData.message = 'Facility deleted successfully';
      responseData.facilityId = id;
    } catch (error) {
      console.error('Error deleting facility:', error);
      responseData.error = error.message;
    }
    return responseData;
  },
};

export default facilityModule;

function isPresent(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}
function isValidFacilityType(type) {
  return Object.values(FacilityType).includes(type);
}

function isValidFacilityStatus(status) {
  return Object.values(FacilityStatus).includes(status);
}

function isValidCapacity(cap) {
  return /^\d+$/.test(cap) && parseInt(cap) > 0;
}
function isValidRate(rate) {
  return !rate || (!isNaN(parseFloat(rate)) && parseFloat(rate) >= 0);
}
