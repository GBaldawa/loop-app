/**
 * Firebase Cloud Functions Entry Point
 * 
 * This file exports all Cloud Functions
 * Firebase will automatically deploy these when you run: firebase deploy --only functions
 */

// Import all trigger functions
import { onRequestCreated } from './triggers/onRequestCreated.js';
import { onItemCreated } from './triggers/onItemCreated.js';
import { onLoanCompleted } from './triggers/onLoanCompleted.js';

// Export all functions
// These will be available as Cloud Functions
export {
  onRequestCreated,
  onItemCreated,
  onLoanCompleted
};

// Optional: Add HTTP-triggered functions if needed
// Example: Callable function for manual operations
/*
import { onCall } from 'firebase-functions/v2/https';

export const manualMatchRequest = onCall(async (request) => {
  // Custom logic here
  return { success: true };
});
*/