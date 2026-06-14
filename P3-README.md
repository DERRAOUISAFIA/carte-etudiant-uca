# E-Carte Étudiant UCA

Système de carte étudiant numérique pour l'Université Cadi Ayyad — monorepo pnpm.

## Architecture

```
carte-etudiant-uca/
├── apps/
│   ├── api/          → Backend NestJS (P3) — port 3000
│   └── ecarte/       → PWA Next.js étudiant (P1/P2/P5) — port 3002
├── prisma/
│   └── schema.prisma → Schéma partagé
└── docker-compose.yml → PostgreSQL local
```

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | NestJS 10 + TypeScript |
| Auth | BetterAuth (sessions + emailOTP) |
| Base de données | PostgreSQL 15 + Prisma ORM |
| JWT QR | jose (RS256, TTL 5min) |
| Upload photos | Cloudflare R2 (S3-compatible) |
| Frontend | Next.js 16 + Tailwind + Serwist (PWA) |
| Monorepo | pnpm workspaces |

---

## Démarrage local

### Prérequis
- Node.js >= 18
- pnpm >= 8
- Docker Desktop

### 1. Cloner et installer

```bash
git clone https://github.com/soufianeboulaarab-cmyk/carte-etudiant-uca.git
cd carte-etudiant-uca
cd apps/api && pnpm install
```

### 2. Variables d'environnement

```bash
cp apps/api/.env.example apps/api/.env
```

Remplir dans `apps/api/.env` :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carte_etudiant
BETTER_AUTH_SECRET=<chaine_aleatoire_32_chars>
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<cle_r2>
R2_SECRET_ACCESS_KEY=<secret_r2>
R2_BUCKET=carte-etudiant-photos
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
PORT=3000
```

### 3. Clés RS256

```bash
mkdir apps/api/keys
openssl genrsa -out apps/api/keys/private.pem 2048
openssl rsa -in apps/api/keys/private.pem -pubout -out apps/api/keys/public.pem
```

### 4. Base de données

```bash
docker compose up -d
cd apps/api
npx prisma generate --schema=../../prisma/schema.prisma
pnpm prisma migrate dev --name init --schema=../../prisma/schema.prisma
```

### 5. Lancer l'API

```bash
cd apps/api
pnpm start:dev
```

API disponible sur `http://localhost:3000`  
Swagger sur `http://localhost:3000/api/docs`

---

## Endpoints /card/*

### Rôle STUDENT

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/card/me` | Carte étudiant complète |
| GET | `/card/qr` | JWT RS256 QR (7h-21h, carte active) |
| GET | `/card/scans/me` | Historique de ses scans |
| GET | `/card/devices` | Liste ses appareils |
| POST | `/card/devices/register` | Enregistrer un appareil (max 2) |
| POST | `/card/devices/confirm` | Confirmer via OTP |
| DELETE | `/card/devices/:id` | Supprimer un appareil |

### Rôle SCOLARITE

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/card/verify` | Vérifier un JWT RS256 issu du QR |
| POST | `/card/scan-log` | Enregistrer un scan |
| GET | `/card/scans` | Tous les scans (filtres: search, filiere, etablissement) |
| POST | `/card/photo/:userId` | Upload photo vers R2 |

---

## Authentification

BetterAuth gère les sessions. Toutes les requêtes doivent inclure :

```
Authorization: Bearer <session_token>
```

Le token est obtenu via `POST /api/auth/sign-in/email`.

### Créer un compte test

```bash
# Étudiant
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{"email":"etudiant@test.ma","password":"Test1234!","name":"Ahmed Benali"}'

# Login
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{"email":"etudiant@test.ma","password":"Test1234!"}'
```

---

## Logique métier

### Année d'inscription
- Mois >= 9 (septembre) → `"2025/2026"`
- Mois < 9 → `"2024/2025"`

### QR Code JWT RS256
- Signé avec clé privée RS256
- TTL : **5 minutes**
- Payload : `{ studentId, cne, apogee, iat, exp }`
- Disponible uniquement entre **7h et 21h** (fuseau Maroc UTC+1)
- Carte suspendue (`cardActive: false`) → `403`

### Vérification QR (`POST /card/verify`)
| Cas | Réponse |
|---|---|
| Token valide | `{ valid: true, student: {...} }` |
| Token expiré | `{ valid: false, reason: "QR_EXPIRED" }` |
| Carte suspendue | `{ valid: false, reason: "CARD_SUSPENDED" }` |
| JWT falsifié | `401 Token JWT invalide` |

### Appareils
- Maximum **2 appareils** par étudiant
- Confirmation via OTP email (BetterAuth emailOTP)

---

## Modèles Prisma

```
User          → compte BetterAuth + rôle (STUDENT / SCOLARITE / ADMIN)
StudentInfo   → CNE, Apogée, filière, établissement, photo, cardActive
Device        → appareils enregistrés (max 2 par étudiant)
ScanLog       → historique des scans QR
Session       → sessions BetterAuth
Account       → comptes OAuth BetterAuth
Verification  → OTP BetterAuth
```

---

## Responsabilités par personne

| Personne | Périmètre |
|---|---|
| P1 | Scaffold monorepo, PWA ecarte, auth frontend |
| P2 | Dashboard étudiant, page devices, flow OTP |
| P3 | CardModule NestJS, JWT RS256, upload R2 |
| P4 | Scanner scolarité, dashboard scans EduDocs |
| P5 | Composant carte QR, timer 5min, auto-refresh |
| P6 | Tests unitaires, seed, déploiement, export CSV |
