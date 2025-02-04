import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
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

const battleFormContainer = document.getElementById("battleFormContainer");

// Funzione per mostrare il form di registrazione della battaglia
function showBattleForm(users) {
  const userOptions = users
    .map((user) => `<option value="${user.username}">${user.username}</option>`)
    .join("");

  battleFormContainer.innerHTML = `
    <div class="battle-form">
      <label for="player1">Player 1:</label>
      <select id="player1">${userOptions}</select>
      
      <label for="player2">Player 2:</label>
      <select id="player2">${userOptions}</select>
      
      <label for="score">Score:</label>
      <input type="text" id="score" placeholder="e.g., 3-1" required>
      
      <label for="date">Date:</label>
      <input type="date" id="date" required>
      
      <button id="recordBattleButton">Record Battle</button>
    </div>
  `;

  const recordBattleButton = document.getElementById("recordBattleButton");
  recordBattleButton.addEventListener("click", recordBattle);
}

// Funzione per registrare la battaglia
async function recordBattle() {
  const player1 = document.getElementById("player1").value;
  const player2 = document.getElementById("player2").value;
  const score = document.getElementById("score").value;
  const date = document.getElementById("date").value;

  try {
    await addDoc(collection(db, "battles"), {
      player1,
      player2,
      score,
      date,
    });
    alert("Battle recorded successfully!");
  } catch (error) {
    console.error("Error recording battle:", error);
    alert("Error recording battle: " + error.message);
  }
}

// Funzione per ottenere gli utenti
async function fetchUsers() {
  const users = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}

// Controlla se l'utente è autenticato
const storedUser = localStorage.getItem("user");
if (storedUser) {
  fetchUsers().then((users) => {
    showBattleForm(users);
  });
} else {
  battleFormContainer.innerHTML = `<p>Please log in to record a battle.</p>`;
}
