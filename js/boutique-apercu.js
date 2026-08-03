// Aperçu de la boutique dans main.html : affiche les 3 premiers articles du
// catalogue (mêmes cartes que boutique.html) suivis du bouton "Voir toute la
// boutique". Dépend de produits.js (PRODUITS).
// Pas de panier ici : chaque carte renvoie simplement vers boutique.html.

const NOMS_CATEGORIES_APERCU = {
  pin: "Pin's",
  patch: "Patch",
  accessoire: "Accessoire",
  faluche: "Faluche",
  kds: "KDS",
};

function teinteProduitApercu(produit) {
  const teintes = { pin: "braise", patch: "ambre", accessoire: "or", faluche: "charbon", kds: "bleu" };
  return teintes[produit.categorie];
}

function creerCarteProduitApercu(produit) {
  const carte = document.createElement("a");
  carte.className = "carte carte-produit";
  carte.href = "boutique.html";
  carte.innerHTML = `
    <div class="carte-produit-echantillon" data-teinte="${teinteProduitApercu(produit)}"><img class="carte-produit-image" src="img/produits/${produit.id}.png" onerror="this.style.display='none';"/></div>
    <span class="carte-produit-categorie">${NOMS_CATEGORIES_APERCU[produit.categorie]}</span>
    <h3>${produit.nom}</h3>
    <div class="carte-produit-bas">
      <span class="carte-prix">${produit.prix} €</span>
    </div>
  `;
  return carte;
}

function initBoutiqueApercu() {
  const grille = document.getElementById("grille-boutique-apercu");
  if (!grille) return;

  //Récup le nb max de cartes qui s'affiche par ligne (selon la largeur de l'écran) pour n'afficher que les cartes visibles
  const nbCartesLigne = getComputedStyle(grille).gridTemplateColumns.split(" ").length;
  PRODUITS.filter((p) => p.stock > 0)
    .filter((p) => p.categorie !== "faluche") // on ne veut pas afficher les faluche dans l'aperçu
    .slice(0, nbCartesLigne)
    .forEach((produit) => grille.appendChild(creerCarteProduitApercu(produit)));
}
