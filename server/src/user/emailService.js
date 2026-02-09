//load the environment variables
require('dotenv').config();

// Email configuration - Brevo API
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Send password reset code
module.exports.sendPasswordResetCode = async (email, code) => {

    const emailData = {
        sender: {
            name: "Shopgress",
            email: SENDER_EMAIL
        },
        to: [{
            email: email
        }],
        subject: 'Shopgress - Password Reset',
        htmlContent: `
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

    console.log('Attempting to send password reset email to:', email);

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API error:', errorData);
            throw new Error(`Email sending failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Email sent successfully via Brevo:', result);
        return result;
    } catch (error) {
        console.error('Error sending email via Brevo:', error);
        throw error;
    }
};
