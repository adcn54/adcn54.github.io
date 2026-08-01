// Écran de chargement, partagé par main.html et boutique.html.
//
//   initChargement()                          → main.html : barre de durée fixe
//   initChargement({ attendre: unePromesse }) → boutique.html : la barre patiente
//                                               tant que la promesse n'est pas résolue
//
// Dans les deux cas on garde une durée minimale : le renard met ~1,6 s à se
// tracer, le couper au milieu ferait davantage "bug" que "rapide".

const DUREE_MINI_CHARGEMENT = 1400; // ms

function initChargement(options = {}) {
  const chargement = document.getElementById("chargement");
  const site = document.getElementById("site");
  const barre = document.getElementById("chargement-barre-remplissage");
  if (!chargement || !site) return;

  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dureeMini = mouvementReduit ? 200 : DUREE_MINI_CHARGEMENT;
  const tache = options.attendre; // undefined sur main.html

  let revele = false;
  const debut = performance.now();

  // Sans tâche à attendre : remplissage linéaire, comme avant.
  // Avec : progression asymptotique vers 90 % — on ne promet pas les 100 %
  // tant que le réseau n'a pas répondu.
  function avancer(maintenant) {
    if (revele) return;
    const t = (maintenant - debut) / 1000;
    const pourcent = tache
      ? 90 * (1 - Math.exp(-t / 1.1))
      : Math.min(100, ((t * 1000) / dureeMini) * 100);
    barre.style.width = pourcent.toFixed(1) + "%";
    requestAnimationFrame(avancer);
  }
  requestAnimationFrame(avancer);

  async function reveler() {
    if (revele) return;

    const surLaBoutique = /boutique\.html$/.test(location.pathname);

    if (surLaBoutique) {
      // On recharge la page UNE FOIS si le catalogue est vide, pour tenter de
      // récupérer le cache local. Le drapeau vit dans l'URL (et non dans
      // sessionStorage) car ce dernier ne survit pas toujours au reload()
      // (file://, webview, navigation privée...), ce qui provoquait une
      // boucle de rechargement infinie.
      const url = new URL(location.href);
      const dejaRetente = url.searchParams.has("adcn-retry");
      if (!dejaRetente) {
        if (typeof PRODUITS !== "undefined" && PRODUITS.length === 0) {
          url.searchParams.set("adcn-retry", "1");
          location.replace(url);
          return;
        }
      } else {
        // déjà retenté une fois : on affiche tel quel, et on nettoie l'URL
        url.searchParams.delete("adcn-retry");
        history.replaceState(null, "", url);
      }
    }
    
    revele = true;

    barre.style.width = "100%";
    await new Promise((r) => setTimeout(r, 250)); // laisse la barre finir sa course

    chargement.classList.add("est-cache");
    site.classList.add("est-visible");
    document.body.style.overflow = "";
    setTimeout(() => { chargement.style.display = "none"; }, 750);
  }

  document.body.style.overflow = "hidden"; // bloque le scroll pendant le chargement

  // On attend la tâche (ou le chargement de la page) ET la durée minimale.
  const attente = tache || new Promise((r) => window.addEventListener("load", r, { once: true }));
  Promise.all([
    Promise.resolve(attente).catch(() => {}), // une erreur ne doit jamais figer l'écran
    new Promise((r) => setTimeout(r, dureeMini)),
  ]).then(reveler);

  setTimeout(reveler, 12000); // filet de sécurité si tout se bloque
}
