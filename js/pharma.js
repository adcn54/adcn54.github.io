// ===== Easter egg #pharma : croix de pharmacie =====
let pharmaEasterEggCharge = false;
function activerEasterEggPharma() {
  const declencher = () => {
    if (pharmaEasterEggCharge) return; // évite les doublons si on retape #pharma
    pharmaEasterEggCharge = true;
    const style = document.createElement("style");
    style.textContent = `
      .pharma-croix {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        animation-name: pharma-cycle;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      @keyframes pharma-cycle {
        0%   { opacity: 0; transform: scale(.4) rotate(-15deg); }
        15%  { opacity: 1; transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 6px #00b34a); }
        50%  { opacity: 1; filter: drop-shadow(0 0 2px #00b34a); }
        85%  { opacity: 0; transform: scale(.4) rotate(15deg); }
        100% { opacity: 0; }
      }
      .pharma-texte {
        position: fixed;
        z-index: 10000;
        font-family: "JetBrains Mono", monospace;
        font-weight: 700;
        color: #fff;
        background: #00A651;
        padding: 10px 18px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        opacity: 0;
        animation: pharma-texte-apparition .6s ease forwards;
      }
      @keyframes pharma-texte-apparition {
        from { opacity: 0; transform: translate(-50%, -12px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }
    `;
    document.head.appendChild(style);

    // Croix de pharmacie (forme classique : croix blanche sur fond vert)
    const svgCroix = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <rect x="0" y="0" width="100" height="100" rx="14" fill="#00A651"/>
        <rect x="40" y="15" width="20" height="70" fill="#fff"/>
        <rect x="15" y="40" width="70" height="20" fill="#fff"/>
      </svg>
    `;

    // Repositionne une croix à un endroit + une taille aléatoires
    function repositionnerAleatoirement(croix) {
      const taille = 32 + Math.random() * 40;
      croix.style.width = taille + "px";
      croix.style.height = taille + "px";
      croix.style.left = "calc(" + (Math.random() * 92) + "vw)";
      croix.style.top = "calc(" + (Math.random() * 88) + "vh)";
    }

    const fragment = document.createDocumentFragment();
    const nombreCroix = 16;
    for (let i = 0; i < nombreCroix; i++) {
      const croix = document.createElement("div");
      croix.className = "pharma-croix";
      croix.innerHTML = svgCroix;
      repositionnerAleatoirement(croix);

      // durée de cycle propre à chaque croix + délai négatif aléatoire
      // (délai négatif = l'animation démarre déjà "en cours", donc les croix
      // sont désynchronisées dès le premier affichage, pas seulement après)
      const duree = 2.2 + Math.random() * 2.8; // entre 2.2s et 5s
      croix.style.animationDuration = duree + "s";
      croix.style.animationDelay = "-" + (Math.random() * duree) + "s";

      // à chaque nouveau tour de boucle (donc juste après être repassée
      // par opacity: 0 à 0%/100%), on la téléporte ailleurs pendant
      // qu'elle est invisible : effet "disparaît puis réapparaît ailleurs"
      croix.addEventListener("animationiteration", () => repositionnerAleatoirement(croix));

      fragment.appendChild(croix);
    }
    document.body.appendChild(fragment);

    // Textes de l'easter egg
    const texte1 = document.createElement("div");
    texte1.className = "pharma-texte";
    texte1.textContent = "AAEPN > ADCN";
    texte1.style.top = "18vh";
    texte1.style.left = "50%";
    const texte2 = document.createElement("div");
    texte2.className = "pharma-texte";
    texte2.textContent = "pharmaforever";
    texte2.style.top = "27vh";
    texte2.style.left = "50%";
    texte2.style.animationDelay = ".25s";
    document.body.appendChild(texte1);
    document.body.appendChild(texte2);
    console.log("%c💊 AAEPN > ADCN — pharmaforever 💊", "font-size: 20px; color: #00A651;");
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(declencher, { timeout: 2000 });
  } else {
    setTimeout(declencher, 200);
  }
}


function verifierHash() {
  if (window.location.hash === "#pharma") activerEasterEggPharma();
  else fermer();
}

window.addEventListener("hashchange", verifierHash);

// Si on arrive directement sur main.html#plumes, on laisse d'abord
// l'écran de chargement finir son travail avant de poser la carte.
if (document.readyState === "complete") verifierHash();
else window.addEventListener("load", verifierHash);
