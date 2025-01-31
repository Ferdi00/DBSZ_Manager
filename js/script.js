const leftTableBody = document.querySelector("#leftTable tbody");
const rightTableBody = document.querySelector("#rightTable tbody");
const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prevTable");
const nextButton = document.getElementById("nextTable");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let characters = [];
let filteredCharacters = [];
let currentPage = 1;
const rowsPerPage = 20;
const rowsPerTable = rowsPerPage / 2;
const typeOrder = ["GIANT", "TOP", "GOOD", "MID", "WEAK", "NC"];

// 📌 Carica i dati dal JSON in modo sicuro
async function fetchCharacters() {
  try {
    const response = await fetch("../data/characters.json");
    if (!response.ok) throw new Error("Errore nel caricamento del JSON");
    characters = await response.json();
    filteredCharacters = [...characters]; // Inizializza i dati filtrati
    initializeTables();
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  }
}

// 📌 Funzione per inizializzare le tabelle
function initializeTables() {
  renderTableStructure();
  renderTableRows();
  renderPagination();
  updateMobileTableNavigation();
}

// 📌 Funzione per creare la struttura delle tabelle
function renderTableStructure() {
  leftTableBody.innerHTML = "";
  rightTableBody.innerHTML = "";

  for (let i = 0; i < rowsPerTable; i++) {
    const leftRow = document.createElement("tr");
    const rightRow = document.createElement("tr");

    for (let j = 0; j < 3; j++) {
      leftRow.appendChild(document.createElement("td"));
      rightRow.appendChild(document.createElement("td"));
    }

    leftTableBody.appendChild(leftRow);
    rightTableBody.appendChild(rightRow);
  }
}

// 📌 Funzione per aggiornare le righe delle tabelle
function renderTableRows() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredCharacters.length
  );
  const pageCharacters = filteredCharacters.slice(startIndex, endIndex);

  const leftCharacters = pageCharacters.slice(0, rowsPerTable);
  const rightCharacters = pageCharacters.slice(rowsPerTable);

  updateTableRows(leftTableBody, leftCharacters);
  updateTableRows(rightTableBody, rightCharacters);
  updateMobileTableNavigation();
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
    typeCell.textContent = character.type;
    typeCell.style.fontWeight = "bold";
    typeCell.style.color = getTypeColor(character.type);

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
  if (order === "type-asc") {
    filteredCharacters.sort(
      (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    );
  } else if (order === "type-desc") {
    filteredCharacters.sort(
      (a, b) => typeOrder.indexOf(b.type) - typeOrder.indexOf(a.type)
    );
  } else {
    filteredCharacters = [...characters];
  }
  currentPage = 1;
  renderTableRows();
  renderPagination();
}

// 📌 Eventi per la barra di ricerca e il selettore di ordinamento
searchInput.addEventListener("input", (e) => filterCharacters(e.target.value));
sortSelect.addEventListener("change", (e) => sortCharacters(e.target.value));

// 📌 Navigazione su mobile
function updateMobileTableNavigation() {
  const isMobile = window.innerWidth <= 768;
  const leftTable = document.getElementById("leftTable");
  const rightTable = document.getElementById("rightTable");

  if (isMobile) {
    leftTable.style.display = currentPage % 2 === 1 ? "table" : "none";
    rightTable.style.display = currentPage % 2 === 0 ? "table" : "none";
    prevButton.disabled = currentPage === 1;
    nextButton.disabled =
      currentPage === Math.ceil(filteredCharacters.length / rowsPerPage);
  } else {
    leftTable.style.display = "table";
    rightTable.style.display = "table";
  }
}

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

// 📌 Aggiorna la visibilità della tabella quando cambia la dimensione dello schermo
window.addEventListener("resize", updateMobileTableNavigation);

// 📌 Carica i dati inizialmente
document.addEventListener("DOMContentLoaded", fetchCharacters);
