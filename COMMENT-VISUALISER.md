# 🎯 Comment Visualiser L'Application

## Méthode 1 : Script Automatique (Plus Simple)

1. Double-cliquez sur le fichier **`start.bat`** à la racine du projet
2. Une fenêtre terminal s'ouvre et l'application démarre automatiquement
3. Attendez voir : `✓ Ready in X.Xs`
4. Ouvrez votre navigateur sur : **http://localhost:3001**

## Méthode 2 : Manuelle (Pour Comprendre)

### Étape 1 : Ouvrir le Terminal

1. Ouvrez **Windows Terminal** ou **PowerShell** ou **CMD**
2. Naviguez vers le projet :
   ```bash
   cd c:\Users\blsb4\Desktop\carteEtudiant
   ```

### Étape 2 : Démarrer l'Application

```bash
pnpm dev:ecarte
```

### Étape 3 : Attendre le Message

Vous verrez :
```
▲ Next.js 16.2.9
- Local:        http://localhost:3001

✓ Starting...
✓ Ready in 2.3s
```

### Étape 4 : Ouvrir le Navigateur

1. Ouvrez **Chrome**, **Edge** ou **Firefox**
2. Tapez dans la barre d'adresse : `http://localhost:3001`
3. Appuyez sur **Entrée**

## 🎉 Vous Devriez Voir

### Redirect Automatique
- La page `/` redirige automatiquement vers `/login`

### Page de Connexion
- **Fond bleu foncé** (`#102447` - couleur UCA)
- **Card blanche centrée** avec :
  - Titre "E-Carte UCA"
  - Champ Email
  - Champ Mot de passe
  - Bouton "Se connecter" (bleu)
  - Lien "S'inscrire"

## 🧪 Testez Maintenant

### Test 1 : Email Invalide
1. Tapez : `test@gmail.com`
2. Tapez un mot de passe : `12345678`
3. Cliquez "Se connecter"
4. **Résultat** : Message d'erreur rouge "Seuls les emails @uca.ma sont autorisés"

### Test 2 : Email Valide
1. Tapez : `mohammed.alami@uca.ma`
2. Tapez un mot de passe : `12345678`
3. Cliquez "Se connecter"
4. **Résultat** : Erreur réseau (normal, backend pas prêt)

### Test 3 : Page Inscription
1. Cliquez sur "S'inscrire"
2. **Résultat** : Page `/register` s'affiche

### Test 4 : Navigation
1. Dans la barre d'adresse, allez sur `http://localhost:3001/card`
2. **Résultat** : Page placeholder "à implémenter par P5"

## 📱 Bonus : Test Mobile

1. Dans le navigateur, appuyez sur **F12** (DevTools)
2. Cliquez sur l'icône **mobile** (ou Ctrl+Shift+M)
3. Sélectionnez "iPhone 12 Pro"
4. **Résultat** : Layout responsive s'adapte

## 🛑 Pour Arrêter

Dans le terminal, appuyez sur **Ctrl+C**

## ✅ Tout Fonctionne Si

- ✅ Page `/login` s'affiche avec design bleu
- ✅ Formulaire est utilisable
- ✅ Validation `@uca.ma` fonctionne
- ✅ Navigation entre pages fonctionne

## 🐛 Problèmes Courants

### "Port 3001 is already in use"
➡️ **Solution** : Arrêtez l'autre application ou changez le port :
```bash
# Dans apps/ecarte/package.json, ligne 6, changez :
"dev": "next dev --port 3002"
```

### "pnpm: command not found"
➡️ **Solution** : Installez pnpm :
```bash
npm install -g pnpm
```

### Page blanche
➡️ **Solution** : 
1. Ouvrez DevTools (F12)
2. Onglet Console
3. Regardez les erreurs
4. Relancez : `pnpm install` puis `pnpm dev:ecarte`

### "Cannot connect to database"
➡️ **C'est NORMAL** — PostgreSQL sert pour le backend (P3)
➡️ L'application frontend fonctionne sans ça

## 📊 Résumé Visuel

```
Vous tapez dans le terminal :
  pnpm dev:ecarte

Terminal affiche :
  ✓ Ready in 2.3s
  - Local: http://localhost:3001

Vous ouvrez le navigateur :
  http://localhost:3001

Navigateur affiche :
  [Fond bleu foncé]
    ┌─────────────┐
    │ E-Carte UCA │
    │   [Login]   │
    └─────────────┘
```

**C'EST TOUT !** 🎉

---

**Temps nécessaire** : 2 minutes
**Difficulté** : Facile
**Prérequis** : Node.js + pnpm installés
