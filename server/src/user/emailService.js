//load the environment variables
require('dotenv').config();

// dependencies
const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Check if email credentials are configured
if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('Warning: EMAIL_USER and EMAIL_PASS environment variables are not set. Email functionality will not work.');
}

// Create transporter (only if credentials are available)
const transporter = EMAIL_USER && EMAIL_PASS ? nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
}) : null;

// Send password reset code
module.exports.sendPasswordResetCode = (email, code) => {

    // Check if transporter is configured
    if (!transporter) {
        reject(new Error('Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.'));
        return;
    }

    const mailOptions = {
        from: SENDER_EMAIL,
        to: email,
        subject: 'Shopping List App - Password Reset',
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You have requested to reset your password. Please use the following 6-digit code:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #2779F6; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this password reset, please ignore this email.</p>
                </div>
            `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            reject(error);
        } else {
            resolve(info);
        }
    });
}
