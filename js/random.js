const player1TableBody = document.querySelector("#player1Table tbody");
const player2TableBody = document.querySelector("#player2Table tbody");
const generateButton = document.getElementById("generateButton");
const player1DLC = document.getElementById("player1DLC");
const player2DLC = document.getElementById("player2DLC");
const presetSelect = document.getElementById("presetSelect"); // Aggiungi un selettore per i preset
let characters = [];

// Ordine personalizzato per il campo Type
const typeOrder = ["TOP", "BUONO", "MEDIO", "SCARSO"];

// Carica i dati dal file JSON
fetch("../data/characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
  })
  .catch((error) => console.error("Errore nel caricamento dei dati:", error));

// Funzione per generare personaggi in base al preset selezionato
function generateRandomCharacters() {
  const preset = presetSelect.value; // Ottieni il preset selezionato

  // Filtra i personaggi in base al toggle DLC
  const availableCharacters = characters.filter(
    (character) =>
      (player1DLC.checked || character.dlc === "no") &&
      (player2DLC.checked || character.dlc === "no")
  );

  if (availableCharacters.length < 10) {
    console.error("Non ci sono abbastanza personaggi disponibili!");
    return;
  }

  let player1Characters = [];
  let player2Characters = [];

  if (preset === "preset1") {
    // Preset 1:
    player1Characters = getCharactersByType(availableCharacters, [
      "WEAK",
      "GOOD",
      "MID",
      "TOP",
      "WEAK",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "WEAK",
      "GOOD",
      "MID",
      "TOP",
      "WEAK",
    ]);
  } else if (preset === "preset2") {
    // Preset 2: Tutti SCARSO
    player1Characters = getCharactersByType(availableCharacters, [
      "TOP",
      "TOP",
      "TOP",
      "TOP",
      "TOP",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "TOP",
      "TOP",
      "TOP",
      "TOP",
      "TOP",
    ]);
  } else if (preset === "preset3") {
    // Preset 2: Tutti SCARSO
    player1Characters = getCharactersByType(availableCharacters, [
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
    ]);
  } else if (preset === "preset4") {
    // Preset 2: Tutti SCARSO
    player1Characters = getCharactersByType(availableCharacters, [
      "MID",
      "MID",
      "MID",
      "MID",
      "MID",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "MID",
      "MID",
      "MID",
      "MID",
      "MID",
    ]);
  } else if (preset === "preset3") {
    // Preset 2: Tutti SCARSO
    player1Characters = getCharactersByType(availableCharacters, [
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
      "GOOD",
    ]);
  } else if (preset === "preset5") {
    // Preset 2: Tutti SCARSO
    player1Characters = getCharactersByType(availableCharacters, [
      "WEAK",
      "WEAK",
      "WEAK",
      "WEAK",
      "WEAK",
    ]);
    player2Characters = getCharactersByType(availableCharacters, [
      "WEAK",
      "WEAK",
      "WEAK",
      "WEAK",
      "WEAK",
    ]);
  } else if (preset === "preset6") {
    // Preset 3: Tutto casuale
    const shuffledCharacters = availableCharacters
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    player1Characters = shuffledCharacters.slice(0, 5);
    player2Characters = shuffledCharacters.slice(5, 10);
  }

  // Aggiorna le tabelle
  updateTable(player1TableBody, player1Characters);
  updateTable(player2TableBody, player2Characters);
}

// Funzione per ottenere personaggi in base ai tipi specificati
function getCharactersByType(availableCharacters, types) {
  const selectedCharacters = [];
  const usedCharacters = new Set(); // Per evitare duplicati

  types.forEach((type) => {
    // Filtra i personaggi disponibili per il tipo specificato
    const filteredCharacters = availableCharacters.filter(
      (character) => character.type === type && !usedCharacters.has(character.name)
    );

    if (filteredCharacters.length === 0) {
      console.error(`Non ci sono abbastanza personaggi di tipo ${type} disponibili!`);
      return;
    }

    // Seleziona un personaggio casuale tra quelli disponibili
    const randomCharacter =
      filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];

    if (randomCharacter) {
      selectedCharacters.push(randomCharacter);
      usedCharacters.add(randomCharacter.name); // Aggiungi il personaggio alla lista dei già selezionati
    }
  });

  return selectedCharacters;
}

// Funzione per aggiornare una tabella
function updateTable(tableBody, characterList) {
  tableBody.innerHTML = ""; // Svuota la tabella

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
    typeCell.textContent = character.type;
    typeCell.style.fontWeight = "bold";

    switch (character.type) {
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

    tableBody.appendChild(row);
  });
}

// Evento per il pulsante di generazione
generateButton.addEventListener("click", generateRandomCharacters);
