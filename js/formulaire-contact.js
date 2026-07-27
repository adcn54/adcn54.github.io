// Formulaire de contact : pour l'instant juste un message de confirmation
// côté front. À remplacer par un vrai appel (fetch vers une API, service
// d'emails type Formspree, etc.) quand un backend existera.
// Expose initFormulaireContact(), appelée depuis principal.js.

function initFormulaireContact() {
  const formulaire = document.getElementById("formulaire-contact");
  const note = document.getElementById("note-formulaire");

  formulaire.addEventListener("submit", (evt) => {
    evt.preventDefault();
    note.textContent = "Message envoyé — merci, on revient vite vers toi.";
    formulaire.reset();
  });
}
