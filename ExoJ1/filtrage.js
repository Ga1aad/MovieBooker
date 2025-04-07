// Tableau de films
const movies = [
  { id: 1, name: "Movie1", category: "Action" },
  { id: 2, name: "Movie2", category: "Comedy" },
  { id: 3, name: "Movie3", category: "Action" },
  { id: 4, name: "Movie4", category: "Comedy" },
];

// Fonction de filtrage par catégorie
function categoryFilter(tab, filter) {
  return tab.filter((movie) => movie.category === filter);
}

// Fonction de filtrage par id, et par extension filtrage par nombre avec possibilité de supérieur ou inférieur
function idFilter(tab, filter) {
  if (typeof filter === "number") {
    return tab.filter((movie) => movie.id === filter);
  } else if (
    typeof filter === "object" &&
    filter.hasOwnProperty("greaterThan")
  ) {
    return tab.filter((movie) => movie.id > filter.greaterThan);
  } else if (typeof filter === "object" && filter.hasOwnProperty("lessThan")) {
    return tab.filter((movie) => movie.id < filter.lessThan);
  }
  return [];
}

// Test de la fonction categoryFilter
console.log(
  "Filtrage des films dont la catégorie est 'Action' :\n",
  categoryFilter(movies, "Action")
);

// Test de la fonction idFilter
console.log("Filtrage des films dont l'id est 1 :\n", idFilter(movies, 1));
console.log(
  "Filtrage des films dont l'id est supérieur à 2 :\n",
  idFilter(movies, { greaterThan: 2 })
);
console.log(
  "Filtrage des films dont l'id est inférieur à 3 :\n",
  idFilter(movies, { lessThan: 3 })
);
