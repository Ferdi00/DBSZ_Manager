const player1TableBody = document.querySelector("#player1Table tbody");
const player2TableBody = document.querySelector("#player2Table tbody");
const generateButton = document.getElementById("generateButton");
const player1DLC = document.getElementById("player1DLC");
const player2DLC = document.getElementById("player2DLC");
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

// Funzione per generare personaggi casuali ordinati per importanza
function generateRandomCharacters() {
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

  // Mischia e seleziona 10 personaggi unici
  const shuffledCharacters = availableCharacters
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  // Ordina i personaggi per importanza (TOP → SCARSO)
  shuffledCharacters.sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  );

  // Dividi casualmente i 10 personaggi tra Player 1 e Player 2
  const player1Characters = shuffledCharacters.slice(0, 5);
  const player2Characters = shuffledCharacters.slice(5, 10);

  // Aggiorna le tabelle
  updateTable(player1TableBody, player1Characters);
  updateTable(player2TableBody, player2Characters);
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
      case "BUONO":
        typeCell.style.color = "green";
        break;
      case "MEDIO":
        typeCell.style.color = "orange";
        break;
      case "SCARSO":
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
