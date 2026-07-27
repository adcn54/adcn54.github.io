// Écran de chargement : remplit la barre de progression, puis révèle le site.
// Expose initChargement(), appelée depuis principal.js.

function initChargement() {
  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duree = mouvementReduit ? 300 : 1900; // ms — assez long pour laisser le renard se tracer

  const chargement = document.getElementById("chargement");
  const barreRemplissage = document.getElementById("chargement-barre-remplissage");
  const site = document.getElementById("site");
  let revele = false;

  function remplirBarre() {
    return new Promise((resolve) => {
      const debut = performance.now();
      function avancer(maintenant) {
        const tempsEcoule = maintenant - debut;
        barreRemplissage.style.width = Math.min(100, (tempsEcoule / duree) * 100) + "%";
        tempsEcoule < duree ? requestAnimationFrame(avancer) : resolve();
      }
      requestAnimationFrame(avancer);
    });
  }

  async function reveler() {
    if (revele) return; // évite un double déclenchement (voir setTimeout plus bas)
    revele = true;
    await remplirBarre();
    chargement.classList.add("est-cache");
    site.classList.add("est-visible");
    document.body.style.overflow = "";
    setTimeout(() => { chargement.style.display = "none"; }, 750);
  }

  document.body.style.overflow = "hidden"; // bloque le scroll tant que le chargement est visible
  window.addEventListener("load", reveler, { once: true });
  setTimeout(reveler, 3500); // filet de sécurité si 'load' ne se déclenche jamais (assets déjà en cache, etc.)
}
