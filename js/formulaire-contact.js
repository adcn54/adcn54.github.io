// Formulaire de contact : à la soumission, on ouvre le client mail de
// l'utilisateur (lien mailto:) en pré-remplissant le sujet et le corps
// du message avec les infos saisies dans le formulaire.
// Expose initFormulaireContact(), appelée depuis principal.js.

const EMAIL_CONTACT = "contact.adcn57@gmail.com";

function initFormulaireContact() {
  const formulaire = document.getElementById("formulaire-contact");
  const note = document.getElementById("note-formulaire");

  formulaire.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const nom = formulaire.elements["name"].value.trim();
    const prenom = formulaire.elements["firstname"].value.trim();
    const message = formulaire.elements["message"].value.trim();

    const sujet = `Message de contact de ${nom}`;
    const corps = `Nom : ${nom}\nPrénom : ${prenom}\n\n${message}`;

    const lienMailto = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

    window.location.href = lienMailto;

    note.textContent = "Ta messagerie va s'ouvrir avec le message pré-rempli — il ne te reste qu'à l'envoyer. \n Si tu ne vois pas ta messagerie s'ouvrir, tu peux directement envoyer un mail à l'adresse suivante : " + EMAIL_CONTACT;
    formulaire.reset();
  });
}
