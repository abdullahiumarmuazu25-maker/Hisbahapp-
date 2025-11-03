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
  addDoc,
  serverTimestamp,
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

// 📋 View Reports
document.getElementById("viewReportsBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Loading reports...</h3>";
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  let html = "<h2>All Submitted Reports</h2><table><tr><th>Title</th><th>Details</th><th>Author</th><th>Date</th></tr>";
  reportsSnapshot.forEach((docSnap) => {
    const report = docSnap.data();
    html += `<tr>
      <td>${report.title}</td>
      <td>${report.details}</td>
      <td>${report.author || "Unknown"}</td>
      <td>${report.date}</td>
    </tr>`;
  });
  html += "</table>";

  dashboardContent.innerHTML = html;
});

// 💬 Send Feedback
document.getElementById("sendFeedbackBtn").addEventListener("click", () => {
  dashboardContent.innerHTML = `
    <h2>Send Feedback to Staff</h2>
    <form id="feedbackForm">
      <input type="text" id="recipientEmail" placeholder="Recipient Email" required />
      <textarea id="feedbackText" placeholder="Write your feedback here..." required></textarea>
      <button type="submit">Send</button>
    </form>
    <div id="feedbackMsg"></div>
  `;

  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackMsg = document.getElementById("feedbackMsg");

  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const recipient = document.getElementById("recipientEmail").value.trim();
    const message = document.getElementById("feedbackText").value.trim();

    if (!recipient || !message) {
      feedbackMsg.innerHTML = `<p class="error">Please fill all fields.</p>`;
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        to: recipient,
        message: message,
        sentAt: serverTimestamp(),
      });

      feedbackMsg.innerHTML = `<p class="success">✅ Feedback sent successfully!</p>`;
      feedbackForm.reset();
    } catch (error) {
      console.error(error);
      feedbackMsg.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  });
});

// 👥 View Staff List
document.getElementById("viewStaffBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Loading staff...</h3>";
  const staffSnapshot = await getDocs(collection(db, "staff"));

  let html = "<h2>All Registered Staff</h2><table><tr><th>Name</th><th>Email</th><th>Role</th></tr>";
  staffSnapshot.forEach((docSnap) => {
    const s = docSnap.data();
    if (s.role === "staff") {
      html += `<tr><td>${s.name}</td><td>${s.email}</td><td>${s.role}</td></tr>`;
    }
  });
  html += "</table>";

  dashboardContent.innerHTML = html;
});

// 📊 Summary
document.getElementById("viewSummaryBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Fetching data...</h3>";

  const reportsSnapshot = await getDocs(collection(db, "reports"));
  const totalReports = reportsSnapshot.size;

  const feedbackSnapshot = await getDocs(collection(db, "feedback"));
  const totalFeedback = feedbackSnapshot.size;

  dashboardContent.innerHTML = `
    <h2>Summary Overview</h2>
    <div class="stats-grid">
      <div class="card">📄 Total Reports: <b>${totalReports}</b></div>
      <div class="card">💬 Feedback Sent: <b>${totalFeedback}</b></div>
    </div>
  `;
});