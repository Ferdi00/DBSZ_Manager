document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menuIcon");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarClose = document.getElementById("sidebarClose");

  // Apri il menu laterale
  menuIcon.addEventListener("click", function () {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  });

  // Chiudi il menu laterale
  overlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Chiudi il menu laterale con l'icona di chiusura
  sidebarClose.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
});
