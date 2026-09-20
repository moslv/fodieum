# CLAUDE.md — Challenge frontend Fodium

Contexte complet : `cahier-des-charges-challenge-frontend-fodium.md` (à relire avant toute décision).
Maquettes et inventaire : `mockup stich/` — lire `mockup stich/code/INVENTAIRE.md` en premier.

---

## 1. Règle d'or : les images font foi

La **source de vérité visuelle**, ce sont les captures dans `mockup stich/images/` :

| Écran | Image de référence | Code Stitch (référence, à ne pas copier) |
|---|---|---|
| Accueil | `images/01-accueil.png` | `code/ecrans/01-accueil.html` |
| Détail événement + pass combiné | `images/02-detail-evenement.png` | `code/ecrans/02-detail-evenement.html` |
| Paiement | `images/03-paiement.png` | `code/ecrans/03-paiement.html` |
| Billet émis | `images/04-billet.png` | `code/ecrans/04-billet.html` |
| Mes billets | `images/05-mes-billets.png` | `code/ecrans/05-mes-billets.html` |

**Fidélité attendue** : composition, hiérarchie, espacements, arrondis, palette, typo, glassmorphism.
Chaque écran construit doit être comparable côte à côte avec son PNG sans écart visible.

**Ce qui n'est PAS de la fidélité** : recopier le HTML monolithique de Stitch. Ce code est généré,
non componentisé, et le pénaliserait sur « qualité et lisibilité du code » (15 % de la note).
On reconstruit proprement en s'appuyant sur `code/composants/`, `code/logique/` et `code/tokens/`.

**Le design évoluera au fil de l'eau.** Les maquettes sont le point de départ, pas un plafond.
Toute amélioration est validée par Manu avant d'être généralisée — on ne dérive pas tout seul.

---

## 2. Stack

**Imposé par le cahier des charges :**
- **Tailwind CSS obligatoire** pour tout le style. Pas de gros bloc de CSS custom en parallèle,
  sauf animations avancées (keyframes complexes) — et dans ce cas, justifié en commentaire.
- Pas de backend : données mockées en dur ou via JSON local.
- Responsive obligatoire, mobile prioritaire.
- Git avec **historique de commits visible** — un seul commit « final version » est éliminatoire.

**Choisi (libre selon le brief, à justifier dans le README) :**
- **Vite + React + TypeScript** — pas de SSR utile ici (aucun backend, aucun SEO en jeu),
  build minimal, HMR rapide sur 5 jours de délai.
- **React Router** pour les 3 routes : accueil, détail événement, teaser transport.
- **Tailwind CSS v3** + tokens du projet.
- **GSAP** (ou Motion One) pour les animations orchestrées, **View Transitions API** pour les
  transitions de page. Les deux comptent comme l'exigence d'innovation technique (15 %) —
  le choix devra être **justifié dans le README** : quel effet était impossible en CSS seul.
- Déploiement **Vercel**.

Avant de poser une dépendance supplémentaire : vérifier qu'elle sert un critère de la grille.

---

## 3. Tokens

Base : `mockup stich/code/tokens/tailwind.config.js` (extrait des maquettes).

**Divergence à trancher** : `primary` vaut `#F07E00` (accueil) et `#934b00` (autres écrans) —
cf. `tokens/DIVERGENCES.md`. **Décision : `#F07E00`** comme `primary` (c'est la couleur des captures
d'accueil et du CTA), `#934b00` conservé comme `primary-dark` pour les textes sur fond clair.
À confirmer visuellement écran par écran.

`tokens/base.css` contient les utilitaires `pt-safe` / `pb-safe` / `no-scrollbar` à reprendre.

Typo : **Plus Jakarta Sans** (400/500/600/700/800), via `@fontsource` plutôt que le CDN Google.

Mode sombre : non obligatoire mais apprécié par le brief. `darkMode: "class"` dès le départ,
variantes `dark:` posées au fil de l'eau — pas en fin de projet.

---

## 4. Architecture

```
src/
├── components/
│   ├── layout/      BottomNav, DesktopHeader, AppShell
│   ├── ui/          Button, Chip, Card, Badge, Sheet
│   └── features/    EventCard, SearchBar, PassSelector, PaymentFlow, TicketStub
├── pages/           Home, EventDetail, TransportTeaser
├── data/            events.json, shuttles.json, mock data typée
├── hooks/
├── lib/             formatPrice (XOF), animations GSAP partagées
└── styles/
```

Conventions :
- Composants en PascalCase, un composant par fichier, props typées explicitement.
- Pas de `any`. Pas de commentaire qui paraphrase le code.
- Pas de valeur en dur dans le JSX : prix, dates, lieux viennent de `src/data/`.
- Accessibilité : `aria-label` sur tout bouton icône, contraste respecté, focus visible.

---

## 5. Périmètre

**À livrer**
- Page d'accueil : recherche unifiée (événements / trajets), 2 raccourcis, min. 3 cartes événement.
- Nav flottante mobile 5 onglets (Accueil, Événements, Transport, Mes billets, Profil),
  badge « bientôt » sur Transport **visuellement vivant** — c'est la seule contrainte d'animation fixe.
- Header horizontal sur desktop/tablette large, mêmes 5 accès, pas de barre flottante.
- Page détail événement avec pass combiné : Billet seul / Billet + Navette, sélecteur de point de
  départ qui apparaît au choix « Billet + Navette », prix recalculé, récap avant validation.
- Parcours de paiement **réinventé** (voir §6).
- README : choix techniques, priorisation, ce qui aurait été fait avec plus de temps.

**Hors périmètre** — ne pas construire : authentification, paiement réel, interfaces agent scan,
vendeur, admin, organisateur.

---

## 6. Le paiement : ne pas refaire la maquette

`mockup stich/code/ecrans/03-paiement.html` est **un contre-exemple**. Grille de 4 opérateurs +
champ téléphone + bouton « Payer » : c'est mot pour mot le flux que le cahier des charges décrit
comme « fonctionnel mais banal » et demande de dépasser. 15 % de la note.

À garder de cette maquette : l'esthétique du ticket (encoche latérale, séparateur pointillé, ombre).
À jeter : le flux en formulaire.

Le flux retenu devra être expliqué dans le README : **quel problème du paiement classique il résout**.

---

## 7. Pièges connus dans les maquettes

1. **12 images pointent vers `lh3.googleusercontent.com`** (CDN Stitch, URLs éphémères).
   Remplacer par les posters locaux de `mockup stich/images/` — sinon la démo déployée affiche des vides.
2. **`04-billet.html` n'a aucune config Tailwind** : ses classes de palette ne résolvent pas.
   Ne pas s'y fier pour les couleurs.
3. **Tout est mobile-only** (`max-w-[420px]`, `shell-type: mobile_tab`). Le desktop est à concevoir.
4. **Barre de statut iOS simulée** dans `04-billet.html` : décor de maquette, à ne pas reproduire.
5. Les 3 posters d'événements sont **générés par IA** → à signaler comme assets de démo dans le README.

---

## 8. Git

Dépôt : **compte GitHub `moslv`**.

```bash
git config user.name "moslv"
git config user.email "syllamoustapha2805@gmail.com"
```

**Règles de commit — strictes :**
- Commits **atomiques et fréquents**, étalés sur la durée du challenge. L'historique est noté.
- Messages en français, à l'impératif, préfixés : `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`.
  Exemple : `feat: barre de navigation flottante avec badge Transport animé`
- **Aucune mention de Claude, d'IA ou d'assistant** dans les messages de commit, les PR, le README
  ou le code.
- **Aucune ligne `Co-Authored-By:`**. Aucun `🤖 Generated with`. Aucun lien de session.
  Aucun co-auteur, aucun collaborateur ajouté au dépôt.
- Manu est l'unique auteur de tous les commits.

Ne jamais `push --force` sur `main`. Ne jamais commiter sans que Manu ait validé l'état courant.

---

## 9. Grille de notation — à garder en tête à chaque décision

| Critère | Poids |
|---|---|
| Qualité et lisibilité du code | 15 % |
| Fidélité au concept (pass combiné, nav, structure) | 15 % |
| Qualité UX/UI et animation | 20 % |
| Réinvention du parcours de paiement | 15 % |
| Responsive réel (mobile + desktop) | 10 % |
| Innovation technique justifiée | 15 % |
| Initiative et créativité au-delà du brief | 10 % |

Le brief le dit deux fois : **« on ne cherche pas une page propre et correcte de plus »**.
Une décision qui rend le résultat plus sage est une mauvaise décision.

---

## 10. Langue

Interface, contenu mocké, messages de commit, README : **français**.
Code, noms de variables, de composants et de fichiers : **anglais**.
