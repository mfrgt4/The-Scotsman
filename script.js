// Graphique Chart.js de la page index.html
// Les données (objet "donnees") sont dans data.js, chargé avant ce fichier.

// On attend que la page soit chargée avant de chercher les éléments
document.addEventListener("DOMContentLoaded", function () {

  // 1. Les éléments de la page
  const periode = document.getElementById("periode");       // liste Period
  const sens = document.getElementById("sens");             // liste Show
  const sousTitre = document.getElementById("viz-subtitle"); // sous-titre de la figure
  const detail = document.getElementById("detail-graphique");         // texte sous le graphique

  // 2. Écrit un nombre avec son signe : 22.9 donne "+22.9%"
  function formater(valeur) {
    const signe = valeur > 0 ? "+" : "";
    return signe + valeur.toFixed(1) + "%";
  }

  // 3. Quand on clique sur une barre, on affiche les chiffres en dessous
  function afficherDetail(evenement, elements) {
    if (elements.length === 0) return;               // clic à côté d'une barre : on ne fait rien
    const i = elements[0].index;                     // numéro de la barre cliquée
    const d = donnees[periode.value + "-" + sens.value];
    detail.textContent = d.labels[i] + " : Scotland " + formater(d.scotland[i]) + ", UK " + formater(d.uk[i]) + ".";
  }

  // 4. Petit plugin : écrit la valeur (avec le %) au bout de chaque barre
  const valeursSurBarres = {
    id: "valeursSurBarres",
    afterDatasetsDraw: function (chart) {             // appelé juste après le dessin des barres
      const ctx = chart.ctx;                          // le "stylo" pour écrire sur le canvas
      ctx.save();                                     // on garde le style actuel
      ctx.font = "600 13px 'Fira Sans', sans-serif";  // police du texte
      ctx.fillStyle = "#111";                         // texte foncé pour bien lire
      ctx.textBaseline = "middle";                    // texte centré sur la hauteur de la barre

      chart.data.datasets.forEach(function (serie, s) {      // pour Scotland, puis pour UK
        if (!chart.isDatasetVisible(s)) return;              // série masquée avec la légende : on saute
        const barres = chart.getDatasetMeta(s).data;         // les barres de cette série
        barres.forEach(function (barre, i) {
          const valeur = serie.data[i];                      // valeur de la barre
          const x = chart.scales.x.getPixelForValue(valeur); // position du bout de la barre
          if (valeur > 0) {
            ctx.textAlign = "left";                          // barre positive : texte à droite du bout
            ctx.fillText(formater(valeur), x + 6, barre.y);
          } else {
            ctx.textAlign = "right";                         // barre négative : texte à gauche du bout
            ctx.fillText(formater(valeur), x - 6, barre.y);
          }
        });
      });

      ctx.restore();                                  // on remet le style d'avant
    }
  };

  // 5. Création du graphique (vide au départ)
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
      onClick: afficherDetail,       // clic sur une barre
      scales: {
        x: { min: -50, max: 40, title: { display: true, text: "Change in quantity bought (%)" } }
      }
    },
    plugins: [valeursSurBarres]      // on active le plugin des valeurs
  });

  // 6. Met à jour le graphique selon les deux listes
  function afficher() {
    const d = donnees[periode.value + "-" + sens.value];   // ex : "long-hausses"
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

  // 7. Quand on change une liste, on met à jour
  periode.addEventListener("change", afficher);
  sens.addEventListener("change", afficher);

  afficher();   // affichage au chargement de la page
});
