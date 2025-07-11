import { Status } from '../constants.js';
import nodemailer  from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailModule = {
    sendVerificationCode: async (email, verificationCode) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on sending verification code'
        };
        try {
            try {
                // TODO update email text on production
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    to: email,
                    subject: 'Your Verification Link',
                    text: `Your verification link is: ${ process.env.HOST || 'http://localhost' }:${ process.env.PORT || 3000 }/api/user/verify-verification-code?email=${email}&verificationCode=${verificationCode}`,
                    html: `Your verification link is: <a href="${ process.env.HOST || 'http://localhost' }:${ process.env.PORT || 3000 }/api/user/verify-verification-code?email=${email}&verificationCode=${verificationCode}">VERIFICATION_LINK</a>`
                };
                
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent: ' + info.response);
                    
                    responseData.status = Status.OK;
                    responseData.error = null;

                  } catch (error) {
                    console.error('Error on sending verification code:', error);
                }
            } catch (error) {
                console.error('Error on sending verification code:', error);
            }
        } catch (error) {
            console.error('Error on sending verification code:', error);
        }
        return responseData;
    },
    sendPasswordResetLink: async (email, resetToken) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on sending password reset link'
        };
        try {
            const resetLink = `${process.env.HOST || 'http://localhost'}:${process.env.PORT || 3000}/reset-password?token=${resetToken}&email=${email}`;
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS || 'jmarellanocreation@gmail.com',
                to: email,
                subject: 'Password Reset Request',
                text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
                html: `<p>You requested a password reset. Click this link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
                
                responseData.status = Status.OK;
                responseData.error = null;

            } catch (error) {
                console.error('Error on sending password reset link:', error);
            }
        } catch (error) {
            console.error('Error on sending password reset link:', error);
        }
        return responseData;
    }
};

export default emailModule;