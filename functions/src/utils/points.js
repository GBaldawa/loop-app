/**
 * Points Calculation System
 * 
 * Handles all point-related calculations for the reward system
 */

// Point calculation constants
const POINTS_PER_DOLLAR = 0.001; // $100 item = 0.1 points per hour
const BASE_POINTS = 10; // Minimum points for any loan
const POINTS_TO_DOLLAR = 1; // 1 point = $1 for buying items

/**
 * Calculate points earned for loaning an item
 * Formula: (estimatedValue * POINTS_PER_DOLLAR) * hours
 * 
 * @param {number} estimatedValue - Dollar value of item
 * @param {number} durationHours - How many hours borrowed
 * @returns {number} Points to award
 */
export function calculateLoanPoints(estimatedValue, durationHours) {
  const calculatedPoints = (estimatedValue * POINTS_PER_DOLLAR) * durationHours;
  
  // Ensure minimum points
  return Math.max(BASE_POINTS, Math.round(calculatedPoints * 100) / 100);
}

/**
 * Calculate points per hour for an item
 * Used to display to users before they commit to a loan
 * 
 * @param {number} estimatedValue - Dollar value of item
 * @returns {number} Points earned per hour
 */
export function calculatePointsPerHour(estimatedValue) {
  return Math.round((estimatedValue * POINTS_PER_DOLLAR) * 100) / 100;
}

/**
 * Calculate total points based on actual loan duration
 * Use this when loan is completed to get exact points
 * 
 * @param {Date} startTime - When loan started
 * @param {Date} endTime - When loan ended
 * @param {number} estimatedValue - Dollar value of item
 * @returns {number} Total points earned
 */
export function calculateActualPoints(startTime, endTime, estimatedValue) {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Round up to nearest hour (be generous!)
  const roundedHours = Math.ceil(durationHours);
  
  return calculateLoanPoints(estimatedValue, roundedHours);
}

/**
 * Calculate damage penalty
 * Borrower loses points if item is damaged
 * 
 * @param {number} repairCost - Estimated cost to repair damage
 * @returns {number} Points to deduct (negative number)
 */
export function calculateDamagePenalty(repairCost) {
  // Penalty is 2x the repair cost in points
  return -Math.round(repairCost * 2);
}

/**
 * Convert points to dollar equivalent
 * For purchasing items with accumulated points
 * 
 * @param {number} points - User's point balance
 * @returns {number} Dollar value
 */
export function pointsToDollars(points) {
  return points * POINTS_TO_DOLLAR;
}

/**
 * Convert dollar amount to points needed
 * 
 * @param {number} dollars - Price of item
 * @returns {number} Points required
 */
export function dollarsToPoints(dollars) {
  return dollars / POINTS_TO_DOLLAR;
}

/**
 * Estimate item value based on category (fallback if user doesn't provide)
 * 
 * @param {string} category - Item category
 * @returns {number} Estimated dollar value
 */
export function estimateItemValue(category) {
  const estimates = {
    'tools': 50,
    'electronics': 100,
    'outdoor': 75,
    'sports': 60,
    'home': 40,
    'other': 30
  };
  
  return estimates[category?.toLowerCase()] || estimates.other;
}