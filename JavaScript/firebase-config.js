// js/firebase-config.js
// Firebase configuration (your real config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo-o-z91lAFh-p1mP_dVmAMhJtz-BLMRk",
  authDomain: "hisbahapp.firebaseapp.com",
  databaseURL: "https://hisbahapp-default-rtdb.firebaseio.com",
  projectId: "hisbahapp",
  storageBucket: "hisbahapp.firebasestorage.app",
  messagingSenderId: "644147380199",
  appId: "1:644147380199:web:b5a0817aadf032aa560742",
  measurementId: "G-9G0RMVFZ1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);