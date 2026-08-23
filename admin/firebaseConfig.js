// ══════════════════════════════════════════════════════════════
// HUGPONG Web Firebase Configuration & Cloud Connector (ES Module)
// Project: hugpong-ff
// ══════════════════════════════════════════════════════════════

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

export const webFirebaseConfig = {
  apiKey: "AIzaSyDYkv9afZa2ZlhxLzIEZfk2b5wP_s2XXpI",
  authDomain: "hugpong-ff.firebaseapp.com",
  projectId: "hugpong-ff",
  storageBucket: "hugpong-ff.firebasestorage.app",
  messagingSenderId: "516809927909",
  appId: "1:516809927909:web:195ec4886bde93e811f80c"
};

// Initialize Firebase App & Firestore Database
const app = initializeApp(webFirebaseConfig);
const db = getFirestore(app);

// Attach globally for admin.js and console tools
window.firebaseApp = app;
window.firebaseDB = db;
window.firestore = {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
};

// Dispatch custom event to notify admin.js that Firestore is ready
window.dispatchEvent(new CustomEvent('hugpong:firebase_ready', { detail: { db, app } }));
console.log('[HUGPONG] Firebase Firestore connected to project: hugpong-ff');
