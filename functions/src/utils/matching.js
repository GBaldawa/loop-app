/**
 * Matching Algorithm
 * 
 * Finds items that match a borrow request based on:
 * - Category/name similarity
 * - Location proximity
 * - Item availability
 */

import { db } from '../config/firebase.js';
import { calculateDistance } from './distance.js';

/**
 * Find items that match a request
 * 
 * @param {object} request - Request document data
 * @returns {Array} Array of matching items with their owners
 */
export async function findMatchingItems(request) {
  try {
    const matches = [];
    
    // Get all available items
    const itemsSnapshot = await db.collection('items')
      .where('available', '==', true)
      .get();
    
    itemsSnapshot.forEach(doc => {
      const item = doc.data();
      
      // Don't match with own items
      if (item.ownerId === request.requesterId) {
        return;
      }
      
      // Check if item matches the request
      const matchScore = calculateMatchScore(request, item);
      
      // If match score is above threshold, include it
      if (matchScore > 0.3) { // 30% match threshold
        const distance = calculateDistance(
          request.location.lat,
          request.location.lng,
          item.location.lat,
          item.location.lng
        );
        
        // Check if within max distance
        if (distance <= (request.maxDistance || 5)) {
          matches.push({
            itemId: doc.id,
            item: item,
            matchScore: matchScore,
            distance: distance
          });
        }
      }
    });
    
    // Sort by match score (best matches first)
    matches.sort((a, b) => {
      // First by match score
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // Then by distance (closer is better)
      return a.distance - b.distance;
    });
    
    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

/**
 * Calculate how well an item matches a request
 * Returns score between 0 and 1
 * 
 * @param {object} request - Request data
 * @param {object} item - Item data
 * @returns {number} Match score (0-1)
 */
function calculateMatchScore(request, item) {
  let score = 0;
  
  // Exact name match (very high score)
  if (item.name.toLowerCase() === request.itemName.toLowerCase()) {
    return 1.0;
  }
  
  // Category match
  if (item.category && request.category && 
      item.category.toLowerCase() === request.category.toLowerCase()) {
    score += 0.5;
  }
  
  // Keyword matching in name
  const requestWords = request.itemName.toLowerCase().split(' ');
  const itemWords = item.name.toLowerCase().split(' ');
  
  let matchingWords = 0;
  requestWords.forEach(word => {
    if (itemWords.some(itemWord => itemWord.includes(word) || word.includes(itemWord))) {
      matchingWords++;
    }
  });
  
  score += (matchingWords / requestWords.length) * 0.5;
  
  return Math.min(score, 1.0);
}

/**
 * Check if an item is currently available
 */
export async function isItemAvailable(itemId) {
  const itemDoc = await db.collection('items').doc(itemId).get();
  
  if (!itemDoc.exists) {
    return false;
  }
  
  const item = itemDoc.data();
  return item.available === true;
}

/**
 * Find active requests that match a newly added item
 * (Reverse matching - when someone adds an item, check pending requests)
 * 
 * @param {object} item - Item document data
 * @returns {Array} Array of matching requests
 */
export async function findMatchingRequests(item) {
  try {
    const matches = [];
    
    // Get all pending requests
    const requestsSnapshot = await db.collection('requests')
      .where('status', '==', 'pending')
      .get();
    
    requestsSnapshot.forEach(doc => {
      const request = doc.data();
      
      // Don't match with own requests
      if (request.requesterId === item.ownerId) {
        return;
      }
      
      // Check if item matches the request
      const matchScore = calculateMatchScore(request, item);
      
      if (matchScore > 0.3) {
        const distance = calculateDistance(
          request.location.lat,
          request.location.lng,
          item.location.lat,
          item.location.lng
        );
        
        if (distance <= (request.maxDistance || 5)) {
          matches.push({
            requestId: doc.id,
            request: request,
            matchScore: matchScore,
            distance: distance
          });
        }
      }
    });
    
    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);
    
    return matches;
  } catch (error) {
    console.error('Error finding matching requests:', error);
    return [];
  }
}