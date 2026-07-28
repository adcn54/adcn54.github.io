// Catalogue de la boutique.
// Pour AJOUTER un article : ajoute une ligne dans le tableau (garde un id unique).
// Pour EN RETIRER un : supprime sa ligne.
// categorie doit être exactement : "pin", "patch", "accessoire" ou "faluche"
// rajoute un etat "en_vente" : true ou false pour savoir si l'article est disponible à la vente (true) ou non (false).
// (ce sont les valeurs utilisées par les boutons de filtre dans boutique.html).


/*
COMMENT REMPLIR LE TABLEAU PRODUITS : Il faut ajouter la ligne suivante pour le produit concernés

{ id: <NUMERO_UNIQUE>,  nom: "<NOM>", categorie: "<pin/patch/accessoire/faluche/kds>", prix: <PRIX>, en_vente: <true/false> },

- id : un numéro unique pour chaque produit (il sert à identifier le produit dans le panier et dans la commande). Il est utilisé pour générer le nom de l'image du produit (img/produits/<id>.png).
- nom : le nom du produit tel qu'il sera affiché dans la boutique.
- categorie : la catégorie du produit (pin, patch, accessoire, faluche ou kds). Elle sert à filtrer les produits dans la boutique.
- prix : le prix du produit en euros (nombre, les virgules sont des ".").
- en_vente : true si le produit est disponible à la vente, false si on ne peut plus l'acheter (c'est cool pour garder une trace)

*/

/*
COMMENT METTRE UNE IMAGE POUR UN PRODUIT : 
il faut créer un fichier image au format PNG, nommé <id>.png (où <id> est l'id du produit) et le placer dans le dossier img/produits/. Si l'image n'existe pas, la boutique affichera un dégradé de couleur selon la catégorie du produit.
*/

const PRODUITS = [

  // --- Pin's ---
  
  { id: 1,  nom: "Pin's Renard classique",        categorie: "pin", prix: 6, en_vente: true },
  { id: 2,  nom: "Pin's Renard braise",           categorie: "pin", prix: 6, en_vente: false },
  { id: 3,  nom: "Pin's Renard ambré",            categorie: "pin", prix: 6, en_vente: true },
  { id: 4,  nom: "Pin's Silhouette renard",       categorie: "pin", prix: 5, en_vente: true },
  { id: 5,  nom: "Pin's Museau renard",           categorie: "pin", prix: 5, en_vente: true },
  { id: 6,  nom: "Pin's Renard endormi",          categorie: "pin", prix: 6, en_vente: true },
  { id: 7,  nom: "Pin's Renard curieux",          categorie: "pin", prix: 6, en_vente: true },
  { id: 8,  nom: "Pin's Renard bondissant",       categorie: "pin", prix: 7, en_vente: true },
  { id: 9,  nom: "Pin's Tête de renard",          categorie: "pin", prix: 6, en_vente: true },
  { id: 10, nom: "Pin's Renard minimaliste",      categorie: "pin", prix: 5, en_vente: true },
  { id: 11, nom: "Pin's Blason ADCN",             categorie: "pin", prix: 6, en_vente: true },
  { id: 12, nom: "Pin's Écusson ADCN",            categorie: "pin", prix: 6, en_vente: true },
  { id: 13, nom: "Pin's Lettres ADCN",            categorie: "pin", prix: 5, en_vente: true },
  { id: 14, nom: "Pin's Flamme",                  categorie: "pin", prix: 6, en_vente: true },
  { id: 15, nom: "Pin's Braise",                  categorie: "pin", prix: 6, en_vente: true },
  { id: 16, nom: "Pin's Étincelle",               categorie: "pin", prix: 6, en_vente: true },
  { id: 17, nom: "Pin's Forêt",                   categorie: "pin", prix: 6, en_vente: true },
  { id: 18, nom: "Pin's Feuille d'automne",       categorie: "pin", prix: 6, en_vente: true },
  { id: 19, nom: "Pin's Pleine lune",             categorie: "pin", prix: 6, en_vente: true },
  { id: 20, nom: "Pin's Étoile du soir",          categorie: "pin", prix: 6, en_vente: true },
  { id: 21, nom: "Pin's Empreinte de renard",     categorie: "pin", prix: 5, en_vente: true },
  { id: 22, nom: "Pin's Queue de renard",         categorie: "pin", prix: 6, en_vente: true },
  { id: 23, nom: "Pin's Oreilles de renard",      categorie: "pin", prix: 5, en_vente: true },
  { id: 24, nom: "Pin's Renard géométrique",      categorie: "pin", prix: 7, en_vente: true },
  { id: 25, nom: "Pin's Renard origami",          categorie: "pin", prix: 7, en_vente: true },
  { id: 26, nom: "Pin's Édition hiver",           categorie: "pin", prix: 8, en_vente: true },
  { id: 27, nom: "Pin's Édition été",             categorie: "pin", prix: 8, en_vente: true },
  { id: 28, nom: "Pin's Édition limitée or",      categorie: "pin", prix: 9, en_vente: true },
  { id: 29, nom: "Pin's Édition limitée argent",  categorie: "pin", prix: 9, en_vente: true },
  { id: 30, nom: "Pin's Renard et lune",          categorie: "pin", prix: 7, en_vente: true },

  // --- Patchs ---
  { id: 31, nom: "Patch Renard brodé",            categorie: "patch", prix: 7, en_vente: true },
  { id: 32, nom: "Patch Blason ADCN",             categorie: "patch", prix: 7, en_vente: true },
  { id: 33, nom: "Patch Lettres ADCN",            categorie: "patch", prix: 6, en_vente: true },
  { id: 34, nom: "Patch Flamme brodée",           categorie: "patch", prix: 7, en_vente: true },
  { id: 35, nom: "Patch Forêt brodée",            categorie: "patch", prix: 8, en_vente: true },
  { id: 36, nom: "Patch Renard courant",          categorie: "patch", prix: 7, en_vente: true },
  { id: 37, nom: "Patch Écusson rond",            categorie: "patch", prix: 6, en_vente: true },
  { id: 38, nom: "Patch Écusson bouclier",        categorie: "patch", prix: 8, en_vente: true },
  { id: 39, nom: "Patch Édition limitée",         categorie: "patch", prix: 9, en_vente: true },
  { id: 40, nom: "Patch Renard doré",             categorie: "patch", prix: 9, en_vente: true },

  // --- Accessoires (gilets, vêtements, divers) ---
  { id: 41, nom: "Gilet sans manches ADCN",       categorie: "accessoire", prix: 42, en_vente: true },
  { id: 42, nom: "Gilet zippé ADCN",              categorie: "accessoire", prix: 48, en_vente: true },
  { id: 43, nom: "Sweat à capuche ADCN",          categorie: "accessoire", prix: 38, en_vente: true },
  { id: 44, nom: "T-shirt renard",                categorie: "accessoire", prix: 18, en_vente: true },
  { id: 45, nom: "Casquette brodée",              categorie: "accessoire", prix: 22, en_vente: true },
  { id: 46, nom: "Bonnet ADCN",                   categorie: "accessoire", prix: 16, en_vente: true },
  { id: 47, nom: "Tote bag renard",               categorie: "accessoire", prix: 12, en_vente: true },
  { id: 48, nom: "Écharpe ADCN",                  categorie: "accessoire", prix: 20, en_vente: true },
  { id: 49, nom: "Mug renard",                    categorie: "accessoire", prix: 10, en_vente: true },
  { id: 50, nom: "Lot de 5 autocollants",         categorie: "accessoire", prix: 6, en_vente: true },

  // --- Faluche (insignes) ---
  { id: 51, nom: "Insigne de Fal",     categorie: "faluche", prix: 3.5, en_vente: true },

  // --- KDS (Kit de survie) ---
  { id: 52, nom: "KDS UE6",              categorie: "kds", prix: 12.6, en_vente: true },
];
