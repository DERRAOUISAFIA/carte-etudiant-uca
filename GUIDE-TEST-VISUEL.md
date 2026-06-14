# 👁️ Guide de Test Visuel — E-Carte UCA

## 🚀 Étape 1 : Démarrer l'Application

Ouvrez un terminal dans le dossier du projet et lancez :

```bash
cd c:\Users\blsb4\Desktop\carteEtudiant
pnpm dev:ecarte
```

Vous devriez voir :

```
▲ Next.js 16.2.9
- Local:        http://localhost:3001
- Environments: .env.local

✓ Starting...
✓ Ready in 2.3s
```

## 🌐 Étape 2 : Ouvrir le Navigateur

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3001**
3. Vous serez automatiquement redirigé vers `/login`

## ✅ Ce Que Vous Devez Voir

### Page de Connexion (/login)

```
┌─────────────────────────────────────┐
│      [Fond bleu UCA #102447]        │
│                                     │
│   ┌───────────────────────────┐    │
│   │  E-Carte UCA              │    │
│   │  Connectez-vous avec      │    │
│   │  votre email @uca.ma      │    │
│   │                           │    │
│   │  Email                    │    │
│   │  [prenom.nom@uca.ma]      │    │
│   │                           │    │
│   │  Mot de passe             │    │
│   │  [••••••••]               │    │
│   │                           │    │
│   │  [Se connecter]           │    │
│   │                           │    │
│   │  Pas encore de compte ?   │    │
│   │  S'inscrire               │    │
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

**Design attendu :**
- Fond de page : bleu foncé `#102447`
- Card blanche centrée avec ombre
- Bouton bleu UCA
- Texte gris et bleu

## 🧪 Tests à Effectuer

### Test 1 : Validation Email @uca.ma

1. Tapez un email : `test@gmail.com`
2. Tapez un mot de passe : `12345678`
3. Cliquez "Se connecter"

**Résultat attendu :**
```
❌ Seuls les emails @uca.ma sont autorisés.
```
(Message d'erreur en rouge sous le bouton)

---

4. Effacez et tapez : `mohammed.alami@uca.ma`
5. Tapez un mot de passe : `12345678`
6. Cliquez "Se connecter"

**Résultat attendu :**
```
⏳ Connexion...
```
Puis une erreur réseau (normal, backend pas encore disponible) :
```
❌ Erreur réseau
```
ou
```
❌ Failed to fetch
```

**✅ C'est NORMAL** — le backend (P3) n'existe pas encore. L'important c'est que la validation `@uca.ma` a fonctionné !

### Test 2 : Page Inscription

1. Cliquez sur le lien "S'inscrire"
2. Vous êtes redirigé vers `/register`

**Ce que vous devez voir :**

```
┌─────────────────────────────────────┐
│      [Fond bleu UCA #102447]        │
│                                     │
│   ┌───────────────────────────┐    │
│   │  E-Carte UCA              │    │
│   │  Créez votre compte       │    │
│   │  étudiant                 │    │
│   │                           │    │
│   │  Nom complet              │    │
│   │  [Mohammed Alami]         │    │
│   │                           │    │
│   │  Email                    │    │
│   │  [prenom.nom@uca.ma]      │    │
│   │                           │    │
│   │  Mot de passe             │    │
│   │  [••••••••]               │    │
│   │                           │    │
│   │  [S'inscrire]             │    │
│   │                           │    │
│   │  Déjà un compte ?         │    │
│   │  Se connecter             │    │
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

3. Testez avec `test@gmail.com` → même erreur `@uca.ma` requis
4. Testez avec `test@uca.ma` + mot de passe court → erreur "8 caractères minimum"

### Test 3 : Navigation

1. Cliquez "Se connecter" (en bas) → retour à `/login` ✅
2. Dans la barre d'adresse, allez à `http://localhost:3001` → redirect `/login` ✅
3. Allez à `http://localhost:3001/card` → page placeholder "à implémenter par P5" ✅

## 🔍 Test 4 : DevTools PWA

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Application** (ou **Stockage**)
3. Dans le menu de gauche, cliquez **Manifest**

**Ce que vous devez voir :**

```
Name: E-Carte UCA
Short name: E-Carte
Start URL: /card
Display: standalone
Theme color: #102447
Background color: #102447
```

**Icônes :**
```
⚠️ 192.png - Failed to load
⚠️ 512.png - Failed to load
```
C'est normal, elles ne sont pas encore générées.

4. Dans le menu, cliquez **Service Workers**

**En développement :** Aucun service worker (désactivé volontairement)
**En production :** Vous verrez `/sw.js` actif

## 🏗️ Test 5 : Build Production

Dans un autre terminal :

```bash
cd c:\Users\blsb4\Desktop\carteEtudiant\apps\ecarte
pnpm build --webpack
```

**Résultat attendu :**

```
▲ Next.js 16.2.9 (webpack)

✓ (serwist) Bundling the service worker script...
✓ Compiled successfully
✓ Generating static pages (4/4)

Route (app)
○ /
○ /_not-found
```

✅ **Aucune erreur** = tout fonctionne !

## 📱 Test 6 : Responsive

1. Ouvrez DevTools (F12)
2. Activez le mode **Device Toolbar** (Ctrl+Shift+M)
3. Testez avec :
   - iPhone 12 Pro
   - Samsung Galaxy S20
   - iPad

**Résultat attendu :**
- La card de login est centrée
- Texte lisible
- Boutons cliquables
- Layout adapté

## ✅ Checklist de Validation Visuelle

Cochez ce que vous voyez :

- [ ] Page `/login` s'affiche avec design bleu UCA
- [ ] Card blanche centrée avec formulaire
- [ ] Validation `@uca.ma` fonctionne
- [ ] Message d'erreur s'affiche en rouge
- [ ] Lien "S'inscrire" redirige vers `/register`
- [ ] Page `/register` s'affiche correctement
- [ ] Boutons ont un hover effect (changent de couleur)
- [ ] Redirect `/` → `/login` automatique
- [ ] `/card` affiche placeholder
- [ ] DevTools → Manifest visible
- [ ] Build production sans erreur
- [ ] Responsive fonctionne

## 🎯 Ce Qui EST Normal

### ❌ Erreurs Normales (Backend Manquant)

```
Failed to fetch
Erreur réseau
Cannot connect to localhost:3000
```

C'est **NORMAL** car P3 n'a pas encore créé le backend.

### ⚠️ Warnings Normaux

```
Warning: Icônes PWA manquantes
```

C'est **NORMAL**, instructions fournies pour les générer.

## 🎉 Si Tout Fonctionne

Vous devriez avoir :

✅ Application démarre sur port 3001
✅ Pages s'affichent correctement
✅ Validation `@uca.ma` active
✅ Navigation fonctionne
✅ Design UCA bleu présent
✅ Build production OK

**Félicitations ! P1 est complet et fonctionnel !** 🚀

## 📸 Captures d'Écran (Recommandé)

Pour documenter votre livraison, prenez des captures :

1. Page `/login` complète
2. Erreur validation `@uca.ma`
3. Page `/register`
4. DevTools Manifest
5. Build production terminal

Ajoutez-les dans un dossier `screenshots/` pour la documentation.

## 🐛 Problèmes ?

### "Cannot GET /"
➡️ Vérifiez que vous êtes sur port 3001, pas 3000

### "Module not found @/lib/..."
➡️ Relancez : `pnpm install` puis `pnpm dev:ecarte`

### Page blanche
➡️ Ouvrez la console (F12) et vérifiez les erreurs

### Port déjà utilisé
➡️ Changez le port dans `apps/ecarte/package.json` ligne `"dev"`

---

**Durée du test** : 5-10 minutes
**Résultat attendu** : Toutes les pages fonctionnent visuellement ✅
