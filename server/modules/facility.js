import { Storage } from '@google-cloud/storage';
import { Status, FacilityType, FacilityStatus, UserRole } from '../constants.js';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage();
const bucket = storage.bucket(process.env.FACILITY_BUCKET_NAME);

const facilityModule = {
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

          if (!user || !user._id) {
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
            const filename = `facility_images/${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;
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

  getFacilityById: async (dbHelper, id) => {
    const responseData = {
      status: Status.INTERNAL_SERVER_ERROR,
      error: 'Error fetching facility',
      facility: null
    };
    try {
      const facility = await dbHelper.findById('facility', id);
      if (!facility) {
        responseData.status = Status.NOT_FOUND;
        responseData.error = 'Facility not found';
        return responseData;
      }
      responseData.status = Status.OK;
      responseData.error = null;
      responseData.facility = facility;
    } catch (error) {
      responseData.error = error.message;
    }
    return responseData;
  }
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
