/**
 * Trigger: When a loan is completed
 * 
 * This function runs when a loan status changes to 'completed'
 * It awards points, updates stats, and sends notifications
 */

import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { db, increment, serverTimestamp } from '../config/firebase.js';
import { calculateActualPoints } from '../utils/points.js';
import { notifyLoanCompleted } from '../utils/notifications.js';

export const onLoanCompleted = onDocumentUpdated(
  'loans/{loanId}',
  async (event) => {
    try {
      const before = event.data.before.data();
      const after = event.data.after.data();
      
      // Only run if status changed to 'completed'
      if (before.status !== 'completed' && after.status === 'completed') {
        const loanId = event.params.loanId;
        
        console.log(`💰 Loan completed: ${loanId}`);
        
        // Get item details to calculate points
        const itemDoc = await db.collection('items').doc(after.itemId).get();
        const item = itemDoc.data();
        
        // Calculate points based on actual time
        const points = calculateActualPoints(
          after.startTime.toDate(),
          after.actualReturnTime.toDate(),
          item.estimatedValue || 50 // Default to $50 if not specified
        );
        
        console.log(`Awarding ${points} points to ${after.loanerId}`);
        
        // Use a batch to update multiple documents atomically
        const batch = db.batch();
        
        // 1. Update loaner's points and stats
        const loanerRef = db.collection('users').doc(after.loanerId);
        batch.update(loanerRef, {
          points: increment(points),
          totalLoans: increment(1),
          lastLoanCompletedAt: serverTimestamp()
        });
        
        // 2. Update borrower's stats
        const borrowerRef = db.collection('users').doc(after.borrowerId);
        batch.update(borrowerRef, {
          totalBorrows: increment(1),
          lastBorrowCompletedAt: serverTimestamp()
        });
        
        // 3. Make item available again
        const itemRef = db.collection('items').doc(after.itemId);
        batch.update(itemRef, {
          available: true,
          lastLoanedAt: serverTimestamp()
        });
        
        // 4. Update the loan with awarded points
        const loanRef = db.collection('loans').doc(loanId);
        batch.update(loanRef, {
          pointsEarned: points,
          completedAt: serverTimestamp()
        });
        
        // 5. Create transaction record
        const transactionRef = db.collection('transactions').doc();
        batch.set(transactionRef, {
          userId: after.loanerId,
          type: 'earned',
          points: points,
          relatedLoanId: loanId,
          description: `Loaned ${item.name}`,
          timestamp: serverTimestamp()
        });
        
        // Commit all updates
        await batch.commit();
        
        console.log('✅ All updates committed');
        
        // Send notification
        await notifyLoanCompleted(after.loanerId, points, item.name);
        
        // Update request status if loan was from a request
        if (after.requestId) {
          await db.collection('requests').doc(after.requestId).update({
            status: 'completed',
            completedAt: serverTimestamp()
          });
        }
        
        return { success: true, pointsAwarded: points };
      }
      
      return { success: true, message: 'Status not changed to completed' };
    } catch (error) {
      console.error('Error in onLoanCompleted:', error);
      throw error;
    }
  }
);