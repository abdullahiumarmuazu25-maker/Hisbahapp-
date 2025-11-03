import { app } from "./firebase-config.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// ✅ Tabbatar idan user yana logged-in, kai tsaye redirect
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await redirectUserByRole(user.email);
  }
});

// 🧠 Login System
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    loginMessage.innerHTML = `<p class="error">Please fill in all fields.</p>`;
    return;
  }

  loginMessage.innerHTML = `<p>Checking credentials...</p>`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    loginMessage.innerHTML = `<p class="success">Login successful. Redirecting...</p>`;

    await redirectUserByRole(user.email);
  } catch (error) {
    console.error(error);
    loginMessage.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
});

// 🔄 Function: Redirect User by Role
async function redirectUserByRole(email) {
  const q = query(collection(db, "staff"), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    loginMessage.innerHTML = `<p class="error">User not found in database.</p>`;
    return;
  }

  let userRole;
  querySnapshot.forEach((doc) => {
    userRole = doc.data().role;
  });

  switch (userRole) {
    case "admin":
      window.location.href = "admin-dashboard.html";
      break;
    case "manager":
      window.location.href = "manager-dashboard.html";
      break;
    case "staff":
      window.location.href = "staff-dashboard.html";
      break;
    case "command":
      window.location.href = "command-dashboard.html";
      break;
    case "intelligence":
      window.location.href = "intelligence-dashboard.html";
      break;
    default:
      loginMessage.innerHTML = `<p class="error">Invalid user role.</p>`;
  }
}