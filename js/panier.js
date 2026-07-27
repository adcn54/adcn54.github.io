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

function ajouterAuPanier(idProduit) {
  const panier = chargerPanier();
  panier[idProduit] = (panier[idProduit] || 0) + 1;
  sauvegarderPanier(panier);
  mettreAJourAffichagePanier();
  ouvrirPanier();
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
        <span class="panier-ligne-prix">${produit.prix * quantite} €</span>
        <button class="panier-ligne-retirer" data-id="${id}" aria-label="Retirer un exemplaire de ${produit.nom}">−</button>
      `;
      liste.appendChild(ligne);
    });
  }

  total.textContent = calculerTotal(panier) + " €";
  compteur.textContent = compterArticles(panier);
  compteur.hidden = compterArticles(panier) === 0;
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

  // délégation d'événement : un seul écouteur pour tous les boutons "−" de la liste
  document.getElementById("panier-liste").addEventListener("click", (evt) => {
    const bouton = evt.target.closest("[data-id]");
    if (!bouton) return;
    retirerUniteDuPanier(bouton.dataset.id);
  });

  mettreAJourAffichagePanier();
}
