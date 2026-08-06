// Validation de commande : envoie le panier + les coordonnées du client vers
// un Google Sheet, via un script Google Apps Script déployé en "Application Web".
//
// Marche à suivre complète : voir GUIDE-BOUTIQUE.md à la racine du projet.
// L'URL de l'API est définie une seule fois dans js/produits.js.

// Temps au bout duquel on abandonne l'envoi. Apps Script répond en général en
// 0,5 à 3 s ; au-delà de 15 s, c'est que quelque chose s'est mal passé.
const DELAI_MAX_COMMANDE = 15000;

/* ============================================================
   CLÉ D'IDEMPOTENCE
   Identifie UNE tentative de commande, pas un clic. Voir IDEMPOTENCE.md.

   Règle : on ne conserve la clé QUE tant qu'on ignore ce qui s'est passé
   côté serveur. Dès qu'il a répondu quoi que ce soit, l'incertitude est
   levée et la clé n'a plus de raison d'être.
   ============================================================ */

const CLE_IDEMPOTENCE = "adcn-cle-commande";

function genererCle() {
  // crypto.randomUUID n'existe qu'en contexte sécurisé (HTTPS ou localhost).
  // GitHub Pages est en HTTPS ; le repli sert aux tests en file://.
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "c" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function obtenirCleCommande() {
  let cle = null;
  // try/catch obligatoire : en navigation privée, localStorage peut lever.
  try { cle = localStorage.getItem(CLE_IDEMPOTENCE); } catch (e) {}

  if (!cle) {
    cle = genererCle();
    try { localStorage.setItem(CLE_IDEMPOTENCE, cle); } catch (e) {}
  }
  return cle;
}

function effacerCleCommande() {
  try { localStorage.removeItem(CLE_IDEMPOTENCE); } catch (e) {}
}

/* ============================================================
   APPEL RÉSEAU
   ============================================================ */

async function envoyerCommande(commande) {
  // Content-Type "text/plain" (plutôt que "application/json") pour éviter
  // qu'un navigateur envoie une requête de pré-vérification CORS que
  // Google Apps Script ne sait pas traiter.
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), DELAI_MAX_COMMANDE);

  try {
    const reponse = await fetch(URL_API_BOUTIQUE, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(commande),
      signal: controleur.signal,
    });
    // Apps Script renvoie une page HTML quand il plante : sans ce test,
    // l'erreur apparaîtrait sous la forme d'un échec de parsing JSON.
    if (!reponse.ok) throw new Error("HTTP " + reponse.status);
    return await reponse.json();
  } finally {
    clearTimeout(minuteur);
  }
}

/* ============================================================
   POPUP DE CONFIRMATION
   ============================================================ */

function recap_popup(total) {
  // On affiche le total calculé PAR LE SERVEUR (reponse.total), jamais celui
  // du panier local : c'est le serveur qui fait foi sur les prix.
  document.getElementById("popup-total").textContent = total + " €";
  document.getElementById("popup-payer").href = LIEN_PAIEMENT;
  document.getElementById("popup-recap").hidden = false;
}

function initPopupRecap() {
  const popup = document.getElementById("popup-recap");
  const boutonFermer = document.getElementById("popup-fermer");

  boutonFermer.addEventListener("click", () => {
    popup.hidden = true;
    fermerPanier();
  });

  // Échap ferme aussi la popup (cohérent avec la popup des événements)
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && !popup.hidden) {
      popup.hidden = true;
      fermerPanier();
    }
  });
}

/* ============================================================
   FORMULAIRE DE COMMANDE
   ============================================================ */

function construireArticles(panier) {
  return Object.keys(panier).map((id) => ({ id: Number(id), quantite: panier[id] }));
}

// Remet le panier et la boutique en phase avec le catalogue renvoyé par le
// serveur. Utilisé par les deux cas de refus (stock, article inconnu).
function resynchroniserApresRefus() {
  ajusterPanierAuStock();
  mettreAJourAffichagePanier();
  rafraichirBoutique();
}

function initFormulaireCommande() {
  const formulaire = document.getElementById("formulaire-commande");
  const note = document.getElementById("note-commande");

  formulaire.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const panier = chargerPanier();
    if (compterArticles(panier) === 0) {
      note.textContent = "Ton panier est vide.";
      return;
    }

    const commande = {
      // Récupérée, pas générée : si une tentative précédente a échoué sans
      // réponse, on renvoie LA MÊME clé et le serveur ne comptera pas deux fois.
      cleCommande: obtenirCleCommande(),
      prenom:  formulaire.prenom.value.trim(),
      nom:     formulaire.nom.value.trim(),
      email:   formulaire.email.value.trim(),
      articles: construireArticles(panier),
    };

    const boutonValider = formulaire.querySelector("button[type=submit]");
    boutonValider.disabled = true;
    note.textContent = "Envoi de la commande… Veuillez ne pas fermer la page ni cliquer plusieurs fois sur le bouton.";

    try {
      const reponse = await envoyerCommande(commande);

      // Le serveur a répondu : quoi qu'il ait dit, l'incertitude est levée.
      // Cet appel doit rester ICI, avant tout return ou throw plus bas.
      effacerCleCommande();

      // le serveur renvoie toujours le catalogue à jour : on en profite
      if (reponse.produits) appliquerProduits(reponse.produits);

      if (reponse.statut === "stock_insuffisant") {
        resynchroniserApresRefus();
        note.textContent = "Stock insuffisant pour : " + reponse.message +
                           ". Ton panier a été ajusté.";
        return;
      }
      if (reponse.statut === "article_inconnu") {
        resynchroniserApresRefus();
        note.textContent = "Un article de ton panier n'est plus disponible. " +
                           "Ton panier a été mis à jour.";
        return;
      }
      if (reponse.statut !== "ok") throw new Error(reponse.message || "réponse inattendue");

      note.textContent = "Commande envoyée — merci !";
      
      //Sauvegarde si achat adhésion
      if (chargerPanier()[ID_ADHESION] > 0) {
        memoriserAdherent();
      }

      viderPanier();
      rafraichirBoutique();
      formulaire.reset();
      recap_popup(reponse.total);
      
      

    } catch (erreur) {
      // ⚠️ ON N'EFFACE PAS LA CLÉ ICI.
      // Si le serveur n'a pas répondu, on ignore s'il a traité la commande.
      // Le prochain essai réutilisera la même clé et c'est lui qui tranchera.
      console.error("Échec de l'envoi de la commande :", erreur);
      note.textContent = "Une erreur est survenue. Réessaie — ta commande ne sera " +
                         "pas comptée deux fois. Si ça persiste, écris-nous à " +
                         "contact.adcn57@gmail.com"+
                         "PS : les commandes ne peuvent pas dépasser 20 articles.";
    } finally {
      boutonValider.disabled = false;
    }
  });
}
