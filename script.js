// Menu All Sections - marche sur index.html et article.html
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.all-sections');
  var panel = document.getElementById('sectionsPanel');
  if (!btn || !panel) return;
  function closeMenu() { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== btn) closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
});

// Graphique : seulement sur article.html, sinon on ne fait rien
if (document.getElementById("graphique")) {
  /* Graphique Chart.js. Les données (objet « donnees ») sont dans data.js, chargé avant ce fichier. */

  // 2. Création du graphique (vide au départ)
  const periode = document.getElementById("periode");
  const sens = document.getElementById("sens");
  // Petit plugin : écrit le % au bout de chaque barre
  const valueLabels = {
    id: "valueLabels",
    afterDatasetsDraw(c) {
      const { ctx } = c; ctx.save(); ctx.font = '600 13px "Fira Sans", sans-serif'; ctx.textBaseline = "middle";
      c.data.datasets.forEach((ds, i) => {
        if (!c.isDatasetVisible(i)) return;
        c.getDatasetMeta(i).data.forEach((bar, j) => {
          const v = ds.data[j]; if (v == null) return;
          const xPointe = c.scales.x.getPixelForValue(v);
          ctx.fillStyle = ds.backgroundColor;
          ctx.textAlign = v > 0 ? "left" : "right";
          ctx.fillText((v > 0 ? "+" : "") + v.toFixed(1) + "%", xPointe + (v > 0 ? 6 : -6), bar.y);
        });
      });
      ctx.restore();
    }
  };

  const graphique = new Chart(document.getElementById("graphique"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        { label: "Scotland", data: [], backgroundColor: "#C47A1A" },
        { label: "UK", data: [], backgroundColor: "#E8C99A" }
      ]
    },
    options: {
      onClick: (evt, els) => { if (els.length) showDetail(els[0].index); }, // Interaction 3 sur le graphique : clic sur une barre
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "rect", font: { size: 13 } } } },
      indexAxis: "y",
      maintainAspectRatio: false,
      scales: {
        x: { min: -50, max: 40, title: { display: true, text: "Change in quantity bought (%)" } },
        y: { grid: { display: false } }
      }
    },
    plugins: [valueLabels]
  });

  // 3. Mise à jour du graphique quand on change une liste
  function afficher() {
    const d = donnees[periode.value + "-" + sens.value];
    graphique.data.labels = d.labels;
    graphique.data.datasets[0].data = d.scotland;
    graphique.data.datasets[1].data = d.uk;
    graphique.update();
    const detail = document.getElementById("detail");
    if (detail) detail.textContent = "Click a bar to see the quantities behind it.";
    const sousTitre = document.getElementById("viz-subtitle");
    if (sousTitre) {
      const periodeTexte = periode.value === "long" ? "2005-06 to 2024-25" : "2019-20 to 2024-25";
      sousTitre.textContent = "Change in the average quantity bought per person, Scotland, " + periodeTexte + ".";
    }
  }
  // Affiche le détail quand on clique sur une barre
  function showDetail(index) {
    const d = donnees[periode.value + "-" + sens.value];
    const detail = document.getElementById("detail");
    if (!detail) return;
    detail.textContent = d.labels[index] + ": Scotland " + (d.scotland[index] > 0 ? "+" : "") + d.scotland[index].toFixed(1) + "%, UK " + (d.uk[index] > 0 ? "+" : "") + d.uk[index].toFixed(1) + "%.";
  }
  periode.addEventListener("change", afficher);
  sens.addEventListener("change", afficher);
  afficher();
}
