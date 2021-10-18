import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { collection } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase with a default Firebase project
initializeApp(firebaseConfig);

// Use the shorthand notation to access the default project's Firebase services
export const storage = getStorage();
export const database = getFirestore();

export const plannerRef = collection(database, 'planner');
export const transactionsRef = collection(database, 'transactions');