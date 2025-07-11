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
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Your Password Reset Verification Code',
                text: `Your verification code for password reset is: ${verificationCode}. This code is valid for 10 minutes.`,
                html: `<p>Your verification code for password reset is: <strong>${verificationCode}</strong>.</p><p>This code is valid for 10 minutes.</p>`
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
        return responseData;
    }
};

export default emailModule;