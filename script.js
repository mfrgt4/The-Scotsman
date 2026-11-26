// Graphique Chart.js de la page index.html
// Chargé depuis un lien CDN
// Les données (donnees) sont dans data.js, chargé avant ce fichier.
// Evolution en % des quantités achetées par personne par semaine, en Écosse contre UK, pour les 5 plus fortes hausses ou les 5 plus fortes baisses selon la période


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
    return;
  }
  const i = elements[0].index;
  const d = donneesChoisies();
  detail.textContent = d.labels[i] + " : Scotland " + formater(d.scotland[i]) + ", UK " + formater(d.uk[i]) + ".";
}

// plugin : écrit la valeur (avec le %) au bout de chaque barre
const valeursSurBarres = {
  id: "valeursSurBarres",
  afterDatasetsDraw: function (chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "600 13px 'Fira Sans', sans-serif";
    ctx.textBaseline = "middle";

    // une boucle par série : s = 0 pour Scotland, s = 1 pour UK --> arriver à 2, on arrête
    for (let s = 0; s < chart.data.datasets.length; s++) {
      if (chart.isDatasetVisible(s) === false) {
        continue;
      }
      const serie = chart.data.datasets[s];
      const barres = chart.getDatasetMeta(s).data;

      // une boucle par barre
      for (let i = 0; i < serie.data.length; i++) {
        const valeur = serie.data[i];
        const x = chart.scales.x.getPixelForValue(valeur);
        const y = barres[i].y;
        if (valeur > 0) {
          ctx.textAlign = "left";
          ctx.fillText(formater(valeur), x + 6, y);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(formater(valeur), x - 6, y);
        }
      }
    }
    ctx.restore(); // on remet les réglages
  }
};

// création du graphique (vide au départ, rempli par afficher())
const graphique = new Chart(document.getElementById("graphique"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      { label: "Scotland", data: [], backgroundColor: "#C47A1A" },  // doré foncé pour SCOTLAND
      { label: "UK", data: [], backgroundColor: "#E8C99A" }         // doré clair pour UK
    ]
  },
  options: {
    indexAxis: "y",
    maintainAspectRatio: false,
    onClick: afficherDetail,
    scales: {
      x: { min: -50, max: 40, title: { display: true, text: "Change in quantity bought (%)" } }
    }
  },
  plugins: [valeursSurBarres]
});

// met à jour le graphique quand on change de période ou de tri, l'appelle, et refait le graphique
function afficher() {
  const d = donneesChoisies();
  graphique.data.labels = d.labels;
  graphique.data.datasets[0].data = d.scotland;
  graphique.data.datasets[1].data = d.uk;
  graphique.update();

  if (periode.value === "long") { // quel bouton de période est choisi
    sousTitre.textContent = "Change in the average quantity bought per person, Scotland, 2005-06 to 2024-25.";
  } else {
    sousTitre.textContent = "Change in the average quantity bought per person, Scotland, 2019-20 to 2024-25.";
  }
  detail.textContent = "Click a bar to see the quantities behind it."; // phrase de base en dessous du graphique
}

// quand on change une liste, on met à jour
periode.addEventListener("change", afficher);
sens.addEventListener("change", afficher);

afficher(); // affichage au chargement de la page