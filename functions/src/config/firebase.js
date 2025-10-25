/**
 * Firebase Admin SDK Initialization
 * 
 * This file initializes Firebase Admin SDK which gives us:
 * - Full access to Firestore (bypasses security rules)
 * - Ability to send notifications
 * - Server-side authentication
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin
// In production, this uses Application Default Credentials
// For local development, set GOOGLE_APPLICATION_CREDENTIALS env variable
admin.initializeApp();

// Firestore database instance
export const db = admin.firestore();

// Authentication instance
export const auth = admin.auth();

// Storage instance
export const storage = admin.storage();

// Firestore FieldValue for special operations
export const FieldValue = admin.firestore.FieldValue;

// Helper to get server timestamp
export const serverTimestamp = () => FieldValue.serverTimestamp();

// Helper to increment/decrement values
export const increment = (value) => FieldValue.increment(value);

// Helper to delete a field
export const deleteField = () => FieldValue.delete();

export default admin;