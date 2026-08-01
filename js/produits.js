// Catalogue de la boutique — synchronisé avec le Google Sheet via Apps Script.
// Le Sheet (onglet "Produits") fait foi : ID | NOM | CATEGORIE | PRIX | STOCK.
// Un produit est en vente si stock >= 1. Voir GUIDE-BOUTIQUE.md.

const URL_API_BOUTIQUE = "https://script.google.com/macros/s/AKfycbxLSFSZsnGdIb4LpI2NiPB2u4tFxvPAKUEWae8ElwsWxSlfexKgwWy9sN6OwCTLwosS/exec"; // ← ton URL /exec
const CLE_CACHE_PRODUITS = "adcn-produits-cache";

let PRODUITS = []; // rempli par chargerProduits(), avant tout affichage

// Nettoie ce qui vient du Sheet (une case vide ou un prix mal saisi ne doit pas casser la page)
function normaliserProduits(brut) {
  return (brut || [])
    .filter((p) => p && !Number.isNaN(Number(p.id)))
    .map((p) => ({
      id:        Number(p.id),
      nom:       String(p.nom || "").trim(),
      categorie: String(p.categorie || "").trim().toLowerCase(),
      prix:      Number(p.prix) || 0,
      stock:     Math.max(0, Math.floor(Number(p.stock) || 0)),
    }));
}

function appliquerProduits(brut) {
  PRODUITS = normaliserProduits(brut);
  try { localStorage.setItem(CLE_CACHE_PRODUITS, JSON.stringify(PRODUITS)); } catch (e) {}
  return PRODUITS;
}

async function chargerProduits() {
  try {
    // ?t=... : empêche le navigateur de servir une version en cache du catalogue
    const reponse = await fetch(`${URL_API_BOUTIQUE}?t=${Date.now()}`);
    const donnees = await reponse.json();
    return appliquerProduits(donnees.produits);
  } catch (erreur) {
    console.warn("Catalogue injoignable, on repart du cache local.", erreur);
    try { PRODUITS = JSON.parse(localStorage.getItem(CLE_CACHE_PRODUITS)) || []; }
    catch (e) { PRODUITS = []; }
    return PRODUITS;
  }
}