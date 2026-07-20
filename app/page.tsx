'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

const projects = [
  {
    title: 'Escalier extérieur en flocons',
    description: 'Finition texturée, uniforme et adaptée aux entrées résidentielles.',
    src: 'https://olipoxy.ca/wp-content/uploads/2024/06/epoxy-flake-stairs.jpg',
    fallback: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600'
  },
  {
    title: 'Garage époxy couleur',
    description: 'Un fini brillant et moderne qui transforme complètement le garage.',
    src: 'https://images.pexels.com/photos/17181949/pexels-photo-17181949.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fallback: 'https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=1600'
  },
  {
    title: 'Surface commerciale',
    description: 'Un revêtement durable, facile à nettoyer et conçu pour un usage intensif.',
    src: 'https://images.pexels.com/photos/103598/pexels-photo-103598.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fallback: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=1600'
  }
];

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/quotes', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d'envoyer la demande.");
      setSent(true);
      event.currentTarget.reset();
      document.getElementById('soumission')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <header className="nav">
        <a href="#accueil" className="brand" aria-label="Épox'Art accueil">
          <Image src="/brand/logo-square.jpg" alt="Logo Épox'Art" width={48} height={48} priority />
          <span>Épox&apos;Art</span>
        </a>
        <nav>
          <a href="#services">Services</a>
          <a href="#realisations">Réalisations</a>
          <a href="#soumission" className="button small">Soumission gratuite</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Revêtements époxy résidentiels et commerciaux</p>
          <h1>Des surfaces solides.<br />Un résultat qui se remarque.</h1>
          <p className="lead">Garages, escaliers extérieurs, sous-sols et espaces commerciaux. Chaque projet est préparé avec soin pour offrir une finition durable et professionnelle.</p>
          <div className="heroActions">
            <a className="button" href="#soumission">Obtenir une soumission gratuite</a>
            <a className="ghostButton" href="#realisations">Voir les finis</a>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="sectionHead">
          <p className="eyebrow">Nos services</p>
          <h2>Un système adapté à chaque surface</h2>
        </div>
        <div className="cards three">
          <article className="serviceCard"><span>01</span><h3>Garages</h3><p>Finitions en flocons, couleurs personnalisées et protection contre l’usure quotidienne.</p></article>
          <article className="serviceCard"><span>02</span><h3>Escaliers et entrées</h3><p>Revêtements texturés pour rehausser l’apparence des marches et des surfaces extérieures.</p></article>
          <article className="serviceCard"><span>03</span><h3>Commercial</h3><p>Solutions résistantes pour ateliers, commerces, entrepôts et zones à circulation élevée.</p></article>
        </div>
      </section>

      <section className="section dark" id="realisations">
        <div className="sectionHead">
          <p className="eyebrow">Inspirations réalistes</p>
          <h2>Des finis qui transforment l’espace</h2>
          <p>Ces images servent d’inspiration visuelle. Les couleurs et textures finales sont choisies selon votre projet.</p>
        </div>
        <div className="gallery">
          {projects.map((project) => (
            <article className="projectCard" key={project.title}>
              <div className="projectImage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.src} alt={project.title} onError={(e) => { e.currentTarget.src = project.fallback; }} />
              </div>
              <div className="projectText"><h3>{project.title}</h3><p>{project.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section process">
        <div className="sectionHead"><p className="eyebrow">Notre méthode</p><h2>Simple, claire et professionnelle</h2></div>
        <div className="steps">
          <div><strong>1</strong><h3>Votre demande</h3><p>Vous nous transmettez les détails, dimensions et photos de votre espace.</p></div>
          <div><strong>2</strong><h3>Analyse du projet</h3><p>Nous vérifions la surface, les contraintes et la finition souhaitée.</p></div>
          <div><strong>3</strong><h3>Prise de contact</h3><p>Nous vous recontactons rapidement pour discuter des prochaines étapes.</p></div>
        </div>
      </section>

      <section className="section quoteSection" id="soumission">
        <div className="quoteIntro">
          <p className="eyebrow">Soumission gratuite</p>
          <h2>Parlez-nous de votre projet</h2>
          <p>Remplissez le formulaire avec le plus de détails possible. Aucune estimation automatique et aucun prix n’est affiché : chaque projet est évalué individuellement.</p>
          <ul>
            <li>Réponse personnalisée</li>
            <li>Possibilité d’ajouter des photos</li>
            <li>Aucun engagement</li>
          </ul>
        </div>

        {sent ? (
          <div className="successBox">
            <div className="successIcon">✓</div>
            <h2>Merci d’avoir fait votre demande de soumission avec Épox&apos;Art.</h2>
            <p>Nous avons bien reçu vos informations. Notre équipe analysera votre projet et vous recontactera dans les plus brefs délais.</p>
            <button className="ghostButton" onClick={() => setSent(false)}>Faire une autre demande</button>
          </div>
        ) : (
          <form className="quoteForm" onSubmit={submitQuote} encType="multipart/form-data">
            <div className="formGrid">
              <label>Nom complet<input name="full_name" required autoComplete="name" /></label>
              <label>Courriel<input type="email" name="email" required autoComplete="email" /></label>
              <label>Téléphone<input type="tel" name="phone" required autoComplete="tel" /></label>
              <label>Ville<input name="city" required autoComplete="address-level2" /></label>
              <label className="full">Adresse du projet<input name="address" required autoComplete="street-address" /></label>
              <label>Type de projet<select name="project_type" required defaultValue=""><option value="" disabled>Sélectionner</option><option>Garage</option><option>Escalier extérieur</option><option>Entrée extérieure</option><option>Sous-sol</option><option>Commerce</option><option>Entrepôt</option><option>Autre</option></select></label>
              <label>Superficie approximative (pi²)<input type="number" name="square_feet" min="1" required /></label>
              <label>Longueur approximative (pi)<input type="number" name="length_ft" min="0" step="0.1" /></label>
              <label>Largeur approximative (pi)<input type="number" name="width_ft" min="0" step="0.1" /></label>
              <label>État du béton<select name="concrete_condition" defaultValue=""><option value="">Je ne sais pas</option><option>Bon état</option><option>Quelques fissures</option><option>Très fissuré ou endommagé</option><option>Peint ou déjà recouvert</option></select></label>
              <label>Humidité visible<select name="humidity" defaultValue=""><option value="">Je ne sais pas</option><option>Non</option><option>Oui</option></select></label>
              <label className="full">Date ou période souhaitée<input name="desired_date" placeholder="Ex. août 2026" /></label>
              <label className="full">Description du projet<textarea name="description" rows={5} required placeholder="Décrivez la surface, le fini souhaité et toute information utile." /></label>
              <label className="full upload">Photos du projet<input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple /><small>Jusqu’à 10 photos, 8 Mo maximum par photo.</small></label>
              <label className="full consent"><input type="checkbox" name="consent" required /> <span>J’autorise Épox&apos;Art à utiliser ces informations uniquement pour traiter ma demande et me recontacter.</span></label>
            </div>
            {error && <p className="formError">{error}</p>}
            <button className="button submit" type="submit" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer ma demande'}</button>
          </form>
        )}
      </section>

      <footer>
        <div className="brand footerBrand"><Image src="/brand/logo-square.jpg" alt="Épox'Art" width={46} height={46} /><span>Épox&apos;Art</span></div>
        <p>Revêtements époxy — Grand Montréal</p>
        <a href="/admin">Accès administrateur</a>
      </footer>
    </main>
  );
}
