// Panier : stocké dans le localStorage du navigateur, donc il survit à un
// rechargement de page. Format : { "3": 2, "12": 1 } → id produit : quantité.
// Dépend de produits.js (le tableau PRODUITS).

const CLE_PANIER = "adcn-panier";

// --- lecture / écriture ---

function chargerPanier() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PANIER)) || {};
  } catch {
    return {};
  }
}

function sauvegarderPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
}

function trouverProduit(idProduit) {
  return PRODUITS.find((produit) => produit.id === Number(idProduit));
}

// --- actions ---

function stockDe(idProduit) {
  const produit = trouverProduit(idProduit);
  return produit ? produit.stock : 0;
}

function ajouterAuPanier(idProduit) {
  const produit = trouverProduit(idProduit);
  first = false
  if (produit.categorie != "adhesion" && Object.keys(chargerPanier()).length === 0 && !estDeclareAdherent()) {
    //Premier article ajouté n'est pas une adhésion et n'est pas encore enregistré comme adhérent
    ouvrirPopupAdhesion();
    first = true
  }

  const panier = chargerPanier();
  const dejaDansPanier = panier[idProduit] || 0;

  if (dejaDansPanier + 1 > stockDe(idProduit)) return; // on ne dépasse jamais le stock

  panier[idProduit] = dejaDansPanier + 1;
  sauvegarderPanier(panier);
  mettreAJourAffichagePanier();

  if (!first) {
    ouvrirPanier();
  }
}

function retirerUniteDuPanier(idProduit) {
  const panier = chargerPanier();
  if (!panier[idProduit]) return;
  panier[idProduit] -= 1;
  if (panier[idProduit] <= 0) delete panier[idProduit];
  sauvegarderPanier(panier);
  mettreAJourAffichagePanier();
}

function viderPanier() {
  sauvegarderPanier({});
  mettreAJourAffichagePanier();
}

// --- calculs ---

function calculerTotal(panier) {
  return Object.entries(panier).reduce((total, [id, quantite]) => {
    const produit = trouverProduit(id);
    return produit ? total + produit.prix * quantite : total;
  }, 0);
}

function compterArticles(panier) {
  return Object.values(panier).reduce((total, quantite) => total + quantite, 0);
}

// --- affichage du tiroir ---

function mettreAJourAffichagePanier() {
  const panier = chargerPanier();
  const liste = document.getElementById("panier-liste");
  const total = document.getElementById("panier-total");
  const compteur = document.getElementById("panier-compteur");
  const idsProduits = Object.keys(panier);

  liste.innerHTML = "";

  if (idsProduits.length === 0) {
    liste.innerHTML = `<p class="panier-vide">Ton panier est vide.</p>`;
  } else {
    idsProduits.forEach((id) => {
      const produit = trouverProduit(id);
      if (!produit) return;
      const quantite = panier[id];

      const ligne = document.createElement("div");
      ligne.className = "panier-ligne";
      ligne.innerHTML = `
        <span class="panier-ligne-nom">${produit.nom}</span>
        <span class="panier-ligne-quantite">× ${quantite}</span>
        <span class="panier-ligne-prix">${Math.round(produit.prix * quantite * 100) / 100} €</span>
        <button class="panier-ligne-bouton" data-action="retirer" data-id="${id}"
                aria-label="Retirer un exemplaire de ${produit.nom}">−</button>
        <button class="panier-ligne-bouton" data-action="ajouter" data-id="${id}"
                ${quantite >= produit.stock ? "disabled" : ""}
                aria-label="Ajouter un exemplaire de ${produit.nom}">+</button>
      `;
      liste.appendChild(ligne);
    });
  }

  total.textContent = Math.round(calculerTotal(panier) * 100) / 100 + " €";
  compteur.textContent = compterArticles(panier);
  compteur.hidden = compterArticles(panier) === 0;
  if (typeof rafraichirEtatBoutons === "function") rafraichirEtatBoutons();if (typeof rafraichirEtatBoutons === "function") rafraichirEtatBoutons();
}

function ouvrirPanier() {
  document.getElementById("panier").classList.add("est-ouvert");
  document.getElementById("panier-fond").classList.add("est-ouvert");
  document.body.style.overflow = "hidden";
}

function fermerPanier() {
  document.getElementById("panier").classList.remove("est-ouvert");
  document.getElementById("panier-fond").classList.remove("est-ouvert");
  document.body.style.overflow = "";
}



// --- initialisation ---

function initPanier() {
  document.getElementById("panier-bouton").addEventListener("click", ouvrirPanier);
  document.getElementById("panier-fermer").addEventListener("click", fermerPanier);
  document.getElementById("panier-fond").addEventListener("click", fermerPanier);

  // délégation d'événement : un seul écouteur pour tous les − et + de la liste
  document.getElementById("panier-liste").addEventListener("click", (evt) => {
    const bouton = evt.target.closest("button[data-id]");
    if (!bouton) return;
    if (bouton.dataset.action === "ajouter") ajouterAuPanier(bouton.dataset.id);
    else retirerUniteDuPanier(bouton.dataset.id);
  });
  ajusterPanierAuStock();
  mettreAJourAffichagePanier();
}

// Recale le panier sur le stock réel — à appeler après chaque chargement du catalogue
function ajusterPanierAuStock() {
  const panier = chargerPanier();
  let modifie = false;

  Object.keys(panier).forEach((id) => {
    const stock = stockDe(id);
    if (panier[id] > stock) {
      modifie = true;
      if (stock === 0) delete panier[id];
      else panier[id] = stock;
    }
  });

  if (modifie) sauvegarderPanier(panier);
  return modifie;
}