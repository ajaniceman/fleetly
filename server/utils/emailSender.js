const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' for Gmail SMTP
  auth: {
    user: process.env.EMAIL_SERVICE_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_SERVICE_PASS  // Your Gmail App Password from .env
  }
});

/**
 * Sends a verification email to the user.
 * @param {string} to - The recipient's email address.
 * @param {string} username - The user's name.
 * @param {string} verificationUrl - The URL the user needs to click to verify their email.
 */
const sendVerificationEmail = async (to, username, verificationUrl) => {
  const mailOptions = {
    from: `"Fleetly Team" <${process.env.EMAIL_SERVICE_USER}>`, // More professional sender name
    to: to, // Recipient's email
    subject: 'Action Required: Verify Your Email for Fleetly Account', // Clearer subject line
    html: `
      <div style="font-family: 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #3498db; text-align: center; margin-bottom: 25px; font-size: 26px;">Welcome to Fleetly, ${username}!</h2>

          <p style="font-size: 16px; margin-bottom: 20px;">We're thrilled to have you join the Fleetly community! To ensure the security of your account and activate all features, please confirm your email address by clicking the button below:</p>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #2ecc71; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 10px rgba(46,204,113,0.3);">Verify Your Email</a>
          </p>

          <p style="font-size: 16px; margin-top: 20px;">This verification link is valid for <strong>24 hours</strong>. If you didn't create an account with Fleetly, please ignore this email and your account will not be activated.</p>

          <p style="font-size: 16px; margin-top: 25px;">Thanks for choosing Fleetly,<br/>The Fleetly Team</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `, // HTML body
    text: `
Welcome to Fleetly, ${username}!

We're thrilled to have you join the Fleetly community! To ensure the security of your account and activate all features, please confirm your email address by visiting the link below:

${verificationUrl}

This verification link is valid for 24 hours. If you didn't create an account with Fleetly, please ignore this email and your account will not be activated.

Thanks for choosing Fleetly,
The Fleetly Team

---
This is an automated email. Please do not reply to this message.
    `, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to ' + to);
  } catch (error) {
    console.error('Error sending verification email to ' + to + ':', error);
    throw new Error('Failed to send verification email.');
  }
};

module.exports = { sendVerificationEmail };
