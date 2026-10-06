import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Official project configuration for rastreia-sepse
const DEFAULT_FIREBASE_CONFIG = {
  projectId: "rastreia-sepse",
  appId: "1:20947624107:web:5bdd7ce115ec94cc3217ee",
  storageBucket: "rastreia-sepse.firebasestorage.app",
  apiKey: "AIzaSyCSytm4PvPNMJdRAsZUMF6kDBLW6dCezCU",
  authDomain: "rastreia-sepse.firebaseapp.com",
  messagingSenderId: "20947624107"
};

const STORAGE_CONFIG_KEY = 'rastreia_sepse_firebase_config';

export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading stored Firebase config', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config) {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Firebase config', e);
  }
}

let app = null;
let auth = null;
let db = null;

export function initFirebase(customConfig = null) {
  const config = customConfig || getStoredFirebaseConfig();
  
  if (config && config.apiKey && config.projectId) {
    try {
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApp();
      }
      auth = getAuth(app);
      db = getFirestore(app);
      return { app, auth, db, isConnected: true };
    } catch (err) {
      console.warn('Firebase init error, running in local fallback mode:', err);
      return { app: null, auth: null, db: null, isConnected: false, error: err.message };
    }
  }

  return { app: null, auth: null, db: null, isConnected: false };
}

// Initial attempt
const firebaseState = initFirebase();
export { app, auth, db, firebaseState };
