# 🌙 Sokoto State Hisbah Board Web Application

Wannan shine cikakken **Web App** na **Sokoto State Hisbah Board**, wanda aka gina da **Firebase Authentication**, **Firestore Database**, da **Firebase Hosting** domin gudanar da ayyukan hukumar cikin sauƙi da tsaro.

---

## 🕌 **Abubuwan da ke cikin wannan web app**
- 🔐 Login Authentication (Admin, Manager, Staff, Command, Intelligence)
- 📋 Register Staff / Assign Roles
- 🧾 Reports submission da viewing
- 📢 Commands sending da receiving
- 📊 Dashboard analytics
- ☁️ Firebase Hosting ready
- 💻 GitHub integrated structure

hisbah-app/ │ ├── index.html ├── register.html ├── admin-dashboard.html ├── manager-dashboard.html ├── staff-dashboard.html ├── command-dashboard.html ├── intelligence-dashboard.html │ ├── js/ │   ├── firebase-config.js │   ├── login.js │   ├── register-dashboard.js │   ├── admin-dashboard.js │   ├── manager-dashboard.js │   ├── staff-dashboard.js │   ├── command-dashboard.js │   ├── intelligence-dashboard.js │ ├── style.css │ ├── assets/ │   ├── logo.png │   ├── hisbah-banner.jpg │   └── signature/ │ ├── firebase.json ├── .firebaserc └── README.md
Copy code

---

## ⚙️ **Firebase Configuration**

Ana amfani da Firebase SDK v10+ tare da wannan config ɗin:

```javascript
// js/firebase-config.js

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

export const app = initializeApp(firebaseConfig);
