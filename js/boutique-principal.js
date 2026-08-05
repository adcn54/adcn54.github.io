// Point d'entrée de boutique.html. Le catalogue vient du Google Sheet :
// l'écran de chargement reste affiché tant qu'il n'est pas arrivé.
(async () => {
  initNavigation();

  const catalogue = chargerProduits();   // on lance le fetch tout de suite
  initChargement({ attendre: catalogue }); // l'écran attend cette promesse

  await catalogue;

  initPanier();
  initPopupAdhesion();
  initBoutique();
  initFormulaireCommande();
  initPopupRecap();
  document.getElementById("annee").textContent = new Date().getFullYear();
})();