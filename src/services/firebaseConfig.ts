// ─── Firebase config for Welile Forms ──────────────────────────────────────
// This is a completely separate Firebase project from anything else in this app.
// Project: welile-forms (Firebase console: https://console.firebase.google.com/project/welile-forms)

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Named app — prevents collision with any other Firebase instance in this codebase
const formsApp = initializeApp(firebaseConfig, 'welile-forms');
const formsAuth = getAuth(formsApp);
const formsDb   = getFirestore(formsApp);



export {
  formsApp,
  formsAuth,
  formsDb,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  type User,
};
