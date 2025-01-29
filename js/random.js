const player1TableBody = document.querySelector("#player1Table tbody");
const player2TableBody = document.querySelector("#player2Table tbody");
const generateButton = document.getElementById("generateButton");
const player1DLC = document.getElementById("player1DLC");
const player2DLC = document.getElementById("player2DLC");
let characters = [];

// Carica i dati dal file JSON
fetch("../data/characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
  })
  .catch((error) => console.error("Errore nel caricamento dei dati:", error));

// Funzione per generare personaggi casuali
function generateRandomCharacters() {
  // Filtro dei personaggi in base al toggle DLC
  const filteredCharactersPlayer1 = player1DLC.checked
    ? characters
    : characters.filter((character) => character.dlc === "no");

  const filteredCharactersPlayer2 = player2DLC.checked
    ? characters
    : characters.filter((character) => character.dlc === "no");

  // Seleziona casualmente 5 personaggi per ciascun giocatore
  const shuffledPlayer1 = filteredCharactersPlayer1.sort(
    () => 0.5 - Math.random()
  );
  const shuffledPlayer2 = filteredCharactersPlayer2.sort(
    () => 0.5 - Math.random()
  );

  const player1Characters = shuffledPlayer1.slice(0, 5);
  const player2Characters = shuffledPlayer2.slice(0, 5);

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
