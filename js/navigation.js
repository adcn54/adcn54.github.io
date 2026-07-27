// Barre de navigation : ouverture/fermeture du menu mobile, et surlignage
// du lien qui correspond à la section actuellement visible à l'écran.
// Expose initNavigation(), appelée depuis principal.js.

function initNavigation() {
  const bouton = document.getElementById("navigation-bouton");
  const liens = document.getElementById("navigation-liens");

  bouton.addEventListener("click", () => {
    const ouvert = liens.classList.toggle("est-ouvert");
    bouton.setAttribute("aria-expanded", String(ouvert));
  });

  // referme le menu mobile après un clic sur un lien
  liens.querySelectorAll("a").forEach((lien) => {
    lien.addEventListener("click", () => {
      liens.classList.remove("est-ouvert");
      bouton.setAttribute("aria-expanded", "false");
    });
  });

  // surligne le lien correspondant à la section visible au scroll
  const sections = document.querySelectorAll("section[id]");
  const lienPourSection = (id) => liens.querySelector(`a[href="#${id}"]`);

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        const lienActif = lienPourSection(entree.target.id);
        if (!lienActif) return;
        liens.querySelectorAll("a").forEach((a) => a.classList.remove("est-actif"));
        lienActif.classList.add("est-actif");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // déclenche quand la section traverse le milieu de l'écran
  );

  sections.forEach((section) => observateur.observe(section));
}
