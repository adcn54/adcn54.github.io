/* Easter egg #eline — taquin 3x3 d'un cœur rouge (page 404) */
(function(){
  const COEUR = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff0f3"/><path d="M50 88 C20 65 8 48 8 33 C8 20 18 12 29 12 C38 12 46 18 50 26 C54 18 62 12 71 12 C82 12 92 20 92 33 C92 48 80 65 50 88 Z" fill="#e0202f"/></svg>'
  );

  let pos; // pos[i] = numéro de la pièce sur la case i (8 = trou)

  function lancer(){
    if (document.getElementById("puzzle-eline")) return;

    const fond = document.createElement("div");
    fond.id = "puzzle-eline";
    fond.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px;";

    const taille = Math.min(window.innerWidth - 48, 300);
    fond.innerHTML =
      '<div style="text-align:center">' +
      '<p id="pe-titre" style="color:#fff;font-family:sans-serif;margin:0 0 12px">Remets le cœur en ordre ♥</p>' +
      '<div id="pe-grille" style="width:'+taille+'px;height:'+taille+'px;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);gap:2px;background:#111;border-radius:8px;overflow:hidden;margin:0 auto"></div>' +
      '<button id="pe-fermer" style="margin-top:14px;padding:8px 18px;border:none;border-radius:6px;background:#e0202f;color:#fff;cursor:pointer">Fermer</button>' +
      '</div>';
    document.body.appendChild(fond);
    document.getElementById("pe-fermer").onclick = () => fond.remove();

    // mélange par coups valides = toujours résoluble
    pos = [...Array(9).keys()];
    for (let n = 0; n < 200; n++){
      const trou = pos.indexOf(8);
      const voisins = [trou-3, trou+3, trou%3 ? trou-1 : -1, trou%3 < 2 ? trou+1 : -1]
        .filter(v => v >= 0 && v < 9);
      const v = voisins[Math.random()*voisins.length|0];
      [pos[trou], pos[v]] = [pos[v], pos[trou]];
    }
    dessiner();
  }

  function dessiner(){
    const g = document.getElementById("pe-grille");
    g.innerHTML = "";
    const gagne = pos.every((p,i) => p === i);
    pos.forEach((p, i) => {
      const c = document.createElement("div");
      if (p === 8 && !gagne){ g.appendChild(c); return; } // trou (réaffiché si gagné)
      c.style.cssText = "background-image:url(\""+COEUR+"\");background-size:300% 300%;"+
        "background-position:"+(p%3)*50+"% "+((p/3|0)*50)+"%;cursor:pointer;";
      c.onclick = () => jouer(i);
      g.appendChild(c);
    });
    if (gagne) document.getElementById("pe-titre").textContent = "Bravo , E+M forever ! ♥";
  }

  function jouer(i){
    const trou = pos.indexOf(8);
    const adjacent = (Math.abs(trou - i) === 3) || (Math.abs(trou - i) === 1 && (trou/3|0) === (i/3|0));
    if (!adjacent) return;
    [pos[trou], pos[i]] = [pos[i], pos[trou]];
    dessiner();
  }

  function verifier(){ if (location.hash.toLowerCase() === "#eline") lancer(); }
  window.addEventListener("hashchange", verifier);
  verifier();
})();
