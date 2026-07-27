// Validation de commande : envoie le panier + les coordonnées du client vers
// un Google Sheet, via un script Google Apps Script déployé en "Application Web".
//
// Marche à suivre complète : voir GUIDE-BOUTIQUE.md à la racine du projet.
// Une fois ton Apps Script déployé, colle son URL ci-dessous (elle se termine
// par /exec).
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbxQkk5HcqvbL1Sh0UigYtaKwPQBYTGqUPjKs6Cb3FEQK-xlRSpPHnIcduKn6Vk7aetc/exec";

function construireDetailCommande(panier) {
  return Object.keys(panier)
    .map((id) => {
      const produit = trouverProduit(id);
      return produit ? `${produit.nom} x${panier[id]}` : null;
    })
    .filter(Boolean)
    .join(", ");
}

async function envoyerCommande(commande) {
  // Content-Type "text/plain" (plutôt que "application/json") pour éviter
  // qu'un navigateur envoie une requête de pré-vérification CORS que
  // Google Apps Script ne sait pas traiter.
  const reponse = await fetch(URL_GOOGLE_SHEET, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(commande),
  });
  return reponse.json();
}

function recap_popup() {
  // Affiche un popup de confirmation de commande
  const popup = document.getElementById("popup-recap");
  popup.hidden = false;
}

function initPopupRecap() {
  const popup = document.getElementById("popup-recap");
  const boutonFermer = document.getElementById("popup-fermer");
  boutonFermer.addEventListener("click", () => {
    popup.hidden = true;
    fermerPanier();
  });
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
      prenom: formulaire.prenom.value.trim(),
      nom: formulaire.nom.value.trim(),
      email: formulaire.email.value.trim(),
      detail: construireDetailCommande(panier),
      total: calculerTotal(panier),
    };

    const boutonValider = formulaire.querySelector("button[type=submit]");
    boutonValider.disabled = true;
    note.textContent = "Envoi de la commande…";

    try {
      await envoyerCommande(commande);
      note.textContent = "Commande envoyée — merci ! On revient vite vers toi.";
      viderPanier();
      formulaire.reset();
      recap_popup()
    } catch (erreur) {
      note.textContent = "Une erreur est survenue. Réessaie, ou écris-nous à contact@adcn.fr.";
    } finally {
      boutonValider.disabled = false;
    }
  });
}
