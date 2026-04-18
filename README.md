# 🏛️ Maison MK — Kenza Hotel Consulting

> Audit & Conseil Vision Michelin pour hôtels indépendants d'exception.
> **Site live :** [micka2000.github.io/kenzahotelconsulting](https://micka2000.github.io/kenzahotelconsulting/)

---

## Stack Actuelle (Production)

| Couche | Technologie | Statut |
|---|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JS | ✅ Live |
| Hébergement | GitHub Pages (`./docs`) | ✅ Live |
| Téléphone | intl-tel-input 19.5.6 (CDN) | ✅ Live |
| Fonts | Google Fonts — Inter (CDN) | ✅ Live |
| Backend | Node.js + SQLite (`server.js`) | 🔧 Local uniquement |
| Base de données | Supabase (PostgreSQL Free Tier) | ⏳ À configurer |
| Formulaire contact | `/api/contact` via fetch | ⚠️ Credentials manquants |
| IA | Google Gemini API (Free Tier) | ⏳ À intégrer |

---

## Architecture des Fichiers

```
docs/                  → Site statique déployé sur GitHub Pages
  index.html           → Page unique (Hero, Manifeste, Piliers, Contact)
  styles.css           → Tous les styles
  app.js               → Logique client (i18n FR/EN, formulaire, scroll reveals)

server.js              → Serveur local Node.js + SQLite (non déployé)
  GET  /api/hotels     → Liste des hôtels (filtre, tri)
  GET  /api/hotels/:id → Détail d'un hôtel
  POST /api/contact    → Enregistrement d'un lead

role prompt/           → Prompts système pour agents IA
  ROLE_ARCHITECT.md    → CTO — infrastructure, SQL, coût zéro
  ROLE_BUILDER.md      → Dev — interface pixel perfect
  ROLE_EXPERT.md       → Expert Michelin — ton et style
  ROLE_STRATEGIST.md   → Stratégie business

.github/workflows/
  deploy.yml           → CI/CD : push sur main → GitHub Pages
```

---

## Lancer en Local

```bash
# Installer les dépendances (sqlite3 pour server.js)
npm install

# Démarrer le serveur local → http://localhost:3000
npm start

# Ou prévisualiser uniquement le frontend statique
npx serve docs
```

---

## Configuration Requise (Supabase)

Dans `docs/app.js`, remplacer les placeholders :

```js
const SUPABASE_URL = "VOTRE_URL";   // → URL de votre projet Supabase
const SUPABASE_KEY = "VOTRE_KEY";   // → Clé anon publique Supabase
```

Une fois configuré, les leads du formulaire seront stockés dans Supabase (table `contacts`).

---

## Déploiement

Tout push sur la branche `main` déclenche automatiquement le workflow GitHub Actions qui publie le dossier `./docs` sur GitHub Pages. Aucune étape de build n'est nécessaire.

---

## Stack Cible (Roadmap)

La vision "Zero Cost Golden Stack" vise à migrer vers :

- **Hébergement :** Vercel (Hobby Plan) pour bénéficier des Serverless Functions
- **Backend :** Vercel Serverless Functions (remplace `server.js`)
- **Data :** Supabase PostgreSQL avec Row Level Security
- **IA :** Google Gemini API — "Concierge Digital" pour qualifier les leads

---

## La Vision Maison MK

**Maison MK** n'est pas un cabinet de conseil, c'est une maison d'excellence. L'audit "Vision Michelin" repose sur **6 Piliers d'Excellence** :

1. 🌍 **Ancrage** — L'hôtel célèbre-t-il sa destination ?
2. 🎨 **Esthétique** — Le design provoque-t-il une émotion durable ?
3. 🤝 **Savoir-Être** — L'accueil est-il un art ?
4. 🍽️ **Signature Culinaire** — La narration gustative est-elle cohérente ?
5. 🔄 **Fluidité Service** — Les parcours invités sont-ils sans friction ?
6. 🎵 **Aura Sonore** — L'acoustique sculpte-t-elle le silence ?

### Les 3 Règles d'Or
- **Propreté Absolue** — Le respect commence par l'hygiène irréprochable.
- **L'Accueil Signature** — Chaque client est un invité de marque.
- **L'Inattendu** — Le détail qui surprend et enchante.

---

*Maison MK — L'Excellence en Signature.*
