import { app } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const intelContent = document.getElementById("intelContent");

// 🔒 Authentication check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    window.currentUser = user;
  }
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// 🕵️‍♂️ Send Intelligence Report
document.getElementById("sendReportBtn").addEventListener("click", () => {
  intelContent.innerHTML = `
    <h2>Submit Intelligence Report</h2>
    <form id="intelReportForm">
      <input type="text" id="reportTitle" placeholder="Report Title" required />
      <textarea id="reportDetails" placeholder="Enter detailed intelligence..." required></textarea>
      <button type="submit">Submit Report</button>
    </form>
    <div id="intelMsg"></div>
  `;

  const intelForm = document.getElementById("intelReportForm");
  const intelMsg = document.getElementById("intelMsg");

  intelForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("reportTitle").value.trim();
    const details = document.getElementById("reportDetails").value.trim();

    if (!title || !details) {
      intelMsg.innerHTML = `<p class="error">Please fill all fields.</p>`;
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        title: title,
        details: details,
        author: window.currentUser.email,
        type: "intelligence",
        date: new Date().toLocaleString(),
        createdAt: serverTimestamp(),
      });
      intelMsg.innerHTML = `<p class="success">✅ Intelligence report sent successfully!</p>`;
      intelForm.reset();
    } catch (error) {
      intelMsg.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  });
});

// 📢 View Commands
document.getElementById("viewCommandsBtn").addEventListener("click", async () => {
  intelContent.innerHTML = `<h3>Loading active commands...</h3>`;
  const commandsSnapshot = await getDocs(collection(db, "commands"));
  let html = `<h2>Commands from Command Officer</h2><ul class="command-list">`;

  if (commandsSnapshot.empty) {
    html += `<p>No command found.</p>`;
  } else {
    commandsSnapshot.forEach((docSnap) => {
      const cmd = docSnap.data();
      html += `
        <li>
          <strong>To:</strong> ${cmd.unit} <br>
          <strong>Instruction:</strong> ${cmd.instruction} <br>
          <small>Sent: ${cmd.sentAt?.toDate().toLocaleString() || "N/A"}</small>
        </li>`;
    });
  }
  html += "</ul>";
  intelContent.innerHTML = html;
});

// 📜 View Report History
document.getElementById("historyBtn").addEventListener("click", async () => {
  const email = window.currentUser?.email;
  if (!email) return;

  intelContent.innerHTML = `<h3>Loading your reports...</h3>`;
  const q = query(collection(db, "reports"), where("author", "==", email));
  const snapshot = await getDocs(q);

  let html = `<h2>Your Report History</h2>
  <table>
    <tr><th>Title</th><th>Details</th><th>Date</th></tr>`;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    html += `
      <tr>
        <td>${data.title}</td>
        <td>${data.details}</td>
        <td>${data.date}</td>
      </tr>`;
  });

  html += "</table>";
  intelContent.innerHTML = html;
});