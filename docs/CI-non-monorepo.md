# CI pour projet non-monorepo (client + server séparés)

> Ce guide explique comment adapter un pipeline GitHub Actions conçu pour un monorepo afin qu'il fonctionne sur un dépôt avec deux projets séparés : `client/` et `server/`.

## Principe

- Chaque projet a son propre job (ou sa propre matrice) dans le workflow.
- On utilise `working-directory` pour exécuter commandes dans `client/` et `server/`.
- On met en cache les dépendances séparément (clé distincte pour `client` et `server`).

## Structure recommandée

```
/
├─ client/
│  ├─ package.json
│  └─ ...
├─ server/
│  ├─ package.json
│  └─ ...
├─ .github/
│  └─ workflows/ci.yml   # workflow CI principal
```

Le workflow existant est à : [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Exemple minimal de workflow

Voici un exemple de `jobs` pour construire/tester le `client` et le `server` séparément. Collez ce bloc dans votre workflow GitHub Actions.

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  client:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Cache client dependencies
        uses: actions/cache@v4
        with:
          path: client/node_modules
          key: client-deps-${{ runner.os }}-node-${{ hashFiles('client/**/package-lock.json') }}
          restore-keys: |
            client-deps-${{ runner.os }}-node-

      - name: Install client deps
        run: npm ci
        working-directory: client

      - name: Build client
        run: npm run build
        working-directory: client

      - name: Test client
        run: npm test --silent
        working-directory: client

  server:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Cache server dependencies
        uses: actions/cache@v4
        with:
          path: server/node_modules
          key: server-deps-${{ runner.os }}-node-${{ hashFiles('server/**/package-lock.json') }}
          restore-keys: |
            server-deps-${{ runner.os }}-node-

      - name: Install server deps
        run: npm ci
        working-directory: server

      - name: Build server
        run: npm run build
        working-directory: server

      - name: Test server
        run: npm test --silent
        working-directory: server
```

Remarques :
- Remplacez `npm ci` par `yarn install --frozen-lockfile` ou la commande adaptée à votre gestionnaire de paquets.
- Utilisez `hashFiles('client/**/package-lock.json')` (ou `yarn.lock`) pour régénérer la clé de cache lorsque les dépendances changent.

## Variantes utiles

- Exécuter `client` et `server` en parallèle (déjà le cas ci‑dessus) pour accélérer les runs.
- Utiliser une `matrix` si vous devez tester plusieurs versions de Node :

```yaml
strategy:
  matrix:
    node: [16, 18]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node }}
```

- Si vous devez démarrer une base de données ou d'autres services, utilisez `services:` sur le job (ex : postgres, redis) ou démarrez via `docker-compose` en positionnant `working-directory` si nécessaire.

## Dépendances entre jobs

Si le `server` doit construire un artefact utilisé par le `client` (ou inversement), vous pouvez :

- Avoir un job `build-server` qui publie un artefact (`actions/upload-artifact`) et un job `build-client` qui télécharge cet artefact (`actions/download-artifact`) en utilisant `needs: build-server`.

## Exemples de commandes locales

Tester localement avant de pousser :

```bash
# client
cd client && npm ci && npm test

# server
cd server && npm ci && npm test
```

Pour simuler GitHub Actions localement, vous pouvez utiliser `act` (outil tiers).

## Conseils et bonnes pratiques

- Séparez les caches par répertoire pour éviter les conflits.
- Gardez les jobs petits et ciblés : lint, install, build, test.
- Évitez d'installer les dépendances globalement pour l'ensemble du repo — installez dans chaque `working-directory`.
- Ajoutez des artefacts si vous avez besoin d'exposer des bundles (ex : build statique) entre jobs.

## Où intégrer ce guide

Placez ce fichier dans le dossier `docs/` pour référence : `docs/CI-non-monorepo.md`.

Si vous souhaitez, je peux :
- Ajouter un workflow complet adapté à votre repo et vos scripts `package.json`.
- Implémenter la logique d'artefacts ou de services Docker (postgres, redis).

---
Fichier de référence workflow actuel : [.github/workflows/ci.yml](.github/workflows/ci.yml)
