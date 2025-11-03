import { app } from "./firebase-config.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, where 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { 
  getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);
const dashboardContent = document.getElementById("dashboardContent");

// ✅ Check authentication
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "staff.html";
  } else {
    localStorage.setItem("staffEmail", user.email);
  }
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "staff.html";
});

// 📋 View My Reports
document.getElementById("viewMyReportsBtn").addEventListener("click", async () => {
  const userEmail = localStorage.getItem("staffEmail");
  dashboardContent.innerHTML = "<h3>Loading your reports...</h3>";

  const q = query(collection(db, "reports"), where("author", "==", userEmail));
  const reportsSnapshot = await getDocs(q);

  let html = "<h2>My Reports</h2><table><tr><th>Title</th><th>Details</th><th>Date</th></tr>";
  reportsSnapshot.forEach((docSnap) => {
    const report = docSnap.data();
    html += `<tr><td>${report.title}</td><td>${report.details}</td><td>${report.date}</td></tr>`;
  });

  html += "</table>";
  dashboardContent.innerHTML = html || "<p>No reports found.</p>";
});

// ➕ Add New Report
document.getElementById("addNewReportBtn").addEventListener("click", () => {
  dashboardContent.innerHTML = `
    <h2>Add New Report</h2>
    <form id="newReportForm">
      <input type="text" id="reportTitle" placeholder="Report Title" required />
      <textarea id="reportDetails" placeholder="Report Details" required></textarea>
      <button type="submit">Submit</button>
    </form>
  `;

  document.getElementById("newReportForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("reportTitle").value;
    const details = document.getElementById("reportDetails").value;
    const date = new Date().toLocaleString();
    const author = localStorage.getItem("staffEmail");

    await addDoc(collection(db, "reports"), { title, details, date, author });
    alert("Report submitted successfully!");
    dashboardContent.innerHTML = "<p>Report submitted successfully.</p>";
  });
});

// 📑 View All Reports
document.getElementById("viewAllReportsBtn").addEventListener("click", async () => {
  dashboardContent.innerHTML = "<h3>Loading all reports...</h3>";
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  let html = "<h2>All Reports</h2><table><tr><th>Title</th><th>Details</th><th>Author</th><th>Date</th></tr>";
  reportsSnapshot.forEach((docSnap) => {
    const r = docSnap.data();
    html += `<tr><td>${r.title}</td><td>${r.details}</td><td>${r.author || "Unknown"}</td><td>${r.date}</td></tr>`;
  });

  html += "</table>";
  dashboardContent.innerHTML = html;
});