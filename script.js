// Graphique Chart.js de la page index.html
// Chargé depuis un lien CDN
// Les données (donnees) sont dans data.js, chargé avant ce fichier.
// Les scripts sont à la fin du body : les éléments de la page existent déjà.

// éléments de la page
const periode = document.getElementById("periode");         // liste Period
const sens = document.getElementById("sens");               // liste Show
const sousTitre = document.getElementById("viz-subtitle");  // sous-titre de la figure
const detail = document.getElementById("detail-graphique"); // texte sous le graphique

// renvoie les données choisies dans les deux listes, ex : "long-hausses"
function donneesChoisies() {
  return donnees[periode.value + "-" + sens.value];
}

// écrit le nombre avec le signe : 22.9 donne "+22.9%"
function formater(valeur) {
  let texte = valeur.toFixed(1) + "%";
  if (valeur > 0) {
    texte = "+" + texte;
  }
  return texte;
}

// clic sur une barre : on affiche ses chiffres sous le graphique
function afficherDetail(evenement, elements) {
  if (elements.length === 0) {
    return;                                  // clic à côté d'une barre
  }
  const i = elements[0].index;               // numéro de la barre cliquée
  const d = donneesChoisies();
  detail.textContent = d.labels[i] + " : Scotland " + formater(d.scotland[i]) + ", UK " + formater(d.uk[i]) + ".";
}

// plugin : écrit la valeur au bout de chaque barre, dans la couleur de la barre
const valeursSurBarres = {
  id: "valeursSurBarres",
  afterDatasetsDraw: function (chart) {      // appelé après le dessin des barres
    const ctx = chart.ctx;
    ctx.save();                              // pour ne pas changer le style du reste du graphique
    ctx.font = "600 13px 'Fira Sans', sans-serif";
    ctx.textBaseline = "middle";

    // s = 0 pour Scotland, s = 1 pour UK
    for (let s = 0; s < chart.data.datasets.length; s++) {
      if (chart.isDatasetVisible(s) === false) {
        continue;                            // série cachée avec la légende
      }
      const serie = chart.data.datasets[s];
      const barres = chart.getDatasetMeta(s).data;
      ctx.fillStyle = serie.backgroundColor;

      for (let i = 0; i < serie.data.length; i++) {
        const valeur = serie.data[i];
        const x = chart.scales.x.getPixelForValue(valeur);   // bout de la barre
        const y = barres[i].y;                                // milieu de la barre
        if (valeur > 0) {
          ctx.textAlign = "left";                             // positif : texte à droite
          ctx.fillText(formater(valeur), x + 6, y);
        } else {
          ctx.textAlign = "right";                            // négatif : texte à gauche
          ctx.fillText(formater(valeur), x - 6, y);
        }
      }
    }
    ctx.restore();
  }
};

// création du graphique (vide au départ, rempli par afficher())
const graphique = new Chart(document.getElementById("graphique"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      { label: "Scotland", data: [], backgroundColor: "#C47A1A" },  // doré foncé
      { label: "UK", data: [], backgroundColor: "#E8C99A" }         // doré clair
    ]
  },
  options: {
    indexAxis: "y",                // barres horizontales
    maintainAspectRatio: false,    // la hauteur vient du CSS
    onClick: afficherDetail,
    scales: {
      x: { min: -50, max: 40, title: { display: true, text: "Change in quantity bought (%)" } }
    }
  },
  plugins: [valeursSurBarres]
});

// met à jour le graphique selon les deux listes
function afficher() {
  const d = donneesChoisies();
  graphique.data.labels = d.labels;
  graphique.data.datasets[0].data = d.scotland;
  graphique.data.datasets[1].data = d.uk;
  graphique.update();

  if (periode.value === "long") {
    sousTitre.textContent = "Change in the average quantity bought per person, Scotland, 2005-06 to 2024-25.";
  } else {
    sousTitre.textContent = "Change in the average quantity bought per person, Scotland, 2019-20 to 2024-25.";
  }
  detail.textContent = "Click a bar to see the quantities behind it.";
}

// quand on change une liste, on met à jour
periode.addEventListener("change", afficher);
sens.addEventListener("change", afficher);

afficher();   // affichage au chargement de la page