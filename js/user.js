import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
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
async function showUserInfo(user) {
  const userQuery = query(collection(db, "users"), where("username", "==", user.username));
  const userSnapshot = await getDocs(userQuery);
  const userData = userSnapshot.docs[0].data();

  // Inizializza i campi se non esistono
  const wins = userData?.wins ?? 0;
  const losses = userData?.losses ?? 0;
  const totalBattles = userData?.totalBattles ?? 0;

  const winRate =
    totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(2) : 0;

  userContainer.innerHTML = `
    <div class="user-info">
      <h2>Welcome back! ${user.username}</h2>
      <img src="${user.image}" alt="Profile Image" class="profile-img">
      <button id="logoutButton">Logout</button>
    </div>
  `;

  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = `
    <h2>Your Stats</h2>
    <p>Vittorie totali: ${wins}</p>
    <p>Sconfitte totali: ${losses}</p>
    <p>WinRate: ${winRate}%</p>
  `;
  statsContainer.classList.remove("hidden");

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", logoutUser);

  // Mostra le battaglie dell'utente
  fetchUserBattles(user.username);
}

// Funzione per effettuare il logout
function logoutUser() {
  localStorage.removeItem("user");
  showLoginForm();
}

// Funzione per ottenere le battaglie dell'utente
async function fetchUserBattles(username) {
  const battlesContainer = document.getElementById("battlesContainer");
  const battlesList = document.getElementById("battlesList");

  // Query per ottenere le battaglie in cui l'utente è coinvolto come player1 o player2
  const q1 = query(collection(db, "battles"), where("player1", "==", username));
  const q2 = query(collection(db, "battles"), where("player2", "==", username));

  const querySnapshot1 = await getDocs(q1);
  const querySnapshot2 = await getDocs(q2);

  battlesList.innerHTML = "";

  // Funzione per colorare i punteggi
  function colorScore(score) {
    const [score1, score2] = score.split("-").map(Number);
    let score1Color, score2Color;

    if (score1 > score2) {
      score1Color = "green";
      score2Color = "red";
    } else if (score1 < score2) {
      score1Color = "red";
      score2Color = "green";
    } else {
      score1Color = "yellow";
      score2Color = "yellow";
    }

    return `<span style="color: ${score1Color}; font-weight: bold;">${score1}</span> <span style="color: white;">-</span> <span style="color: ${score2Color}; font-weight: bold;">${score2}</span>`;
  }

  // Aggiungi le battaglie in cui l'utente è player1
  querySnapshot1.forEach((doc) => {
    const battle = doc.data();
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="battle-date">${battle.date}</span>: 
      <span class="battle-players">${battle.player1} vs ${battle.player2}</span> - 
      <span class="battle-score">${colorScore(battle.score)}</span>
    `;
    battlesList.appendChild(listItem);
  });

  // Aggiungi le battaglie in cui l'utente è player2
  querySnapshot2.forEach((doc) => {
    const battle = doc.data();
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="battle-date">${battle.date}</span>: 
      <span class="battle-players">${battle.player1} vs ${battle.player2}</span> - 
      <span class="battle-score">${colorScore(battle.score)}</span>
    `;
    battlesList.appendChild(listItem);
  });

  if (battlesList.innerHTML === "") {
    battlesList.innerHTML = "<li>No battles recorded yet.</li>";
  }

  battlesContainer.classList.remove("hidden");
}

// Controlla se l'utente è già autenticato
const storedUser = localStorage.getItem("user");
if (storedUser) {
  const user = JSON.parse(storedUser);
  showUserInfo(user);
} else {
  showLoginForm();
}