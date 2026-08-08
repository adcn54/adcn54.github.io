// Sauivegarde de la réponse est adhérent 
CLE_ADHERENT = "adcn-adherent";
SAISON_ADHESION = "2026-2027"; //<- A Mettre a jour tous les ANS !!!!

function estDeclareAdherent() {
  // try/catch : en navigation privée, localStorage peut lever une exception.
  try { return localStorage.getItem(CLE_ADHERENT) === SAISON_ADHESION; }
  catch (e) { return false; }
}

function memoriserAdherent() {
  try { localStorage.setItem(CLE_ADHERENT, SAISON_ADHESION); } catch (e) {}
}



// --- popup adhésion ---
function ouvrirPopupAdhesion() {
  document.getElementById("popup-adhesion").hidden = false;
}

/*
function ajouterAdhesionAuPanier() {
  const adhesion = trouverProduit(ID_ADHESION);
  if (!adhesion) return;
  const panier = chargerPanier();
  panier[adhesion.id] = 1;
  sauvegarderPanier(panier);
  mettreAJourAffichagePanier();
}


function initPopupAdhesion() {
  const popup = document.getElementById("popup-adhesion");

  document.getElementById("adhesion-oui").addEventListener("click", () => {
    memoriserAdherent();
    popup.hidden = true;
    ouvrirPanier();      // on enchaîne sur le panier, comme un ajout normal
  });

  document.getElementById("adhesion-non").addEventListener("click", () => {
    ajouterAdhesionAuPanier();
    popup.hidden = true;
    ouvrirPanier();
  });
}*/

function initPopupAdhesion() {
  const popup = document.getElementById("popup-adhesion");

  // Prix et lien pris sur le produit "adhesion" du catalogue (une seule fois,
  // le catalogue est déjà chargé quand initPopupAdhesion() est appelée).
  const adhesion = PRODUITS.find((produit) => produit.categorie === "adhesion");
  if (adhesion) document.getElementById("adhesion-prix").textContent = adhesion.prix + " €";
  document.getElementById("adhesion-non").href = LIEN_PAIEMENT_ADHESION;

  document.getElementById("adhesion-oui").addEventListener("click", () => {
    memoriserAdherent();
    popup.hidden = true;
    ouvrirPanier();      // on enchaîne sur le panier, comme un ajout normal
  });

  document.getElementById("adhesion-non").addEventListener("click", () => {
    popup.hidden = true;
  });
}