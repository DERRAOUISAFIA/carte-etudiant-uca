# Génération Icônes PWA

## Option 1 : Service en ligne (recommandé)

1. Aller sur https://realfavicongenerator.net/
2. Upload logo UCA (format vectoriel si possible)
3. Configurer :
   - Background : `#102447`
   - Padding : 10-15%
4. Générer et télécharger
5. Extraire `192.png` et `512.png`
6. Placer dans `public/icons/`

## Option 2 : Figma / Canva

1. Créer deux artboards :
   - 192×192px
   - 512×512px
2. Fond : `#102447`
3. Centrer logo UCA (blanc de préférence)
4. Exporter en PNG
5. Placer dans `public/icons/`

## Option 3 : Placeholder temporaire

Si vous n'avez pas le logo UCA maintenant, utilisez ce code pour générer un placeholder :

```bash
# Installer sharp (si pas déjà fait)
pnpm add -D sharp

# Créer script temporaire
node scripts/generate-icons.js
```

Contenu de `scripts/generate-icons.js` :

```js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [192, 512];
const color = '#102447';

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}"/>
      <text
        x="50%"
        y="50%"
        font-size="${size / 3}"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-weight="bold"
      >UCA</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/icons/${size}.png`);
  
  console.log(`✓ Generated ${size}.png`);
}

(async () => {
  if (!fs.existsSync('public/icons')) {
    fs.mkdirSync('public/icons', { recursive: true });
  }
  
  for (const size of sizes) {
    await generateIcon(size);
  }
  
  console.log('✅ All icons generated!');
})();
```

Puis lancer :

```bash
node scripts/generate-icons.js
```

## Validation

Après génération, vérifier :

```bash
ls -la public/icons/
# Doit montrer :
# 192.png (quelques KB)
# 512.png (quelques KB)
```

Tester dans DevTools :
1. Ouvrir http://localhost:3001
2. DevTools → Application → Manifest
3. Icons doivent apparaître

## Spécifications Officielles

Selon le CDC et les standards PWA :

- **Format** : PNG
- **Tailles** : 192×192 et 512×512 (requis)
- **Fond** : `#102447` (bleu UCA) ou transparent
- **Contenu** : Logo UCA officiel
- **Qualité** : Haute résolution, pas de compression excessive

## Production

Pour la production, utiliser le logo officiel UCA fourni par la direction.

Les placeholders sont acceptables pour le développement mais doivent être remplacés avant déploiement.
