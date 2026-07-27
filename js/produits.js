// Catalogue de la boutique.
// Pour AJOUTER un article : ajoute une ligne dans le tableau (garde un id unique).
// Pour EN RETIRER un : supprime sa ligne.
// categorie doit être exactement : "pin", "patch" ou "accessoire"
// (ce sont les valeurs utilisées par les boutons de filtre dans boutique.html).

const PRODUITS = [

  // --- Pin's ---
  { id: 1,  nom: "Pin's Renard classique",        categorie: "pin", prix: 6 },
  { id: 2,  nom: "Pin's Renard braise",           categorie: "pin", prix: 6 },
  { id: 3,  nom: "Pin's Renard ambré",            categorie: "pin", prix: 6 },
  { id: 4,  nom: "Pin's Silhouette renard",       categorie: "pin", prix: 5 },
  { id: 5,  nom: "Pin's Museau renard",           categorie: "pin", prix: 5 },
  { id: 6,  nom: "Pin's Renard endormi",          categorie: "pin", prix: 6 },
  { id: 7,  nom: "Pin's Renard curieux",          categorie: "pin", prix: 6 },
  { id: 8,  nom: "Pin's Renard bondissant",       categorie: "pin", prix: 7 },
  { id: 9,  nom: "Pin's Tête de renard",          categorie: "pin", prix: 6 },
  { id: 10, nom: "Pin's Renard minimaliste",      categorie: "pin", prix: 5 },
  { id: 11, nom: "Pin's Blason ADCN",             categorie: "pin", prix: 6 },
  { id: 12, nom: "Pin's Écusson ADCN",            categorie: "pin", prix: 6 },
  { id: 13, nom: "Pin's Lettres ADCN",            categorie: "pin", prix: 5 },
  { id: 14, nom: "Pin's Flamme",                  categorie: "pin", prix: 6 },
  { id: 15, nom: "Pin's Braise",                  categorie: "pin", prix: 6 },
  { id: 16, nom: "Pin's Étincelle",               categorie: "pin", prix: 6 },
  { id: 17, nom: "Pin's Forêt",                   categorie: "pin", prix: 6 },
  { id: 18, nom: "Pin's Feuille d'automne",       categorie: "pin", prix: 6 },
  { id: 19, nom: "Pin's Pleine lune",             categorie: "pin", prix: 6 },
  { id: 20, nom: "Pin's Étoile du soir",          categorie: "pin", prix: 6 },
  { id: 21, nom: "Pin's Empreinte de renard",     categorie: "pin", prix: 5 },
  { id: 22, nom: "Pin's Queue de renard",         categorie: "pin", prix: 6 },
  { id: 23, nom: "Pin's Oreilles de renard",      categorie: "pin", prix: 5 },
  { id: 24, nom: "Pin's Renard géométrique",      categorie: "pin", prix: 7 },
  { id: 25, nom: "Pin's Renard origami",          categorie: "pin", prix: 7 },
  { id: 26, nom: "Pin's Édition hiver",           categorie: "pin", prix: 8 },
  { id: 27, nom: "Pin's Édition été",             categorie: "pin", prix: 8 },
  { id: 28, nom: "Pin's Édition limitée or",      categorie: "pin", prix: 9 },
  { id: 29, nom: "Pin's Édition limitée argent",  categorie: "pin", prix: 9 },
  { id: 30, nom: "Pin's Renard et lune",          categorie: "pin", prix: 7 },

  // --- Patchs ---
  { id: 31, nom: "Patch Renard brodé",            categorie: "patch", prix: 7 },
  { id: 32, nom: "Patch Blason ADCN",             categorie: "patch", prix: 7 },
  { id: 33, nom: "Patch Lettres ADCN",            categorie: "patch", prix: 6 },
  { id: 34, nom: "Patch Flamme brodée",           categorie: "patch", prix: 7 },
  { id: 35, nom: "Patch Forêt brodée",            categorie: "patch", prix: 8 },
  { id: 36, nom: "Patch Renard courant",          categorie: "patch", prix: 7 },
  { id: 37, nom: "Patch Écusson rond",            categorie: "patch", prix: 6 },
  { id: 38, nom: "Patch Écusson bouclier",        categorie: "patch", prix: 8 },
  { id: 39, nom: "Patch Édition limitée",         categorie: "patch", prix: 9 },
  { id: 40, nom: "Patch Renard doré",             categorie: "patch", prix: 9 },

  // --- Accessoires (gilets, vêtements, divers) ---
  { id: 41, nom: "Gilet sans manches ADCN",       categorie: "accessoire", prix: 42 },
  { id: 42, nom: "Gilet zippé ADCN",              categorie: "accessoire", prix: 48 },
  { id: 43, nom: "Sweat à capuche ADCN",          categorie: "accessoire", prix: 38 },
  { id: 44, nom: "T-shirt renard",                categorie: "accessoire", prix: 18 },
  { id: 45, nom: "Casquette brodée",              categorie: "accessoire", prix: 22 },
  { id: 46, nom: "Bonnet ADCN",                   categorie: "accessoire", prix: 16 },
  { id: 47, nom: "Tote bag renard",               categorie: "accessoire", prix: 12 },
  { id: 48, nom: "Écharpe ADCN",                  categorie: "accessoire", prix: 20 },
  { id: 49, nom: "Mug renard",                    categorie: "accessoire", prix: 10 },
  { id: 50, nom: "Lot de 5 autocollants",         categorie: "accessoire", prix: 6 },

];
