document.addEventListener("DOMContentLoaded", function () {
  // Imposta la data di scadenza del timer (due settimane da oggi)
  const countdownDate = new Date();
  countdownDate.setDate(countdownDate.getDate() + 14);

  // Aggiorna il timer ogni secondo
  const countdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Calcola giorni, ore, minuti e secondi
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostra il risultato nei rispettivi elementi
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

    // Se il conto alla rovescia è finito, mostra un messaggio
    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown").innerHTML = "Season 1 has started!";
    }
  }, 1000);
});
