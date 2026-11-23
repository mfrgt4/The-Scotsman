/* Données du graphique : valeurs de l'onglet « Graphique » du fichier Excel (évolution en %).
   Période : "long" = 2005-06 → 2024-25, "recent" = 2019-20 → 2024-25 ;
   "hausses" = 5 plus fortes hausses, "baisses" = 5 plus fortes baisses. */
   
const donnees = {
  "long-hausses": {
    labels: ["Cheese", "Confectionery", "Other fresh vegetables", "Other cereals", "Biscuits and crispbreads"],
    scotland: [22.9, 11.6, 10.0, 5.5, 2.6],
    uk: [11.2, 3.1, -7.1, -0.9, -4.2]
  },
  "long-baisses": {
    labels: ["Bread", "Other milk and cream", "Fats", "Fresh fruit", "Fish"],
    scotland: [-37.0, -30.1, -20.9, -14.5, -14.4],
    uk: [-37.4, -24.4, -24.5, -17.5, -25.4]
  },
  "recent-hausses": {
    labels: ["Cheese", "Fresh green vegetables", "Fish", "Other fresh vegetables", "Processed vegetables"],
    scotland: [22.7, 17.2, 15.0, 11.7, 2.6],
    uk: [-0.5, -14.9, -15.9, -11.4, -7.9]
  },
  "recent-baisses": {
    labels: ["Other milk and cream", "Biscuits and crispbreads", "Bread", "Processed potatoes", "Confectionery"],
    scotland: [-23.7, -18.9, -14.2, -10.7, -9.4],
    uk: [-18.8, -8.5, -16.3, -11.0, -11.5]
  }
};
