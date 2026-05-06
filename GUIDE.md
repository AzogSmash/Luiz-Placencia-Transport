# Guide — Luis Placencia Transport

> Rédigé le 06/05/2026 — pour Clément et l'équipe.

---

## 1. Vue d'ensemble du site

Le site est en ligne sur **https://luiz-placencia-transport.vercel.app**

C'est une application Next.js complète avec :
- Un site vitrine public
- Un système de réservation en 3 étapes
- Des comptes membres (clients)
- Un panneau d'administration
- Des emails automatiques (confirmation de réservation, changement de statut, formulaire de contact)

**Stack technique :** Next.js · Supabase (base de données + auth) · Resend (emails) · Vercel (hébergement)

---

## 2. Pages publiques du site

| URL | Contenu |
|-----|---------|
| `/` | Page d'accueil — hero, services, flotte, processus, avis |
| `/servicios` | Catalogue des 6 services avec tarifs indicatifs |
| `/reserva` | Formulaire de réservation en 3 étapes |
| `/contacto` | Formulaire de contact + inscription newsletter |
| `/aviso-legal` | Mentions légales |
| `/politica-privacidad` | Politique de confidentialité (RGPD) |
| `/cgv` | Conditions générales de vente |

---

## 3. Naviguer en tant que membre (client)

### S'inscrire
1. Cliquer **MI CUENTA** dans le menu
2. Sur la page de connexion, cliquer **Crear una cuenta**
3. Remplir nom, email, mot de passe
4. Un email de confirmation est envoyé → le client doit cliquer le lien avant de pouvoir se connecter

### Se connecter
1. **MI CUENTA** → entrer email + mot de passe
2. Redirection automatique vers le **tableau de bord** (`/dashboard`)

### Ce que voit un membre connecté
- **Dashboard (`/dashboard`)** : ses propres réservations, statuts (en attente / confirmée / en cours / terminée / annulée), nombre total
- **Mon compte (`/compte`)** : modifier son nom, téléphone, adresse, langue préférée, email, mot de passe

### Faire une réservation
1. Aller sur `/reserva`
2. **Étape 1** — choisir le type de service + le véhicule
   - Tesla Model Y : 1–4 pax · 2 bagages
   - Hyundai Staria : 1–7 pax · 6 bagages
   - Mercedes Clase V : 1–7 pax · 6 bagages
   - Toyota Proace : 1–8 pax · 6 bagages
3. **Étape 2** — lieu de départ, destination, date (pas dans le passé), heure, passagers, bagages
4. **Étape 3** — nom, email, téléphone (min. 9 chiffres), message optionnel
5. Validation → confirmation à l'écran avec numéro de réservation + email automatique envoyé au client ET à Luis

---

## 4. Naviguer en tant qu'admin

### Accéder au panneau admin
L'admin doit d'abord se connecter avec un **compte ayant le rôle admin** (voir section 5 ci-dessous).

URL directe : **`/admin`**

Depuis le dashboard, le lien "Panel Admin" apparaît si le compte a le rôle `admin`.

### Ce que l'admin peut faire

**Vue d'ensemble :**
- Toutes les réservations de tous les clients
- Compteurs par statut : Total · En attente · Confirmée · En cours · Terminée · Annulée

**Filtrer les réservations :**
- Onglets en haut : Todas / En attente / Confirmée / En cours / Terminée / Annulée

**Chaque réservation affiche :**
- Numéro de réservation (#ID)
- Nom, email, téléphone du client
- Adresse de départ → destination
- Date et heure
- Nombre de passagers
- Message du client (notes, vol, sièges enfants...)
- Date de création
- Statut actuel

**Changer le statut d'une réservation :**
1. Trouver la réservation dans la liste
2. Cliquer le menu déroulant de statut sur la ligne
3. Choisir le nouveau statut
4. → Le client reçoit **automatiquement un email** de notification du changement de statut

**Statuts disponibles :**
- `En attente` — réservation reçue, pas encore traitée
- `Confirmée` — Luis a confirmé le trajet
- `En cours` — trajet en cours
- `Terminée` — trajet terminé
- `Annulée` — réservation annulée

---

## 5. Créer un compte admin (à faire lundi)

Les comptes admin **ne se créent pas depuis le site** — ils se configurent directement dans Supabase.

### Étapes :

**Option A — Promouvoir un compte existant**
1. Aller sur [supabase.com](https://supabase.com) → se connecter → ouvrir le projet Luis Placencia Transport
2. Aller dans **Table Editor** → table `profiles`
3. Trouver la ligne avec l'email du compte à promouvoir
4. Changer la colonne `role` de `user` à `admin`
5. Sauvegarder

**Option B — Créer un nouveau compte admin**
1. Créer le compte normalement sur le site (`/register`)
2. Puis faire l'étape A ci-dessus pour lui donner le rôle admin

> Le compte de Luis devrait être promu admin de cette façon pour qu'il accède à `/admin`.

---

## 6. Emails automatiques en place

| Déclencheur | Destinataire | Contenu |
|-------------|-------------|---------|
| Nouvelle réservation | Client | Confirmation avec numéro de réf., détails du trajet |
| Nouvelle réservation | Admin (Luis) | Alerte avec toutes les infos client, lien vers `/admin` |
| Changement de statut | Client | Notification du nouveau statut |
| Formulaire de contact | Admin (Luis) | Message reçu avec email du client en reply-to |

> **Note :** Les emails partent actuellement depuis `onboarding@resend.dev` (adresse de test). Une fois le domaine connecté, ils partiront depuis `noreply@luizplasenciatransport.com`.

---

## 7. Ce qui reste à faire — par ordre de priorité

### 🔴 URGENT — Avant de communiquer l'URL aux clients

**1. Compléter les mentions légales et CGV**
Les pages `/aviso-legal`, `/politica-privacidad` et `/cgv` ont des champs `[À compléter]`.
Il faut demander à Luis :
- Son adresse postale complète
- Sa forme juridique (Auto-entrepreneur ? SASU ?)
- Ses conditions d'annulation (délai de préavis, pourcentage de pénalité)
- Son numéro de licence VTC
- Son assurance responsabilité civile professionnelle
- Le nom du médiateur de consommation agréé

---

### 🟡 IMPORTANT — Pour un site professionnel complet

**4. Confirmer les tarifs avec Luis**
La page `/servicios` affiche des tarifs indicatifs (75€ aéroport, 110€ Disneyland, etc.) mais le formulaire de réservation dit "Precio bajo consulta". Il faut décider avec Luis si :
- Les tarifs affichés sont corrects et définitifs
- Ou si on enlève les prix de la page services et tout passe par devis

**5. Connecter le domaine `luizplasenciatransport.com`**
- Luis a le domaine via Wix
- Il doit se connecter à son compte Wix, aller dans Domaines → DNS
- Toi tu vas dans Vercel → projet → Settings → Domains → ajouter `luizplasenciatransport.com`
- Vercel te donne 2 enregistrements DNS à coller dans Wix
- Ensuite dans Resend → Domains → ajouter le domaine → 3 enregistrements DNS supplémentaires à coller dans Wix
- Une fois fait : mettre à jour `FROM` dans `src/lib/resend.ts` → `noreply@luizplasenciatransport.com`
- Et mettre à jour le `Site URL` dans Supabase → Auth → URL Configuration

---

### 🟢 AMÉLIORATIONS — Quand le site tourne bien

**6. Paiement en ligne (Stripe)**
Intégrer Stripe pour permettre le paiement à la réservation (ou acompte).
Nécessite : la grille tarifaire définitive de Luis + un compte Stripe.

**7. Photos réelles des véhicules**
Si Luis prend de vraies photos de ses véhicules, on les intègre directement (remplacer les photos actuelles dans `public/vehicles/`).

**8. Newsletter**
La liste des emails s'accumule dans Supabase. Pour envoyer de vraies campagnes, il faudra connecter un outil comme Brevo (gratuit jusqu'à 300 emails/jour) ou Resend Broadcasts.

**9. Optimisation SEO**
Ajouter des balises méta, description, Open Graph pour que Google indexe bien le site.

---

## 8. Informations encore nécessaires du client

| Information | Pour quoi faire |
|-------------|----------------|
| Adresse postale complète | Mentions légales, CGV, pages légales |
| Forme juridique (auto-entrepreneur, SASU...) | Mentions légales |
| Numéro de licence VTC | CGV (obligatoire légalement) |
| Assurance RC professionnelle | CGV |
| Conditions d'annulation (délais + %) | CGV |
| Grille tarifaire définitive | Page servicios + CGV + futur paiement en ligne |
| Accès compte Wix | Pour connecter le domaine |
| Vraies photos véhicules (optionnel) | Remplacement photos actuelles |

---

## 9. Variables d'environnement Vercel (à vérifier)

Aller sur **Vercel → projet → Settings → Environment Variables**

| Variable | Valeur | Statut |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Doit être présente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Doit être présente |
| `SUPABASE_SERVICE_KEY` | Clé service Supabase | Doit être présente |
| `RESEND_API_KEY` | Clé API Resend | À vérifier |
| `ADMIN_NOTIFICATION_EMAIL` | `Luisplasenciatransport@gmail.com` | Optionnelle (déjà en fallback) |

---

## 10. Contacts utiles

| Service | Où se connecter |
|---------|----------------|
| Vercel (hébergement) | vercel.com |
| Supabase (base de données) | supabase.com |
| Resend (emails) | resend.com |
| GitHub (code source) | github.com/AzogSmash/Luis-Placencia-Transport |
| Site en production | luiz-placencia-transport.vercel.app |

---

*Guide rédigé par Clément — projet Luis Placencia Transport*
