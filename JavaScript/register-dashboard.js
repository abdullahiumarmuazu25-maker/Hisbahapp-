import { app } from "./firebase-config.js";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth, createUserWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const backBtn = document.getElementById("backBtn");

// ✅ Koma baya zuwa dashboard idan ya danna Back
backBtn.addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

// 🔐 Tabbatar an shiga kafin a iya amfani da wannan page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

// ✳️ Register New User
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!fullName || !email || !password || !role) {
    registerMessage.innerHTML = `<p class="error">Please fill all fields!</p>`;
    return;
  }

  registerMessage.innerHTML = `<p>Registering user, please wait...</p>`;

  try {
    // 1️⃣ Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Save user info in Firestore
    await addDoc(collection(db, "staff"), {
      name: fullName,
      email: email,
      role: role,
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    registerMessage.innerHTML = `<p class="success">✅ User registered successfully!</p>`;
    registerForm.reset();
  } catch (error) {
    console.error(error);
    registerMessage.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
});