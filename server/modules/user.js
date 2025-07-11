import bcrypt from 'bcryptjs';
import { Status, UserRole } from '../constants.js';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import jwtHelper from './jwtHelper.js';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userModule = {
    /**
     * Registers a new user.
     * @param {object} dbHelper - The database helper for database operations.
     * @param {object} data - The data object containing the email, name, and password fields.
     * @returns {object} Response data with status, error, message, and userId on success.
     */
    register: async (dbHelper, data) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on registering user'
        };
        try {
            let { email, firstName, lastName, password } = data;
            email = email.trim();
            firstName = firstName.trim();
            lastName = lastName.trim();
            if (
                !isPresent(email) ||
                !isPresent(firstName) ||
                !isPresent(lastName) ||
                !isPresent(password)
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

            if (!isValidName(firstName) || !isValidName(lastName)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid name';
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
                    firstName,
                    lastName,
                    password: await hashPassword(password), 
                    role: UserRole.GUEST,
                    createdAt: new Date().valueOf(),
                    lastLoggedIn: new Date().valueOf()
                });                

                responseData.status = Status.OK;
                responseData.error = null;
                responseData.message = 'User registered successfully';
                responseData.userId = userCreated._id.toString();
                responseData.role = userCreated.role;
            } catch (error) {
                console.error('Error registering user:', error);
                responseData.status = Status.INTERNAL_SERVER_ERROR;
                responseData.error = error.message;
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
        return responseData;
    },
    
    /**
     * Logs in a user to the system
     * @param {object} dbHelper the database helper object
     * @param {object} data the data object containing the email and password fields
     * @returns {object} the response data object containing the status and error fields
     */
    login: async (dbHelper, data) => {
        const responseData = {
        status: Status.INTERNAL_SERVER_ERROR,
        error: 'Error on logging in user'
        };
        try {
        let { email, password } = data;
        email = email.trim();

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

        await dbHelper.updateOne('user', { email }, { lastLoggedIn: new Date().valueOf() });

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
        const fullName = payload.name;
        const [firstName, lastName] = fullName.split(/\s+/, 2);

        let user = await dbHelper.findOne('user', { googleId });
        if (!user) {
            user = await dbHelper.findOne('user', { email });
            if (user) {
                await dbHelper.updateOne('user', { email }, { googleId, lastLoggedIn: new Date().valueOf() });
            } else {
                user = await dbHelper.create('user', {
                    email,
                    firstName,
                    lastName,
                    googleId,
                    role: UserRole.GUEST,
                    createdAt: new Date().valueOf(),
                    lastLoggedIn: new Date().valueOf()
                });
            }
        } else {
            await dbHelper.updateOne('user', { googleId }, { lastLoggedIn: new Date().valueOf() });
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

            const { id: facebookId, email, name: fullName } = fbData;
            const [firstName, lastName] = fullName.split(/\s+/, 2);

            let user = await dbHelper.findOne('user', { facebookId });

            if (!user) {
                user = await dbHelper.findOne('user', { email });

                if (user) {
                    await dbHelper.updateOne('user', { email }, { facebookId, lastLoggedIn: new Date().valueOf() });
                } else {
                    user = await dbHelper.create('user', {
                        facebookId,
                        email,
                        firstName,
                        lastName,
                        role: UserRole.GUEST,
                        createdAt: new Date().valueOf(),
                        lastLoggedIn: new Date().valueOf()
                    });
                }
            } else {
                await dbHelper.updateOne('user', { facebookId }, { lastLoggedIn: new Date().valueOf() });
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
     * Resets a user's password.
     * @param {Object} dbHelper - The database helper for database operations.
     * @param {string} email - The email address of the user to reset the password for.
     * @param {string} newGeneratedPassword - The new password to set for the user.
     * @returns {Object} Response data with status, error, and message.
     */
    resetPassword: async (dbHelper, data) => {
        let { email, newPassword, verificationCode } = data;
        email = email.trim();
        newPassword = newPassword.trim();
        verificationCode = verificationCode.trim();

        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on resetting password'
        };
        try {
            if (!isPresent(email) || !isPresent(newPassword) || !isPresent(verificationCode)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            if (!isValidEmail(email)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid email address';
                return responseData;
            }

            if (!isValidPassword(newPassword)) {
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

            if (user.verificationCode !== verificationCode) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid verification code';
                return responseData;
            }

            if (Date.now() > user.verificationCodeExpiry) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Verification code has expired';
                return responseData;
            }

            const hashedPassword = await hashPassword(newPassword);

            await dbHelper.updateOne('user', { email }, { password: hashedPassword, verificationCode: null, verificationCodeExpiry: null, updatedAt: new Date().valueOf() });

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'Password reset successfully';
        } catch (error) {
            console.error('Error on resetting password:', error);
        }
        return responseData;
    },

    
    /**
     * Sends a password reset link to the user's email if it exists in the system.
     * @param {Object} dbHelper - The database helper for database operations.
     * @param {Object} data - The data object containing the email field.
     * @returns {Object} Response data with status, error, and message. If the user exists, a reset token is also included.
     */
    sendPasswordResetVerificationCode: async (dbHelper, emailModule, data) => {
        let { email } = data;
        email = email.trim();
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on sending password reset verification code'
        };
        try {
            if (!isPresent(email)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            if (!isValidEmail(email)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid email address';
                return responseData;
            }

            const user = await dbHelper.findOne('user', { email });
            if (!user) {
                responseData.status = Status.OK;
                responseData.error = null;
                responseData.message = 'If your email is in our system, a verification code has been sent.';
                return responseData;
            }

            const verificationCode = generateVerificationCode();
            const verificationCodeExpiry = Date.now() + 600000; // 10 minutes from now

            await dbHelper.updateOne('user', { email }, { verificationCode, verificationCodeExpiry });

            const emailResponse = await emailModule.sendVerificationCode(email, verificationCode);
            if (emailResponse.status !== Status.OK) {
                return emailResponse;
            }

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'If your email is in our system, a verification code has been sent.'; 
        } catch (error) {
            console.error('Error on sending password reset verification code:', error);
        }
        return responseData;
    },

    verifyPasswordResetCode: async (dbHelper, data) => {
        let { email, verificationCode } = data;
        email = email.trim();
        verificationCode = verificationCode.trim();
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on verifying password reset code'
        };
        try {
            if (!isPresent(email) || !isPresent(verificationCode)) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Missing required fields';
                return responseData;
            }

            const user = await dbHelper.findOne('user', { email });
            if (!user) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'User not found';
                return responseData;
            }

            if (user.verificationCode !== verificationCode) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Invalid verification code';
                return responseData;
            }

            if (Date.now() > user.verificationCodeExpiry) {
                responseData.status = Status.BAD_REQUEST;
                responseData.error = 'Verification code has expired';
                return responseData;
            }

            // Clear the verification code and expiry after successful verification
            await dbHelper.updateOne('user', { email }, { verificationCode: null, verificationCodeExpiry: null });

            responseData.status = Status.OK;
            responseData.error = null;
            responseData.message = 'Verification code verified successfully';
        } catch (error) {
            console.error('Error on verifying password reset code:', error);
        }
        return responseData;
    }
};

export default userModule;

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    const nameRegex = /^[A-Za-z]+([ '.-][A-Za-z]+)*$/;
    return nameRegex.test(name) && name.length > 0;
}

function isValidPassword(password) {
    const minLength = 6;
    const maxLength = 14;
    return password.length >= minLength && password.length <= maxLength;
}

function isPresent(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
}

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}