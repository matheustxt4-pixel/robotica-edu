import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD41AbUiDxfmFKM1wySscFZbfrkRBzOmu8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'robotica-edu-3ad5d.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'robotica-edu-3ad5d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'robotica-edu-3ad5d.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '198215858487',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:198215858487:web:6ffd18833133d9404b82b2'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseDemo = (import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey) === 'demo-api-key';

export default app;

