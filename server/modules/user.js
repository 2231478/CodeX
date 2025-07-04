import bcrypt from 'bcryptjs';
import { Status, UserRole } from '../constants.js';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import jwtHelper from './jwtHelper.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userModule = {
    /**
     * Registers a new user.
     * @param {object} dbHelper - The database helper for database operations.
     * @param {object} session - The session object for the current user.
     * @param {object} data - The data object containing the email, name, password, and mobileNumber fields.
     * @returns {object} Response data with status, error, message, and userId on success.
     */
    register: async (dbHelper, data) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on registering user'
        };
        try {
            const { email, name, password, mobileNumber } = data;
            if (
                !isPresent(email) ||
                !isPresent(name) ||
                !isPresent(password) || 
                !isPresent(mobileNumber)
            ) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }
            if (!isValidEmail(email)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid email address';
                return responseData;
            }
            if (!isValidPassword(password)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid password';
                return responseData;
            }
            if (!isValidName(name)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid name';
                return responseData;
            }
            if(!isValidPhilippineMobileNumber(mobileNumber)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid mobile number';
                return responseData;
            }

            const emailExists = await dbHelper.findOne('user', { email });
            if (emailExists) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Email already exists';
                return responseData;
            }

            try {
                const userCreated = await dbHelper.create('user', { 
                    email, 
                    name, 
                    password: await hashPassword(password), 
                    mobileNumber: convertToPlus639Format(mobileNumber),
                    role: UserRole.GUEST,
                    createdAt: new Date().valueOf(),
                    lastLoggedIn: null
                });                

                responseData.status = Status.OK;
                responseData.error = null;
                responseData.message = 'User registered successfully';
                responseData.userId = userCreated._id.toString();
                responseData.role = userCreated.role;
            } catch (error) {
                console.error('Error registering user:', error);
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
        return responseData;
    },
    
    /**
     * Logs in a user to the system
     * @param {object} dbHelper the database helper object
     * @param {object} session the express session object
     * @param {object} data the data object containing the email and password fields
     * @returns {object} the response data object containing the status and error fields
     */
    
    login: async (dbHelper, data) => {
        const responseData = {
        status: Status.INTERNAL_SERVER_ERROR,
        error: 'Error on logging in user'
        };
        try {
        const { email, password } = data;
        if (!isPresent(email) || !isPresent(password)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Missing required fields';
            return responseData;
        }
        if (!isValidEmail(email)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid email address';
            return responseData;
        }
        if (!isValidPassword(password)) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid password';
            return responseData;
        }

        const userObject = await dbHelper.findOne('user', { email });
        if (!userObject) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Email does not exist';
            return responseData;
        }
        const match = await bcrypt.compare(password, userObject.password);
        if (!match) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid Email and Password Combination';
            return responseData;
        }
        
        const accessToken = jwtHelper.generateAccessToken(userObject);

        dbHelper.updateOne('user', { email }, { lastLoggedIn: new Date().valueOf() });

        responseData.status = Status.OK;
        responseData.error = null;
        responseData.message = 'User logged in successfully';
        responseData.accessToken = accessToken;
        responseData.userId = userObject._id.toString();
        responseData.role = userObject.role;

        } catch (error) {
        console.error('Error logging in user:', error);
        responseData.error = error.message;
        }
        return responseData;
    },

    /**
     * Logs in or registers a user via Google OAuth.
     * @param {Object} dbHelper - The database helper for database operations.
     * @param {Object} session - The session object for the current user.
     * @param {Object} data - The data object containing the Google ID token.
     * @returns {Object} Response data with status, error, message, and userId on success.
     */
    googleLogin: async (dbHelper, data) => {
    const responseData = {
        status: Status.INTERNAL_SERVER_ERROR,
        error: 'Error on logging in with Google'
    };

    try {
        if (!data.token) {
        responseData.status = Status.BAD_REQUEST;
        responseData.error = 'Missing Google token';
        return responseData;
        }

        const ticket = await client.verifyIdToken({
        idToken: data.token,
        audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;

        let user = await dbHelper.findOne('user', { googleId });
        if (!user) {
        user = await dbHelper.create('user', {
            email,
            name,
            googleId,
            role: UserRole.GUEST,
            createdAt: new Date().valueOf()
        });
        }
        
        const accessToken = jwtHelper.generateAccessToken(user);

        responseData.status = Status.OK;
        responseData.error = null;
        responseData.message = 'User logged in with Google successfully';
        responseData.userId = user._id.toString();
        responseData.role = user.role;
        responseData.accessToken = accessToken;

    } catch (error) {
        console.error('Error logging in with Google:', error);
        responseData.error = error.message;
    }

    return responseData;
    },

  /**
  * Logs in or registers a user via Facebook OAuth.
  * @param {Object} dbHelper - The database helper for database operations.
  * @param {Object} session - The session object for the current user.
  * @param {Object} data - The data object containing the Facebook token.
  * @returns {Object} Response data with status, error, message, and userId on success.
  */
  facebookLogin: async (dbHelper, data) => {
    const responseData = {
        status: Status.INTERNAL_SERVER_ERROR,
        error: 'Error on logging in with Facebook'
    };

    try {
        if (!data.token) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Missing Facebook token';
            return responseData;
        }

        const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.token}`);
        const fbData = await fbRes.json();

        if (!fbData || !fbData.id || !fbData.email) {
            responseData.status = Status.BAD_REQUEST;
            responseData.error = 'Invalid Facebook token or missing user data';
            return responseData;
        }

        const { id: facebookId, email, name } = fbData;

        let user = await dbHelper.findOne('user', { facebookId });

        if (!user) {
            user = await dbHelper.create('user', {
                facebookId,
                email,
                name,
                role: UserRole.GUEST,
                createdAt: new Date().valueOf()
            });
        }

        const accessToken = jwtHelper.generateAccessToken(user);

        responseData.status = Status.OK;
        responseData.error = null;
        responseData.message = 'User logged in with Facebook successfully';
        responseData.userId = user._id.toString();
        responseData.role = user.role;
        responseData.accessToken = accessToken;

    } catch (error) {
        console.error('Error logging in with Facebook:', error);
        responseData.error = error.message;
    }

    return responseData;
},

    /**
     * Logs out the user from the system
     * @param {object} session the express session object
     * @returns {object} the response data object containing the status and error fields
     */
    logout: (session) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on logging out user'
        };
        try {
            session.destroy(err => {
                if (err) {
                    console.error('Error logging out user:', err);
                }
            });
            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'User logged out successfully';
        } catch (error) {
            console.error('Error logging out user:', error);
        }
        return responseData;
    },

    getUser: async (dbHelper, session) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on getting user profile'
        };
        try {
            if (!session.userEmail) {
                responseData.status = Status.UNAUTHORIZED;
                responseData.error = 'Unauthorized';
                return responseData;
            }

            const user = await dbHelper.findOne('user', { email: session.userEmail });
            if (!user) {
                responseData.status = Status.NOT_FOUND;
                responseData.error = 'User not found';
                return responseData;
            }

            const userObject = user.toObject();
            delete userObject.password;
            delete userObject.__v;

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'User profile retrieved successfully';
            responseData.data = userObject;

        } catch (error) {
            console.error('Error on getting user profile:', error);
        }
        return responseData;
    },
    changePassword: async (dbHelper, session, data) => {
        const responseData = { 
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on changing password'
        };
        try {
            const { oldPassword, newPassword } = data;
            if (!isPresent(oldPassword) || !isPresent(newPassword)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            if (!session.userEmail) {
                responseData.status = Status.UNAUTHORIZED;
                responseData.error = 'Unauthorized';
                return responseData;
            }

            if (!isValidPassword(newPassword) ) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid new password';
                return responseData;
            }

            const user = await dbHelper.findOne('user', { email: session.userEmail });
            if (!user) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'User not found';
                return responseData;
            }

            const userObject = user.toObject();
            if (!await isMatchedPassword(oldPassword, userObject.password)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid old password';
                return responseData;
            }

            const hashedPassword = await hashPassword(newPassword);
            await dbHelper.updateOne('user', { email: session.userEmail }, { password: hashedPassword, updatedAt: new Date().valueOf() });
            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'Password changed successfully';
        } catch (error) {
            console.error('Error on changing password:', error);
        }
        return responseData;
    },
    resetPassword: async (dbHelper, email, newGeneratedPassword) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on resetting password'
        };
        try {
            if (!isPresent(email) || !isPresent(newGeneratedPassword)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            if (!isValidEmail(email)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid email address';
                return responseData;
            }

            if (!isValidPassword(newGeneratedPassword)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid password';
                return responseData;
            }

            const user = await dbHelper.findOne('user', { email });
            if (!user) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'User not found';
                return responseData;
            }

            const hashedPassword = await hashPassword(newGeneratedPassword);

            await dbHelper.updateOne('user', { email }, { password: hashedPassword, updatedAt: new Date().valueOf() });

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'Password reset successfully';
        } catch (error) {
            console.error('Error on resetting password:', error);
        }
        return responseData;
    },
    generateValidPassword: () => {
        const minLength = 6;
        const maxLength = 14;
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }
};

export default userModule;

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name) && name.length > 0;
}

function isValidPassword(password) {
    const minLength = 6;
    const maxLength = 14;
    return password.length >= minLength && password.length <= maxLength;
}

function isValidPhilippineMobileNumber(number) {
    const philippineMobileNumberPattern = /^(\+63|0)9\d{9}$/;
    if (philippineMobileNumberPattern.test(number)) {
        return true;
    } else {
        return false;
    }
}

function isPresent(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
}

function convertToPlus639Format(number) {
    const philippineMobileNumberPattern = /^(\+63|0)(9\d{9})$/;

    const match = number.match(philippineMobileNumberPattern);

    if (match) {
        const mobileNumberPart = match[2];
        return `+63${mobileNumberPart}`;
    } else {
        return null;
    }
}

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function isMatchedPassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}