// Validation de commande : envoie le panier + les coordonnées du client vers
// un Google Sheet, via un script Google Apps Script déployé en "Application Web".
//
// Marche à suivre complète : voir GUIDE-BOUTIQUE.md à la racine du projet.
// Une fois ton Apps Script déployé, colle son URL ci-dessous (elle se termine
// par /exec).



async function envoyerCommande(commande) {
  // Content-Type "text/plain" (plutôt que "application/json") pour éviter
  // qu'un navigateur envoie une requête de pré-vérification CORS que
  // Google Apps Script ne sait pas traiter.
  const reponse = await fetch(URL_API_BOUTIQUE, {
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

function construireArticles(panier) {
  return Object.keys(panier).map((id) => ({ id: Number(id), quantite: panier[id] }));
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
      articles: construireArticles(panier),
    };

    const boutonValider = formulaire.querySelector("button[type=submit]");
    boutonValider.disabled = true;
    note.textContent = "Envoi de la commande…";

    try {
      const reponse = await envoyerCommande(commande);

      // le serveur renvoie toujours le catalogue à jour : on en profite
      if (reponse.produits) appliquerProduits(reponse.produits);

      if (reponse.statut === "stock_insuffisant") {
        ajusterPanierAuStock();
        mettreAJourAffichagePanier();
        rafraichirBoutique();
        note.textContent = "Stock insuffisant pour : " + reponse.message + ". Ton panier a été ajusté.";
        return;
      }
      if (reponse.statut !== "ok") throw new Error(reponse.message || "réponse inattendue");

      note.textContent = "Commande envoyée — merci !";
      viderPanier();
      rafraichirBoutique();
      formulaire.reset();
      recap_popup();
    } catch (erreur) {
      note.textContent = "Une erreur est survenue. Réessaie, ou écris-nous à contact.adcn57@gmail.com.";
    } finally {
      boutonValider.disabled = false;
    }
  });
}
