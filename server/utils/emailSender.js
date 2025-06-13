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
    from: `"Fleetly" <${process.env.EMAIL_SERVICE_USER}>`, // Sender address and name
    to: to, // Recipient's email
    subject: 'Verify your email for Fleetly', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #3498db;">Welcome to Fleetly, ${username}!</h2>
        <p>Thank you for registering with Fleetly. To get started, please verify your email address by clicking the link below:</p>
        <p style="margin: 1.5rem 0;">
          <a href="${verificationUrl}" style="background-color: #2ecc71; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Verify Email Address</a>
        </p>
        <p>This link will expire in 24 hours for security reasons. If you did not register for Fleetly, please ignore this email.</p>
        <p>Best regards,<br/>The Fleetly Team</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 2rem 0;">
        <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
      </div>
    `, // HTML body
    text: `Welcome to Fleetly, ${username}!\n\nThank you for registering. Please verify your email by visiting this link: ${verificationUrl}\n\nThis link will expire in 24 hours. If you did not register for Fleetly, please ignore this email.\n\nBest regards,\nThe Fleetly Team\n\nThis is an automated email, please do not reply.`, // Plain text body for clients that don't support HTML
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
