// Événements affichés dans la section "Événements" de main.html.
// La carte ET la popup sont générées automatiquement à partir de cet objet :
// il suffit d'ajouter/retirer une entrée ici pour ajouter/retirer un article sur le site.
//
// Champs de chaque événement :
//   pole        → badge affiché en haut de la carte (ex: "Pôle Intégration")
//   titre       → titre de la carte et de la popup
//   sousTitre   → texte affiché sur la carte ET en sous-titre dans la popup
//   description → descriptif complet affiché uniquement dans la popup
//   images      → photos du carrousel, dans l'ordre d'affichage
//                 (dépose-les dans img/evenements/ puis liste-les ici)
//
// L'ordre des clés ci-dessous détermine l'ordre d'affichage des cartes.

const EVENEMENTS = {
  kds: {
    pole: "Pôle Pédago",
    titre: "Kit de Survie",
    sousTitre: "Des carnets pour réviser les notions essentiels de chaque UE.",
    description: "Les Kits de Survie (KDS) sont des supports de révision au format papier conçus pour aider les étudiants à préparer leurs examens. Chaque kit comprend un résumé des notions essentielles d'un cours ainsi que des exercices variés (cas cliniques, schémas, mots croisés, textes à compléter, etc.) pour s'entraîner de manière plus interactive que les annales. Disponibles uniquement pour les adhérents de l'ADCN, ils peuvent également être achetés à un tarif solidaire permettant de soutenir l'association.",
    images: ["img/event/kds1.jpg", "img/event/kds2.jpg", "img/event/kds3.jpg"],
  },
  wei: {
    pole: "Bureau de l'ADCN",
    titre: "WEI",
    sousTitre: "Le Week-End d'Intégration de l'ADCN, pour accueillir les nouveaux étudiants.",
    description: "Un week-end festif et convivial organisé par l'ADCN pour accueillir les nouveaux étudiants en santé. Au programme : activités de cohésion, jeux, soirées à thème et moments de partage pour favoriser l'intégration et créer des liens entre les étudiants. Alternant activité avec ET SANS alcool, le WEI est un moment fort de la vie étudiante, ouvert à tous et s'adaptant aux différents rythmes et envies des participants. L'ADCN met un point d'honneur à organiser un événement inclusif et respectueux, où chacun peut se sentir à l'aise et profiter pleinement de cette expérience unique. PS : c'est un super moment pour découvrir votre nouvelle promo de FGSM2 ainsi que les assos de la fac !",
    images: ["img/event/wei1.png"],
  },
  octobre_rose: {
    pole: "Pôle Santé Publique",
    titre: "Octobre Rose",
    sousTitre: "Une journée en extérieur, ouverte à tous les niveaux.",
    description: "Descriptif à compléter : programme de la journée, matériel à prévoir, point de rendez-vous…",
    images: ["img/1.png"],
  },
  novembrose: {
    pole: "Pôle Santé Publique",
    titre: "Novembrose",
    sousTitre: "Stand boutique, tombola et bilan de l'année avec toute la communauté.",
    description: "Descriptif à compléter : horaires, lots de la tombola, stands présents…",
    images: ["img/1.png"],
  },
  h24destan: {
    pole: "Pôle Soirée",
    titre: "24h de Stan",
    sousTitre: "Stand boutique, tombola et bilan de l'année avec toute la communauté.",
    description: "Descriptif à compléter : horaires, lots de la tombola, stands présents…",
    images: ["img/1.png"],
  },
  ifmsa: {
    pole: "Pôle IFMSA",
    titre: "Echanges internationaux",
    sousTitre: "Permet aux étudiants de partir à l'étranger pour des stages en 4 et 6ème année.",
    description: "Le programme SCOPE de l'IFMSA (International Federation of Medical Students' Associations) permet aux étudiants en médecine de partir à l'étranger pour effectuer des stages cliniques. Ces échanges offrent une opportunité unique de découvrir d'autres systèmes de santé, d'acquérir de nouvelles compétences et de s'immerger dans différentes cultures médicales. L'ADCN facilite l'organisation de ces échanges pour les étudiants de la faculté, en fournissant des informations, un soutien logistique et en promouvant les expériences internationales au sein de la communauté étudiante.",
    images: ["img/event/ifmsa1.jpg", "img/event/ifmsa2.jpg"],
  },
  mars_bleu: {
    pole: "Pôle Santé Publique",
    titre: "Mars Bleu",
    sousTitre: "Stand boutique, tombola et bilan de l'année avec toute la communauté.",
    description: "Descriptif à compléter : horaires, lots de la tombola, stands présents…",
    images: ["img/1.png"],
  },
  hdn: {
    pole: "Pôle Santé Publique",
    titre: "Hopital des Nounours",
    sousTitre: "Le HDN est un moment d'échange et de sensibilisation pour les enfants.",
    description: "L'Hôpital des Nounours (HDN) est un événement de prévention destiné aux enfants de grande section de maternelle. À travers un parcours de soins ludique où ils accompagnent leur peluche « malade » dans différents services hospitaliers, les enfants découvrent le monde médical de façon rassurante. Organisé par l'ADCN avec des étudiants bénévoles en santé, le HDN vise à dédramatiser l'hôpital, sensibiliser aux bonnes pratiques de santé et permettre aux futurs professionnels de développer leurs compétences pédagogiques auprès des jeunes enfants.",
    images: ["img/event/hdn1.jpg", "img/event/hdn2.jpg", "img/event/hdn3.jpg"],
  },
};

let indexCarrousel = 0;
let imagesCourantes = [];

function construireCarrousel(images) {
  const conteneurImages = document.getElementById("popup-evenement-images");
  const conteneurPoints = document.getElementById("popup-evenement-points");
  conteneurImages.innerHTML = "";
  conteneurPoints.innerHTML = "";

  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = "popup-evenement-image";
    conteneurImages.appendChild(img);

    const point = document.createElement("button");
    point.type = "button";
    point.className = "popup-evenement-point";
    point.setAttribute("aria-label", `Aller à la photo ${i + 1}`);
    point.addEventListener("click", () => afficherImage(i));
    conteneurPoints.appendChild(point);
  });

  const controlesMultiples = images.length > 1;
  document.getElementById("popup-evenement-prec").hidden = !controlesMultiples;
  document.getElementById("popup-evenement-suiv").hidden = !controlesMultiples;
  conteneurPoints.hidden = !controlesMultiples;

  afficherImage(0);
}

function afficherImage(i) {
  const total = imagesCourantes.length;
  indexCarrousel = (i + total) % total;

  document.getElementById("popup-evenement-images").style.transform =
    `translateX(-${indexCarrousel * 100}%)`;

  document.querySelectorAll(".popup-evenement-point").forEach((point, j) => {
    point.classList.toggle("est-actif", j === indexCarrousel);
  });
}

function ouvrirPopupEvenement(cle) {
  const evenement = EVENEMENTS[cle];
  if (!evenement) return;

  document.getElementById("popup-evenement-organisateur").textContent =
    `${evenement.pole} — organisateur de ${evenement.titre}`;
  document.getElementById("popup-evenement-titre").textContent = evenement.titre;
  document.getElementById("popup-evenement-soustitre").textContent = evenement.sousTitre;
  document.getElementById("popup-evenement-description").textContent = evenement.description;

  imagesCourantes = evenement.images;
  construireCarrousel(imagesCourantes);

  document.getElementById("popup-evenement").hidden = false;
  document.body.style.overflow = "hidden";
}

function fermerPopupEvenement() {
  document.getElementById("popup-evenement").hidden = true;
  document.body.style.overflow = "";
}

function construireCartesEvenements() {
  const grille = document.getElementById("grille-evenements");
  if (!grille) return;
  grille.innerHTML = "";

  Object.entries(EVENEMENTS).forEach(([cle, evenement]) => {
    const carte = document.createElement("article");
    carte.className = "carte carte-evenement";
    carte.dataset.evenement = cle;
    carte.tabIndex = 0;
    carte.setAttribute("role", "button");
    carte.setAttribute("aria-haspopup", "dialog");

    const pole = document.createElement("span");
    pole.className = "carte-date";
    pole.textContent = evenement.pole;

    const titre = document.createElement("h3");
    titre.textContent = evenement.titre;

    const soustitre = document.createElement("p");
    soustitre.textContent = evenement.sousTitre;

    const lien = document.createElement("span");
    lien.className = "carte-evenement-lien";
    lien.innerHTML = `Voir le détail <span aria-hidden="true">→</span>`;

    carte.append(pole, titre, soustitre, lien);
    grille.appendChild(carte);
  });
}

function initEvenements() {
  construireCartesEvenements();

  document.querySelectorAll(".carte-evenement").forEach((carte) => {
    carte.addEventListener("click", () => ouvrirPopupEvenement(carte.dataset.evenement));
    carte.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") {
        evt.preventDefault();
        ouvrirPopupEvenement(carte.dataset.evenement);
      }
    });
  });

  document.getElementById("popup-evenement-fermer").addEventListener("click", fermerPopupEvenement);

  document.getElementById("popup-evenement").addEventListener("click", (evt) => {
    if (evt.target.id === "popup-evenement") fermerPopupEvenement();
  });

  document.getElementById("popup-evenement-prec").addEventListener("click", () => afficherImage(indexCarrousel - 1));
  document.getElementById("popup-evenement-suiv").addEventListener("click", () => afficherImage(indexCarrousel + 1));

  document.addEventListener("keydown", (evt) => {
    const popup = document.getElementById("popup-evenement");
    if (popup.hidden) return;
    if (evt.key === "Escape") fermerPopupEvenement();
    if (evt.key === "ArrowRight") afficherImage(indexCarrousel + 1);
    if (evt.key === "ArrowLeft") afficherImage(indexCarrousel - 1);
  });
}
