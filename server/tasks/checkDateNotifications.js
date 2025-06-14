const pool = require('../config/dbPool');
const { sendDateNotificationEmail } = require('../utils/emailSender'); // Import the new email sending function

/**
 * Checks for upcoming and expired vehicle dates and sends notifications.
 * This function should be scheduled to run periodically (e.g., daily).
 */
async function checkAndSendDateNotifications() {
  console.log('Running date notification check...');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate comparison

  try {
    // Fetch all active vehicle dates for all verified users
    // We only want to send notifications to users who have verified their email
    const [dates] = await pool.query(
      `SELECT
         vd.id AS dateId, vd.date_type AS dateType, vd.due_date AS dueDate,
         v.id AS vehicleId, v.make, v.model, v.license_plate AS licensePlate,
         u.id AS userId, u.name AS userName, u.email AS userEmail
       FROM vehicle_dates vd
       JOIN vehicles v ON vd.vehicle_id = v.id
       JOIN users u ON v.user_id = u.id
       WHERE vd.due_date IS NOT NULL AND u.is_verified = TRUE` // Only for verified users
    );

    const notificationDays = [15, 7, 3]; // Days before due date to send reminders

    for (const date of dates) {
      const dueDateObj = new Date(date.dueDate);
      dueDateObj.setHours(0, 0, 0, 0); // Normalize due date to start of day

      const timeDiff = dueDateObj.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Calculate days remaining (rounds up)

      let notificationToSend = null;

      // Check for upcoming notifications
      if (notificationDays.includes(daysRemaining)) {
        notificationToSend = `${daysRemaining}_days_left`;
      }
      // Check for 'due today' notification
      else if (daysRemaining === 0) {
        notificationToSend = 'due_today';
      }
      // Check for 'expired' notification (only send once on the day it expires, or first check after it expires)
      // For simplicity, we'll trigger "expired" once the day it becomes <= 0.
      else if (daysRemaining < 0) {
        // This logic ensures 'expired' only sends once per date.
        // You might want to send it for -1, -7 days etc. For now, it's just 'expired'.
        // If you want separate -1, -7, you'd add those to notificationDays and handle it like upcoming.
        notificationToSend = 'expired';
      }

      if (notificationToSend) {
        // Check if this specific notification type has already been logged for this date
        const [log] = await pool.query(
          `SELECT id FROM notification_log WHERE vehicle_date_id = ? AND notification_type = ?`,
          [date.dateId, notificationToSend]
        );

        if (log.length === 0) { // If no record means it hasn't been sent yet
          try {
            await sendDateNotificationEmail(
              date.userEmail,
              date.userName,
              { make: date.make, model: date.model, licensePlate: date.licensePlate },
              { dateType: date.dateType, dueDate: date.dueDate },
              daysRemaining
            );
            // Log the notification as sent
            await pool.query(
              `INSERT INTO notification_log (user_id, vehicle_date_id, notification_type) VALUES (?, ?, ?)`,
              [date.userId, date.dateId, notificationToSend]
            );
            console.log(`[SUCCESS] Sent ${notificationToSend} notification for ${date.dateType} on ${date.make} ${date.model} (User: ${date.userName}).`);
          } catch (emailError) {
            console.error(`[ERROR] Failed to send email for ${notificationToSend} for dateId ${date.dateId} (User: ${date.userName}):`, emailError.message);
          }
        } else {
          console.log(`[SKIPPED] ${notificationToSend} notification for dateId ${date.dateId} already sent.`);
        }
      }
    }
    console.log('Date notification check completed.');
  } catch (error) {
    console.error('Error in checkAndSendDateNotifications:', error);
  }
}

module.exports = checkAndSendDateNotifications;
