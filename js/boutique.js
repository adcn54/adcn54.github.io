// Affichage du catalogue : construit les cartes produit et gère les filtres
// par catégorie. Dépend de produits.js (PRODUITS) et de panier.js (ajouterAuPanier).
const afficher_le_stock = false; // si true, affiche le stock restant sur chaque carte produit

const NOMS_CATEGORIES = {
  pin: "Pin's",
  patch: "Patch",
  accessoire: "Accessoire",
  faluche: "Faluche",
  kds: "KDS",
  adhesion: "Adhésion",
};

// Couleur de la vignette produit, dérivée de l'id : pas besoin d'une vraie
// photo pour chaque article. Pour utiliser une vraie image plus tard, ajoute
// un champ "image" (une URL) sur le produit dans produits.js et adapte
// creerCarteProduit() ci-dessous pour l'utiliser à la place de ce dégradé.
function teinteProduit(produit) {
  const teintes = {"adhesion": "charbon", "pin": "braise", "patch": "ambre", "accessoire": "or", "faluche": "charbon", "kds": "bleu"};
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
    <div class="carte-produit-echantillon" data-teinte="${teinteProduit(produit)}"><img class="carte-produit-image" src="img/produits/${produit.id}.webp" alt="" loading="lazy" decoding="async" onerror="this.remove();"/></div>
    <span class="carte-produit-categorie">${NOMS_CATEGORIES[produit.categorie]}</span>
    <h3>${produit.nom}</h3>
    ${afficher_le_stock ? `<span class="carte-produit-stock"></span>` : ""}
    <div class="carte-produit-bas">
      <span class="carte-prix">${produit.prix} €</span>
      ${produit.stock <= 0
      ? `<span class="carte-produit-indisponible">Épuisé</span>`
      : produit.categorie === "adhesion"
        ? `<a class="bouton bouton-primaire bouton-petit" href="${LIEN_PAIEMENT_ADHESION}" target="_blank" rel="noopener">Payer</a>`
        : `<button class="bouton bouton-primaire bouton-petit" data-id="${produit.id}">Ajouter</button>`}
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
    if (produit.categorie === "adhesion") return;
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

function trierParNom(liste) {
  return [...liste].sort((a, b) =>
    a.nom.localeCompare(b.nom, "fr", { sensitivity: "base", numeric: true })
  );
}

function afficherProduits(liste) {
  const grille = document.getElementById("grille-boutique");
  grille.innerHTML = "";
  trierParNom(liste).forEach((produit) => grille.appendChild(creerCarteProduit(produit)));
  rafraichirEtatBoutons();
}

// Catégories retirées de la navigation normale (bouton de filtre + vue "Tout"),
// mais toujours accessibles via un lien direct : boutique.html#faluche
// ou boutique.html?item=faluche
const CATEGORIES_SECRETES = ["faluche", "adhesion"];

let categorieActive = "tout";

function filtrerParCategorie(categorie) {
  categorieActive = categorie;
  let liste;
  if (categorie === "tout") {
    // la vue "Tout" n'affiche jamais les catégories secrètes
    liste = PRODUITS.filter(
      (p) =>
        p.categorie === "adhesion" ||
        !CATEGORIES_SECRETES.includes(p.categorie)
    );
  } else {
    liste = PRODUITS.filter((p) => p.categorie === categorie);
  }
  afficherProduits(liste);
}

// Reconstruit la grille avec le catalogue à jour, en gardant le filtre en cours
function rafraichirBoutique() {
  filtrerParCategorie(categorieActive);
}

// Lit l'URL pour savoir si une catégorie doit être présélectionnée :
// boutique.html#pin ou boutique.html?item=pin → filtre "pin" actif au chargement
function categorieDepuisURL() {
  const params = new URLSearchParams(window.location.search);
  const brut = (window.location.hash.slice(1) || params.get("item") || "").toLowerCase();
  return Object.keys(NOMS_CATEGORIES).includes(brut) ? brut : null;
}

// Active visuellement le bon bouton de filtre puis applique le filtre
function selectionnerFiltre(categorie) {
  const bouton = document.querySelector(`.filtre-categorie[data-categorie="${categorie}"]`);
  document.querySelectorAll(".filtre-categorie").forEach((b) => b.classList.remove("est-actif"));
  if (bouton) {
    bouton.classList.add("est-actif");
    filtrerParCategorie(categorie);
  } else {
    document.querySelector('.filtre-categorie[data-categorie="tout"]').classList.add("est-actif");
    filtrerParCategorie("tout");
  }
}

// Si l'URL demande une catégorie secrète (ex: #faluche), on ajoute un bouton
// de filtre temporaire le temps de la visite, pour que ce ne soit pas "cassé"
function afficherFiltreSecretSiBesoin(categorie) {
  if (!CATEGORIES_SECRETES.includes(categorie)) return;
  const conteneur = document.querySelector(".filtres");
  if (conteneur.querySelector(`[data-categorie="${categorie}"]`)) return;

  const bouton = document.createElement("button");
  bouton.className = "filtre-categorie";
  bouton.dataset.categorie = categorie;
  bouton.textContent = NOMS_CATEGORIES[categorie];
  conteneur.appendChild(bouton);
}

// Délégation d'événement : un seul écouteur, qui marche aussi pour le
// bouton "Faluche" ajouté dynamiquement par afficherFiltreSecretSiBesoin()
function initFiltres() {
  document.querySelector(".filtres").addEventListener("click", (evt) => {
    const bouton = evt.target.closest(".filtre-categorie");
    if (!bouton) return;
    selectionnerFiltre(bouton.dataset.categorie);
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
  initFiltres();
  initAjoutPanier();

  const categorieDepart = categorieDepuisURL() || "tout";
  afficherFiltreSecretSiBesoin(categorieDepart);
  selectionnerFiltre(categorieDepart);

  // Permet aussi de changer de filtre en modifiant juste le #hash,
  // sans recharger la page (ex: quelqu'un colle un nouveau lien dans la barre d'adresse)
  window.addEventListener("hashchange", () => {
    const categorie = categorieDepuisURL() || "tout";
    afficherFiltreSecretSiBesoin(categorie);
    selectionnerFiltre(categorie);
  });
}
