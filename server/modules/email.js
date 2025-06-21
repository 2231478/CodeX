import { Status } from '../constants.js';
import nodemailer  from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS || 'jmarellanocreation@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tixj syal edok chzm'
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
                    from: process.env.EMAIL_ADDRESS || 'jmarellanocreation@gmail.com',
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
    sendResetPassword: async (email, newGeneratedPassword) => {
        const responseData = {
            status: Status.INTERNAL_SERVER_ERROR,
            error: 'Error on sending reset password'
        };
        try {
            try {
                // TODO update email text on production
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS || 'jmarellanocreation@gmail.com',
                    to: email,
                    subject: 'Your New Password',
                    text: `Your new password is: ${newGeneratedPassword}`,
                    html: `Your new password is: ${newGeneratedPassword}`
                };
                
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent: ' + info.response);
                    
                    responseData.status = Status.OK;
                    responseData.error = null;

                } catch (error) {
                    console.error('Error on sending reset password:', error);
                }
            } catch (error) {
                console.error('Error on sending reset password:', error);
            }   
        } catch (error) {
            console.error('Error on sending reset password:', error);
        }
        return responseData;
    }
};

export default emailModule;