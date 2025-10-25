/**
 * Notification Utilities
 * 
 * Handles sending SMS notifications via Twilio (when implemented)
 * For now, we'll log notifications - you can add Twilio later
 */

import { db } from '../config/firebase.js';

/**
 * Send notification to user
 * Currently logs to console - implement Twilio when ready
 * 
 * @param {string} userId - User to notify
 * @param {string} message - Notification message
 * @param {string} type - Type of notification (match, loan, etc)
 */
export async function sendNotification(userId, message, type = 'general') {
  try {
    // Get user's phone number
    const userDoc = await db.collection('users').doc(userId).get();
    const phoneNumber = userDoc.data()?.phoneNumber;
    
    if (!phoneNumber) {
      console.log(`No phone number for user ${userId}`);
      return;
    }
    
    // Store notification in database
    await db.collection('notifications').add({
      userId,
      message,
      type,
      phoneNumber,
      sentAt: new Date(),
      read: false
    });
    
    // TODO: Implement Twilio SMS when ready
    // For now, just log it
    console.log(`📱 NOTIFICATION to ${phoneNumber}: ${message}`);
    
    // Uncomment below when you add Twilio credentials:
    /*
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    */
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

/**
 * Notify item owner about matching request
 */
export async function notifyRequestMatch(ownerId, itemName, requestId) {
  const message = `🔔 Someone nearby needs your ${itemName}! Check Loop to respond.`;
  return sendNotification(ownerId, message, 'match');
}

/**
 * Notify borrower that their request was accepted
 */
export async function notifyRequestAccepted(borrowerId, itemName, loanerName) {
  const message = `✅ ${loanerName} will loan you their ${itemName}! Open Loop to arrange pickup.`;
  return sendNotification(borrowerId, message, 'accepted');
}

/**
 * Notify about loan completion
 */
export async function notifyLoanCompleted(loanerId, pointsEarned, itemName) {
  const message = `💰 Loan completed! You earned ${pointsEarned} points for loaning your ${itemName}.`;
  return sendNotification(loanerId, message, 'completed');
}

/**
 * Remind about overdue return
 */
export async function notifyOverdueReturn(borrowerId, itemName, hoursOverdue) {
  const message = `⏰ Reminder: ${itemName} was due ${hoursOverdue} hours ago. Please return it soon!`;
  return sendNotification(borrowerId, message, 'overdue');
}

/**
 * Notify about damage report
 */
export async function notifyDamageReport(userId, itemName) {
  const message = `⚠️ A damage report was filed for ${itemName}. Our support team will contact you.`;
  return sendNotification(userId, message, 'damage');
}