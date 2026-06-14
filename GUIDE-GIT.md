# 🚀 Guide Git — Créer et Pusher le Repo

## Méthode 1 : GitHub (Recommandé)

### Étape 1 : Créer le Repo sur GitHub

1. Allez sur https://github.com
2. Cliquez sur **New repository**
3. Nom : `carte-etudiant-uca`
4. Description : `Système de carte étudiante numérique PWA - Université Cadi Ayyad`
5. **Private** ou **Public** (selon votre choix)
6. ❌ **NE PAS** cocher "Initialize with README" (on a déjà tout)
7. Cliquez **Create repository**

### Étape 2 : Initialiser Git Localement

Ouvrez un terminal dans le projet :

```bash
cd c:\Users\blsb4\Desktop\carteEtudiant

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "P1: Architecture, Scaffold & PWA ecarte - Initial commit"

# Ajouter le remote (remplacez YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/carte-etudiant-uca.git

# Pousser vers GitHub
git push -u origin main
```

### Étape 3 : Vérifier

Retournez sur GitHub et rafraîchissez la page → tous vos fichiers apparaissent ! ✅

---

## Méthode 2 : GitLab

### Créer le projet sur GitLab

1. Allez sur https://gitlab.com
2. **New project** → **Create blank project**
3. Nom : `carte-etudiant-uca`
4. Visibility : Private ou Public
5. ❌ **NE PAS** cocher "Initialize with README"
6. **Create project**

### Pusher le code

```bash
cd c:\Users\blsb4\Desktop\carteEtudiant

git init
git add .
git commit -m "P1: Architecture, Scaffold & PWA ecarte - Initial commit"

# Remote GitLab (remplacez YOUR_USERNAME)
git remote add origin https://gitlab.com/YOUR_USERNAME/carte-etudiant-uca.git

git push -u origin main
```

---

## Méthode 3 : Bitbucket

Même principe que GitHub/GitLab.

---

## 🏷️ Structure des Commits Recommandée

Pour les prochains commits, utilisez cette convention :

```bash
# P1 (vous)
git commit -m "P1: fix: Correction port 3002"
git commit -m "P1: docs: Ajout guide Git"

# P2 (dashboard)
git commit -m "P2: feat: Page dashboard avec historique scans"
git commit -m "P2: feat: Page devices avec OTP"

# P3 (backend)
git commit -m "P3: feat: CardModule complet avec JWT RS256"
git commit -m "P3: feat: Upload photo R2"

# P5 (QR)
git commit -m "P5: feat: Composant ECarteCard avec QR"
git commit -m "P5: feat: Timer 5min auto-refresh"
```

Format : `P[numéro]: [type]: [description]`

Types :
- `feat` - nouvelle fonctionnalité
- `fix` - correction bug
- `docs` - documentation
- `refactor` - refactoring code
- `style` - formatting, CSS
- `test` - ajout tests

---

## 📋 Fichiers à Vérifier Avant Push

### Fichiers sensibles (déjà dans .gitignore) ✅

- ✅ `.env` et `.env.local` → ignorés
- ✅ `node_modules/` → ignoré
- ✅ `.next/` → ignoré
- ✅ Pas de clés secrètes exposées

### Fichiers inclus

- ✅ Tout le code source
- ✅ Toute la documentation (11 fichiers)
- ✅ Configuration (package.json, tsconfig, etc.)
- ✅ Docker compose
- ✅ Scripts (start.bat)

---

## 🔐 Sécurité

### Variables d'environnement

Le fichier `.env.local` est ignoré par Git. Les autres devront créer leur propre :

```env
# apps/ecarte/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Pas de secrets dans le code ✅

Vérifié : aucun token, mot de passe ou clé API dans le code.

---

## 📦 README GitHub

Le fichier `README.md` à la racine est parfait pour GitHub. Il contient :

- Description du projet
- Architecture
- Installation
- Configuration
- Commandes
- Répartition des tâches

Il s'affichera automatiquement sur la page d'accueil du repo.

---

## 👥 Collaborateurs

Une fois le repo créé, ajoutez vos collègues :

**GitHub :**
Settings → Collaborators → Add people

**GitLab :**
Members → Invite members

Invitez P2, P3, P5, P6 avec rôle **Developer** ou **Maintainer**.

---

## 🌿 Branches Recommandées

```
main (production)
├── develop (intégration)
├── feat/p1-scaffold (vous - à merger)
├── feat/p2-dashboard (P2)
├── feat/p3-backend (P3)
└── feat/p5-qr-display (P5)
```

**Workflow :**
1. Chaque personne travaille sur sa branche `feat/pX-...`
2. Pull request vers `develop` pour review
3. Merge `develop` → `main` pour déploiement

---

## 📝 Commandes Git Utiles

```bash
# Voir le statut
git status

# Voir les modifications
git diff

# Ajouter des fichiers
git add .

# Commit
git commit -m "P1: votre message"

# Pousser
git push

# Créer une branche
git checkout -b feat/p1-scaffold

# Changer de branche
git checkout main

# Mettre à jour
git pull

# Voir l'historique
git log --oneline
```

---

## ✅ Checklist Avant Push

- [ ] Code compilé sans erreur (`pnpm build`)
- [ ] Documentation complète
- [ ] `.gitignore` configuré
- [ ] Pas de `.env` avec secrets
- [ ] README.md clair
- [ ] Commits avec messages clairs

---

## 🎉 Après le Push

1. **Vérifiez sur GitHub/GitLab** que tout est là
2. **Partagez le lien** avec P2, P3, P5
3. **Créez un projet/board** pour suivre les tâches
4. **Ajoutez un badge** dans README.md (optionnel)

```markdown
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![P1](https://img.shields.io/badge/P1-completed-success)
```

---

**Durée** : 5 minutes
**Prêt à partager !** 🚀
