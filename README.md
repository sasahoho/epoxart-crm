# Épox'Art — Site + CRM de soumissions

Application Next.js avec :

- site vitrine sans prix ni numéro de téléphone public;
- formulaire de soumission gratuite avec photos;
- enregistrement des demandes dans Supabase;
- courriel automatique à `karassekaldas3@gmail.com` via Resend;
- tableau de bord privé `/admin`;
- statuts et notes internes.

## 1. Sécurité immédiate

La clé Resend envoyée dans le chat doit être **révoquée**. Crée une nouvelle clé et ajoute-la uniquement dans Vercel comme variable `RESEND_API_KEY`. Ne l'écris jamais dans GitHub.

## 2. Créer la base Supabase

Dans Supabase > SQL Editor, colle et exécute `supabase/schema.sql`.

Dans Authentication > Users, crée l'utilisateur administrateur :

- courriel : `karassekaldas3@gmail.com`
- mot de passe : à choisir
- confirme l'utilisateur.

## 3. Variables Vercel

Dans Vercel > Project > Settings > Environment Variables, ajoute :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL` = `karassekaldas3@gmail.com`
- `RESEND_FROM_EMAIL` = `Épox'Art <soumissions@epoxart.store>` après validation du domaine dans Resend

Pour les clés Supabase : Project Settings > API.

## 4. Domaine Resend

Dans Resend > Domains, ajoute `epoxart.store`, puis ajoute les enregistrements DNS demandés chez ton fournisseur de domaine.

Tant que le domaine n'est pas vérifié, utilise temporairement :

`RESEND_FROM_EMAIL=Épox'Art <onboarding@resend.dev>`

## 5. Déploiement

Téléverse le contenu de ce dossier à la racine de ton dépôt GitHub, puis importe ce dépôt dans Vercel.

Réglages Vercel :

- Framework Preset : Next.js
- Root Directory : dossier contenant `package.json`
- Build Command : par défaut
- Output Directory : par défaut

## Images

Le site utilise des images d'inspiration externes. Remplace-les progressivement par tes propres réalisations. N'utilise jamais les images d'un concurrent comme si elles représentaient des travaux réalisés par Épox'Art.
