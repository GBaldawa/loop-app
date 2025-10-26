# Loop - Community Lending App

## Overview

Loop is a community-driven platform for lending and borrowing items locally. Built with React and Firebase, it connects neighbors who want to share resources, earn credits through lending, and build stronger communities. The platform features real-time matching between borrowers and lenders, a credit-based reward system, and secure meetup verification.

## Features

- Smart Item Matching: AI-powered system matches borrowing requests with available inventory
- Credit System: Lenders earn points based on item value and loan duration
- Real-time Notifications: Users receive instant updates on requests, acceptances, and completions
- Location-based Search: Find items and lenders within a specified radius
- Secure Meetup Verification: Unique codes verify item handoffs between users
- Rating System: Build trust through user ratings and reviews after each transaction
- Inventory Management: Add, edit, and track items available for lending
- Loan Tracking: Monitor active loans, borrowed items, and transaction history
- Damage Reporting: Built-in system for handling and documenting damaged items

## Tech Stack

- Frontend: React 18 with Hooks
- Routing: React Router v6
- Styling: Material-UI and custom CSS
- Backend: Firebase (Authentication, Firestore Database, Real-time Listeners)
- Icons: Lucide React
- Geolocation: Native Browser API

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/loop.git
cd loop
```

### Install Dependencies

```bash
npm install
```

### Configure Firebase

Create a `src/config/firebase.js` file with your Firebase configuration:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Set Up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /items/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    match /requests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.requesterId == request.auth.uid;
    }
    
    match /loans/{loanId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.loanerId == request.auth.uid || 
         resource.data.borrowerId == request.auth.uid);
    }
    
    match /notifications/{notifId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

### Start the Development Server

```bash
npm start
```

## Usage

### Getting Started

1. Create an account with your email and password
2. Allow location access for distance-based features
3. Choose to either request items as a borrower or add items as a lender

### Borrowing Workflow

1. Create a request specifying the item name, duration, and maximum distance
2. Wait for a lender to accept your request
3. Meet the lender and confirm pickup using the provided meetup code
4. Return the item by the agreed-upon time
5. Complete the loan and rate your experience with the lender

### Lending Workflow

1. Add items to your inventory with name, description, category, and value
2. Receive notifications when users request items matching your inventory
3. Accept requests that work for your schedule
4. Meet the borrower and provide the meetup code for verification
5. Confirm return of the item and rate your experience with the borrower

## Project Structure

```
loop/
├── src/
│   ├── components/
│   │   └── LoadingSpinner.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── hooks/
│   │   ├── useNotifications.jsx
│   │   └── useHapticFeedback.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ItemsPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── LoaningPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AuthPage.jsx
│   │   └── MapPage.jsx
│   ├── App.jsx
│   └── index.js
├── public/
├── package.json
└── README.md
```

## Database Schema

### Collections

- users: User profiles, credits, ratings, and transaction counts
- items: Items available for lending with owner information and availability status
- requests: Borrowing requests with item details, location, and time requirements
- loans: Active and completed loans tracking borrower, lender, and item details
- notifications: Real-time user notifications for requests, acceptances, and completions
- ratings: User ratings and reviews for completed transactions

## Development Tools

### Database Reset Function

For development purposes, reset the database while preserving user accounts:

```javascript
// In browser console
resetDatabase()
```

This will delete all items, requests, loans, and notifications.

## Future Plans

- Interactive Map: Add visual map interface with markers for items and requests
- In-app Messaging: Direct communication between borrowers and lenders
- Photo Uploads: Allow users to upload images of items
- Push Notifications: Mobile push notifications for important updates
- Advanced Search: Implement filters by category, distance, rating, and availability
- Payment Integration: Handle damage deposits and insurance through the platform
- Social Features: User profiles, followers, and community building features
- Mobile App: Native iOS and Android applications using React Native
- Multi-language Support: Internationalization for global communities
- Item History: Track complete lifecycle and usage statistics for each item

## Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.
