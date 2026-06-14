# E-Carte Numérique UCA — Cahier des Charges Technique

## Vue d'ensemble

L'E-Carte est une PWA qui remplace la carte étudiante physique. Elle est distincte d'EduDocs mais partage la même base de données PostgreSQL et la même infrastructure. L'étudiant installe l'app depuis un lien sur EduDocs ou une URL directe, se connecte avec son email `@uca.ma`, et obtient une carte numérique avec un QR code rotatif signé. La scolarité scanne ce QR depuis le back-office EduDocs pour vérifier l'identité en temps réel.

---
## Modifications Schéma Prisma

### Modifications modèle `User` existant

```prisma
model User {
  // ... champs existants ...
  apogee      String?       @unique   // Numéro Apogée — saisi par scolarité
  photoUrl    String?                 // URL R2 — uploadée par scolarité uniquement
  cardActive  Boolean       @default(true)
  devices     UserDevice[]
  scans       StudentScan[]
}
```

### Nouveau modèle `UserDevice`

```prisma
model UserDevice {
  id          String   @id @default(cuid())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  deviceName  String   // ex: "iPhone de Mohammed", saisi par l'étudiant
  userAgent   String   // navigator.userAgent au moment de l'enregistrement
  createdAt   DateTime @default(now())

  @@index([userId])
}
```

Max 2 appareils par étudiant — enforced côté serveur avant création.

### Nouveau modèle `StudentScan`

```prisma
model StudentScan {
  id              String           @id @default(cuid())
  etudiant        User             @relation(fields: [etudiantId], references: [id])
  etudiantId      String
  scannedBy       String           // userId agent scolarité
  scannedAt       DateTime         @default(now())
  result          ScanResult
  rejectionReason RejectionReason?

  @@index([etudiantId])
  @@index([scannedBy])
}

enum ScanResult {
  APPROVED
  REJECTED
}

enum RejectionReason {
  PHOTO_MISMATCH
  NOT_ENROLLED
  QR_EXPIRED
  CARD_SUSPENDED
  WRONG_ESTABLISHMENT
  OTHER
}
```

---

## Endpoints NestJS (CardModule)

Tous dans `apps/api/src/card/`.

### Carte étudiant

```
GET /card/me
```
Données complètes de la carte. Requiert STUDENT.

```json
{
  "id": "clx...",
  "name": "Mohammed Alami",
  "email": "m.alami@uca.ma",
  "cne": "R123456789",
  "apogee": "20089012",
  "photoUrl": "https://r2.../photos/clx....jpg",
  "etablissement": "ENSA MARRAKECH",
  "filiere": "GI2",
  "anneeInscription": "2024/2025",
  "cardActive": true
}
```

```
GET /card/qr
```
JWT RS256, TTL 5min. Requiert STUDENT + cardActive. Payload: `{ studentId, cne, apogee, iat, exp }`.

```json
{
  "token": "eyJhbGci...",
  "expiresAt": "2026-06-14T10:35:00Z"
}
```

```
GET /card/scans/me?page=1&limit=30
```
Historique des 30 derniers scans de l'étudiant connecté. Requiert STUDENT.

### Appareils

```
GET  /card/devices
```
Liste des appareils enregistrés (max 2). Requiert STUDENT.

```
POST /card/devices/register
```
Initie l'enregistrement d'un appareil. Envoie OTP à l'email `@uca.ma`. Corps: `{ deviceName: string }`. Requiert STUDENT. Rejette si déjà 2 appareils.

```
POST /card/devices/confirm
```
Confirme avec l'OTP reçu par email. Corps: `{ otp: string, deviceName: string }`. Crée le `UserDevice`. BetterAuth OTP natif.

```
DELETE /card/devices/:id
```
Révoque un appareil. Requiert STUDENT (propriétaire uniquement).

### Scolarité

```
POST /card/verify
```
Vérifie un QR scanné. Requiert SCOLARITE ou SUPER_ADMIN.

Corps: `{ token: string }`

Retourne:
```json
{
  "valid": true,
  "student": {
    "id": "clx...",
    "name": "Mohammed Alami",
    "photoUrl": "https://r2.../...",
    "cne": "R123456789",
    "apogee": "20089012",
    "filiere": "GI2",
    "etablissement": "ENSA MARRAKECH",
    "anneeInscription": "2024/2025"
  }
}
```

```
POST /card/scan-log
```
Enregistre la décision de l'agent. Requiert SCOLARITE.

Corps: `{ etudiantId: string, result: ScanResult, rejectionReason?: RejectionReason }`

```
GET /card/scans?page=1&limit=20&search=alami&filiere=GI2&etablissement=ENSA
```
Historique paginé + recherche des scans effectués par l'agent connecté. Requiert SCOLARITE.

### Admin photo (scolarité uniquement)

```
POST /card/photo/:userId
```
Upload photo vers R2, met à jour `photoUrl`. Requiert SCOLARITE ou SUPER_ADMIN. Multipart form.

---

## Flux Heureux

### Flux Étudiant

1. Reçoit lien `ecarte.uca.ma` via EduDocs
2. Ouvre sur mobile — navigateur propose "Installer l'application"
3. Installe la PWA
4. Connexion avec `@uca.ma` — BetterAuth rejette tout autre domaine
5. `GET /card/me` — données chargées, mises en cache service worker
6. Voit sa carte: photo, nom, filière, établissement, logo
7. Navigue vers l'onglet QR — `GET /card/qr` — QR affiché avec timer 5min
8. Présente le téléphone à l'agent
9. QR auto-refresh à 0

### Flux Enregistrement Appareil

1. Étudiant va dans "Mes appareils" sur le dashboard
2. Voit ses appareils enregistrés (0, 1 ou 2)
3. Si moins de 2: bouton "Ajouter cet appareil"
4. Saisit un nom (`"Mon iPhone"`)
5. `POST /card/devices/register` → OTP envoyé à `@uca.ma`
6. Étudiant saisit OTP dans la PWA
7. `POST /card/devices/confirm` → appareil créé
8. Appareil visible dans la liste avec date d'ajout
9. Pour révoquer: bouton "Supprimer" → `DELETE /card/devices/:id`


### Flux Scolarité (Scan)

1. Agent ouvre EduDocs → `(scolarite)/scanner`
2. Clique "Scanner" — permission caméra accordée
3. Pointe sur QR étudiant — `html5-qrcode` décode
4. `POST /card/verify` — réponse instantanée
5. Voit: photo officielle, nom, CNE, Apogée, filière, établissement
6. Compare visuellement photo / personne
7. Clique "Approuver" ou "Rejeter" + raison si rejet
8. `POST /card/scan-log` — log créé
9. Peut aller dans "Historique" — tableau paginé avec recherche

---

## Cas Limites

### QR Expiré
- `POST /card/verify` retourne `{ valid: false, reason: "QR_EXPIRED" }`
- Agent voit "QR expiré — demander à l'étudiant de rafraîchir"
- PWA: auto-refresh à 0, ne devrait pas arriver en pratique

### Hors Heures (7h–21h)
- Vérification côté serveur dans `GET /card/qr` — retourne 403 hors plage
- PWA affiche carte sans QR: "QR disponible de 7h à 21h"
- Données carte (nom, photo) toujours visibles offline

### Mode Offline
- `GET /card/me` + photo R2 mis en cache au premier chargement
- QR non disponible offline (signature serveur obligatoire)
- Bannière: "Mode hors ligne — QR indisponible — données du [date]"

### Carte Suspendue
- `cardActive: false` → `GET /card/qr` retourne 403
- `POST /card/verify` retourne `{ valid: false, reason: "CARD_SUSPENDED" }`
- PWA: bannière rouge "Etudiant suspendue — contactez la scolarité"

### Photo Manquante
- `photoUrl: null` (scolarité pas encore uploadé)
- Carte affichée avec avatar placeholder
- QR disponible normalement
- Agent voit placeholder, vérifie manuellement via CNE/Apogée

### Max 2 Appareils Atteint
- `POST /card/devices/register` retourne 400 `"Maximum 2 appareils atteint"`
- Étudiant doit révoquer un appareil existant avant d'en ajouter un nouveau

### Token JWT Falsifié
- `jose.verify()` lève une exception — signature RS256 invalide
- `POST /card/verify` retourne 401
- Impossible sans clé privée serveur

### Transfert d'Établissement
- Scolarité met à jour `etablissement` en DB
- `GET /card/me` retourne le nouvel établissement
- Logo change automatiquement côté PWA (map statique `etablissement → logo`)
- Ancien QR expire en 5min naturellement

---

## Architecture PWA

### Manifest
```json
{
  "name": "E-Carte UCA",
  "short_name": "E-Carte",
  "start_url": "/card",
  "display": "standalone",
  "background_color": "#102447",
  "theme_color": "#102447",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Stratégie Service Worker (Serwist)

| Ressource | Stratégie | TTL |
|---|---|---|
| `/card/me` | StaleWhileRevalidate | 24h |
| Photo R2 | CacheFirst | 7 jours |
| Assets statiques Next.js | CacheFirst | 30 jours |
| `/card/qr` | NetworkOnly | jamais |
| `/card/verify` | NetworkOnly | jamais |
| `/card/devices` | NetworkOnly | jamais |

---

## Pages PWA (apps/ecarte)

| Route | Contenu |
|---|---|
| `/` | Redirect → `/card` si connecté, sinon `/login` |
| `/login` | Page connexion email `@uca.ma` |
| `/card` | E-carte plein écran + QR avec timer |
| `/dashboard` | Historique scans reçus + état carte |
| `/devices` | Liste appareils + ajout/révocation + flow OTP |

## Pages Scolarité (EduDocs existant)

| Route | Contenu |
|---|---|
| `(scolarite)/scanner` | Scanner caméra + résultat vérification + boutons décision |
| `(scolarite)/scans` | Historique paginé + recherche nom/Apogée/filière |

---

## Répartition des Tâches

### P1 — Architecture, Scaffold & Carte 
- Repo `ecarte` Next.js + Tailwind + Serwist
- PWA manifest + icônes + configuration Vercel
- Service worker + stratégies de cache
- Modifications schéma Prisma + migrations

### P2 — Dashboard & Appareils Étudiant (PWA)
- Page `/dashboard` — historique scans, état carte, bannière offline
- Page `/devices` — liste appareils, flow OTP enregistrement, révocation
- Consomme `GET /card/scans/me`, `GET /card/devices`, `POST /card/devices/register`, `POST /card/devices/confirm`, `DELETE /card/devices/:id`


### P3 — CardModule NestJS
- `CardModule` complet dans `apps/api`
- Tous les endpoints `/card/*`
- Génération + vérification JWT RS256 (`jose`)
- Logique métier: heures, cardActive, anneeInscription courante
- Upload photo R2 (réutilise `r2.service.ts`)
- Swagger `@ApiProperty()` sur tous les DTOs

### P4 — Scanner & Dashboard Scolarité (EduDocs)
- Page `(scolarite)/scanner` — caméra, `html5-qrcode`, affichage résultat, boutons Approuver/Rejeter
- Page `(scolarite)/scans` — tableau paginé, recherche par nom/Apogée/filière/établissement
- Consomme `POST /card/verify`, `POST /card/scan-log`, `GET /card/scans`

### P5 — QR Display & Rotation (PWA)

- Composant `<ECarteCard />` — layout UCA, photo, nom, filière, établissement, logo dynamique, bilingue FR/AR
- Page `/card` — affichage carte plein écran + QR
- `qrcode.react` pour le rendu QR
- Timer compte à rebours 5min
- Auto-refresh JWT à expiration
- États: chargement, QR actif, hors heures, offline, carte suspendue

### P6 — Tests, Seed & Déploiement
- Seed for demonstration. 
- Tests unitaires: JWT expiré, carte suspendue, mauvais domaine, max appareils
- Déploiement Backend.
- Export CSV scans — `GET /card/scans/export`



---

## Ce Qui N'Existe Pas Dans Ce Projet

- ❌ Upload photo par l'étudiant
- ❌ Redis — pas de blacklist
- ❌ Keycloak  
- ❌ Kubernetes / Docker Compose — Vercel + Railway
- ❌ Microservices 
- ❌ Téléchargement carte PNG 
- ❌ Détection de visage automatique
- ❌ Intégration APOGEE API 
- ❌ Borne kiosque — hardware séparé, hors scope
- ❌ Watermark / mode présentation verrouillé — security theater
