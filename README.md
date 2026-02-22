# To-Do List — Pastel

Application To-Do List en React + TypeScript + Vite : tâches, priorités personnalisables, favoris, filtres, persistance LocalStorage. Style pastel, mobile-first, installable en PWA.

## Démarrage

```bash
npm install
npm run dev
```

## Build et prévisualisation (production)

```bash
npm run build
npm run preview
```

Ouvre l’URL affichée (ex. `http://localhost:4173`) pour tester la version de production.

---

## Audit Lighthouse (obligatoire pour les perfs)

**Les scores Lighthouse doivent être mesurés sur la version de production, pas sur `npm run dev`.**

1. **Construire** la version optimisée :
   ```bash
   npm run build
   ```

2. **Servir** le build en local :
   ```bash
   npm run preview
   ```

3. **Ouvrir** l’URL indiquée (ex. `http://localhost:4173`) dans Chrome.

4. **Lancer Lighthouse** (DevTools > onglet *Lighthouse*) :
   - Mode : **Navigation**
   - Device : **Mobile**
   - Catégories : Performance, Accessibilité, Bonnes pratiques, SEO, PWA

5. **Interpréter** :
   - En `npm run dev`, les alertes « Minify JS » et « Unused JS » sont normales.
   - Sur `npm run preview`, un score Performance mobile ≥ 80 est visé.

---

## Installation PWA (sur téléphone)

L’app est une PWA : vous pouvez l’installer sur l’écran d’accueil.

### Génération des icônes (premier build)

Les icônes PWA (192×192 et 512×512) sont générées à partir de `public/pwa-icon.svg` avant le build. Le script utilise **sharp** (dépendance de dev).

```bash
npm install
npm run generate-pwa-icons
```

Puis :

```bash
npm run build
npm run preview
```

(Si vous lancez directement `npm run build`, le script `prebuild` appelle `generate-pwa-icons` automatiquement.)

### Android (Chrome)

1. Ouvrir l’app dans Chrome (en HTTPS ou via `npm run preview` sur le même réseau).
2. Menu (⋮) > **Installer l’application** / **Ajouter à l’écran d’accueil**.
3. Ou accepter la bannière « Installer l’application » si elle s’affiche.

### iOS (Safari)

1. Ouvrir l’app dans **Safari** (PWA non prise en charge depuis Chrome sur iOS).
2. Bouton **Partager** (carré avec flèche).
3. **Sur l’écran d’accueil**.
4. Nommer et valider.

### Vérification (DevTools)

- **Application** > **Manifest** : nom, icônes, `start_url`, `display: standalone` corrects.
- **Application** > **Service Workers** : statut **activated**.

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build TypeScript + Vite (production) |
| `npm run preview` | Servir le build (pour test prod + Lighthouse) |
| `npm run generate-pwa-icons` | Génère `pwa-192x192.png` et `pwa-512x512.png` depuis `pwa-icon.svg` |
| `npm run lint` | ESLint |

---

## Stack

- React 19, TypeScript (strict), Vite 7
- Pas de framework CSS (CSS pur, variables, mobile-first)
- Persistance : LocalStorage
- PWA : vite-plugin-pwa (manifest + service worker)
