# Carte Étudiant UCA — Monorepo

Système de carte étudiante numérique PWA pour l'Université Cadi Ayyad.

## Architecture

```
carteEtudiant/
├── apps/
│   ├── ecarte/        # PWA étudiant (Next.js + Serwist)
│   └── api/           # Backend NestJS (à créer par P3)
├── prisma/
│   └── schema.prisma  # Schéma DB (à créer par P3)
└── docker-compose.yml # PostgreSQL 15
```

## Prérequis

- Node.js >= 18
- pnpm >= 8
- Docker (pour PostgreSQL)

## Installation

```bash
# Cloner le repo
git clone <repo-url>
cd carteEtudiant

# Installer les dépendances
pnpm install

# Démarrer PostgreSQL
docker compose up -d
```

## Configuration

### apps/ecarte/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### apps/api/.env (à créer par P3)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carte_etudiant
FRONTEND_URL=http://localhost:3001
BETTER_AUTH_SECRET=<générer avec openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

## Démarrage

### Backend API (P3)

```bash
cd apps/api
pnpm prisma migrate dev --name init
pnpm start:dev  # Port 3000
```

### PWA Étudiant (ecarte)

```bash
pnpm dev:ecarte  # Port 3001
```

Ouvrir http://localhost:3001

## Structure apps/ecarte

```
apps/ecarte/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Redirect → /login
│   │   ├── login/page.tsx     # Connexion @uca.ma
│   │   ├── register/page.tsx  # Inscription
│   │   └── card/page.tsx      # Carte + QR (P5)
│   ├── lib/
│   │   ├── auth-client.ts     # BetterAuth client
│   │   └── api.ts             # Fetch wrapper
│   └── sw.ts                  # Service Worker Serwist
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # 192.png, 512.png (à générer)
└── next.config.ts             # Config Serwist
```

## Fonctionnalités PWA

### Service Worker (Serwist)

| Route | Stratégie | Durée Cache |
|-------|-----------|-------------|
| `/card/me` | StaleWhileRevalidate | 24h |
| Photos R2 | CacheFirst | 7 jours |
| `/card/qr` | NetworkOnly | — |
| Assets Next.js | CacheFirst | 30 jours |

### Manifest PWA

- **Nom** : E-Carte UCA
- **Couleur** : #102447 (bleu UCA)
- **Mode** : standalone
- **Start URL** : /card

## Endpoints API (P3)

### Auth (BetterAuth)
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`

### Card
- `GET /card/me` — Infos étudiant
- `GET /card/qr` — JWT RS256 (5min TTL)
- `GET /card/scans/me?page&limit` — Historique
- `GET /card/devices` — Appareils (max 2)
- `POST /card/devices/register` — OTP enregistrement
- `POST /card/devices/confirm` — Confirmer OTP
- `DELETE /card/devices/:id` — Révoquer

Swagger : http://localhost:3000/api/docs

## Validation @uca.ma

Seuls les emails `@uca.ma` sont acceptés :
- ✅ `m.alami@uca.ma`
- ❌ `test@gmail.com`

Validation côté client (login/register) + serveur (BetterAuth).

## Installation PWA

1. Ouvrir ecarte.uca.ma sur mobile
2. Navigateur propose "Installer l'application"
3. Ajouter à l'écran d'accueil
4. Lancer comme app native

## Icônes PWA

Générer deux icônes PNG dans `apps/ecarte/public/icons/` :
- `192.png` (192x192px)
- `512.png` (512x512px)

Outils : Figma, Canva, ou https://realfavicongenerator.net/

Fond recommandé : `#102447` (bleu UCA)

## Répartition des Tâches

### P1 (✅ Terminé) — Architecture & Scaffold
- ✅ Monorepo pnpm + docker-compose
- ✅ apps/ecarte Next.js + Tailwind + Serwist
- ✅ PWA manifest + config service worker
- ✅ Pages auth `/login` `/register`
- ✅ BetterAuth client + API wrapper
- ⚠️ Icônes PWA (à générer)

### P2 — Dashboard & Appareils
- Page `/dashboard` — historique scans
- Page `/devices` — gestion appareils + OTP

### P3 — Backend NestJS
- CardModule complet
- Endpoints `/card/*`
- JWT RS256 (jose)
- Upload photo R2
- Swagger

### P5 — QR Display
- Composant `<ECarteCard />`
- Page `/card` avec QR + timer 5min
- Auto-refresh JWT
- États offline/suspendu

## Commandes Utiles

```bash
# Démarrer PostgreSQL
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down

# Installer deps racine
pnpm install

# Dev ecarte
pnpm dev:ecarte

# Build ecarte
pnpm --filter ecarte build
```

## Déploiement

- **Frontend** : Vercel
- **Backend** : Railway / Render
- **DB** : PostgreSQL 15 (Railway / Supabase)
- **Storage** : Cloudflare R2

Variables d'environnement production :
- `NEXT_PUBLIC_API_URL` → URL API production
- `DATABASE_URL` → PostgreSQL production
- `FRONTEND_URL` → URL frontend production

## Support

Pour questions : contacter le chef de projet ou voir `cdc.md`
