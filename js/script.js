const leftTableBody = document.querySelector("#leftTable tbody");
const rightTableBody = document.querySelector("#rightTable tbody");
const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prevTable");
const nextButton = document.getElementById("nextTable");

let characters = [];
let currentPage = 1;
const rowsPerPage = 20;
const rowsPerTable = rowsPerPage / 2; // Ogni tabella ha metà righe
const typeOrder = ["GIANT","TOP", "GOOD", "MID", "WEAK", "NC"]; // Ordine personalizzato per Type

// Carica i dati dal JSON
fetch("../data/characters.json")
  .then((response) => response.json())
  .then((data) => {
    characters = data;
    renderTableStructure();
    renderTableRows();
    renderPagination();
    updateMobileTableNavigation();
  })
  .catch((error) => console.error("Errore nel caricamento dei dati:", error));

// Funzione per creare solo la struttura delle tabelle
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

// Funzione per aggiornare solo le righe visibili delle tabelle
function renderTableRows() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, characters.length);
  const pageCharacters = characters.slice(startIndex, endIndex);

  const leftCharacters = pageCharacters.slice(0, rowsPerTable);
  const rightCharacters = pageCharacters.slice(rowsPerTable);

  updateTableRows(leftTableBody, leftCharacters);
  updateTableRows(rightTableBody, rightCharacters);
  updateMobileTableNavigation();
}

// Funzione per aggiornare una singola tabella
function updateTableRows(tableBody, tableCharacters) {
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row, index) => {
    const cells = row.children;

    if (index < tableCharacters.length) {
      const character = tableCharacters[index];

      cells[0].textContent = character.name;

      const img = document.createElement("img");
      img.src = character.image_url;
      img.alt = character.name;
      img.style.width = "50px";
      cells[1].innerHTML = "";
      cells[1].appendChild(img);

      cells[2].textContent = character.type;
      cells[2].style.fontWeight = "bold";

      switch (character.type) {
        case "TOP":
          cells[2].style.color = "purple";
          break;
        case "GOOD":
          cells[2].style.color = "green";
          break;
        case "MID":
          cells[2].style.color = "orange";
          break;
        case "WEAK":
          cells[2].style.color = "red";
          break;
        case "GIANT":
          cells[2].style.color = "#35f0f3";
          break;
        default:
          cells[2].style.color = "white";
      }

      row.style.opacity = "0";
      row.style.transform = "translateY(10px)";
      setTimeout(() => {
        row.style.transition = "opacity 0.4s, transform 0.4s";
        row.style.opacity = "1";
        row.style.transform = "translateY(0)";
      }, 50);
    } else {
      cells[0].textContent = "";
      cells[1].innerHTML = "";
      cells[2].textContent = "";
    }
  });
}

// Funzione per generare la paginazione
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(characters.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      renderTableRows();
      renderPagination();
    });

    pagination.appendChild(button);
  }
}

// Funzione per ordinare la tabella per `type`
function sortTableByType() {
  characters.sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  );
  currentPage = 1;
  renderTableRows();
  renderPagination();
}

// **📱 Navigazione tra le pagine su mobile**
function updateMobileTableNavigation() {
  const isMobile = window.innerWidth <= 768;
  const leftTable = document.getElementById("leftTable");
  const rightTable = document.getElementById("rightTable");

  if (isMobile) {
    leftTable.style.display = currentPage % 2 === 1 ? "table" : "none";
    rightTable.style.display = currentPage % 2 === 0 ? "table" : "none";
    prevButton.disabled = currentPage === 1;
    nextButton.disabled =
      currentPage === Math.ceil(characters.length / rowsPerPage);
  } else {
    leftTable.style.display = "table";
    rightTable.style.display = "table";
  }
}

// Evento per la navigazione su mobile (cambia pagina intera)
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTableRows();
    renderPagination();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < Math.ceil(characters.length / rowsPerPage)) {
    currentPage++;
    renderTableRows();
    renderPagination();
  }
});

// Aggiorna la visibilità della tabella quando cambia la dimensione dello schermo
window.addEventListener("resize", updateMobileTableNavigation);
