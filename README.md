# Épox'Art — site professionnel + soumissions + CRM

Site Next.js prêt à déployer avec :

- design Épox'Art noir / or / bleu, 100 % responsive;
- services, système de couches, méthode, garantie et FAQ;
- formulaire de soumission gratuite complet;
- ajout de jusqu'à 5 photos (compression dans le navigateur);
- enregistrement des demandes et photos dans Supabase;
- courriel automatique à l'administrateur avec **toutes les coordonnées, tous les détails, les photos en pièces jointes et des liens privés vers les photos**;
- courriel de confirmation automatique au client;
- tableau de bord privé `/admin` pour suivre les demandes, statuts, photos et notes internes.

## 1) Supabase

Crée un projet Supabase, puis exécute `supabase/schema.sql` dans **SQL Editor**.

Dans **Authentication > Users**, crée ton utilisateur administrateur avec le même courriel que `ADMIN_EMAIL`.

## 2) Resend

Crée un compte Resend et une clé API. Vérifie idéalement `epoxart.store` dans **Resend > Domains**.

Tant que le domaine n'est pas vérifié, utilise :

`RESEND_FROM_EMAIL=Épox'Art <onboarding@resend.dev>`

## 3) Variables d'environnement

Dans Vercel > Project > Settings > Environment Variables :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `RESEND_FROM_EMAIL`

Copie `.env.example` en `.env.local` pour tester en local.

## 4) Déploiement Vercel

1. Mets ce dossier dans un dépôt GitHub.
2. Importe le dépôt dans Vercel.
3. Framework : **Next.js**.
4. Ajoute les variables ci-dessus.
5. Déploie.

## 5) Soumissions

Le client remplit le formulaire et peut joindre jusqu'à 5 photos. Les images lourdes sont compressées côté navigateur pour garder la requête compatible avec un déploiement serverless standard.

À l'envoi :

1. la demande est sauvegardée dans `quotes`;
2. les photos sont sauvegardées dans le bucket privé `quote-photos`;
3. l'administrateur reçoit le dossier par courriel avec les photos jointes et des liens privés valides 7 jours;
4. le client reçoit une confirmation;
5. la demande apparaît dans `/admin`.

## Sécurité

Ne publie jamais `SUPABASE_SERVICE_ROLE_KEY` ni `RESEND_API_KEY` dans GitHub. Garde-les uniquement dans les variables d'environnement de Vercel.
