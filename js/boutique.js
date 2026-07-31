// Affichage du catalogue : construit les cartes produit et gère les filtres
// par catégorie. Dépend de produits.js (PRODUITS) et de panier.js (ajouterAuPanier).
const afficher_le_stock = false; // si true, affiche le stock restant sur chaque carte produit

const NOMS_CATEGORIES = {
  pin: "Pin's",
  patch: "Patch",
  accessoire: "Accessoire",
  faluche: "Faluche",
  kds: "KDS",
};

// Couleur de la vignette produit, dérivée de l'id : pas besoin d'une vraie
// photo pour chaque article. Pour utiliser une vraie image plus tard, ajoute
// un champ "image" (une URL) sur le produit dans produits.js et adapte
// creerCarteProduit() ci-dessous pour l'utiliser à la place de ce dégradé.
function teinteProduit(produit) {
  const teintes = {"pin": "braise", "patch": "ambre", "accessoire": "or", "faluche": "charbon", "kds": "bleu"};
  return teintes[produit.categorie];
}

function texteStock(produit, dansPanier) {
  if (produit.stock <= 0) return "Épuisé";
  const restant = produit.stock - dansPanier;
  if (restant <= 0) return "Tout le stock est dans ton panier";
  if (restant <= 3) return `Plus que ${restant} !`;
  return `${restant} en stock`;
}

function creerCarteProduit(produit) {
  const carte = document.createElement("article");
  carte.className = "carte carte-produit";
  carte.dataset.id = produit.id; // sert à rafraichirEtatBoutons()
  carte.innerHTML = `
    <div class="carte-produit-echantillon" data-teinte="${teinteProduit(produit)}"><img class="carte-produit-image" src="img/produits/${produit.id}.png" onerror="this.style.display='none';"/></div>
    <span class="carte-produit-categorie">${NOMS_CATEGORIES[produit.categorie]}</span>
    <h3>${produit.nom}</h3>
    ${afficher_le_stock ? `<span class="carte-produit-stock"></span>` : ""}
    <div class="carte-produit-bas">
      <span class="carte-prix">${produit.prix} €</span>
      ${produit.stock > 0
        ? `<button class="bouton bouton-primaire bouton-petit" data-id="${produit.id}">Ajouter</button>`
        : `<span class="carte-produit-indisponible">Épuisé</span>`}
    </div>
  `;
  return carte;
}

// Met à jour le texte de stock + l'état des boutons sans tout reconstruire.
// Appelée par panier.js à chaque modification du panier.
function rafraichirEtatBoutons() {
  const panier = chargerPanier();
  document.querySelectorAll("#grille-boutique .carte-produit").forEach((carte) => {
    const produit = trouverProduit(carte.dataset.id);
    if (!produit) return;
    const dansPanier = panier[produit.id] || 0;
    
    if (afficher_le_stock) {
      carte.querySelector(".carte-produit-stock").textContent = texteStock(produit, dansPanier);
    }

    const bouton = carte.querySelector("button[data-id]");
    if (bouton) {
      bouton.disabled = dansPanier >= produit.stock;
      bouton.textContent = bouton.disabled ? "Maximum" : "Ajouter";
    }
  });
}

function afficherProduits(liste) {
  const grille = document.getElementById("grille-boutique");
  grille.innerHTML = "";
  liste.forEach((produit) => grille.appendChild(creerCarteProduit(produit)));
  rafraichirEtatBoutons();
}

let categorieActive = "tout";

function filtrerParCategorie(categorie) {
  categorieActive = categorie;
  const liste = categorie === "tout" ? PRODUITS : PRODUITS.filter((p) => p.categorie === categorie);
  afficherProduits(liste);
}

// Reconstruit la grille avec le catalogue à jour, en gardant le filtre en cours
function rafraichirBoutique() {
  filtrerParCategorie(categorieActive);
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
    const bouton = evt.target.closest("button[data-id]");
    if (!bouton) return;
    ajouterAuPanier(Number(bouton.dataset.id));
  });
}

function initBoutique() {
  afficherProduits(PRODUITS);
  initFiltres();
  initAjoutPanier();
}
