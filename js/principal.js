// Point d'entrée — chargé en dernier, après chargement.js / navigation.js /
// formulaire-contact.js (voir l'ordre des balises <script> dans main.html).
// Se contente de lancer chaque brique une fois que la page est prête.

(async () => {
  initChargement();
  initNavigation();
  initFormulaireContact();
  initEvenements();

  await chargerProduits();
  initBoutiqueApercu();

  document.getElementById("annee").textContent = new Date().getFullYear();
})();