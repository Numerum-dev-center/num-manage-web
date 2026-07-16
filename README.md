# num-manage-web

Frontend Next.js (App Router) du projet Numerum Dev Center.

## Prérequis

- Node.js ≥ 18
- pnpm ≥ 9 (`npm install -g pnpm` si besoin — le projet refuse npm/yarn via `preinstall`)

## Installation

```bash
pnpm install
```

## Configuration

Copiez `.env.example` en `.env` :

```bash
cp .env.example .env
```

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ne changez pas cette valeur — que vous utilisiez le mock ou la vraie API, elles
écoutent toutes les deux sur le port `3001` (une seule à la fois, voir plus bas).

## Lancer le projet

### Option A — En autonomie, sans backend réel (recommandé si vous n'avez pas
l'API NestJS / MySQL sous la main)

Deux terminaux :

```bash
# Terminal 1 : API simulée (json-server)
pnpm run mock-api

# Terminal 2 : le site
pnpm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Tout fonctionne :
connexion, dashboards par rôle, gestion des promotions et des apprenants,
espace apprenant. Les données vivent dans `mock-server/db.json` et vos
modifications (créer une promotion, affecter un apprenant...) y sont
sauvegardées automatiquement — donc conservées d'un lancement à l'autre.

**Comptes de test :**

| Rôle      | Email                | Mot de passe |
|-----------|-----------------------|--------------|
| Admin     | admin@numerum.com     | Admin123!    |
| Formateur | manager@numerum.com   | Manager123!  |
| Apprenant | student@numerum.com   | Student123!  |

Détails complets (ce qui est simulé, réinitialiser les données, cas du bouton
Google) : [`mock-server/README.md`](./mock-server/README.md).

### Option B — Avec la vraie API (num-manage-api + MySQL en local)

```bash
# Dans num-manage-api : pnpm run start:dev (voir son propre README)
# Ici :
pnpm run dev
```

Ne lancez **jamais** `pnpm run mock-api` et la vraie API en même temps : elles
utilisent le même port `3001` et se marchent dessus.

## Scripts disponibles

| Commande            | Effet                                              |
|----------------------|-----------------------------------------------------|
| `pnpm run dev`       | Lance le site en mode développement (port 3000)     |
| `pnpm run mock-api`  | Lance l'API simulée pour travailler hors-ligne       |
| `pnpm run build`     | Build de production                                  |
| `pnpm run start`     | Sert le build de production                          |
| `pnpm run lint`      | Vérifie le code (ESLint)                             |

## Problèmes fréquents

- **"Failed to fetch" / rien ne se connecte** : vérifiez qu'un des deux
  serveurs API (`pnpm run mock-api` OU la vraie API) tourne bien sur le port
  `3001`, et qu'aucun des deux ne tourne déjà dessus par ailleurs
  (`Get-Process node` sous PowerShell pour voir ce qui écoute).
- **Redirigé vers `/auth/login` en boucle** : le cookie `refreshToken` n'a pas
  été posé — reconnectez-vous ; si ça persiste, videz les cookies de
  `localhost` pour le site.
- **Après avoir tiré (`git pull`) des changements de routes** : videz le
  cache Next.js si le build ou le dev server se comporte bizarrement :
  `rm -rf .next` (ou supprimez le dossier `.next` à la main sous Windows) puis
  relancez.
- **Repartir d'un jeu de données propre côté mock** :
  `git checkout -- mock-server/db.json`.

## Pour aller plus loin

L'architecture du projet (routing, store d'auth, styling, conventions) est
documentée dans [`CLAUDE.md`](./CLAUDE.md).
