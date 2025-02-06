import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
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

// Funzione per aggiornare la classifica
function updateLeaderboard() {
  const leaderboardTableBody = document.querySelector(
    "#leaderboardTable tbody"
  );
  leaderboardTableBody.innerHTML = "";

  const q = query(collection(db, "users"), orderBy("wins", "desc"));
  onSnapshot(q, (querySnapshot) => {
    leaderboardTableBody.innerHTML = ""; // Pulisci la tabella prima di aggiornarla
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      const row = document.createElement("tr");

      const userCell = document.createElement("td");
      const img = document.createElement("img");
      img.src = user.image;
      img.alt = user.username;
      img.style.width = "50px";
      img.style.borderRadius = "50%";
      img.style.marginRight = "10px";
      userCell.appendChild(img);
      userCell.appendChild(document.createTextNode(user.username));

      const winsCell = document.createElement("td");
      winsCell.textContent = user.wins;

      const lossesCell = document.createElement("td");
      lossesCell.textContent = user.losses;

      const winRateCell = document.createElement("td");
      const totalBattles = user.wins + user.losses;
      const winRate = totalBattles > 0 ? ((user.wins / totalBattles) * 100).toFixed(2) : 0;
      winRateCell.textContent = `${winRate}%`;

      row.appendChild(userCell);
      row.appendChild(winsCell);
      row.appendChild(lossesCell);
      row.appendChild(winRateCell);

      leaderboardTableBody.appendChild(row);
    });
  });
}

// Aggiorna la classifica al caricamento della pagina
document.addEventListener("DOMContentLoaded", updateLeaderboard);
