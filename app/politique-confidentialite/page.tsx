import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Politique de confidentialité | Épox'Art",
  description: "Comment Épox'Art recueille, utilise et protège vos renseignements personnels.",
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="legalPage">
      <a href="/" className="backLink">&larr; Retour au site</a>
      <h1>Politique de confidentialité</h1>
      <p className="legalUpdated">Dernière mise à jour : {/* TODO: date de mise en ligne */} à compléter</p>

      <p>
        Épox&apos;Art (&laquo; nous &raquo;) respecte votre vie privée et s&apos;engage à protéger les
        renseignements personnels que vous nous transmettez, conformément à la Loi sur la protection des
        renseignements personnels dans le secteur privé du Québec (Loi 25).
      </p>

      <h2>1. Renseignements que nous recueillons</h2>
      <p>Lorsque vous remplissez notre formulaire de soumission, nous recueillons :</p>
      <ul>
        <li>Votre nom, courriel, téléphone et adresse du projet;</li>
        <li>Des détails sur votre projet (type, superficie, état de la surface);</li>
        <li>Les photos que vous choisissez de nous envoyer;</li>
        <li>Toute information supplémentaire que vous ajoutez dans votre description.</li>
      </ul>

      <h2>2. Utilisation de vos renseignements</h2>
      <p>
        Ces renseignements servent uniquement à évaluer votre projet, préparer une soumission et
        communiquer avec vous à ce sujet. Nous ne vendons ni ne louons vos renseignements personnels
        à des tiers.
      </p>

      <h2>3. Conservation et sécurité</h2>
      <p>
        Vos renseignements sont stockés de façon sécurisée et conservés le temps nécessaire au
        traitement de votre demande {/* TODO: précise une durée si tu en fixes une, ex. 24 mois */}.
        L&apos;accès à ces données est limité au personnel autorisé d&apos;Épox&apos;Art.
      </p>

      <h2>4. Partage avec des tiers</h2>
      <p>
        Nous utilisons des fournisseurs de services (hébergement, envoi de courriels) pour faire
        fonctionner ce site. Ces fournisseurs n&apos;ont accès à vos renseignements que dans la
        mesure nécessaire pour fournir leurs services et sont tenus de les protéger.
      </p>

      <h2>5. Vos droits</h2>
      <p>
        Vous pouvez en tout temps demander l&apos;accès à vos renseignements personnels, leur
        correction ou leur suppression en nous écrivant à{' '}
        <a href="mailto:info@epoxart.store">info@epoxart.store</a>
        {/* TODO: remplace par ton vrai courriel de contact */}.
      </p>

      <h2>6. Nous joindre</h2>
      <p>
        Pour toute question concernant cette politique ou vos renseignements personnels, contactez-nous à{' '}
        <a href="mailto:info@epoxart.store">info@epoxart.store</a>.
      </p>
    </main>
  );
}
