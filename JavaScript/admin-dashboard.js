import { app } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const dashboardContent = document.getElementById("dashboardContent");

// ✅ Tabbatar da login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// 👥 View All Users
document.getElementById("viewUsersBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Loading users...</h3>";
  const usersSnapshot = await getDocs(collection(db, "staff"));

  let html = "<h2>All Registered Users</h2><table><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>";
  usersSnapshot.forEach((docSnap) => {
    const u = docSnap.data();
    const date = u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleString() : "N/A";
    html += `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${date}</td></tr>`;
  });
  html += "</table>";

  dashboardContent.innerHTML = html;
});

// 📄 View Reports
document.getElementById("viewReportsBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Loading reports...</h3>";
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  let html = "<h2>All Reports</h2><table><tr><th>Title</th><th>Details</th><th>Author</th><th>Date</th></tr>";
  reportsSnapshot.forEach((docSnap) => {
    const r = docSnap.data();
    html += `<tr><td>${r.title}</td><td>${r.details}</td><td>${r.author || "N/A"}</td><td>${r.date}</td></tr>`;
  });
  html += "</table>";

  dashboardContent.innerHTML = html;
});

// ➕ Register New User
document.getElementById("registerUserBtn").addEventListener("click", () => {
  window.location.href = "register.html";
});

// 📊 Analytics / Stats
document.getElementById("viewStatsBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Calculating statistics...</h3>";

  const usersSnapshot = await getDocs(collection(db, "staff"));
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  const totalUsers = usersSnapshot.size;
  const totalReports = reportsSnapshot.size;

  let adminCount = 0, staffCount = 0, managerCount = 0, commandCount = 0;
  usersSnapshot.forEach((docSnap) => {
    const role = docSnap.data().role;
    if (role === "admin") adminCount++;
    else if (role === "manager") managerCount++;
    else if (role === "staff") staffCount++;
    else if (role === "command") commandCount++;
  });

  dashboardContent.innerHTML = `
    <h2>System Analytics</h2>
    <div class="stats-grid">
      <div class="card">👥 Total Users: <b>${totalUsers}</b></div>
      <div class="card">📄 Total Reports: <b>${totalReports}</b></div>
      <div class="card">🛡 Admins: <b>${adminCount}</b></div>
      <div class="card">📋 Managers: <b>${managerCount}</b></div>
      <div class="card">👮 Staff: <b>${staffCount}</b></div>
      <div class="card">⚔ Command: <b>${commandCount}</b></div>
    </div>
  `;
});