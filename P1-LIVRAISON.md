# 📦 Livraison P1 — Architecture, Scaffold & Carte

## ✅ Ce qui a été fait

### 1. Monorepo configuré
- `pnpm-workspace.yaml` configuré
- `package.json` racine avec scripts
- `docker-compose.yml` PostgreSQL 15

### 2. apps/ecarte — PWA Next.js
- ✅ Next.js 15 + TypeScript + Tailwind CSS 4
- ✅ Serwist (service worker PWA)
- ✅ PWA manifest.json
- ✅ BetterAuth client configuré
- ✅ API wrapper avec gestion token Bearer
- ✅ Pages auth fonctionnelles (`/login`, `/register`)
- ✅ Validation email `@uca.ma`
- ✅ Redirect `/` → `/login`

### 3. Service Worker (Serwist)
Stratégies de cache configurées dans `src/sw.ts` :
- `/card/me` → StaleWhileRevalidate (24h)
- `/card/qr` → NetworkOnly
- `/card/devices` → NetworkOnly
- Photos R2 → CacheFirst (7 jours)
- Assets Next.js → CacheFirst (30 jours)

### 4. Documentation
- ✅ README.md racine
- ✅ README.md apps/ecarte
- ✅ Instructions icônes PWA

## ⚠️ À finaliser

### Icônes PWA
Générer deux PNG dans `apps/ecarte/public/icons/` :
- `192.png` (192×192px)
- `512.png` (512×512px)

Fond : `#102447` (bleu UCA)  
Outils : Figma, Canva, realfavicongenerator.net

Instructions : voir `apps/ecarte/public/icons/INSTRUCTIONS.md`

## 🔗 Points de contrat pour P2, P5

### Variables d'environnement
`apps/ecarte/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Auth client
```ts
import { signIn, signOut, signUp } from '@/lib/auth-client';
```

### API client
```ts
import { api, saveToken, clearToken } from '@/lib/api';

// GET
const data = await api.get<CardData>('/card/me');

// POST
await api.post('/card/devices/register', { deviceName: 'Mon iPhone' });

// DELETE
await api.delete('/card/devices/123');
```

Token stocké automatiquement dans localStorage, envoyé dans tous les requêtes.

### Pages existantes
- `/` → redirect `/login`
- `/login` → connexion
- `/register` → inscription
- `/card` → placeholder (P5 doit implémenter)

### Pages à créer

**P2 :**
- `/dashboard` — historique scans
- `/devices` — gestion appareils + OTP

**P5 :**
- `/card` — remplacer le placeholder par carte + QR + timer

## 🚀 Démarrage pour P2 et P5

```bash
# Depuis la racine
pnpm install
pnpm dev:ecarte  # Port 3001
```

**Prérequis :** API backend (P3) doit tourner sur port 3000

## 📋 Endpoints API à consommer

### P2 (Dashboard & Appareils)
```
GET  /card/scans/me?page=1&limit=30
GET  /card/devices
POST /card/devices/register  { deviceName: string }
POST /card/devices/confirm   { otp: string, deviceName: string }
DELETE /card/devices/:id
```

### P5 (QR Display)
```
GET /card/me    # Infos étudiant
GET /card/qr    # JWT RS256 (5min TTL)
```

## 🎨 Design System

### Couleurs UCA
```css
--uca-blue: #102447
--uca-blue-dark: #0a1830
```

### Layout auth
Voir `/login` et `/register` pour référence :
- Fond : `bg-[#102447]`
- Card : `bg-white rounded-2xl shadow-lg`
- Boutons : `bg-[#102447] hover:bg-[#1a3a6b]`

## 📦 Structure Fichiers

```
apps/ecarte/
├── src/
│   ├── app/
│   │   ├── page.tsx              ✅ Fait
│   │   ├── login/page.tsx        ✅ Fait
│   │   ├── register/page.tsx     ✅ Fait
│   │   ├── card/page.tsx         ⏳ P5
│   │   ├── dashboard/page.tsx    ⏳ P2
│   │   └── devices/page.tsx      ⏳ P2
│   ├── lib/
│   │   ├── auth-client.ts        ✅ Fait
│   │   └── api.ts                ✅ Fait
│   └── sw.ts                     ✅ Fait
├── public/
│   ├── manifest.json             ✅ Fait
│   └── icons/                    ⚠️ À générer
├── .env.local                    ✅ Fait
├── next.config.ts                ✅ Fait
├── package.json                  ✅ Fait
└── README.md                     ✅ Fait
```

## ✨ Fonctionnalités prêtes

- ✅ Auth BetterAuth avec validation `@uca.ma`
- ✅ Service worker PWA avec cache stratégique
- ✅ Fetch wrapper avec token Bearer
- ✅ Routing Next.js App Router
- ✅ Tailwind CSS configuré
- ✅ PWA installable (après génération icônes)

## 🔐 Sécurité

- Validation email `@uca.ma` côté client (à confirmer serveur par P3)
- Token Bearer localStorage (HTTP-only cookies recommandé en prod)
- Service worker cache sensible uniquement sur HTTPS en prod

## 🎯 Prochaines étapes

### P2
1. Créer `/dashboard` avec tableau historique scans
2. Créer `/devices` avec liste + flow OTP
3. Consommer endpoints devices

### P5
1. Remplacer `/card` par vrai composant
2. Installer `qrcode.react`
3. Implémenter timer 5min + auto-refresh
4. Gérer états offline/suspendu/hors heures

### P6
1. Générer icônes PWA
2. Tests E2E
3. Déploiement Vercel

---

**Contact :** Pour questions sur l'architecture ou intégration, voir README.md ou cdc.md
