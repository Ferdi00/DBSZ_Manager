const tableBody = document.querySelector("#table tbody");
const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prevTable");
const nextButton = document.getElementById("nextTable");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let characters = [];
let filteredCharacters = [];
let currentPage = 1;
const rowsPerPage = 10;
const typeOrder = ["GIANT", "TOP", "GOOD", "MID", "WEAK", "ULTRA-WEAK"];
const sortOptions = {
  DEFAULT: "default",
  TYPE_ASC: "type-asc",
  TYPE_DESC: "type-desc",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
};

// 📌 Carica i dati dal JSON in modo sicuro
async function fetchCharacters() {
  try {
    const response = await fetch("../data/characters.json");
    if (!response.ok) throw new Error("Errore nel caricamento del JSON");
    characters = await response.json();
    filteredCharacters = [...characters]; // Inizializza i dati filtrati
    initializeTable();
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  }
}

// 📌 Funzione per inizializzare la tabella
function initializeTable() {
  renderTableStructure();
  renderTableRows();
  renderPagination();
}

// 📌 Funzione per creare la struttura della tabella
function renderTableStructure() {
  tableBody.innerHTML = "";

  for (let i = 0; i < rowsPerPage; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 3; j++) {
      row.appendChild(document.createElement("td"));
    }

    tableBody.appendChild(row);
  }
}

// 📌 Funzione per aggiornare le righe della tabella
function renderTableRows() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredCharacters.length);
  const pageCharacters = filteredCharacters.slice(startIndex, endIndex);

  updateTableRows(tableBody, pageCharacters);
}

// 📌 Funzione per aggiornare una tabella
function updateTableRows(tableBody, tableCharacters) {
  tableBody.innerHTML = "";

  tableCharacters.forEach((character) => {
    const row = document.createElement("tr");
    row.classList.add("fade-in");

    const nameCell = document.createElement("td");
    nameCell.textContent = character.name;

    const imageCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = character.image_url;
    img.alt = character.name;
    img.style.width = "50px";
    imageCell.appendChild(img);

    const typeCell = document.createElement("td");
    typeCell.textContent = character.power_level;
    typeCell.style.fontWeight = "bold";
    typeCell.style.color = getTypeColor(character.power_level);

    row.appendChild(nameCell);
    row.appendChild(imageCell);
    row.appendChild(typeCell);
    tableBody.appendChild(row);
  });
}

// 📌 Funzione per ottenere il colore in base al tipo
function getTypeColor(type) {
  switch (type) {
    case "TOP":
      return "purple";
    case "GOOD":
      return "green";
    case "MID":
      return "orange";
    case "WEAK":
      return "red";
    case "GIANT":
      return "#35f0f3";
    default:
      return "white";
  }
}

// 📌 Funzione per la paginazione
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredCharacters.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === currentPage) button.classList.add("active");

    button.addEventListener("click", () => {
      currentPage = i;
      renderTableRows();
      renderPagination();
    });

    pagination.appendChild(button);
  }
}

// 📌 Funzione per filtrare i personaggi in base alla ricerca
function filterCharacters(searchTerm) {
  if (searchTerm.length < 3) {
    filteredCharacters = [...characters];
  } else {
    filteredCharacters = characters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  currentPage = 1;
  renderTableRows();
  renderPagination();
}

// 📌 Funzione per ordinare i personaggi in base al tipo
function sortCharacters(order) {
  switch (order) {
    case sortOptions.TYPE_ASC:
      filteredCharacters.sort(
        (a, b) =>
          typeOrder.indexOf(a.power_level) - typeOrder.indexOf(b.power_level)
      );
      break;

    case sortOptions.TYPE_DESC:
      filteredCharacters.sort(
        (a, b) =>
          typeOrder.indexOf(b.power_level) - typeOrder.indexOf(a.power_level)
      );
      break;

    case sortOptions.NAME_ASC:
      filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case sortOptions.NAME_DESC:
      filteredCharacters.sort((a, b) => b.name.localeCompare(a.name));
      break;

    default:
      filteredCharacters = [...characters];
  }

  currentPage = 1;
  renderTableRows();
  renderPagination();
}

// 📌 Eventi per la barra di ricerca e il selettore di ordinamento
searchInput.addEventListener("input", (e) => filterCharacters(e.target.value));
sortSelect.addEventListener("change", (e) => sortCharacters(e.target.value));

// 📌 Eventi per la navigazione su mobile
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTableRows();
    renderPagination();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredCharacters.length / rowsPerPage)) {
    currentPage++;
    renderTableRows();
    renderPagination();
  }
});

// 📌 Carica i dati inizialmente
document.addEventListener("DOMContentLoaded", fetchCharacters);
