# Connecter la boutique à un Google Sheet

Le formulaire de commande (dans le panier de `boutique.html`) envoie chaque
commande vers un Google Sheet, via un petit script Google gratuit appelé
"Apps Script". Pas de serveur à héberger, pas de coût.

**Important à savoir avant de commencer :** ce formulaire collecte la
commande (qui, quoi, combien) — il n'encaisse pas de paiement en ligne. Pour
un site associatif qui gère la remise en main propre ou le virement, c'est
généralement suffisant. Si tu veux un vrai paiement par carte, il faudra
brancher un service dédié (Stripe, HelloAsso...) en plus, une autre étape.

## 1. Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et crée une feuille
   vide, par exemple nommée **Commandes ADCN**.
2. Sur la première ligne, ajoute ces en-têtes de colonnes :
   `Horodatage | Prénom | Nom | Email | Détail | Total`
3. Vérifie le nom de l'onglet en bas (par défaut `Feuille 1`) — tu en auras
   besoin à l'étape suivante.

## 2. Créer le script Apps Script

1. Dans le Sheet, menu **Extensions → Apps Script**.
2. Supprime le code par défaut et colle celui-ci :

```javascript
/** @OnlyCurrentDoc */

const NOM_FEUILLE = "Feuille 1"; // remplace par le nom réel de ton onglet

function doPost(e) {
  const donnees = JSON.parse(e.postData.contents);
  const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOM_FEUILLE);

  feuille.appendRow([
    new Date(),
    donnees.prenom,
    donnees.nom,
    donnees.email,
    donnees.detail,
    donnees.total,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ statut: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Renomme le projet (en haut à gauche) en quelque chose comme
   **Commandes ADCN — script**.
4. Sauvegarde (icône disquette ou `Ctrl+S`).

## 3. Déployer le script en application web

1. Bouton **Déployer → Nouveau déploiement**.
2. Type : **Application web**.
3. Réglages :
   - **Exécuter en tant que** : Moi (ton compte Google)
   - **Qui a accès** : Tout le monde
4. Clique **Déployer**, puis **Autoriser l'accès** (Google va demander de
   confirmer que ce script peut écrire dans ton Sheet — c'est normal,
   accepte).
5. Une URL apparaît, du type :
   `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`
   Copie-la en entier.

## 4. Brancher l'URL sur le site

Ouvre `js/commande.js` et remplace cette ligne :

```javascript
const URL_GOOGLE_SHEET = "COLLE_ICI_L_URL_DE_TON_APPS_SCRIPT";
```

par ton URL réelle, par exemple :

```javascript
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";
```

## 5. Tester

1. Ouvre `boutique.html`, ajoute un article au panier, remplis le formulaire
   et valide.
2. Vérifie que la ligne apparaît dans le Google Sheet.
3. Si ça ne marche pas :
   - Vérifie que `NOM_FEUILLE` dans Apps Script correspond exactement au nom
     de l'onglet (sensible à la casse et aux accents).
   - Vérifie que le déploiement est bien réglé sur "Tout le monde" a accès.
   - Si tu modifies le code Apps Script après déploiement, il faut faire
     **Déployer → Gérer les déploiements → modifier (icône crayon) → Nouvelle
     version** pour que les changements soient pris en compte — sauvegarder
     seul ne suffit pas.

## Pour aller plus loin (facultatif)

Envoyer un email de confirmation automatique au client : dans le code Apps
Script, avant le `return`, ajoute :

```javascript
MailApp.sendEmail(
  donnees.email,
  "Confirmation de ta commande ADCN",
  `Merci ${donnees.prenom} ! On a bien reçu ta commande : ${donnees.detail} (total : ${donnees.total} €).`
);
```
