// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfgN6kqIWkMPxXiQf2u_CddJeJUDRcaKA",
  authDomain: "loop-hack25.firebaseapp.com",
  projectId: "loop-hack25",
  storageBucket: "loop-hack25.firebasestorage.app",
  messagingSenderId: "531958376297",
  appId: "1:531958376297:web:27e8ab1318841ca2b67ff8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);