# E-Carte UCA — PWA Étudiant

Application Progressive Web App pour la carte étudiante numérique UCA.

## Installation PWA

1. Ouvrir sur mobile/navigateur compatible
2. Menu → "Installer l'application" ou "Ajouter à l'écran d'accueil"
3. Lancer comme application native

## Développement

```bash
# Depuis la racine du monorepo
pnpm dev:ecarte
```

Ouvre sur http://localhost:3001

## Variables d'Environnement

Créer `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Structure

```
src/
├── app/
│   ├── page.tsx              # Redirect → /login
│   ├── login/page.tsx        # Connexion @uca.ma
│   ├── register/page.tsx     # Inscription
│   ├── card/page.tsx         # Carte + QR (P5)
│   ├── dashboard/page.tsx    # Historique (P2)
│   └── devices/page.tsx      # Appareils (P2)
├── lib/
│   ├── auth-client.ts        # BetterAuth
│   └── api.ts                # Fetch + token
└── sw.ts                     # Service Worker

public/
├── manifest.json             # PWA manifest
└── icons/
    ├── 192.png               # À générer
    └── 512.png               # À générer
```

## Service Worker (Serwist)

Stratégies de cache configurées :

| Ressource | Stratégie | TTL |
|-----------|-----------|-----|
| `/card/me` | StaleWhileRevalidate | 24h |
| Photos R2 | CacheFirst | 7 jours |
| `/card/qr` | NetworkOnly | jamais |
| `/card/devices` | NetworkOnly | jamais |
| Assets statiques | CacheFirst | 30 jours |

## Auth

BetterAuth client configuré dans `src/lib/auth-client.ts` :

```ts
import { signIn, signOut, signUp } from '@/lib/auth-client';

// Connexion
await signIn.email({ email, password });

// Inscription
await signUp.email({ name, email, password });

// Déconnexion
await signOut();
```

## API

Wrapper fetch avec token Bearer dans `src/lib/api.ts` :

```ts
import { api } from '@/lib/api';

// GET
const data = await api.get('/card/me');

// POST
await api.post('/card/devices/register', { deviceName: 'Mon iPhone' });

// DELETE
await api.delete('/card/devices/123');
```

Token stocké dans localStorage, envoyé automatiquement.

## Validation @uca.ma

Seuls les emails `@uca.ma` autorisés :

```ts
if (!email.endsWith('@uca.ma')) {
  setError('Seuls les emails @uca.ma sont autorisés.');
  return;
}
```

## Icônes PWA

Générer deux PNG :
- `public/icons/192.png` (192×192px)
- `public/icons/512.png` (512×512px)

Fond : `#102447` (bleu UCA)  
Outils : Figma, Canva, realfavicongenerator.net

## Build Production

```bash
pnpm build
pnpm start
```

## Déploiement Vercel

```bash
vercel --prod
```

Variables d'environnement :
- `NEXT_PUBLIC_API_URL` → URL API production

## Mode Offline

Le service worker cache :
- `/card/me` (infos étudiant)
- Photos R2 (7 jours)
- Assets statiques (30 jours)

Bannière affichée si hors ligne. QR indisponible sans réseau.

## Cas d'Usage

### Étudiant se connecte
1. Ouvre l'app PWA
2. Connexion avec `@uca.ma`
3. Redirect vers `/card`
4. Voit sa carte + QR

### Présente le QR
1. Agent scolarité scanne
2. Vérification instantanée
3. Affichage photo + infos

### Enregistre un appareil (P2)
1. Va dans `/devices`
2. "Ajouter cet appareil"
3. Reçoit OTP par email
4. Confirme OTP
5. Appareil enregistré (max 2)

## Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Styling** : Tailwind CSS 4
- **PWA** : Serwist 9
- **Auth** : BetterAuth
- **QR** : qrcode.react (P5)
- **Déploiement** : Vercel

## Prochaines Étapes

- [ ] P2 : Pages `/dashboard` et `/devices`
- [ ] P5 : Composant carte + QR avec timer
- [ ] Générer icônes PWA
- [ ] Tests E2E
