# Mock API (json-server)

Serveur mock permettant de développer le frontend **sans lancer l'API NestJS ni
MySQL**. Il reproduit les endpoints réels utilisés par l'app (mêmes routes,
mêmes formes de réponse) à partir d'un simple fichier JSON.

## Démarrage

```bash
pnpm run mock-api
```

Le serveur écoute par défaut sur `http://localhost:3001` — exactement le port
attendu par `NEXT_PUBLIC_API_URL` (voir `.env.example`). Aucune autre
configuration n'est nécessaire : lancez `pnpm run dev` dans un autre terminal
et l'app pointe automatiquement dessus.

Ne lancez pas la vraie API en même temps sur le même port : le mock la
remplace, il ne la complète pas.

## Comptes de test

| Rôle      | Email                  | Mot de passe   |
|-----------|-------------------------|----------------|
| Admin     | admin@numerum.com       | Admin123!      |
| Formateur | manager@numerum.com     | Manager123!    |
| Apprenant | student@numerum.com     | Student123!    |

Deux apprenants (`student@numerum.com`, `student2@numerum.com`) sont déjà
affectés à la promotion « Promotion 2026 - Fullstack », un troisième
(`student3@numerum.com`) n'a pas de promotion.

## Connexion Google (bouton "Continuer avec Google")

Le vrai flux OAuth Google n'est pas simulable hors-ligne. `GET /auth/google`
saute directement à l'étape finale : il connecte un utilisateur de test et
redirige vers `/auth/google/callback` comme le ferait la vraie API après
consentement. Utilisez `?as=admin`, `?as=manager` ou `?as=student` sur le
bouton/lien pour choisir quel compte est utilisé (`student` par défaut).

## Ce qui est simulé

- Auth : `POST /auth/login`, `/register`, `/refresh`, `/logout`, `GET /auth/me`
  (jeton et cookie `refreshToken` fictifs, pas de vrai JWT — suffisant pour
  développer les écrans)
- `GET/POST/PATCH/DELETE /users`, `PATCH /users/me`, `/users/:id/toggle-active`
- `GET/POST/PATCH /promotions`, `PATCH /promotions/:id/archive`,
  `PATCH /promotions/:id/apprenants`, `DELETE /promotions/:id/apprenants/:userId`
- `GET /mon-espace/ma-promotion`

Les réponses incluent les mêmes relations imbriquées que la vraie API
(`promotion` sur un utilisateur, `apprenants`/`formateur` sur une promotion).

## Données

Tout est stocké dans `db.json`. Les mutations (création, édition, archivage...)
sont écrites dedans par json-server — vos modifications restent locales à
votre poste. Pour repartir d'un état propre, restaurez `db.json` depuis git
(`git checkout -- mock-server/db.json`).

## Variables d'environnement optionnelles

- `MOCK_PORT` — port d'écoute (défaut `3001`)
- `FRONTEND_URL` — origine autorisée en CORS (défaut `http://localhost:3000` ,https://num-manage-web.vercel.app)
