// Données utilisateur
const jsonUser = {
  id: 1,
  username: "Galaad",
  email: "galaad@gmail.com",
};

// Fonction de génération du token
function generateToken(user) {
  const userData = JSON.stringify(user);
  const token = btoa(userData);
  return token;
}

// Fonction de vérification du token
function verifyToken(token) {
  const userData = atob(token);
  const jsonUser = JSON.parse(userData);
  return jsonUser;
}

/* Test d'authentification */
// Génération du token
const token = generateToken(jsonUser);
console.log("Token généré : ", token);
// Vérification des informations de l'utilisateur via le décodage du token
const user = verifyToken(token);
console.log("Différence entre jsonUser et user : ", jsonUser === user);
console.log("Utilisateur vérifié : ", user);
