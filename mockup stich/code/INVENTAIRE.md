# Inventaire des maquettes Stitch — Fodium

Organisation du dossier `mockup stich` :

```
mockup stich/
├── images/        illustrations (5 captures d'écran + 3 posters d'événements)
├── code/
│   ├── ecrans/       les 5 HTML bruts sortis de Stitch — RÉFÉRENCE, ne pas éditer
│   ├── composants/   blocs isolés (header, nav, sections, pass combiné)
│   ├── logique/      le JS extrait de chaque écran
│   ├── tokens/       tailwind.config.js + base.css + divergences relevées
│   └── INVENTAIRE.md (ce fichier)
└── design-tokens-fodium-pulse.md   tokens Material bruts générés par Stitch
```

## Couverture du cahier des charges

| Exigence du brief | Poids | Maquette existante | Verdict |
|---|---|---|---|
| Nav flottante 5 onglets + badge « bientôt » | 15 % | `nav-01-accueil.html` (les 5 accès y sont) | Réutilisable |
| Recherche unifiée + 2 raccourcis + 3 cartes événement | 15 % | `sections-01-accueil.html` | Réutilisable |
| Pass combiné (billet seul / billet+navette, chips de ramassage, prix dynamique) | 15 % | `pass-combine-02-detail.html` + `logique/pass-combine.js` | **Le plus solide — à garder** |
| Réinvention du parcours de paiement | 15 % | `03-paiement.html` | **À jeter — voir ci-dessous** |
| Innovation technique (WebGL, View Transitions, GSAP…) | 15 % | aucune | **À construire de zéro** |
| Animation / micro-interactions | 20 % | quasi rien (transitions CSS basiques) | **À construire** |
| Responsive mobile + desktop | 10 % | mobile uniquement (`max-w-[420px]`, `shell-type: mobile_tab`) | **Desktop à construire** |
| Header horizontal desktop | — | aucun | À construire |
| Page teaser Transport | — | aucune | À construire |

## Points durs relevés dans le code

1. **Le paiement est exactement ce que le brief demande de ne pas faire.**
   `logique/paiement.js` = grille de 4 tuiles (Wave / OM / Free / Carte) + champ téléphone + bouton « Payer ».
   C'est le formulaire classique que le cahier des charges qualifie de « fonctionnel mais banal ».
   Garder l'esthétique du ticket (encoche + pointillés) ; jeter le flux.

2. **12 images pointent vers `lh3.googleusercontent.com` (CDN Stitch).**
   Ces URLs expirent. À remplacer par les 3 posters de `images/` avant tout déploiement,
   sinon la démo livrée affichera des cadres vides.

3. **`04-billet.html` n'embarque aucune config Tailwind** (`tailwind-config` absent, cf. `tokens/`).
   Ses classes `primary-container`, `on-surface`, `surface-container-low` ne résolvent pas :
   l'écran s'affiche avec les couleurs par défaut de Tailwind, pas avec la palette Fodium.

4. **Divergence de palette entre écrans** : `primary` vaut `#F07E00` sur l'accueil et `#934b00`
   sur les autres. Trancher avant de figer `tokens/tailwind.config.js`. Détail : `tokens/DIVERGENCES.md`.

5. **Aucun mode sombre**, aucun `dark:` dans les écrans, alors que `darkMode: "class"` est déclaré.
   Le brief le dit « non obligatoire mais apprécié ».

6. **`04-billet.html` simule une barre de statut iOS** (heure, batterie, réseau en dur).
   Décor de maquette — à supprimer dans une vraie page web.

## Ce que ces maquettes valent réellement

Elles valent pour la **direction visuelle** (glassmorphism chaud, palette orange/vert, Plus Jakarta Sans)
et pour la **structure d'information**. Le code lui-même est du HTML monolithique généré :
il ne survivra pas au passage en composants. Le copier tel quel coûterait des points sur
« qualité et lisibilité du code » (15 %).

Assets générés par IA (les 3 posters) : à signaler comme assets de démo dans le README du rendu.
