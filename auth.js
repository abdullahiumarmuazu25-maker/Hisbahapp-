// js/auth.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null);
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    callback(snap.exists() ? { ...snap.data(), uid: user.uid, email: user.email } : null);
  });
}

export function redirectByRole(role) {
  if (role === "admin") window.location.href = "admin-dashboard.html";
  else if (role === "manager") window.location.href = "manager-dashboard.html";
  else if (role === "staff") window.location.href = "staff-dashboard.html";
  else if (role === "command") window.location.href = "command-dashboard.html";
}