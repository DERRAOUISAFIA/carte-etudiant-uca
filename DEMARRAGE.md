# 🚀 Démarrage Rapide — Carte Étudiant UCA

## Installation en 3 étapes

### 1. Installer les dépendances

```bash
cd c:\Users\blsb4\Desktop\carteEtudiant
pnpm install
```

### 2. Démarrer PostgreSQL

```bash
pnpm db:up
```

Vérifier que la base tourne :
```bash
docker ps
# Doit montrer : carte_postgres
```

### 3. Lancer l'application

```bash
pnpm dev:ecarte
```

Ouvrir : **http://localhost:3001**

## ✅ Vérification

Si tout fonctionne correctement :

1. Le navigateur ouvre http://localhost:3001
2. Redirect automatique vers `/login`
3. Page de connexion s'affiche avec design UCA bleu
4. Vous pouvez cliquer "S'inscrire"
5. Saisir `test@gmail.com` → erreur "Seuls les emails @uca.ma"
6. Saisir `test@uca.ma` → pas d'erreur (attendra backend P3)

## 🎯 Test Build Production

```bash
cd apps\ecarte
pnpm build --webpack
```

✅ Doit compiler sans erreur

## 📂 Structure du Projet

```
carteEtudiant/
├── apps/
│   └── ecarte/           ✅ PWA Next.js (VOUS ÊTES ICI)
│
├── pnpm-workspace.yaml   ✅ Monorepo configuré
├── docker-compose.yml    ✅ PostgreSQL
└── README.md             ✅ Documentation complète
```

## 🔧 Commandes Utiles

| Commande | Description |
|----------|-------------|
| `pnpm dev:ecarte` | Dev server (port 3001) |
| `pnpm build:ecarte` | Build production |
| `pnpm db:up` | Démarrer PostgreSQL |
| `pnpm db:down` | Arrêter PostgreSQL |
| `pnpm db:logs` | Voir logs DB |

## 📝 Notes Importantes

### Pour Travailler Sans Backend

Si P3 n'a pas encore livré le backend, vous pouvez :

1. **Mocker les réponses API** dans `src/lib/api.ts`
2. **Créer des données de test** temporaires
3. **Travailler sur le UI** en attendant

### Icônes PWA

Les icônes PWA ne sont pas générées. Ce n'est pas bloquant.

Instructions : `apps/ecarte/public/icons/GENERER-ICONES.md`

### Service Worker

En développement (`pnpm dev:ecarte`), le service worker est **désactivé** pour faciliter le debug.

Il s'active uniquement en production (`pnpm build`).

## 🐛 Problèmes Courants

### "Cannot connect to API"
➡️ Normal, backend P3 pas encore déployé

### "Email @uca.ma required"
➡️ Validation fonctionne correctement

### Port 3001 déjà utilisé
```bash
# Changer le port dans package.json
"dev": "next dev --port 3002"
```

### PostgreSQL ne démarre pas
```bash
# Vérifier Docker
docker ps -a

# Redémarrer
pnpm db:down
pnpm db:up
```

## 📚 Documentation Complète

- **README principal** : `README.md`
- **Livraison P1** : `P1-LIVRAISON.md`
- **Checklist** : `P1-CHECKLIST.md`
- **Résumé** : `P1-RESUME.md`
- **CDC** : `cdc.md`

## 🎯 Prochaines Étapes

### Pour P2 (Dashboard & Appareils)
1. Créer `src/app/dashboard/page.tsx`
2. Créer `src/app/devices/page.tsx`
3. Utiliser `api.get('/card/scans/me')` etc.

### Pour P5 (QR Display)
1. Remplacer `src/app/card/page.tsx`
2. Installer `pnpm add qrcode.react`
3. Consommer `api.get('/card/me')` et `api.get('/card/qr')`

## ✅ Statut P1

| Item | Statut |
|------|--------|
| Monorepo | ✅ |
| PWA Scaffold | ✅ |
| Auth Pages | ✅ |
| Service Worker | ✅ |
| Build Production | ✅ |
| Documentation | ✅ |

**P1 est complet et prêt pour livraison** ✨

---

**Besoin d'aide ?** Consultez les fichiers de documentation ou contactez l'équipe.
