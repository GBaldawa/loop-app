/**
 * Trigger: When a new item is created
 * 
 * This function automatically runs when someone adds an item they can loan
 * It checks if any pending requests match this item
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { findMatchingRequests } from '../utils/matching.js';
import { db } from '../config/firebase.js';

export const onItemCreated = onDocumentCreated(
  'items/{itemId}',
  async (event) => {
    try {
      const itemId = event.params.itemId;
      const item = event.data.data();
      
      console.log(`📦 New item created: ${itemId} - ${item.name}`);
      
      // Find matching requests
      const matches = await findMatchingRequests(item);
      
      console.log(`Found ${matches.length} matching requests`);
      
      if (matches.length === 0) {
        console.log('No matching requests found');
        return { success: true, matchCount: 0 };
      }
      
      // Store match suggestions for the item owner
      // They can see these as "People looking for your item"
      const batch = event.firestore.batch();
      
      matches.slice(0, 10).forEach(match => { // Top 10 matches
        const matchRef = event.firestore
          .collection('items')
          .doc(itemId)
          .collection('matches')
          .doc(match.requestId);
        
        batch.set(matchRef, {
          requestId: match.requestId,
          requesterId: match.request.requesterId,
          itemName: match.request.itemName,
          matchScore: match.matchScore,
          distance: match.distance,
          createdAt: new Date()
        });
      });
      
      await batch.commit();
      
      // Optionally: Notify the item owner about matches
      if (matches.length > 0) {
        // Get owner's user document to send notification
        const ownerDoc = await db.collection('users').doc(item.ownerId).get();
        
        console.log(`✅ Found ${matches.length} people looking for this item`);
        
        // You could send a notification here:
        // await notifyItemHasMatches(item.ownerId, item.name, matches.length);
      }
      
      return { success: true, matchCount: matches.length };
    } catch (error) {
      console.error('Error in onItemCreated:', error);
      throw error;
    }
  }
);