# MovieBooker

Projet Nest.js académique de reservation de films en ligne.

## Description

Ce projet contient plusieurs exercices afin de pratiquer et monter en compétences avec Nest.js.

### Exercices du jour 1 : [ExoJ1](ExoJ1/)

Dans un premier temps, deux exercices ont été réalisés en JS natif.

Exercie d'authentification avec base64 :

- [Authentification.js](ExoJ1/filtrage.js)

Exercie de filtrage de tableau :

- [Filtrage.js](ExoJ1/filtrage.js)

Plus d'information sur les exercices [ICI](ExoJ1/README.md).

---

### Projet Nest.js Hello World : [Hello World](hello-world/)

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

Résultat non fonctionnel :

![Image du test non fonctionnel](./Capture/TestHelloWorldNoFonctionnel.png)

Résultat fonctionnel :

![Image du test fonctionnel](./Capture/TestHelloWorldFonctionnel.png)

---
