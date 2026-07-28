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


  // --- Patchs ---
  { id: 31, nom: "Patch Renard brodé",            categorie: "patch", prix: 7, en_vente: true },
  { id: 32, nom: "Patch Blason ADCN",             categorie: "patch", prix: 7, en_vente: true },


  // --- Accessoires (gilets, vêtements, divers) ---
  { id: 41, nom: "Gilet sans manches ADCN",       categorie: "accessoire", prix: 42, en_vente: true },
  { id: 42, nom: "Gilet zippé ADCN",              categorie: "accessoire", prix: 48, en_vente: true },


  // --- Faluche (insignes) ---
  // Attention : id 52 est réservé au KDS plus bas, on saute ce numéro ici.
  { id: 51, nom: "Écusson",                            categorie: "faluche", prix: 3.5,  en_vente: true },
  { id: 53, nom: "Caducée",                            categorie: "faluche", prix: 2,    en_vente: true },
  { id: 54, nom: "Bouteille de Bordeaux",               categorie: "faluche", prix: 2,    en_vente: true },
  { id: 55, nom: "Phi",                                 categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 122, nom: "Epsilon",                             categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 56, nom: "Petite palme UE master",              categorie: "faluche", prix: 1.2,  en_vente: true },
  { id: 57, nom: "Ciseaux",                             categorie: "faluche", prix: 1.4,  en_vente: true },
  { id: 58, nom: "Palme fin de cycle / major",          categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 59, nom: "Étoile dorée",                        categorie: "faluche", prix: 3,    en_vente: true },
  { id: 60, nom: "Étoile argentée",                     categorie: "faluche", prix: 1,    en_vente: true },
  { id: 61, nom: "Chameau",                             categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 62, nom: "Cochon",                              categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 63, nom: "Squelette Simple",                           categorie: "faluche", prix: 2,    en_vente: true },
  { id: 64, nom: "Squelette RuBi",                      categorie: "faluche", prix: 2,    en_vente: true },
  { id: 65, nom: "Squelette pointe diamant",            categorie: "faluche", prix: 2,    en_vente: true },
  { id: 66, nom: "Feuille de vigne",                    categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 67, nom: "Rose",                                categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 68, nom: "Tête de mort",                        categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 69, nom: "Tête de vache",                       categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 70, nom: "Bachus troué",                        categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 71, nom: "Ancre",                               categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 72, nom: "Ballon",                              categorie: "faluche", prix: 2,    en_vente: true },
  { id: 73, nom: "Étoile et foudre",                    categorie: "faluche", prix: 1,    en_vente: true },
  { id: 74, nom: "Chardon lorrain",                     categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 75, nom: "Fourchette",                          categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 76, nom: "Grappe de raisin",                    categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 77, nom: "Lyre",                                categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 78, nom: "Palette vernie",                      categorie: "faluche", prix: 2,    en_vente: true },
  { id: 79, nom: "Plume",                               categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 80, nom: "Raquette",                            categorie: "faluche", prix: 2,    en_vente: true },
  { id: 81, nom: "Sphinx",                              categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 82, nom: "Parapluie fermé",                     categorie: "faluche", prix: 2,    en_vente: true }, // prix noté "2 ?" dans la source, à confirmer
  { id: 83, nom: "Parapluie ouvert",                    categorie: "faluche", prix: 4,    en_vente: true },
  { id: 84, nom: "Croix GC",                            categorie: "faluche", prix: 5.3,  en_vente: true },
  { id: 85, nom: "Croix GM",                            categorie: "faluche", prix: 5.3,  en_vente: true },
  { id: 86, nom: "Soleil",                              categorie: "faluche", prix: 2.1,  en_vente: true },
  { id: 87, nom: "Lune",                                categorie: "faluche", prix: 2.3,  en_vente: true },
  { id: 88, nom: "Chauve-souris",                       categorie: "faluche", prix: 1.5,  en_vente: true },
  { id: 89, nom: "Signe astro",                         categorie: "faluche", prix: 1.7,  en_vente: true },
  { id: 90, nom: "Positions sexuelles",                 categorie: "faluche", prix: 2,    en_vente: true },
  { id: 91, nom: "Flying penis / Flying foufoune",      categorie: "faluche", prix: 2,    en_vente: true },
  { id: 92, nom: "Nounours",                            categorie: "faluche", prix: 3.5,  en_vente: true },
  { id: 93, nom: "Épervier",                            categorie: "faluche", prix: 0,    en_vente: false }, // prix inconnu ("?") dans la source, à compléter
  { id: 94, nom: "Grenouille argentée",                 categorie: "faluche", prix: 2,    en_vente: true },
  { id: 95, nom: "Coiffe de faluche",                   categorie: "faluche", prix: 10.5, en_vente: true },
 
  // --- Faluche : lettres (toutes tailles), 1,10€ l'unité ---
  { id: 96,  nom: "Lettre A", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 97,  nom: "Lettre B", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 98,  nom: "Lettre C", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 99,  nom: "Lettre D", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 100, nom: "Lettre E", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 101, nom: "Lettre F", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 102, nom: "Lettre G", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 103, nom: "Lettre H", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 104, nom: "Lettre I", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 105, nom: "Lettre J", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 106, nom: "Lettre K", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 107, nom: "Lettre L", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 108, nom: "Lettre M", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 109, nom: "Lettre N", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 110, nom: "Lettre O", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 111, nom: "Lettre P", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 112, nom: "Lettre Q", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 113, nom: "Lettre R", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 114, nom: "Lettre S", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 115, nom: "Lettre T", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 116, nom: "Lettre U", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 117, nom: "Lettre V", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 118, nom: "Lettre W", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 119, nom: "Lettre X", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 120, nom: "Lettre Y", categorie: "faluche", prix: 1.1, en_vente: true },
  { id: 121, nom: "Lettre Z", categorie: "faluche", prix: 1.1, en_vente: true },

  // --- KDS (Kit de survie) ---
  { id: 52, nom: "KDS UE6",              categorie: "kds", prix: 12.6, en_vente: true },
];
