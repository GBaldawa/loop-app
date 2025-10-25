/**
 * Trigger: When a new request is created
 * 
 * This function automatically runs when someone posts a borrow request
 * It finds matching items and notifies the owners
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { findMatchingItems } from '../utils/matching.js';
import { notifyRequestMatch } from '../utils/notifications.js';

export const onRequestCreated = onDocumentCreated(
  'requests/{requestId}',
  async (event) => {
    try {
      const requestId = event.params.requestId;
      const request = event.data.data();
      
      console.log(`🔍 New request created: ${requestId} - ${request.itemName}`);
      
      // Find matching items
      const matches = await findMatchingItems(request);
      
      console.log(`Found ${matches.length} matching items`);
      
      // Notify each item owner about the match
      const notificationPromises = matches.map(match => 
        notifyRequestMatch(
          match.item.ownerId,
          request.itemName,
          requestId
        )
      );
      
      await Promise.all(notificationPromises);
      
      console.log(`✅ Notified ${matches.length} potential loaners`);
      
      // Optionally: Store match suggestions in a subcollection
      // This lets users see their match history
      const batch = event.firestore.batch();
      matches.slice(0, 10).forEach(match => { // Top 10 matches
        const matchRef = event.firestore
          .collection('requests')
          .doc(requestId)
          .collection('matches')
          .doc(match.itemId);
        
        batch.set(matchRef, {
          itemId: match.itemId,
          ownerId: match.item.ownerId,
          matchScore: match.matchScore,
          distance: match.distance,
          createdAt: new Date()
        });
      });
      
      await batch.commit();
      
      return { success: true, matchCount: matches.length };
    } catch (error) {
      console.error('Error in onRequestCreated:', error);
      throw error;
    }
  }
);