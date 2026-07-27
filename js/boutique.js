// Affichage du catalogue : construit les cartes produit et gère les filtres
// par catégorie. Dépend de produits.js (PRODUITS) et de panier.js (ajouterAuPanier).

const NOMS_CATEGORIES = {
  pin: "Pin's",
  patch: "Patch",
  accessoire: "Accessoire",
};

// Couleur de la vignette produit, dérivée de l'id : pas besoin d'une vraie
// photo pour chaque article. Pour utiliser une vraie image plus tard, ajoute
// un champ "image" (une URL) sur le produit dans produits.js et adapte
// creerCarteProduit() ci-dessous pour l'utiliser à la place de ce dégradé.
function teinteProduit(produit) {
  const teintes = {"pin": "braise", "patch": "ambre", "accessoire": "charbon"};
  return teintes[produit.categorie];
}

function creerCarteProduit(produit) {
  const carte = document.createElement("article");
  carte.className = "carte carte-produit";
  /ajoute l'image que si elle existe sinon on met un dégradé de couleur selon l'id du produit et cache l'image icon/
  carte.innerHTML = `
    <div class="carte-produit-echantillon" data-teinte="${teinteProduit(produit)}"><img class="carte-produit-image" src="img/${produit.id}.png" onerror="this.style.display='none';"/></div>
    <span class="carte-produit-categorie">${NOMS_CATEGORIES[produit.categorie]}</span>
    <h3>${produit.nom}</h3>
    <div class="carte-produit-bas">
      <span class="carte-prix">${produit.prix} €</span>
      <button class="bouton bouton-primaire bouton-petit" data-id="${produit.id}">Ajouter</button>
    </div>
  `;
  return carte;
}

function afficherProduits(liste) {
  const grille = document.getElementById("grille-boutique");
  grille.innerHTML = "";
  liste.forEach((produit) => grille.appendChild(creerCarteProduit(produit)));
}

function filtrerParCategorie(categorie) {
  const liste = categorie === "tout" ? PRODUITS : PRODUITS.filter((p) => p.categorie === categorie);
  afficherProduits(liste);
}

function initFiltres() {
  const boutons = document.querySelectorAll(".filtre-categorie");
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      boutons.forEach((b) => b.classList.remove("est-actif"));
      bouton.classList.add("est-actif");
      filtrerParCategorie(bouton.dataset.categorie);
    });
  });
}

function initAjoutPanier() {
  // délégation d'événement : un seul écouteur pour la cinquantaine de boutons "Ajouter"
  document.getElementById("grille-boutique").addEventListener("click", (evt) => {
    const bouton = evt.target.closest("[data-id]");
    if (!bouton) return;
    ajouterAuPanier(Number(bouton.dataset.id));
  });
}

function initBoutique() {
  afficherProduits(PRODUITS);
  initFiltres();
  initAjoutPanier();
}
