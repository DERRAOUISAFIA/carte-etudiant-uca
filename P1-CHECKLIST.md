# ✅ Checklist P1 — Vérification Livraison

## Structure Projet

- [x] `pnpm-workspace.yaml` existe
- [x] `package.json` racine avec scripts
- [x] `docker-compose.yml` PostgreSQL 15
- [x] `README.md` racine complet
- [x] `P1-LIVRAISON.md` pour P2/P5
- [x] `.gitignore` configuré

## apps/ecarte

### Configuration
- [x] `package.json` avec dépendances
- [x] `next.config.ts` avec Serwist
- [x] `.env.local` avec NEXT_PUBLIC_API_URL
- [x] Port dev configuré (3001)
- [x] `tsconfig.json` existe

### PWA
- [x] `public/manifest.json` configuré
- [ ] `public/icons/192.png` (⚠️ à générer)
- [ ] `public/icons/512.png` (⚠️ à générer)
- [x] `src/sw.ts` service worker configuré
- [x] Stratégies cache définies

### Auth & API
- [x] `src/lib/auth-client.ts` BetterAuth
- [x] `src/lib/api.ts` fetch wrapper
- [x] Token Bearer dans localStorage
- [x] Validation `@uca.ma`

### Pages
- [x] `src/app/page.tsx` → redirect /login
- [x] `src/app/login/page.tsx` fonctionnel
- [x] `src/app/register/page.tsx` fonctionnel
- [x] `src/app/card/page.tsx` placeholder
- [x] `app/layout.tsx` avec manifest meta
- [x] `app/globals.css` avec couleurs UCA

### Documentation
- [x] `README.md` apps/ecarte
- [x] Instructions icônes PWA

## Test Manuel

### 1. Installation
```bash
cd c:\Users\blsb4\Desktop\carteEtudiant
pnpm install
```
Vérifier : pas d'erreur

### 2. Base de données
```bash
pnpm db:up
```
Vérifier : `docker ps` montre postgres

### 3. Dev server
```bash
pnpm dev:ecarte
```
Vérifier : 
- Ouvre sur http://localhost:3001
- Pas d'erreur compilation
- Service worker build OK

### 4. Navigation
- [ ] Ouvrir http://localhost:3001
- [ ] Redirect automatique vers /login
- [ ] Page login s'affiche correctement
- [ ] Cliquer "S'inscrire" → /register
- [ ] Retour vers /login

### 5. Validation email
- [ ] Taper email `test@gmail.com` → erreur "Seuls les emails @uca.ma"
- [ ] Taper `test@uca.ma` → pas d'erreur (attendra l'API)

### 6. PWA
- [ ] Ouvrir DevTools → Application
- [ ] Service Worker enregistré
- [ ] Manifest visible avec nom "E-Carte UCA"
- [ ] Icônes manquantes (normal, à générer)

### 7. Build Production
```bash
cd apps/ecarte
pnpm build
```
Vérifier : build sans erreur

## Points Bloquants pour P2/P5

### Bloquants critiques
- [ ] API backend (P3) pas encore disponible
- [ ] Prisma schema pas créé

### Non-bloquants
- [ ] Icônes PWA (cosmétique, peut attendre)
- [ ] Vraies données (peut mocker en attendant P3)

## Actions Requises Avant Merge

### P1 doit faire
1. [ ] Générer icônes PWA ou documenter comment
2. [ ] Tester flow auth en local (avec API P3)
3. [ ] Vérifier service worker fonctionne

### Coordination avec P3
- [ ] Confirmer structure endpoints `/card/*`
- [ ] Valider format réponse `GET /card/me`
- [ ] Confirmer JWT dans réponse sign-in

### Prêt pour P2
- [x] `src/lib/api.ts` disponible
- [x] Pages auth fonctionnelles
- [x] Documentation claire

### Prêt pour P5
- [x] Layout app configuré
- [x] Page `/card` existe (placeholder)
- [x] Service worker prêt
- [x] Manifest PWA

## Notes Importantes

1. **Apps/api manquant** : P3 doit créer le backend NestJS
2. **Prisma manquant** : P3 doit créer schema + migrations
3. **Icônes PWA** : Pas bloquant, peut être fait par P6
4. **EduDocs** : Existe dans un autre projet, ne pas inclure ici

## Commandes Rapides

```bash
# Démarrer tout
pnpm db:up && pnpm dev:ecarte

# Arrêter DB
pnpm db:down

# Voir logs DB
pnpm db:logs

# Build
pnpm build:ecarte
```

## Résultat Attendu

✅ **P1 est complet si :**
1. `pnpm dev:ecarte` démarre sans erreur
2. Pages `/login` et `/register` s'affichent
3. Validation `@uca.ma` fonctionne
4. Service worker se compile
5. Documentation complète

⚠️ **Dépendances externes :**
- API backend (P3) pour test complet
- Icônes PWA (peut être délégué)

---

**Date :** 2025-06-14  
**Responsable :** P1  
**Statut :** ✅ Prêt pour livraison (sauf icônes)
