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
const contentDiv = document.getElementById("commandContent");

// 🔒 Tabbatar da login
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

// 📋 Duba Reports
document.getElementById("viewReportsBtn").addEventListener("click", async () => {
  contentDiv.innerHTML = "<h3>Loading reports...</h3>";
  const reportsSnapshot = await getDocs(collection(db, "reports"));

  let html = `<h2>All Field Reports</h2>
  <table>
    <tr><th>Title</th><th>Details</th><th>Submitted By</th><th>Date</th></tr>`;

  reportsSnapshot.forEach((docSnap) => {
    const r = docSnap.data();
    html += `
      <tr>
        <td>${r.title}</td>
        <td>${r.details}</td>
        <td>${r.author || "Unknown"}</td>
        <td>${r.date}</td>
      </tr>`;
  });
  html += "</table>";
  contentDiv.innerHTML = html;
});

// 📢 Send Command
document.getElementById("sendCommandBtn").addEventListener("click", () => {
  contentDiv.innerHTML = `
    <h2>Send Command Instruction</h2>
    <form id="commandForm">
      <input type="text" id="unit" placeholder="Target Unit or Staff Email" required />
      <textarea id="instruction" placeholder="Enter your command here..." required></textarea>
      <button type="submit">Send Command</button>
    </form>
    <div id="commandMsg"></div>
  `;

  const commandForm = document.getElementById("commandForm");
  const commandMsg = document.getElementById("commandMsg");

  commandForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const unit = document.getElementById("unit").value.trim();
    const instruction = document.getElementById("instruction").value.trim();

    if (!unit || !instruction) {
      commandMsg.innerHTML = `<p class="error">All fields are required.</p>`;
      return;
    }

    try {
      await addDoc(collection(db, "commands"), {
        unit: unit,
        instruction: instruction,
        sentAt: serverTimestamp(),
      });
      commandMsg.innerHTML = `<p class="success">✅ Command sent successfully!</p>`;
      commandForm.reset();
    } catch (error) {
      console.error(error);
      commandMsg.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  });
});

// 📊 Summary View
document.getElementById("viewSummaryBtn").addEventListener("click", async () => {
  contentDiv.innerHTML = "<h3>Fetching summary...</h3>";

  const reportsSnapshot = await getDocs(collection(db, "reports"));
  const totalReports = reportsSnapshot.size;

  const commandsSnapshot = await getDocs(collection(db, "commands"));
  const totalCommands = commandsSnapshot.size;

  contentDiv.innerHTML = `
    <h2>Command Summary Overview</h2>
    <div class="stats-grid">
      <div class="card">📄 Total Reports: <b>${totalReports}</b></div>
      <div class="card">📢 Commands Sent: <b>${totalCommands}</b></div>
    </div>
  `;
});