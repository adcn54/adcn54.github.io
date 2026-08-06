// Catalogue de la boutique — synchronisé avec le Google Sheet via Apps Script.
// Le Sheet (onglet "Produits") fait foi : ID | NOM | CATEGORIE | PRIX | STOCK.
// Un produit est en vente si stock >= 1. Voir GUIDE-BOUTIQUE.md.

const URL_API_BOUTIQUE = "https://adcn-boutique-proxy.contact-adcn57.workers.dev/"; // ← ton URL /exec
const CLE_CACHE_PRODUITS = "adcn-produits-cache";
const LIEN_PAIEMENT = "https://pots.lydia.me/collect/ventes-adcn-10693190/fr";

let PRODUITS = []; // rempli par chargerProduits(), avant tout affichage
 
// Doit correspondre à ID_ADHESION du script Apps Script.
const ID_ADHESION = 9999;

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

function lireCacheLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLE_CACHE_PRODUITS)) || [];
  } catch (e) {
    return [];
  }
}

const DELAI_MAX_CATALOGUE = 6000;   // ms

async function chargerProduits() {
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), DELAI_MAX_CATALOGUE);

  try {
    const reponse = await fetch(URL_API_BOUTIQUE, { signal: controleur.signal });
    if (!reponse.ok) throw new Error("HTTP " + reponse.status);
    const donnees = await reponse.json();
    SAISON_COURANTE = donnees.saison || null;     // pour le correctif B-03
    return appliquerProduits(donnees.produits);
  } catch (erreur) {
    console.warn("Catalogue injoignable, on repart du cache local.", erreur);
    return appliquerProduits(lireCacheLocal());
  } finally {
    clearTimeout(minuteur);
  }
}
