# Gérer la boutique depuis un Google Sheet

Le catalogue de la boutique (articles, prix, stock) ne vit **plus dans le
code** : il vit dans un Google Sheet. Le site vient lire ce Sheet à chaque
chargement de page, chaque commande validée décrémente automatiquement le
stock, et un email de confirmation part au client via une file d'attente.

Concrètement : pour ajouter un article, changer un prix ou faire un réassort,
**tu modifies le Sheet, et c'est tout**. Aucune ligne de code à toucher.

Tout passe par un petit script Google gratuit appelé « Apps Script ». Pas de
serveur à héberger, pas de coût.

**À savoir avant de commencer :** ce système enregistre la commande (qui,
quoi, combien), met le stock à jour et envoie une confirmation par email — il
**n'encaisse pas de paiement en ligne**. Le paiement se fait au local, en
espèces ou en CB. Si un jour tu veux un vrai paiement par carte, il faudra
brancher un service dédié (Stripe, HelloAsso…), c'est un autre chantier.

---

## Comment ça marche

```
                    ┌──────────────────────────┐
                    │   Google Sheet           │
                    │   ├── onglet Produits    │  ← tu édites ici
                    │   └── onglet Commandes   │  ← se remplit tout seul,
                    │                          │    avec suivi d'envoi mail
                    └───────────┬──────────────┘
                                │
                         Apps Script (/exec)
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
     GET : envoie le catalogue        POST : vérifie le stock,
     au site (au chargement)          le décrémente, enregistre
              │                       la commande, met l'email
              │                       en file d'attente
              ▼                                   ▲
     ┌────────────────────────────────────────────┴──┐
     │  boutique.html  (js/produits.js, js/commande.js)│
     └────────────────────────────────────────────────┘

     Déclencheur horaire ou menu ADCN
              │
              ▼
     traiterFileMails() → envoie les confirmations en attente
```

Deux points importants :

- **C'est le serveur qui a le dernier mot sur le stock.** Le site affiche le
  stock tel qu'il était au chargement de la page ; si deux personnes
  commandent le dernier article en même temps, la seconde reçoit un message
  « stock insuffisant » et son panier est ajusté automatiquement.
- **L'email de confirmation ne fait jamais échouer une commande.** À la
  validation, la commande est écrite dans le Sheet avec le statut
  `en attente`, et l'envoi est traité séparément. Si le quota Gmail est
  épuisé ou si l'envoi plante, le stock est déjà à jour et la commande est
  enregistrée — l'email sera simplement renvoyé plus tard.

---

## 1. Créer le Google Sheet

Va sur [sheets.google.com](https://sheets.google.com) et crée une feuille
vide, par exemple **Boutique ADCN**. Il lui faut **deux onglets**.

### Onglet `Produits`

Renomme le premier onglet en `Produits` (clic droit sur l'onglet en bas →
Renommer). Sur la ligne 1, mets ces en-têtes, **dans cet ordre exact** :

| ID | NOM | CATEGORIE | PRIX | STOCK |
|----|-----|-----------|------|-------|
| 1 | Pin's Renard classique | pin | 6 | 12 |
| 2 | Pin's Renard braise | pin | 6 | 0 |
| 41 | Gilet sans manches ADCN | accessoire | 42 | 5 |
| 51 | Insigne de Fal | faluche | 3.5 | 30 |

Règles à respecter :

- **ID** — un nombre **unique** par article. Il ne doit jamais changer : il
  identifie l'article dans les paniers déjà enregistrés et sert à retrouver
  son image (`img/produits/<ID>.png`).
- **NOM** — le nom affiché dans la boutique.
- **CATEGORIE** — exactement l'un de ces cinq mots :
  `pin`, `patch`, `accessoire`, `faluche`, `kds`.
  Ce sont les valeurs des boutons de filtre de `boutique.html`. Une catégorie
  mal orthographiée = article invisible dans les filtres.
- **PRIX** — en euros. **Le séparateur décimal doit être un point** (`3.5`,
  pas `3,5`). Si Google Sheets te reformate en `3,5` à l'affichage ce n'est
  pas grave, c'est la valeur numérique qui compte — mais ne mets pas le prix
  en texte.
- **STOCK** — la quantité disponible, un nombre entier.
  - `stock ≥ 1` → l'article est en vente, et on ne peut pas en commander plus
    qu'il n'y en a.
  - `stock = 0` → l'article s'affiche en « Épuisé », bouton désactivé.

Il n'y a **plus de colonne « en vente »** : le stock décide tout seul.

> Pour retirer un article de la vente sans perdre sa trace, mets simplement
> son stock à `0`. Ne supprime la ligne que si tu veux le faire disparaître
> complètement de la boutique.

### Onglet `Commandes`

Crée un second onglet nommé `Commandes`, avec ces en-têtes sur la ligne 1 :

| Horodatage | Prénom | Nom | Email | Détail | Total | Statut mail | Envoyé le | Erreur |
|---|---|---|---|---|---|---|---|---|

Tu n'écris jamais rien dedans : le script le remplit à chaque commande.

Les trois dernières colonnes servent au suivi des emails de confirmation :

- **Statut mail** — `en attente` (dès qu'une commande arrive), puis `envoyé`
  ou `erreur` après passage du mailer.
- **Envoyé le** — la date d'envoi effectif, une fois le mail parti.
- **Erreur** — le message d'erreur en cas d'échec (adresse invalide, quota
  Google épuisé…). Vide quand tout va bien.

---

## 2. Créer le script Apps Script

1. Dans le Sheet, menu **Extensions → Apps Script**.
2. Supprime le code par défaut et colle le contenu du script fourni avec le
   projet.
3. Renomme le projet (en haut à gauche) en **Boutique ADCN — script**.
4. Sauvegarde (icône disquette ou `Ctrl+S`).

**Ce que fait le script, en résumé :**

- `lireProduits()` lit l'onglet `Produits` et le transforme en liste
  exploitable par le site.
- `doGet()` répond au site quand il demande le catalogue.
- `doPost()` traite une commande : il vérifie **d'abord** que tout est en
  stock (et refuse la commande en entier si ce n'est pas le cas), puis
  décrémente les stocks, recalcule le total à partir des prix du Sheet, et
  ajoute une ligne dans `Commandes` avec le statut mail `en attente`.
  **L'email n'est pas envoyé à ce moment-là.**
- `traiterFileMails()` parcourt les commandes en attente, envoie chaque
  confirmation et met à jour le statut ligne par ligne. C'est cette fonction
  qu'on appelle depuis le menu ou depuis un déclencheur horaire.
- Le `LockService` de `doPost` met les commandes à la queue leu leu :
  impossible que deux personnes achètent le même dernier article. Le mailer,
  lui, utilise son propre verrou (via `PropertiesService`) pour ne pas
  bloquer les commandes pendant qu'il envoie sa file.
- Le total est **recalculé côté serveur** : même si quelqu'un bidouille le
  site dans son navigateur, le montant enregistré reste le bon.

---

## 3. Déployer le script en application web

1. Bouton **Déployer → Nouveau déploiement**.
2. Type : **Application web** (clique sur l'engrenage à gauche pour choisir le
   type si besoin).
3. Réglages :
   - **Exécuter en tant que** : Moi (ton compte Google)
   - **Qui a accès** : Tout le monde
4. Clique **Déployer**, puis **Autoriser l'accès**. Google va afficher un
   écran d'avertissement (« Cette application n'est pas validée ») : clique
   sur **Paramètres avancés → Accéder à Boutique ADCN — script**. C'est
   normal, c'est ton propre script.

   La première fois, Google demandera aussi l'autorisation d'envoyer des
   emails en ton nom (pour `MailApp`) — c'est nécessaire pour les
   confirmations de commande.
5. Une URL apparaît, du type :
   `https://script.google.com/macros/s/AKfycb.../exec`
   **Copie-la en entier.**

---

## 4. Brancher l'URL sur le site

Ouvre `js/produits.js` et remplace la valeur de cette ligne, tout en haut :

```javascript
const URL_API_BOUTIQUE = "https://script.google.com/macros/s/AKfycb.../exec";
```

C'est la **seule URL à renseigner** dans tout le projet : `js/commande.js`
réutilise la même constante.

---

## 5. Planifier l'envoi automatique des emails

Sans déclencheur, les emails ne partent que si tu cliques sur **ADCN → Envoyer
les confirmations en attente** dans le menu du Sheet. C'est très bien pour
démarrer, ça te permet de garder l'œil dessus. Une fois que la boutique
tourne, tu voudras que ça se fasse tout seul.

1. Dans l'éditeur Apps Script, clique sur l'icône **horloge** (déclencheurs)
   dans la barre latérale gauche.
2. **Ajouter un déclencheur**.
3. Réglages :
   - **Fonction** : `traiterFileMails`
   - **Déploiement** : Head
   - **Événement** : Piloté par le temps
   - **Type** : Minuteur horaire (ou aux 15 min si tu veux plus réactif)
4. Enregistrer.

Le script vérifie tout seul qu'un envoi précédent n'est pas encore en cours
grâce au verrou `mails_en_cours` — pas de risque qu'il se marche sur les
pieds.

---

## 6. Tester

1. Ouvre l'URL `/exec` directement dans ton navigateur. Tu dois voir ton
   catalogue en JSON, quelque chose comme :
   `{"statut":"ok","produits":[{"id":1,"nom":"Pin's Renard classique",...}]}`
   Si tu vois ça, la moitié du travail est validée.
2. Depuis l'éditeur Apps Script, lance la fonction **`testerEmail`** (menu
   Exécuter). Tu dois recevoir un mail « Test ADCN » sur l'adresse de l'asso —
   ça confirme que `MailApp` est autorisé.
3. Ouvre `boutique.html`. Les articles doivent s'afficher avec leur stock
   (« 12 en stock », « Plus que 2 ! », « Épuisé »).
4. Ajoute un article au panier plusieurs fois : le bouton doit passer à
   « Maximum » une fois le stock atteint.
5. Remplis le formulaire et valide. Vérifie que :
   - une ligne est apparue dans l'onglet `Commandes`, avec statut
     `en attente` ;
   - le stock a bien baissé dans l'onglet `Produits`.
6. Dans le Sheet, menu **ADCN → Envoyer les confirmations en attente**.
   Vérifie que :
   - l'email arrive chez le client ;
   - la ligne passe à `envoyé` avec la date remplie.

---

## 7. Au quotidien

### Suivre les commandes

L'onglet `Commandes` est ton tableau de bord. La colonne **Statut mail** te
dit d'un coup d'œil ce qui a été confirmé (`envoyé`), ce qui attend
(`en attente`) et ce qui a foiré (`erreur` — regarde alors la colonne
`Erreur` pour comprendre pourquoi).

Pour être notifié à chaque nouvelle commande, plutôt que de brancher une
copie mail (qui grillerait du quota), utilise **Outils → Règles de
notification** du Sheet : tu peux demander à Google de te prévenir dès qu'une
ligne est ajoutée.

### Ajouter un article

Une nouvelle ligne dans l'onglet `Produits`, avec un ID encore jamais utilisé.
Puis (facultatif) une image, voir ci-dessous. Recharge la page : il est là.

### Faire un réassort

Change le nombre dans la colonne `STOCK`. Rien d'autre.

### Changer un prix

Change la colonne `PRIX`. Les commandes déjà enregistrées gardent le montant
qui était en vigueur au moment de l'achat.

### Retirer un article de la vente

Mets son stock à `0`. Il reste visible mais marqué « Épuisé ». Pour le faire
disparaître totalement, supprime la ligne.

### Ajouter l'image d'un article

Crée un PNG nommé `<ID>.png` (l'ID de la colonne A) et dépose-le dans
`img/produits/`. Par exemple `img/produits/41.png` pour le gilet.
Si le fichier n'existe pas, la carte affiche un dégradé de couleur
correspondant à la catégorie — ce n'est pas une erreur.

### Relancer les mails en erreur

Une commande peut passer en `erreur` (adresse mal saisie, quota du jour
épuisé…). Le menu **ADCN → Relancer les mails en erreur** remet toutes ces
lignes en `en attente` : elles seront reprises au prochain passage du
mailer. Corrige d'abord la cause (par exemple demande la vraie adresse au
client), puis relance.

### Vérifier le quota email

Menu **ADCN → Quota email restant**. Un compte Gmail gratuit a environ 100
destinataires par jour ; un compte Google Workspace, 1 500. Ce compteur
descend à chaque email envoyé et se réinitialise chaque nuit.

---

## 8. Dépannage

**La boutique est vide, ou affiche un vieux catalogue**
Le site garde une copie de secours du dernier catalogue reçu (dans le
navigateur) pour rester consultable si Google est injoignable. Ouvre la
console du navigateur (`F12` → onglet Console) : un message
« Catalogue injoignable » confirme que l'appel au Sheet a échoué. Vérifie
alors l'URL dans `js/produits.js` et le point suivant.

**Erreur CORS, ou le site ne reçoit rien**
Neuf fois sur dix, le déploiement n'est pas réglé sur **« Qui a accès : Tout
le monde »**. Va dans **Déployer → Gérer les déploiements** et corrige.

**J'ai modifié le script Apps Script et rien ne change**
Sauvegarder ne suffit pas. Il faut faire **Déployer → Gérer les déploiements →
icône crayon → Version : Nouvelle version → Déployer**. L'URL `/exec` reste la
même, mais elle sert désormais le nouveau code. C'est l'erreur la plus
fréquente.

**Le menu ADCN n'apparaît pas dans le Sheet**
Il n'est ajouté qu'à l'ouverture du Sheet, par `onOpen`. Recharge la page du
Sheet (F5). Si ça ne suffit pas, lance `onOpen` manuellement depuis l'éditeur
Apps Script — après avoir donné l'autorisation, il apparaîtra à chaque
ouverture.

**Un article n'apparaît pas dans son filtre**
Vérifie l'orthographe de sa catégorie : elle doit être exactement `pin`,
`patch`, `accessoire`, `faluche` ou `kds` (le script passe tout en minuscules
et enlève les espaces, mais pas les fautes de frappe).

**Un prix s'affiche à 0 €**
La cellule `PRIX` contient probablement du texte, ou une virgule décimale
interprétée bizarrement. Sélectionne la colonne → **Format → Nombre → Nombre**.

**Le stock ne baisse pas après une commande**
Vérifie que les noms d'onglets sont exactement `Produits` et `Commandes`
(sensible à la casse et aux accents), et qu'ils correspondent aux constantes
`FEUILLE_PRODUITS` / `FEUILLE_COMMANDES` en haut du script.

**Les mails passent tous en `erreur` avec un message de quota**
Tu as épuisé les 100 envois quotidiens du compte Gmail gratuit. Le compteur
se remet à zéro chaque nuit (heure du Pacifique) — attends demain, puis
**ADCN → Relancer les mails en erreur**. Si ça devient récurrent, il faut
passer sur un service dédié (voir « Pour aller plus loin »).

**Une commande reste bloquée en `en attente`**
Vérifie que le déclencheur horaire existe bien (icône horloge dans
l'éditeur). En attendant, tu peux forcer l'envoi via
**ADCN → Envoyer les confirmations en attente**.

---

## 9. Limites à garder en tête

- **Le stock affiché n'est pas en temps réel** : il date du chargement de la
  page. C'est normal et voulu — le serveur tranche à la validation de la
  commande.
- **Le catalogue est public.** N'importe qui connaissant l'URL `/exec` peut
  lire l'onglet `Produits`. N'y mets donc pas d'informations internes (prix
  d'achat, fournisseur, marge…) : crée un onglet séparé pour ça, le script ne
  lit que `Produits`.
- **L'onglet `Commandes`, lui, n'est jamais exposé** : le script écrit dedans
  mais ne le renvoie jamais. Les coordonnées des acheteurs restent privées.
- **Ne réutilise jamais un ID** déjà attribué à un ancien article : quelqu'un
  peut avoir un panier enregistré dans son navigateur qui pointe dessus.
- **Les emails partent depuis une adresse Gmail** sans authentification
  SPF/DKIM d'un domaine à toi. Ils arrivent bien la plupart du temps mais
  peuvent atterrir en spam chez certains destinataires (Outlook, messageries
  d'université…). La popup de confirmation sur le site indique déjà tout le
  nécessaire — le mail est un rappel, pas la seule trace de la commande.

---

## Pour aller plus loin (facultatif)

### Alerte quand un stock devient bas

Dans `doPost`, à l'intérieur de la boucle de décrément, juste après le
`setValue` :

```javascript
      if (restant <= 2) {
        MailApp.sendEmail(
          EMAIL_ASSO,
          "Stock bas — " + valeurs[i][P_NOM - 1],
          "Il ne reste que " + restant + " exemplaire(s) de " + valeurs[i][P_NOM - 1] + "."
        );
      }
```

Attention, ça consomme du quota mail. Si tu manques déjà de marge pour les
confirmations client, remplace cet envoi par une simple mise en forme
conditionnelle sur la colonne `STOCK` du Sheet.

### Garder un historique des mouvements de stock

Crée un troisième onglet `Mouvements` et ajoute, dans la boucle de décrément :

```javascript
      classeur.getSheetByName("Mouvements").appendRow([
        new Date(), valeurs[i][P_ID - 1], valeurs[i][P_NOM - 1],
        -article.quantite, restant, donnees.email,
      ]);
```

Pratique pour retrouver ce qui s'est passé si un stock paraît incohérent.

### Passer sur un vrai service d'emails

Si tu dépasses régulièrement le quota Gmail, tu peux router
`envoyerConfirmation` vers un service dédié via `UrlFetchApp.fetch()`.
Quelques options gratuites en 2026 :

- **Brevo** (ex-Sendinblue) — 300 emails/jour gratuits, hébergement européen,
  le plus généreux actuellement.
- **Mailjet** — 6 000 emails/mois mais plafonné à 200/jour.
- **Resend** — bon rapport qualité/simplicité pour du transactionnel.

Les tarifs changent souvent, vérifie sur leur site avant de choisir. La clé
API se stocke dans `PropertiesService` (jamais en dur dans le code, et
surtout jamais côté navigateur).


# CODE.GS

Code à copier dans le Scrip App de Google Sheet

```js
/** @OnlyCurrentDoc */

const FEUILLE_PRODUITS  = "Produits";
const FEUILLE_COMMANDES = "Commandes";

// Colonnes de l'onglet Produits (1 = A)
// Prefixe P_ : ne PAS melanger avec les colonnes de l'onglet Commandes.
const P_ID = 1, P_NOM = 2, P_CATEGORIE = 3, P_PRIX = 4, P_STOCK = 5;

// Colonnes de l'onglet Commandes (1 = A)
// A..F = la commande elle-meme, G..I = le suivi de l'email de confirmation.
const C_DATE   = 1, C_PRENOM = 2, C_NOM    = 3, C_EMAIL  = 4,
      C_DETAIL = 5, C_TOTAL  = 6,
      C_STATUT = 7, C_ENVOYE = 8, C_ERREUR = 9;

const EN_ATTENTE = "en attente";
const ENVOYE     = "envoyé";
const ERREUR     = "erreur";

const EMAIL_ASSO  = "contact.adcn57@gmail.com";
const MARGE_QUOTA = 5;   // on ne descend jamais a zero : marge de securite

// Verrou propre au mailer. On n'utilise PAS LockService ici : ce verrou-la est
// partage avec doPost, et garder le verrou 4 minutes bloquerait toutes les
// commandes pendant l'envoi de la file.
const CLE_VERROU_MAILS   = "mails_en_cours";
const DUREE_VERROU_MAILS = 6 * 60 * 1000;  // au-dela, on considere le verrou perime


/* ============================================================
   UTILITAIRES
   ============================================================ */

function reponseJSON(objet) {
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}

function messageErreur(err) {
  if (err && err.message) return String(err.message);
  return String(err);
}

function lireProduits() {
  const valeurs = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(FEUILLE_PRODUITS).getDataRange().getValues();

  return valeurs.slice(1)                       // on saute la ligne d'en-tetes
    .filter((l) => l[P_ID - 1] !== "")
    .map((l) => ({
      id:        Number(l[P_ID - 1]),
      nom:       String(l[P_NOM - 1]),
      categorie: String(l[P_CATEGORIE - 1]).trim().toLowerCase(),
      prix:      Number(l[P_PRIX - 1]),
      stock:     Math.max(0, Number(l[P_STOCK - 1]) || 0),
    }));
}


/* ============================================================
   API APPELEE PAR LE SITE
   ============================================================ */

// Chargement du catalogue par la boutique
function doGet() {
  return reponseJSON({ statut: "ok", produits: lireProduits() });
}

// Validation d'une commande
function doPost(e) {
  let donnees;
  try {
    donnees = JSON.parse(e.postData.contents);
  } catch (err) {
    return reponseJSON({ statut: "erreur", message: "Requête illisible." });
  }

  // Garde-fou : sans tableau "articles", tout le reste plante.
  // Verifie que js/commande.js envoie bien :
  //   articles: Object.entries(panier).map(([id, quantite]) => ({ id: Number(id), quantite }))
  if (!Array.isArray(donnees.articles) || donnees.articles.length === 0) {
    return reponseJSON({ statut: "erreur", message: "Commande vide ou mal formée." });
  }
  if (!donnees.email) {
    return reponseJSON({ statut: "erreur", message: "Email manquant." });
  }

  const verrou = LockService.getScriptLock();
  try { verrou.waitLock(20000); }
  catch (err) {
    return reponseJSON({ statut: "erreur", message: "Trop de commandes en même temps, réessaie." });
  }

  try {
    const classeur = SpreadsheetApp.getActiveSpreadsheet();
    const feuille  = classeur.getSheetByName(FEUILLE_PRODUITS);
    const valeurs  = feuille.getDataRange().getValues();

    // index : id du produit -> numero de ligne dans le tableau
    const ligneDeId = {};
    for (let i = 1; i < valeurs.length; i++) ligneDeId[Number(valeurs[i][P_ID - 1])] = i;

    // 1) verification du stock AVANT d'ecrire quoi que ce soit
    const problemes = [];
    donnees.articles.forEach((article) => {
      const i = ligneDeId[Number(article.id)];
      if (i === undefined) { problemes.push("article inconnu #" + article.id); return; }
      const stock = Math.max(0, Number(valeurs[i][P_STOCK - 1]) || 0);
      if (article.quantite > stock) {
        problemes.push(valeurs[i][P_NOM - 1] + " (reste " + stock + ")");
      }
    });

    if (problemes.length) {
      return reponseJSON({
        statut: "stock_insuffisant",
        message: problemes.join(", "),
        produits: lireProduits(),
      });
    }

    // 2) decrement du stock + calcul du total cote serveur (non falsifiable)
    let total = 0;
    const detail = [];
    donnees.articles.forEach((article) => {
      const i = ligneDeId[Number(article.id)];
      const restant = Number(valeurs[i][P_STOCK - 1]) - article.quantite;
      feuille.getRange(i + 1, P_STOCK).setValue(restant);
      total += Number(valeurs[i][P_PRIX - 1]) * article.quantite;
      detail.push(valeurs[i][P_NOM - 1] + " x" + article.quantite);
    });

    // 3) enregistrement de la commande, avec l'email en file d'attente.
    //    L'envoi se fait plus tard via traiterFileMails() : une commande n'est
    //    jamais bloquee par un quota email epuise.
    classeur.getSheetByName(FEUILLE_COMMANDES).appendRow([
      new Date(), donnees.prenom, donnees.nom, donnees.email,
      detail.join(", "), total,
      EN_ATTENTE, "", "",
    ]);

    return reponseJSON({ statut: "ok", total: total, produits: lireProduits() });
  } finally {
    SpreadsheetApp.flush();   // force l'ecriture AVANT de liberer le verrou
    verrou.releaseLock();
  }
}


/* ============================================================
   EMAILS DE CONFIRMATION
   ============================================================ */

function envoyerConfirmation(donnees, detail, total) {
  if (!donnees.email) throw new Error("Email absent de la commande");

  const corps =
    "Salut " + donnees.prenom + " !\n\n" +
    "On a bien reçu ta commande :\n\n" +
    detail.map((l) => "  • " + l).join("\n") + "\n\n" +
    "Total à régler : " + total + " €\n\n" +
    "Passe au local pour payer (espèces ou CB) et récupérer tes articles.\n" +
    "Pour annuler ou modifier, réponds simplement à cet email.\n\n" +
    "À bientôt,\nL'ADCN 🦊";

  MailApp.sendEmail({
    to: donnees.email,
    subject: "Ta commande ADCN est enregistrée",
    body: corps,
    name: "ADCN",           // nom affiche a la place de l'adresse brute
    replyTo: EMAIL_ASSO,    // les reponses arrivent sur la boite de l'asso
    // pas de bcc : il consommerait une deuxieme unite de quota par commande.
    // Pour etre notifie des commandes : Outils > Regles de notification du Sheet.
  });
}

// Vide la file d'attente. Appelable a la main (menu ADCN) ou par declencheur horaire.
function traiterFileMails() {
  const props  = PropertiesService.getScriptProperties();
  const depuis = Number(props.getProperty(CLE_VERROU_MAILS) || 0);
  console.log("ok")
  if (Date.now() - depuis < DUREE_VERROU_MAILS) return "Un envoi est déjà en cours.";
  props.setProperty(CLE_VERROU_MAILS, String(Date.now()));

  try {
    const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FEUILLE_COMMANDES);
    const valeurs = feuille.getDataRange().getValues();

    let budget = MailApp.getRemainingDailyQuota() - MARGE_QUOTA;
    const debut = Date.now();
    let envoyes = 0, echecs = 0, restants = 0;

    for (let i = 1; i < valeurs.length; i++) {
      const ligne = valeurs[i];
      if (String(ligne[C_STATUT - 1]).trim().toLowerCase() !== EN_ATTENTE) continue;

      // garde-fous : quota epuise, ou on approche des 6 min d'execution max
      if (budget < 1 || Date.now() - debut > 4 * 60 * 1000) { restants++; continue; }

      try {
        envoyerConfirmation(
          { prenom: ligne[C_PRENOM - 1], email: ligne[C_EMAIL - 1] },
          String(ligne[C_DETAIL - 1]).split(/,\s*/),
          ligne[C_TOTAL - 1]
        );

        feuille.getRange(i + 1, C_STATUT).setValue(ENVOYE);
        feuille.getRange(i + 1, C_ENVOYE).setValue(new Date());
        feuille.getRange(i + 1, C_ERREUR).setValue("");
        budget--; envoyes++;
      } catch (err) {
        feuille.getRange(i + 1, C_STATUT).setValue(ERREUR);
        feuille.getRange(i + 1, C_ERREUR).setValue(messageErreur(err).slice(0, 250));
        echecs++;
      }

      // ecriture immediate : si le script est coupe ici, aucun mail ne part deux fois
      
      SpreadsheetApp.flush();

      console.log("Budget restant : " + budget + " (ligne " + (i + 1) + ")");
    }

    console.log("Quota Google après traitement : " + MailApp.getRemainingDailyQuota());

    return envoyes + " envoyé(s), " + echecs + " en erreur, " + restants + " encore en attente.";
  } finally {
    props.deleteProperty(CLE_VERROU_MAILS);
  }
}


/* ============================================================
   MENU DANS LE SHEET
   ============================================================ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("ADCN")
    .addItem("Envoyer les confirmations en attente", "menuEnvoyer")
    .addItem("Relancer les mails en erreur", "menuRelancer")
    .addItem("Quota email restant", "menuQuota")
    .addToUi();
}

function menuEnvoyer() {
  SpreadsheetApp.getUi().alert(traiterFileMails());
}

function menuQuota() {
  SpreadsheetApp.getUi().alert(
    "Destinataires restants aujourd'hui : " + MailApp.getRemainingDailyQuota()
  );
}

function menuRelancer() {
  const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FEUILLE_COMMANDES);
  const valeurs = feuille.getDataRange().getValues();
  let remis = 0;
  for (let i = 1; i < valeurs.length; i++) {
    if (String(valeurs[i][C_STATUT - 1]).trim().toLowerCase() === ERREUR) {
      feuille.getRange(i + 1, C_STATUT).setValue(EN_ATTENTE);
      remis++;
    }
  }
  SpreadsheetApp.getUi().alert(remis + " ligne(s) remise(s) en attente.");
}


/* ============================================================
   DIAGNOSTIC (a executer a la main depuis l'editeur)
   ============================================================ */

function testerEmail() {
  MailApp.sendEmail({
    to: EMAIL_ASSO,
    subject: "Test ADCN",
    body: "Si tu lis ça, MailApp fonctionne.",
  });
  console.log("Quota restant : " + MailApp.getRemainingDailyQuota());
}
function quota_de_mail() {
  console.log("Quota restant : " + MailApp.getRemainingDailyQuota());
}
```
