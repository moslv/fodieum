# Fodium — billetterie et navettes événementielles

Challenge frontend Kanzey.co. Reconception de l'accueil et du parcours d'achat de
Fodium autour de sa nouvelle offre **Fodium Transport** : un seul pass pour le
billet et le trajet.

**Démo** : _(lien de déploiement à ajouter)_

---

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification de types + build de production
npm run lint
npm run posters    # régénère les affiches WebP depuis les sources
```

Aucun backend, aucune variable d'environnement. Les données vivent dans
`src/data/`, les billets achetés dans le `localStorage` du navigateur.

---

## Choix techniques

### Vite + React + TypeScript

Pas de SSR : il n'y a ni backend à interroger, ni contenu à référencer. Next.js
aurait apporté un routeur serveur et une couche de cache dont rien ici ne se
sert, pour un temps de build et une surface de configuration supérieurs. Sur
cinq jours, le HMR de Vite compte plus que le rendu serveur.

TypeScript strict, sans `any`.

### Tailwind CSS, avec la palette en variables CSS

Tailwind est imposé par le brief. La palette Material 3 des maquettes n'est pas
écrite en dur dans la configuration : chaque teinte est une **variable CSS**
déclarée deux fois dans `src/styles/index.css`.

```js
primary: 'rgb(var(--primary) / <alpha-value>)'
```

Conséquence directe : le thème sombre est une classe `.dark` sur `<html>`, et
**aucun composant ne porte de variante `dark:`**. Un seul endroit décrit les deux
thèmes.

### React Router (routeur de données)

`createBrowserRouter` plutôt que le routeur déclaratif : c'est lui qui débloque
`ScrollRestoration` et le prop `viewTransition` des liens, sur lequel repose la
transition entre la carte d'un événement et sa page détail.

Neuf routes, dont les trois du brief (accueil, détail, teaser transport).

### Pas de bibliothèque d'état

Deux petits magasins de module (`lib/ticketStore.ts`, `lib/theme.ts`) exposés par
`useSyncExternalStore`. Les pages s'abonnent à l'état sans qu'un contexte ait à
envelopper toute l'application, et le coffre à billets survit au rechargement.
Redux ou Zustand pour deux tableaux aurait été une dépendance de plus sans
contrepartie.

### GSAP

**Ce qui était impossible en CSS seul : une animation qu'on parcourt, et qui
sait revenir en arrière.**

L'impression du billet est une frise GSAP laissée **en pause**, dont on adresse
la position (`timeline.progress(p)`). Une transition CSS, ou une animation
déclenchée puis oubliée, joue du début à la fin : elle ne sait ni suivre le
doigt, ni rembobiner si l'on relâche. Ici la frise est parcourue par deux
sources successives — l'appui maintenu, puis le retour de l'opérateur de
paiement.

GSAP sert aussi à la déchirure du billet à l'annulation (`useTicketTear`), où
l'enchaînement tampon → secousse élastique → séparation des deux moitiés
demande un ordonnancement que des `@keyframes` parallèles ne donnent pas.

### View Transitions API

Le poster d'un événement porte un `viewTransitionName` : le navigateur fait
lui-même le morphing entre la vignette de la carte et le bandeau de la page
détail. Native, sans coût de bundle, et dégradée proprement là où elle n'existe
pas.

---

## Le pass combiné

`PassSelector` : **Billet seul** / **Billet + Navette**. Le choix de la navette
fait apparaître le sélecteur de point de départ (avec l'horaire aller, l'horaire
retour et les places restantes), le prix se recalcule, et le récapitulatif reste
sous les yeux jusqu'à la validation. Le calcul vit dans `lib/pricing.ts`, jamais
dans le JSX.

Un billet avec navette porte son point de départ, ses horaires et **un numéro de
siège** — dérivé de la référence, donc stable.

---

## Le parcours de paiement

Le brief demande de dépasser le flux « grille d'opérateurs + champ téléphone +
bouton Payer ». `mockup stich/code/ecrans/03-paiement.html` est exactement ce
flux : il a servi de contre-exemple.

### Le problème traité

Un paiement mobile sénégalais **sort de l'application**. Wave ou Orange Money
prend la main pour retirer les fonds, et l'utilisateur revient sur un spinner,
sans savoir si son billet existe. C'est là que les billetteries perdent les gens.
Le paiement classique a deux défauts : on ne peut plus revenir en arrière une
fois le bouton pressé, et on ne voit rien de ce qu'on achète.

### Ce qui a été construit

**1. L'attente *est* le geste.** On maintient le bouton au lieu de le cliquer
(`HoldToPay`). L'avancement suit le doigt, et **relâcher avant la fin annule** —
rien n'est débité. Le geste reste réversible jusqu'au dernier instant, ce qu'un
clic ne permet pas.

**2. Le billet s'imprime sous le doigt.** Pendant l'appui, le titre et les champs
du billet s'inscrivent. On voit ce qu'on est en train d'acheter se former. Si on
relâche, le billet se dé-imprime.

**3. L'aller-retour chez l'opérateur est rendu visible.** `PaymentHandoff`
annonce le départ, montre le retrait, accuse le retour. Le billet reste à
l'écran derrière le voile : on n'a jamais quitté sa commande. Tant que les fonds
ne sont pas prélevés, **« Annuler le paiement » est disponible**.

**4. Ce qui valide le billet arrive avec le débit.** Le code-barres, le sceau
« Vérifié » et le numéro de souche ne s'impriment **qu'au retour de
l'opérateur** — les 60 % restants de la frise. L'appui prépare le billet, le
paiement l'émet.

**5. Le billet se télécharge.** `lib/ticketImage.ts` redessine le billet dans un
canvas à taille d'impression et rend un PNG. Ce n'est pas une capture d'écran :
c'est le même objet redessiné, entailles, affiche et code-barres compris.

**6. On peut rendre un billet.** Annulation en deux temps — le premier appui
demande confirmation, la demande retombe seule au bout de cinq secondes. Pas de
`confirm()` du navigateur, qui bloque la page et sort l'utilisateur du billet
qu'il regarde. Le billet se fait tamponner et se déchire à l'écran avant de
quitter le coffre.

---

## Le billet

Un billet garde **le même format partout** — au paiement, dans le coffre, en
liste. `TicketFrame` porte le contour, `TicketStub` et `TicketListCard` n'en
remplissent que le corps.

Les entailles latérales sont **deux masques radiaux intersectés**, pas des
pastilles posées par-dessus : la découpe évide réellement le billet, donc elle
tient sur n'importe quel fond, clair comme sombre. L'ombre est portée en
`drop-shadow` par l'enveloppe, parce qu'une `box-shadow` posée sur le billet
serait rognée par le masque en même temps que le reste.

C'est la seule entorse à « tout en Tailwind » : aucune classe n'exprime un
masque composé. Elle est isolée dans `@layer components` et commentée.

---

## Responsive

Mobile d'abord, desktop conçu (les maquettes sont mobile-only).

- **Mobile** : barre d'onglets flottante à cinq accès, avec un indicateur unique
  qui glisse d'un onglet à l'autre plutôt que cinq fonds commutés. Badge
  « bientôt » animé sur Transport — un reflet qui balaie la pastille et un halo
  qui respire.
- **Desktop / tablette large** : header horizontal, mêmes cinq accès, pas de
  barre flottante. Le carrousel « À la une » devient une grille, la page
  événement passe en deux colonnes, le coffre à billets aussi.

---

## Mode sombre

Trois réglages, pas deux : **Système** par défaut — un visiteur qui a réglé son
téléphone en sombre n'a pas à le redire — puis Clair ou Sombre s'il choisit.
Bouton dans les deux en-têtes, réglage nommé sur la page Profil.

Le thème est posé par un script d'amorçage dans `index.html`, avant le premier
rendu : chargé par React, il ferait apparaître la page en clair avant de virer
au sombre.

Deux inversions ne se déduisent pas d'un simple échange de teintes et sont
faites à la main : l'orange s'éclaircit et le texte posé dessus s'assombrit
(du blanc sur `#F07E00` ne passe pas le contraste), et les filets comme les
ombres changent de sens — un trait noir à 6 % ne se voit plus sur fond sombre.

---

## Détails techniques notables

**Rendu déterministe.** Référence de billet, motif de code-barres, numéro de
siège et tirage d'affiche sortaient de `Math.random()` : ils changeaient à chaque
rendu de React. Tout dérive maintenant d'un hachage FNV-1a d'une graine textuelle
(`lib/hash.ts`). Un même panier produit toujours le même billet.

**Affiches générées.** Les maquettes ne fournissent que trois posters. Plutôt
qu'emprunter le visuel d'un autre événement, `PosterArtwork` compose une affiche
sérigraphiée depuis les données de la fiche — encre plate, trame SVG, titre au
massicot, deux gammes par famille d'événement. Le composant sert de filet : il
s'affiche dès qu'une fiche n'a pas de photo.

**Carrousel auto.** Le défilement est calculé sur le conteneur plutôt que confié
à `scrollIntoView`, qui emportait la page avec lui quand le carrousel n'est qu'à
moitié visible. Il s'interrompt au survol, au doigt posé, quand l'onglet passe en
arrière-plan, et quand le carrousel devient une grille.

**Mouvement réduit.** `prefers-reduced-motion` est respecté partout : la frise
d'impression rend le billet complet d'emblée, la déchirure est sautée, le
carrousel ne défile plus, et une règle de sécurité dans `index.css` couvre les
animations que le navigateur déclenche seul.

---

## Accessibilité

`aria-label` sur tout bouton icône, `role="radiogroup"` sur le choix de thème,
`aria-live` sur les états de paiement et d'annulation, focus visible avec anneau
décalé, contrastes tenus dans les deux thèmes. Les barres de code-barres sont
`aria-hidden` — c'est une image, pas du texte.

---

## Priorisation

1. **Le modèle de données et le calcul de prix** avant toute interface. C'est ce
   qui rend le pass combiné réel plutôt que décoratif.
2. **La navigation et les six écrans**, pour avoir un parcours entier tôt, même
   grossier.
3. **Le pass combiné**, cœur du concept, noté sur la fidélité.
4. **Le paiement**, qui vaut 15 % à lui seul et qu'on demandait explicitement de
   réinventer.
5. **Le billet et le coffre**, puis la recherche.
6. **Le thème sombre en dernier, mais préparé dès le départ** : le passage aux
   tokens de surface a été fait avant, ce qui a réduit le mode sombre à une
   table de variables.

## Avec plus de temps

- **Tests.** Rien n'est testé. `lib/pricing.ts`, `lib/search.ts` et
  `lib/ticketView.ts` sont des fonctions pures : elles méritent Vitest en
  premier.
- **Découpage du bundle.** 519 ko avant gzip (166 ko gzippés), un seul morceau. GSAP et le
  générateur de PNG ne servent qu'au paiement : un `import()` dynamique les
  sortirait du chemin critique de l'accueil.
- **Le vrai contenu Transport.** Le teaser est une page ; la grille de trajets
  interurbains, la carte des points de départ et le suivi de navette sont le
  service réel.
- **Persistance hors ligne.** Le brief insiste sur des billets lisibles sans
  réseau : un service worker et un manifeste PWA tiendraient la promesse pour de
  bon.
- **Le partage de billet.** `navigator.share` est branché mais ne partage qu'une
  URL locale.
- **Vérification visuelle automatisée.** Une comparaison des écrans avec les PNG
  de référence, en CI.

---

## Assets

| Source | Fichiers | Statut |
|---|---|---|
| Maquettes Stitch | `poster-pool-party-saly`, `poster-fashion-week-dakar`, `poster-jazz-night` | **Générés par IA** — visuels de démonstration |
| Pexels (licence libre, usage commercial) | `poster-popenguine`, `poster-saint-louis-jazz`, `poster-dakar-jazz` | Provenance détaillée dans `photos/SOURCES.md` |
| Généré par le code | Toute fiche sans photo | `PosterArtwork` |

Les originaux sont convertis en WebP à deux largeurs, recadrés en 4:3, par
`npm run posters`. Seuls les WebP sont servis.

Noms, prix, organisateurs et horaires sont **fictifs**.

---

## Hors périmètre

Conformément au brief : pas d'authentification, pas de paiement réel, pas
d'interface agent de scan, vendeur, admin ou organisateur. La page Profil est
une maquette statique.
