/* ============================================================
   PLUMES — easter egg #plumes
   Hommage à la liste "Les Plumes" (Tutorat Santé Lorraine, BR 2026-2027).

   Fichier unique, à charger en différé tout en bas de main.html :
       <script src="js/plumes.js" defer></script>

   Avec "defer", le navigateur télécharge ce fichier en parallèle du
   rendu et ne l'exécute qu'une fois la page construite : il ne bloque
   jamais l'affichage. Et surtout, rien n'est injecté dans le DOM ni
   dans le <head> tant que personne n'a tapé #plumes — le CSS et la
   carte ne sont construits qu'au premier appel (voir construire()).
   ============================================================ */

(function () {
"use strict";

/* --- Les six teintes des professions de foi, dans l'ordre de la liste --- */
const TEINTES = {
  marylene: "#4A9BC6", // Présidente
  mathis:   "#E08A4C", // Trésorier
  romane:   "#B98BC9", // Secrétaire
  jasmine:  "#2FA3A0", // Vice-Présidente Générale
  enzo:     "#C9354E", // Vice-Président Général
  noe:      "#7FB77E", // Vice-Président Réseaux
  or:       "#E8C843"  // la liste, ensemble
};

const MEMBRES = [
  {
    nom: "COLIN Marylène",
    poste: "Présidente",
    teinte: TEINTES.marylene,
    detail: "RP Tut'Prépares 25-26 : kit de la vie étudiante pour les futurs P1 (demandes de bourses, accès logement...), augmenter les périodes d'immersion, renforcer les liens avec les LAS en vue de la réforme."
  },
  {
    nom: "KREMER Mathis",
    poste: "Trésorier",
    teinte: TEINTES.mathis,
    detail: "Tuteur UE3 & RM UE6 25-26 : gratuité du pack+ pour les étudiants précaires, app Tutoweb pour téléphone, réorganiser les permanences, rediffuser les GDT."
  },
  {
    nom: "LAURENSON Romane",
    poste: "Secrétaire",
    teinte: TEINTES.romane,
    detail: "Tutrice UE3 & RM Petit Bassin 25-26 :  emploi du temps commun à la TutoTeam (GDT, soirées, permanences, Tut'dépenses, forums), avec signalement des événements en manque de présentateurs, Newsletter."
  },
  {
    nom: "CHARBONNIER Jasmine",
    poste: "Vice-Présidente Générale",
    teinte: TEINTES.jasmine,
    detail: "RP Pédago-Oraux 25-26 : kit pour aider les tuteurs, faire de la pédagogie active (GDT = cours + Wooclap), format audio/podcast pour les cours pertinents."
  },
  {
    nom: "ULRICH--LIBÉ Enzo",
    poste: "Vice-Président Général",
    teinte: TEINTES.enzo,
    detail: "RM UE3 & RM UE8 25-26 : Pré-rentrée du S2 sous forme de capsules vidéo et de Wooclap distanciel, développer les aides inter-team."
  },
  {
    nom: "LABRE Noé",
    poste: "Vice-Président en charge des Réseaux",
    teinte: TEINTES.noe,
    detail: "RP Graph 25-26 : préparer la réfomre 27-28, se faire créditer sur parcoursup, avoir une représentation active de chaque filière au sein du tutorat"
  }
];

/* Le tracé de la plume, réutilisé partout. */
const VANE   = "M47 5C26 9 12 26 11 45c0 4 .6 8 1.8 12 20-3 36-19 39-38 .8-5 .4-9-4.8-14z";
const RACHIS = "M47 5 12 57";

const CSS = `
#plumes-pluie{
  position:fixed; inset:0; pointer-events:none; z-index:99998; overflow:hidden;
}
.plume-chute{
  position:absolute; top:0; will-change:transform;
  animation:plume-chute-anim linear forwards;
}
.plume-chute svg{ display:block; animation:plume-balance ease-in-out infinite alternate; }
@keyframes plume-chute-anim{
  0%{ transform:translate3d(0,-20vh,0); opacity:0 }
  8%{ opacity:.95 } 92%{ opacity:.95 }
  100%{ transform:translate3d(var(--pl-dx,40px),112vh,0); opacity:0 }
}
@keyframes plume-balance{ from{ transform:rotate(-22deg) } to{ transform:rotate(22deg) } }

#plumes-hommage{
  position:fixed; inset:0; z-index:99999;
  display:grid; place-items:center; padding:20px;
  background:rgb(10 8 7 / 0%);
  backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
  animation:plumes-voile .45s var(--courbe,ease) both;
}
@keyframes plumes-voile{ from{opacity:0} to{opacity:1} }

.plumes-carte{
  position:relative; width:min(600px,100%); max-height:88vh; overflow-y:auto;
  background:var(--fond-alt,#1C1611);
  border:1px solid var(--ligne-forte,rgba(243,234,224,.22));
  border-radius:16px; padding:34px 32px 28px;
  box-shadow:0 30px 80px rgba(0,0,0,.6);
  animation:plumes-carte-entree .5s var(--courbe,ease) both;
}
@keyframes plumes-carte-entree{
  from{ opacity:0; transform:translateY(18px) scale(.98) } to{ opacity:1; transform:none }
}

.plumes-fermer{
  position:absolute; top:12px; right:14px; background:none; border:0;
  color:var(--texte-attenue,#A69A8C); font-size:26px; line-height:1;
  cursor:pointer; padding:6px 10px; border-radius:8px;
}
.plumes-fermer:hover{ color:var(--texte,#F3EAE0) }

.plumes-surtitre,.plumes-signature{
  font-family:var(--police-mono,monospace); font-size:10.5px; letter-spacing:.2em;
  text-transform:uppercase; color:var(--texte-attenue,#A69A8C);
}
.plumes-surtitre{ margin:0 0 10px }
.plumes-signature{ margin:10px 0 0 }

.plumes-titre{
  font-family:var(--police-titre,sans-serif); font-weight:900;
  font-size:clamp(38px,9vw,58px); line-height:.9; letter-spacing:.01em;
  color:${TEINTES.or}; margin:0 0 6px;
}
.plumes-chapeau{
  margin:0; font-size:14px; line-height:1.6; max-width:46ch;
  color:var(--texte-attenue,#A69A8C);
}

.plumes-liste{
  margin:26px 0 0; padding:0; list-style:none;
  border-top:1px solid var(--ligne,rgba(243,234,224,.12));
}
.plumes-membre{
  padding:14px 0 13px;
  border-bottom:1px solid var(--ligne,rgba(243,234,224,.12));
}
.plumes-nom{
  display:inline-flex; align-items:center; gap:9px;
  font-family:var(--police-titre,sans-serif); font-weight:700;
  font-size:21px; letter-spacing:.02em; color:var(--pl-teinte,var(--texte));
}
.plumes-nom svg{ width:13px; height:13px; flex:none }
.plumes-nom svg:last-child{ transform:scaleX(-1) }
.plumes-poste{
  display:block; font-family:var(--police-mono,monospace); font-size:10px;
  letter-spacing:.18em; text-transform:uppercase;
  color:var(--pl-teinte,var(--texte-attenue)); opacity:.85; margin:5px 0 4px;
}
.plumes-detail{
  margin:0; font-size:13.5px; line-height:1.55; color:var(--texte-attenue,#A69A8C);
}

.plumes-projet{
  margin:22px 0 0; padding:14px 16px;
  border-left:2px solid ${TEINTES.or};
  background:rgba(232,200,67,.06); border-radius:0 8px 8px 0;
  font-size:13.5px; line-height:1.6; color:var(--texte-attenue,#A69A8C);
}
.plumes-projet strong{ color:var(--texte,#F3EAE0); font-weight:600 }

.plumes-dedicace{
  margin:24px 0 0; font-family:var(--police-titre,sans-serif); font-weight:700;
  font-size:19px; line-height:1.35; color:var(--texte,#F3EAE0);
}

@media (max-width:480px){
  .plumes-carte{ padding:30px 20px 24px }
  .plumes-nom{ font-size:18px }
}
@media (prefers-reduced-motion:reduce){
  #plumes-hommage,.plumes-carte{ animation:none }
  #plumes-pluie{ display:none }
}
`;

/* --- petites fabriques --- */

function plumeInline() {
  return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="${VANE}" fill="currentColor" fill-opacity=".3"/>
    <path d="${RACHIS}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

function ligneMembre(m) {
  // Le nom encadré de deux plumes : l'annotation même du "Projet Plumes".
  return `<li class="plumes-membre" style="--pl-teinte:${m.teinte}">
    <span class="plumes-nom">${plumeInline()}${m.nom}${plumeInline()}</span>
    <span class="plumes-poste">${m.poste}</span>
    <p class="plumes-detail">${m.detail}</p>
  </li>`;
}

/* --- état --- */
let carte = null;
let couche = null;
let intervalle = null;
let ouvert = false;
const animationsReduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function construire() {
  const style = document.createElement("style");
  style.id = "plumes-style";
  style.textContent = CSS;
  document.head.appendChild(style);

  carte = document.createElement("div");
  carte.id = "plumes-hommage";
  carte.setAttribute("role", "dialog");
  carte.setAttribute("aria-modal", "true");
  carte.setAttribute("aria-labelledby", "plumes-titre");
  carte.innerHTML = `
    <div class="plumes-carte">
      <button class="plumes-fermer" id="plumes-fermer" aria-label="Fermer">&times;</button>
      <p class="plumes-surtitre">Tutorat Santé Lorraine — Bureau Restreint 2026-2027</p>
      <h2 class="plumes-titre" id="plumes-titre">Les Plumes</h2>
      <p class="plumes-chapeau">
        Six potes, une seule liste BR pour l'avenir du tuto.
      </p>
      <ul class="plumes-liste">${MEMBRES.map(ligneMembre).join("")}</ul>
      <p class="plumes-projet">
        <strong>Projet Plumes.</strong> Mettre en avant les notions déjà tombées 
        aux annales dans les ronéos : mises en gras et encadrées par des plumes.
        Comme ceci. Un script pour le premier repérage, les RM pour trancher.
      </p>
      <p class="plumes-projet">
        <strong>Projet Bien-être.</strong> Favoriser le bien être des P1 en incluant un
        deuxième RP Bien-être. Faire des permanences à thèmes (distribution de ronéos + jeu),
        former la TutoTeam à la santé mentale (kit parrain/marraine).
      </p>
      <p class="plumes-dedicace">
        Une voix. C'est tout ce qui a manqué.<br>
        L'équipe, elle, était déjà élue.
      </p>
      <p class="plumes-signature">#plumes — AG 2026</p>
    </div>`;
  document.body.appendChild(carte);

  carte.querySelector("#plumes-fermer").addEventListener("click", fermer);
  carte.addEventListener("click", (e) => { if (e.target === carte) fermer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fermer(); });
}

function semerUnePlume() {
  const teintes = Object.values(TEINTES);
  const plume = document.createElement("div");
  plume.className = "plume-chute";
  plume.innerHTML = `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="${VANE}" fill="currentColor" fill-opacity=".28"/>
    <path d="${RACHIS}M41 12 26 21M44 21 29 31M45 31 30 41M44 41 29 50"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;

  plume.style.left  = (Math.random() * 100) + "vw";
  plume.style.width = (16 + Math.random() * 22) + "px";
  plume.style.color = teintes[Math.floor(Math.random() * teintes.length)];
  plume.style.setProperty("--pl-dx", (Math.random() * 160 - 80) + "px");
  plume.style.animationDuration = (7 + Math.random() * 6) + "s";

  const feuille = plume.querySelector("svg");
  feuille.style.animationDuration = (1.6 + Math.random() * 1.8) + "s";
  feuille.style.animationDelay = (-Math.random() * 2) + "s";

  plume.addEventListener("animationend", () => plume.remove());
  couche.appendChild(plume);
}

function ouvrir() {
  if (ouvert) return;
  if (!carte) construire();
  ouvert = true;

  console.log(
    "%c🪶 Les Plumes — TSL 2026-2027 🪶\n" +
    "Marylène · Mathis · Romane · Jasmine · Enzo · Noé",
    "font-size:18px; color:" + TEINTES.or + "; line-height:1.6;"
  );

  carte.hidden = false;
  carte.style.display = 'block';
  carte.querySelector("#plumes-fermer").focus();

  if (animationsReduites) return;
  couche = document.createElement("div");
  couche.id = "plumes-pluie";
  document.body.appendChild(couche);
  for (let i = 0; i < 12; i++) semerUnePlume(); // une première volée
  intervalle = setInterval(semerUnePlume, 260); // puis en continu
}

function fermer() {
  if (!ouvert) return;
  ouvert = false;
  carte = document.getElementById("plumes-hommage");
  carte.hidden = true;
  carte.style.display = 'none';
  //clearInterval(intervalle); // on n'enlève pas l'intervalle pour que les plumes continuent leur chute
  //if (couche) { couche.remove(); couche = null; }
  // On efface le # pour que l'easter egg puisse être relancé.
  if (window.location.hash === "#plumes") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

/* ============================================================
   VEILLEUR
   Seule partie qui s'exécute au chargement de la page : deux
   écouteurs et une comparaison de chaîne. Coût quasi nul.
   ============================================================ */
function verifierHash() {
  if (window.location.hash.toLowerCase() === "#plumes") ouvrir();
  else fermer();
}

window.addEventListener("hashchange", verifierHash);

// Si on arrive directement sur main.html#plumes, on laisse d'abord
// l'écran de chargement finir son travail avant de poser la carte.
if (document.readyState === "complete") verifierHash();
else window.addEventListener("load", verifierHash);

})();
