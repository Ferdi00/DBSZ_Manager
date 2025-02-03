import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAAr2hqejSjlFnLq9KBEqXG_EQZFMh588E",
  authDomain: "dbszmanager.firebaseapp.com",
  projectId: "dbszmanager",
  storageBucket: "dbszmanager.firebasestorage.app",
  messagingSenderId: "436504110426",
  appId: "1:436504110426:web:7a0d2b3e44ca5f3f00ff63",
  measurementId: "G-ZB6DECV6M6",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userContainer = document.getElementById("userContainer");

// Funzione per mostrare il form di login
function showLoginForm() {
  userContainer.innerHTML = `
    <div class="login-form">
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button id="loginButton">Login</button>
    </div>
  `;

  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", loginUser);
}

// Funzione per effettuare il login
async function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      localStorage.setItem("user", JSON.stringify(userData));
      showUserInfo(userData);
    } else {
      alert("Username o password non validi.");
    }
  } catch (error) {
    console.error("Errore di login:", error);
    alert("Errore di login: " + error.message);
  }
}

// Funzione per mostrare le informazioni dell'utente
function showUserInfo(user) {
  userContainer.innerHTML = `
    <div class="user-info">
      <h2>Benvenuto, ${user.username}</h2>
      <img src="${user.image}" alt="Profile Image" class="profile-img">
      <button id="logoutButton">Logout</button>
    </div>
  `;

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", logoutUser);
}

// Funzione per effettuare il logout
function logoutUser() {
  localStorage.removeItem("user");
  showLoginForm();
}

// Controlla se l'utente è già autenticato
const storedUser = localStorage.getItem("user");
if (storedUser) {
  const user = JSON.parse(storedUser);
  showUserInfo(user);
} else {
  showLoginForm();
}
