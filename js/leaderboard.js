import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
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
    let index = 0; // Inizializza l'indice
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
      const winRate =
        totalBattles > 0 ? ((user.wins / totalBattles) * 100).toFixed(2) : 0;
      winRateCell.textContent = `${winRate}%`;

      // Aggiungi colori e icone per le prime 3 posizioni
      if (index === 0) {
        row.classList.add("gold");
      } else if (index === 1) {
        row.classList.add("silver");
      } else if (index === 2) {
        row.classList.add("bronze");
      }

      row.appendChild(userCell);
      row.appendChild(winsCell);
      row.appendChild(lossesCell);
      row.appendChild(winRateCell);

      leaderboardTableBody.appendChild(row);
      index++; // Incrementa l'indice
    });
  });
}

async function updateMatchesMatrix() {
  const matchesTableBody = document.querySelector("#matchesTable tbody");
  matchesTableBody.innerHTML = "";

  const battlesQuery = query(collection(db, "battles"));
  const battlesSnapshot = await getDocs(battlesQuery);

  const matches = {};

  battlesSnapshot.forEach((doc) => {
    const battle = doc.data();
    const player1 = battle.player1;
    const player2 = battle.player2;

    // Ordine canonico: il giocatore che viene prima alfabeticamente è sempre il primo
    const [first, second] =
      player1 < player2 ? [player1, player2] : [player2, player1];
    const key = `${first}-${second}`;

    if (!matches[key]) {
      // Salviamo l'ordine canonico nel match
      matches[key] = { player1: first, player2: second, wins: 0, losses: 0 };
    }

    // Estraiamo il punteggio dalla stringa (es. "1-0")
    const [score1, score2] = battle.score.split("-").map(Number);

    // Se l'ordine nella battaglia corrisponde all'ordine canonico,
    // aggiungiamo il punteggio così com'è, altrimenti invertiamo i valori.
    if (player1 === first) {
      matches[key].wins += score1;
      matches[key].losses += score2;
    } else {
      matches[key].wins += score2;
      matches[key].losses += score1;
    }
  });

  const sortedMatches = Object.values(matches).sort((a, b) => {
    if (a.player1 < b.player1) return -1;
    if (a.player1 > b.player1) return 1;
    if (a.player2 < b.player2) return -1;
    if (a.player2 > b.player2) return 1;
    return 0;
  });

  sortedMatches.forEach((match) => {
    const row = document.createElement("tr");

    const player1Cell = document.createElement("td");
    player1Cell.textContent = match.player1;

    const player2Cell = document.createElement("td");
    player2Cell.textContent = match.player2;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = `${match.wins}-${match.losses}`;

    const totalMatchesCell = document.createElement("td");
    // Total è la somma dei punteggi (wins + losses)
    totalMatchesCell.textContent = match.wins + match.losses;

    row.appendChild(player1Cell);
    row.appendChild(player2Cell);
    row.appendChild(scoreCell);
    row.appendChild(totalMatchesCell);

    matchesTableBody.appendChild(row);
  });

  // Aumenta la dimensione della matrice delle partite
  matchesTableBody.style.fontSize = "1.2em";
}



// Aggiorna la classifica e la matrice delle partite al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
  updateLeaderboard();
  updateMatchesMatrix();
});
