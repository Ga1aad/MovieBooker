# MovieBooker

Projet Nest.js académique de reservation de films en ligne.

## Description

Ce projet contient plusieurs exercices afin de pratiquer et monter en compétences avec Nest.js.

### Exercices du jour 1 : [ICI](ExoJ1/)

Dans un premier temps, deux exercices ont été réalisés en JS natif.

Exercie d'authentification avec base64 :

- [Authentification.js](ExoJ1/filtrage.js)

Exercie de filtrage de tableau :

- [Filtrage.js](ExoJ1/filtrage.js)

Plus d'information sur les exercices [ICI](ExoJ1/README.md).

---

### Projet Nest.js Hello World : [ICI](hello-world/)

Nous avons initialiser un projet Nest.js "Hello World" afin d'analyser la structure type de ce projet.

Test de fonctionnement de l'application :

```bash
npm run start
```

Sur le port 3000, l'application affiche :

```bash
Hello World!
```

Pour comprendre la structure et le focntionnement :

Modification du message affiché depuis le fichier [app.service.ts](hello-world/src/app.service.ts) :

```TypeScript
@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World Galaad!";
  }
}
```

Test fonctionnel réaliser depuis le fichier [app.controller.spec.ts](hello-world/src/app.controller.spec.ts) :

```TypeScript
describe('root', () => {
  it('should return "Hello World Galaad!"', () => {
    expect(appController.getHello()).toBe('Hello World Galaad!');
  });
});
```

```bash
npm run test
```

Résultat avant modification de app.service.ts :

![Image du test non fonctionnel](./Capture/TestHelloWorldNoFonctionnel.png)

Résultat fonctionnel une fois la mise à jour effectuée :

![Image du test fonctionnel](./Capture/TestHelloWorldFonctionnel.png)

---

### Projet final Nest.js : [ICI](server/)

Génération du projet Nest.js :

```bash
nest new server
```

#### Configuration initiale

Nous avons implémenté un système d'authentification complet avec JWT dans notre projet.

Commencer par l'installation des dépendances nécessaires :

```bash
npm install @nestjs/jwt bcrypt @nestjs/passport passport passport-jwt @types/passport-jwt
npm install @nestjs/swagger swagger-ui-express
```

#### Création des endpoints d'authentification

Nous avons créé trois endpoints principaux Register, Login et Profile.

Nous avons connecté le projet avec Swagger pour permettre de:

- Tester les endpoints directement depuis l'interface
- Voir les schémas de données attendu
- Comprendre les différente réponses possibles

---

- **POST /auth/register** : Inscription d'un nouvel utilisateur
  - Validation des données avec class-validator
  - Hachage du mot de passe avec bcrypt
  - Sauvegarde en base de données PostgreSQL

![Interface Swagger Register](./Capture/Swagger1-register.png)

- **POST /auth/login** : Connexion d'un utilisateur
  - Vérification des identifiants
  - Génération d'un token JWT

![Interface Swagger Login](./Capture/Swagger1-login.png)

- **GET /auth/profile** : Route protégée nécessitant une authentification
  - Protection avec JWT Guard
  - Accessible uniquement avec un token valide

![Interface Swagger Profile](./Capture/Swagger1-profile.png)

Les schémas de données attendu sont :

![Schémas Swagger](./Capture/Swagger1-schemas.png)

#### Tests unitaires

Plusieurs tests unitaires ont été mises en place via les fichiers `.spec.ts`:

- Tests unitaires pour les DTOs
- Tests du service d'authentification
- Tests du contrôleur
- Tests de la stratégie JWT

Pour lancer les tests :

```bash
npm run test
```

Résultat des tests :

![Résultat des tests](./Capture/CaptureTestJ1.png)

#### 5. Utilisation

1. Démarrer le serveur :

```bash
npm run start:dev
```

2. Accéder à Swagger :
   http://localhost:3000/api

---

#### Jour 2 : Intégration de l'API TMDB

Nous avons ajouté l'intégration de l'API TMDB (The Movie Database) pour récupérer les informations sur les films.

#### Configuration de l'API TMDB

Installation des dépendances nécessaires :

```bash
npm install axios @nestjs/config
```

Configuration des variables d'environnement dans le fichier `.env` :

```env
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_API_KEY=votre_clé_api
```

#### Création du endpoint films

Nous avons créé un endpoint unique pour la gestion des films que l'on retrouve dans Swagger :

- **GET /movies** : Récupération de la liste des films
  - Pagination des résultats
  - Recherche par titre
  - Tri par popularité, date de sortie, vote moyen

![Interface Swagger Movies](./Capture/Swagger2-movies.png)

Nous avons ajouté directemnt les schémas de données :

- **MovieDto** : Structure des données d'un film

  - Informations de base (id, titre, synopsis)
  - Données de notation (vote_average, vote_count)
  - URLs des images
  - Genres

- **MovieResponseDto** : Structure de la réponse de plusieurs films paginée
  - Liste des films
  - Informations de pagination
  - Nombre total de résultats

![Schémas Swagger](./Capture/Swagger2-schemas.png)

#### Tests unitaires

De nouveaux tests unitaires ont été ajoutés :

- Tests pour les dto : MovieDto et MovieResponseDto
- Tests du service : MoviesService
- Tests du contrôleur : MoviesController
- Tests de transformation des données TMDB

Résultat des tests :

```bash
npm run test
```

![Résultat des tests](./Capture/CaptureTestJ2.png)

#### Utilisation

1. Démarrer le serveur :

```bash
npm run start:dev
```

2. Accéder à Swagger :
   http://localhost:3000/api

3. Tester l'endpoint /movies :

- S'identifier et recupérer l'access_token
- Utiliser l'access_token pour accéder à l'endpoint /movies
- Tester les différents paramètres de l'endpoint /movies

## Jour 3 : Système de Réservation de Films

Pour ce troisième jour, nous avons implémenté un système complet de réservation de films. Les utilisateurs peuvent désormais :

- Créer une réservation pour un film
- Consulter leurs réservations
- Annuler une réservation existante

### Endpoints de Réservation

Tous les endpoints de réservation nécessitent une authentification JWT.

#### 1. Créer une Réservation

- **POST** `/reservations`
- Permet de réserver un film pour une date et heure spécifiques
- Vérifie plusieurs conditions :
  - La date doit être dans le futur
  - Pas de chevauchement avec d'autres réservations
  - Le film doit exister
- Durée automatique de 2 heures par séance
  ![Création d'une réservation](Capture/Swagger3-reservation.png)

#### 2. Liste des Réservations

- **GET** `/reservations`
- Retourne toutes les réservations de l'utilisateur connecté
- Triées par date de séance
  ![Liste des réservations](Capture/Swagger3-reservationlist.png)

#### 3. Supprimer une Réservation

- **DELETE** `/reservations/{id}`
- Permet d'annuler une réservation existante
- Vérifie que :
  - La réservation existe
  - L'utilisateur est bien le propriétaire
  - La séance n'a pas encore commencé
    ![Suppression d'une réservation](Capture/Swagger3-resservation-deleted.png)
    Une fois la scéance bien suprimée, la liste des réservations est vide :
    ![Liste vide](Capture/Swagger3-reservationlist-empty.png)

### Gestion des Erreurs

Le système inclut une gestion des erreurs :

- Tentative de réservation dans le passé
  ![Erreur date passée](Capture/Swagger3-reservation-notinfuture.png)
- Conflit avec une réservation existante
  ![Erreur créneau occupé](Capture/Swagger3-reservation-alreadytaken.png)

### Tests Unitaires

Les nouveaux composants sont couverts par des tests unitaires exhaustifs :

```bash
npm run test
```

![Tests Jour 3](Capture/CaptureTestJ3.png)

Les tests incluent :

- `ReservationController` : Validation des endpoints et de la gestion des erreurs
- `ReservationService` : Logique métier et règles de réservation
- DTOs : Validation des données d'entrée/sortie
- Intégration avec le système d'authentification

### Utilisation

1. Démarrer le serveur :

```bash
npm run start:dev
```

2. Accéder à Swagger :
   http://localhost:3000/api

3. Tester l'endpoint /reservations :

- S'identifier et recupérer l'access_token
- Utiliser l'access_token pour accéder à l'endpoint /reservations
- Créer une réservation
- Lister les réservations
- Supprimer une réservation
- Vérifier que la réservation est bien supprimée de la liste

## Ressources

### ExoJ1

- Lien d'aide pour Authentification.js : [www.digitalocean.com](https://www.digitalocean.com/community/tutorials/how-to-encode-and-decode-strings-with-base64-in-javascript).

### Projet Nest.js Hello World

- Lien d'aide pour prendre en main Nest.js : [nestjs.com](https://docs.nestjs.com/first-steps).

### Projet final Nest.js

- [Lien d'aide pour la partie authentification](https://www.linkedin.com/pulse/nestjs-app-authentication-login-signup-moaz-irfan).
- [Lien d'aide pour la partie authentification](https://pietrzakadrian.com/blog/nestjs-authentication-series/user-registration/).
