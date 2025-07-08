import mongoose from 'mongoose';
import { UserRole, Category, GuestType, ReservationStatus, FacilityType, FacilityStatus, ServiceType } from '../constants.js';

const dbHelper = {
    connect: async (connectionString) => {
        try {
            const UserSchema = new mongoose.Schema({
                email: { type: String, required: true, unique: true },
                name: { type: String, required: true },
                password: { type: String, required: false },
                role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.GUEST },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, required: false},
                lastLoggedIn: { type: Date, required: false}
            });

            const ProfileSchema = new mongoose.Schema({
                about: { type: String, required: false }, 
                address: { type: String, required: false },
                xProfile: { type: String, required: false }, 
                fbProfile: { type: String, required: false }, 
                instagramProfile: { type: String, required: false }, 
                linkedInProfile: { type: String, required: false }, 
                profilePic: { type: String, required: true }, 
                createdProfileAt: { type: String, default: Date.now }, 
                updatedProfileAt: { type: String, required: false }, 
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
            });

            const ReservationSchema = new mongoose.Schema({
                guestName: { type: String, required: true },
                homeAddress: { type: String, required: true },
                officeAddress: { type: String, required: false },
                category: { type: String, enum: Object.values(Category), required: true },
                guestType: { type: String, enum: Object.values(GuestType), required: true },
                telephone: { type: String, required: true },
                officeTelephone: { type: String, required: false },
                numberOfGuests: {
                    total: { type: Number, required: true },
                    adult: { type: Number, required: true },
                    children: { type: Number, required: false },
                    pwds: { type: Number, required: false }
                },
                emergencyContact: { type: String, required: true },
                dateOfArrival: { type: Date, required: true }, 
                dateOfDeparture: { type: Date, required: true }, 
                timeOfArrival: { type: String, required: true },
                facility: { type: mongoose.Schema.Types.ObjectId, ref: 'facility', required: true },
                serviceType: { type: String, enum: Object.values(ServiceType), required: true }, 
                letterOfIntentFile: { type: String, required: true },
                status: { type: String, enum: Object.values(ReservationStatus), default: ReservationStatus.PENDING, required: true },
                totalEstimatedAmount: { type: Number, required: true },
                otherRequests: { type: String, required: false },
                createdAt: { type: Date, default: Date.now },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
            });

            const FacilitySchema = new mongoose.Schema({
                name: { type: String, required: true, unique: true },
                facilityType: { type: String, enum: Object.values(FacilityType), required: true },
                capacity: { type: Number, required: true },
                ratePerPerson: { type: Number, required: false },
                status: { type: String, enum: Object.values(FacilityStatus), default: FacilityStatus.AVAILABLE, required: true },
                image: { type: String, required: true},
                createdAt: { type: Date, default: Date.now }
                });
            
            const SpecialServiceSchema = new mongoose.Schema({
                name: { type: String, required: true },
                price: { type: String, required: true }, 
                unit: { type: String, required: false }, 
                createdAt: { type: Date, default: Date.now }
            });

            const NotificationSchema = new mongoose.Schema({
                title: { type: String, required: true },
                message: { type: String, required: true },
                isRead: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
                reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'reservation', required: true }
            });

            mongoose.model('user', UserSchema);
            mongoose.model('profile', ProfileSchema);
            mongoose.model('reservation', ReservationSchema);
            mongoose.model('facility', FacilitySchema);
            mongoose.model('specialservice', SpecialServiceSchema);
            mongoose.model('notification', NotificationSchema);
            
            await mongoose.connect(connectionString);
            console.log('Connected to MongoDB: ' + connectionString);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    },
    create: async (collectionName, document) => {
        return await mongoose.model(collectionName).create(document);
    },
    find: async (collectionName, query = {}, projection = {}) => {
        return await mongoose.model(collectionName).find(query, projection);
    },

    findOne: async (collectionName, query) => {
        return await mongoose.model(collectionName).findOne(query);
    },
    updateOne: async (collectionName, query, update) => {
        return await mongoose.model(collectionName).updateOne(query, update);
    },
    findOneAndUpdate: async (collectionName, query, update) => {
        return await mongoose.model(collectionName).findOneAndUpdate(query, update);
    },
    deleteOne: async (collectionName, query) => {
        return await mongoose.model(collectionName).deleteOne(query);
    }
};

export default dbHelper;