/**
 * Distance Calculation Utilities
 * 
 * Uses the Haversine formula to calculate distance between two lat/lng points
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a point is within a certain radius of another point
 * @param {object} point1 - {lat, lng}
 * @param {object} point2 - {lat, lng}
 * @param {number} radiusMiles - Maximum distance in miles
 * @returns {boolean}
 */
export function isWithinRadius(point1, point2, radiusMiles) {
  const distance = calculateDistance(
    point1.lat,
    point1.lng,
    point2.lat,
    point2.lng
  );
  return distance <= radiusMiles;
}

/**
 * Format distance for display
 * @param {number} miles - Distance in miles
 * @returns {string} Formatted string like "0.3 mi" or "2.5 mi"
 */
export function formatDistance(miles) {
  return `${miles.toFixed(1)} mi`;
}