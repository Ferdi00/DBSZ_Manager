import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAr2hqejSjlFnLq9KBEqXG_EQZFMh588E",
  authDomain: "dbszmanager.firebaseapp.com",
  projectId: "dbszmanager",
  storageBucket: "dbszmanager.firebasestorage.app",
  messagingSenderId: "436504110426",
  appId: "1:436504110426:web:7a0d2b3e44ca5f3f00ff63",
  measurementId: "G-ZB6DECV6M6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const player1TableBody = document.querySelector("#player1Table tbody");
const player2TableBody = document.querySelector("#player2Table tbody");
const generateButton = document.getElementById("generateButton");
const dlcCheckbox = document.getElementById("dlcCheckbox");
const presetSelect = document.getElementById("presetSelect");
const customPresetInput = document.getElementById("customPreset");
const roomIdDisplay = document.getElementById("roomIdDisplay");
const roomIdText = document.getElementById("roomIdText");
let characters = [];

const createRoomButton = document.getElementById("createRoomButton");
const joinRoomButton = document.getElementById("joinRoomButton");
const roomPasswordInput = document.getElementById("roomPassword");
const joinRoomPasswordInput = document.getElementById("joinRoomPassword");

let roomId = null;

// Carica i dati dal file JSON
fetch("../data/characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
  })
  .catch((error) => console.error("Errore nel caricamento dei dati:", error));

// Funzione per creare una stanza
createRoomButton.addEventListener("click", async () => {
  const roomPassword = roomPasswordInput.value;
  if (!roomPassword) {
    alert("Please enter a room password.");
    return;
  }

  const roomRef = await addDoc(collection(db, "rooms"), {
    password: roomPassword,
    player1: [],
    player2: [],
  });

  roomId = roomRef.id;
  roomIdText.textContent = roomId;
  roomIdDisplay.style.display = "block";
  alert("Room created successfully. Room ID: " + roomId);

  // Ascolta le modifiche in tempo reale
  listenToRoomChanges(roomId);
});

// Funzione per partecipare a una stanza
joinRoomButton.addEventListener("click", async () => {
  const roomPassword = joinRoomPasswordInput.value;
  if (!roomPassword) {
    alert("Please enter a room password.");
    return;
  }

  const roomQuery = query(
    collection(db, "rooms"),
    where("password", "==", roomPassword)
  );
  const roomSnapshot = await getDocs(roomQuery);
  if (roomSnapshot.empty) {
    alert("Room not found.");
    return;
  }

  roomId = roomSnapshot.docs[0].id;
  roomIdText.textContent = roomId;
  roomIdDisplay.style.display = "block";
  alert("Joined room successfully. Room ID: " + roomId);

  // Ascolta le modifiche in tempo reale
  listenToRoomChanges(roomId);
});

// Funzione per ascoltare le modifiche in tempo reale
function listenToRoomChanges(roomId) {
  const roomRef = doc(db, "rooms", roomId);
  onSnapshot(roomRef, (doc) => {
    const data = doc.data();
    if (data) {
      updateTable(player1TableBody, data.player1);
      updateTable(player2TableBody, data.player2);
    }
  });
}

// Funzione per generare personaggi per entrambi i giocatori
function generateRandomCharacters() {
  const preset = presetSelect.value;
  const selectedMode = document.querySelector(
    'input[name="gameMode"]:checked'
  ).value;

  // Filtra i personaggi in base alla spunta DLC per ogni giocatore
  const player1DlcCheckbox = document.getElementById("dlcCheckboxPlayer1");
  const player2DlcCheckbox = document.getElementById("dlcCheckboxPlayer2");

  const availableCharactersPlayer1 = characters.filter(
    (character) =>
      selectedMode === "local" || player1DlcCheckbox.checked || character.dlc === "no"
  );

  const availableCharactersPlayer2 = characters.filter(
    (character) =>
      selectedMode === "local" || player2DlcCheckbox.checked || character.dlc === "no"
  );

  if (availableCharactersPlayer1.length < 5 || availableCharactersPlayer2.length < 5) {
    console.error("Non ci sono abbastanza personaggi disponibili!");
    return;
  }

  let player1Characters = [];
  let player2Characters = [];
  const usedIds = new Set(); // Set per tenere traccia degli ID già usati

  if (preset === "preset1") {
    player1Characters = getCharactersByType(
      availableCharactersPlayer1,
      ["WEAK", "GOOD", "MID", "TOP", "MID"],
      usedIds
    );
    player2Characters = getCharactersByType(
      availableCharactersPlayer2,
      ["WEAK", "GOOD", "MID", "TOP", "MID"],
      usedIds
    );
  } else if (preset === "preset2") {
    player1Characters = getCharactersByType(
      availableCharactersPlayer1,
      ["TOP", "GOOD", "WEAK", "MID", "GOOD"],
      usedIds
    );
    player2Characters = getCharactersByType(
      availableCharactersPlayer2,
      ["TOP", "GOOD", "WEAK", "MID", "GOOD"],
      usedIds
    );
  } else if (preset === "preset3") {
    player1Characters = getCharactersByType(
      availableCharactersPlayer1,
      ["TOP", "WEAK", "MID", "GOOD", "TOP"],
      usedIds
    );
    player2Characters = getCharactersByType(
      availableCharactersPlayer2,
      ["TOP", "WEAK", "MID", "GOOD", "TOP"],
      usedIds
    );
  } else if (preset === "preset4") {
    const shuffledCharactersPlayer1 = availableCharactersPlayer1
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    const shuffledCharactersPlayer2 = availableCharactersPlayer2
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    player1Characters = shuffledCharactersPlayer1;
    player2Characters = shuffledCharactersPlayer2;
  } else if (preset === "custom") {
    const customPreset = customPresetInput.value.split(",");
    player1Characters = getCharactersByType(
      availableCharactersPlayer1,
      customPreset,
      usedIds
    );
    player2Characters = getCharactersByType(
      availableCharactersPlayer2,
      customPreset,
      usedIds
    );
  }

  // Aggiorna le tabelle
  updateTable(player1TableBody, player1Characters);
  updateTable(player2TableBody, player2Characters);

  // Sincronizza i dati con Firestore se in modalità online
  if (selectedMode === "online" && roomId) {
    const roomRef = doc(db, "rooms", roomId);
    updateDoc(roomRef, {
      player1: player1Characters,
      player2: player2Characters,
    });
  }
}

// Funzione per ottenere personaggi in base ai tipi specificati
function getCharactersByType(availableCharacters, types, usedIds) {
  const selectedCharacters = [];
  const usedCharacters = new Set();

  types.forEach((type) => {
    const filteredCharacters = availableCharacters.filter(
      (character) =>
        character.power_level === type &&
        !usedCharacters.has(character.name) &&
        !usedIds.has(character.id) // Escludi personaggi con ID già usati
    );

    if (filteredCharacters.length === 0) {
      console.error(
        `Non ci sono abbastanza personaggi di tipo ${type} disponibili!`
      );
      return;
    }

    const randomCharacter =
      filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];
    if (randomCharacter) {
      selectedCharacters.push(randomCharacter);
      usedCharacters.add(randomCharacter.name);
      usedIds.add(randomCharacter.id); // Aggiungi l'ID alla lista degli ID usati
    }
  });

  return selectedCharacters;
}

// Funzione per aggiornare una tabella
function updateTable(tableBody, characterList) {
  tableBody.innerHTML = "";

  characterList.forEach((character) => {
    const row = document.createElement("tr");
    row.classList.add("fade-in");

    const nameCell = document.createElement("td");
    nameCell.textContent = character.name;

    const imageCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = character.image_url;
    img.alt = character.name;
    imageCell.appendChild(img);

    const typeCell = document.createElement("td");
    const positionCell = document.createElement("td");
    typeCell.textContent = character.power_level;
    positionCell.textContent = character.position;
    typeCell.style.fontWeight = "bold";

    switch (character.power_level) {
      case "TOP":
        typeCell.style.color = "purple";
        break;
      case "GOOD":
        typeCell.style.color = "green";
        break;
      case "MID":
        typeCell.style.color = "orange";
        break;
      case "WEAK":
        typeCell.style.color = "red";
        break;
      default:
        typeCell.style.color = "white";
    }

    row.appendChild(nameCell);
    row.appendChild(imageCell);
    row.appendChild(typeCell);
    row.appendChild(positionCell);

    tableBody.appendChild(row);
  });
}

// Evento per il pulsante di generazione
generateButton.addEventListener("click", generateRandomCharacters);
