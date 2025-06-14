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
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email, please do not reply to this message.</p>
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

/**
 * Sends a notification email for an upcoming or expired vehicle date.
 * @param {string} to - The recipient's email address.
 * @param {string} username - The user's name.
 * @param {object} vehicle - Vehicle details { make, model, licensePlate }.
 * @param {object} dateInfo - Date details { dateType, dueDate }.
 * @param {number} daysRemaining - Number of days until due (positive) or since expired (negative or zero).
 */
const sendDateNotificationEmail = async (to, username, vehicle, dateInfo, daysRemaining) => {
  const dueDateFormatted = new Date(dateInfo.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const vehicleName = `${vehicle.make} ${vehicle.model}`;
  const licensePlate = vehicle.licensePlate ? `(${vehicle.licensePlate})` : '';

  let subject;
  let htmlContent;
  let textContent;

  if (daysRemaining > 0) {
    subject = `Reminder: Your ${dateInfo.dateType} for ${vehicleName} is due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}!`;
    htmlContent = `
      <div style="font-family: 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #f39c12; text-align: center; margin-bottom: 25px; font-size: 24px;">Upcoming ${dateInfo.dateType} Due Soon!</h2>

          <p style="font-size: 16px;">Hi ${username},</p>
          <p style="font-size: 16px;">This is a friendly reminder that your **${dateInfo.dateType}** for your vehicle **${vehicleName}** ${licensePlate} is due in **${daysRemaining} day${daysRemaining === 1 ? '' : 's'}**.</p>
          <p style="font-size: 16px;">**Due Date:** <strong style="color: #e67e22;">${dueDateFormatted}</strong></p>
          <p style="font-size: 16px; margin-top: 20px;">Please ensure you take the necessary action to update this date to avoid any issues.</p>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #3498db; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(52,152,219,0.3);">View Your Dashboard</a>
          </p>

          <p style="font-size: 16px;">Thank you,<br/>The Fleetly Team</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `;
    textContent = `
Hi ${username},

This is a friendly reminder that your ${dateInfo.dateType} for your vehicle ${vehicleName} ${licensePlate} is due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}.

Due Date: ${dueDateFormatted}

Please ensure you take the necessary action to update this date to avoid any issues.

View your Dashboard: ${process.env.FRONTEND_URL}/dashboard

Thank you,
The Fleetly Team

---
This is an automated email. Please do not reply to this message.
    `;
  } else { // daysRemaining <= 0, meaning it's today or past due
    subject = `Action Required: Your ${dateInfo.dateType} for ${vehicleName} has Expired!`;
    htmlContent = `
      <div style="font-family: 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #e74c3c; text-align: center; margin-bottom: 25px; font-size: 24px;">${dateInfo.dateType} Expired!</h2>

          <p style="font-size: 16px;">Hi ${username},</p>
          <p style="font-size: 16px;">This is an urgent notification that your **${dateInfo.dateType}** for your vehicle **${vehicleName}** ${licensePlate} expired on **<strong style="color: #c0392b;">${dueDateFormatted}</strong>**.</p>
          <p style="font-size: 16px;">Please log in to your Fleetly dashboard to update this information immediately to avoid any potential penalties or issues.</p>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #e74c3c; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(231,76,60,0.3);">Go to Dashboard</a>
          </p>

          <p style="font-size: 16px;">Thank you,<br/>The Fleetly Team</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `;
    textContent = `
Hi ${username},

This is an urgent notification that your ${dateInfo.dateType} for your vehicle ${vehicleName} ${licensePlate} expired on ${dueDateFormatted}.

Please log in to your Fleetly dashboard to update this information immediately to avoid any potential penalties or issues.

Go to Dashboard: ${process.env.FRONTEND_URL}/dashboard

Thank you,
The Fleetly Team

---
This is an automated email. Please do not reply to this message.
    `;
  }

  const mailOptions = {
    from: `"Fleetly Notifications" <${process.env.EMAIL_SERVICE_USER}>`, // Specific sender name for notifications
    to: to,
    subject: subject,
    html: htmlContent,
    text: textContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${to} for ${dateInfo.dateType} of ${vehicleName}. Days remaining: ${daysRemaining}`);
  } catch (error) {
    console.error(`Error sending date notification email to ${to}:`, error);
    throw new Error('Failed to send date notification email.');
  }
};


module.exports = { sendVerificationEmail, sendDateNotificationEmail };
