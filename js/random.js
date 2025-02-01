const player1TableBody = document.querySelector("#player1Table tbody");
const player2TableBody = document.querySelector("#player2Table tbody");
const generateButton = document.getElementById("generateButton");
const dlcCheckbox = document.getElementById("dlcCheckbox");
const presetSelect = document.getElementById("presetSelect");
const modeSelection = document.querySelectorAll('input[name="gameMode"]');
const dlcToggle = document.getElementById("dlcToggle");
const player1TableContainer = document.getElementById("player1TableContainer");
const player2TableContainer = document.getElementById("player2TableContainer");
const tablesContainer = document.querySelector(".tables");
let characters = [];



// Carica i dati dal file JSON
fetch("../data/characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
  })
  .catch((error) => console.error("Errore nel caricamento dei dati:", error));

// Funzione per gestire la scelta della modalità di gioco
function handleModeChange() {
  const selectedMode = document.querySelector(
    'input[name="gameMode"]:checked'
  ).value;

  if (selectedMode === "local") {
    // Modalità Co-op locale
    dlcToggle.classList.add("hidden"); // Nascondi la spunta DLC
    player2TableContainer.classList.remove("hidden"); // Mostra la seconda tabella
    tablesContainer.classList.remove("single-table");
    tablesContainer.classList.add("double-tables");
  } else {
    // Modalità Multiplayer online
    dlcToggle.classList.remove("hidden"); // Mostra la spunta DLC
    player2TableContainer.classList.add("hidden"); // Nascondi la seconda tabella
    tablesContainer.classList.remove("double-tables");
    tablesContainer.classList.add("single-table");
  }
}

// Aggiungi event listener per la scelta della modalità
modeSelection.forEach((mode) => {
  mode.addEventListener("change", handleModeChange);
});

// Funzione per generare personaggi in base al preset selezionato
function generateRandomCharacters() {
  const preset = presetSelect.value;
  const selectedMode = document.querySelector(
    'input[name="gameMode"]:checked'
  ).value;

  // Filtra i personaggi in base alla spunta DLC (solo per multiplayer online)
  const availableCharacters = characters.filter(
    (character) =>
      selectedMode === "local" || dlcCheckbox.checked || character.dlc === "no"
  );

  if (availableCharacters.length < (selectedMode === "local" ? 10 : 5)) {
    console.error("Non ci sono abbastanza personaggi disponibili!");
    return;
  }

  let player1Characters = [];
  let player2Characters = [];
  const usedIds = new Set(); // Set per tenere traccia degli ID già usati

  if (preset === "preset1") {
    player1Characters = getCharactersByType(
      availableCharacters,
      ["WEAK", "GOOD", "MID", "TOP", "WEAK"],
      usedIds
    );
    player2Characters =
      selectedMode === "local"
        ? getCharactersByType(
            availableCharacters,
            ["WEAK", "GOOD", "MID", "TOP", "WEAK"],
            usedIds
          )
        : [];
  } else if (preset === "preset2") {
    player1Characters = getCharactersByType(
      availableCharacters,
      ["TOP", "TOP", "TOP", "TOP", "TOP"],
      usedIds
    );
    player2Characters =
      selectedMode === "local"
        ? getCharactersByType(
            availableCharacters,
            ["TOP", "TOP", "TOP", "TOP", "TOP"],
            usedIds
          )
        : [];
  } else if (preset === "preset3") {
    player1Characters = getCharactersByType(
      availableCharacters,
      ["GOOD", "GOOD", "GOOD", "GOOD", "GOOD"],
      usedIds
    );
    player2Characters =
      selectedMode === "local"
        ? getCharactersByType(
            availableCharacters,
            ["GOOD", "GOOD", "GOOD", "GOOD", "GOOD"],
            usedIds
          )
        : [];
  } else if (preset === "preset4") {
    player1Characters = getCharactersByType(
      availableCharacters,
      ["MID", "MID", "MID", "MID", "MID"],
      usedIds
    );
    player2Characters =
      selectedMode === "local"
        ? getCharactersByType(
            availableCharacters,
            ["MID", "MID", "MID", "MID", "MID"],
            usedIds
          )
        : [];
  } else if (preset === "preset5") {
    player1Characters = getCharactersByType(
      availableCharacters,
      ["WEAK", "WEAK", "WEAK", "WEAK", "WEAK"],
      usedIds
    );
    player2Characters =
      selectedMode === "local"
        ? getCharactersByType(
            availableCharacters,
            ["WEAK", "WEAK", "WEAK", "WEAK", "WEAK"],
            usedIds
          )
        : [];
  } else if (preset === "preset6") {
    const shuffledCharacters = availableCharacters
      .sort(() => 0.5 - Math.random())
      .slice(0, selectedMode === "local" ? 10 : 5);
    player1Characters = shuffledCharacters.slice(0, 5);
    player2Characters =
      selectedMode === "local" ? shuffledCharacters.slice(5, 10) : [];
  }

  // Aggiorna le tabelle
  updateTable(player1TableBody, player1Characters);
  if (selectedMode === "local") {
    updateTable(player2TableBody, player2Characters);
  }
}

// Funzione per ottenere personaggi in base ai tipi specificati
function getCharactersByType(availableCharacters, types, usedIds) {
  const selectedCharacters = [];
  const usedCharacters = new Set();

  types.forEach((type) => {
    const filteredCharacters = availableCharacters.filter(
      (character) =>
        character.type === type &&
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

// Imposta la modalità iniziale
handleModeChange();
