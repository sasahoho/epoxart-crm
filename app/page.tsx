'use client';

import Image from 'next/image';
import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useState } from 'react';

const inspirations = [
  { title: 'Garage en flocons', description: 'Un fini propre, uniforme et durable pour un garage moderne.', src: '/images/garage-flocons.jpeg' },
  { title: 'Escaliers en flocons', description: 'Une finition texturée qui transforme complètement une entrée extérieure.', src: '/images/escaliers-flocons.jpeg' },
  { title: 'Époxy métallique noir', description: 'Un effet profond, brillant et haut de gamme qui attire immédiatement le regard.', src: '/images/epoxy-metallique-noir.jpeg' },
  { title: 'Époxy métallique sur mesure', description: 'Des mouvements uniques qui donnent à chaque surface une identité distincte.', src: '/images/epoxy-metallique-brillant.jpeg' }
];

const reasons = [
  {
    title: 'Matériaux de qualité professionnelle',
    description: 'Produits époxy certifiés, choisis pour leur durabilité et leur résistance à l\u2019usure, à l\u2019humidité et aux taches.'
    // TODO: remplace par la marque exacte de produit que tu utilises si tu veux la nommer.
  },
  {
    title: 'Un processus clair, du début à la fin',
    description: 'Analyse de la surface, préparation rigoureuse du béton et suivi personnalisé à chaque étape — aucune surprise en cours de projet.'
  },
  {
    title: 'Garantie sur les travaux',
    description: 'Chaque projet est couvert par une garantie écrite sur la qualité de l\u2019installation.'
    // TODO: précise la durée réelle de ta garantie (ex. 2 ans, 5 ans) une fois déterminée.
  },
  {
    title: 'Entreprise assurée',
    description: 'Épox\u2019Art opère avec les assurances et licences requises pour les travaux de revêtement au Québec.'
    // TODO: ajoute ton numéro de licence RBQ et ton NEQ ici dès que disponibles — voir aussi le footer.
  }
];

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(()=>{const mm=(e:MouseEvent)=>{document.body.style.setProperty('--mx',String(e.clientX));document.body.style.setProperty('--my',String(e.clientY));};window.addEventListener('mousemove',mm);return()=>window.removeEventListener('mousemove',mm);},[]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        document.body.style.setProperty('--scroll', String(window.scrollY));
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleHeroMouseMove(event: ReactMouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  }

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
      <div className="scrollProgress" style={{ width: `${progress}%` }} />
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#accueil" className="brand">
          <Image src="/brand/logo-square.jpg" alt="Logo Épox'Art" width={50} height={50} priority />
          <span>Épox&apos;Art</span>
        </a>
        <nav>
          <a href="#services">Services</a>
          <a href="#realisations">Réalisations</a>
          <a href="#soumission" className="button small">Soumission gratuite</a>
        </nav>
      </header>

      <section className="hero" id="accueil" onMouseMove={handleHeroMouseMove}>
        <div className="heroBg" />
        <div className="heroOverlay" />
        <div className="heroGlow" />
        <div className="heroContent">
          <p className="eyebrow">Revêtements d&apos;époxy haut de gamme</p>
          <h1>Transformez votre surface en <em>œuvre d&apos;art</em>.</h1>
          <p className="lead">Finitions en flocons et effets métalliques sur mesure pour garages, escaliers, sous-sols et espaces commerciaux.</p>
          <div className="heroActions">
            <a className="button" href="#soumission">Obtenir une soumission</a>
            <a className="ghostButton" href="#realisations">Découvrir nos finis</a>
          </div>
        </div>
      </section>

      <section className="section intro">
        <p className="eyebrow">Épox&apos;Art</p>
        <h2>Un fini pensé pour impressionner. Une surface conçue pour durer.</h2>
        <p className="introText">Chaque projet est préparé avec soin afin d&apos;obtenir une finition propre, durable et visuellement remarquable.</p>
      </section>

      <section className="section" id="services">
        <div className="sectionHead reveal">
          <p className="eyebrow">Nos services</p>
          <h2>Deux univers. Une finition haut de gamme.</h2>
        </div>
        <div className="serviceShowcase">
          <article className="serviceFeature reveal">
            <Image src="/images/garage-flocons.jpeg" alt="Garage avec sol en époxy flocons" fill sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="serviceShade" />
            <div className="serviceContent"><span>01</span><h3>Époxy en flocons</h3><p>Un fini texturé, uniforme et durable pour garages, escaliers et entrées.</p></div>
          </article>
          <article className="serviceFeature reveal">
            <Image src="/images/epoxy-metallique-noir.jpeg" alt="Garage avec sol en époxy métallique" fill sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="serviceShade" />
            <div className="serviceContent"><span>02</span><h3>Époxy métallique</h3><p>Des mouvements de couleurs uniques pour créer un effet luxueux et spectaculaire.</p></div>
          </article>
        </div>
      </section>

      <section className="section dark" id="realisations">
        <div className="sectionHead reveal">
          <p className="eyebrow">Inspirations</p>
          <h2>Des finis qui changent complètement l&apos;espace.</h2>
          <p className="disclaimer">Épox&apos;Art démarre ses activités : ces images illustrent des finis que nous proposons et servent d&apos;inspiration pour votre projet. Notre portfolio de réalisations sera mis à jour au fil de nos premiers chantiers.</p>
        </div>
        <div className="galleryPremium">
          {inspirations.map((project, index) => (
            <article className={`projectCard reveal ${index === 0 ? 'featured' : ''}`} key={project.title}>
              <div className="projectImage"><Image src={project.src} alt={project.title} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
              <div className="projectText"><span>Inspiration</span><h3>{project.title}</h3><p>{project.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="pourquoi">
        <div className="sectionHead reveal">
          <p className="eyebrow">Pourquoi nous choisir</p>
          <h2>Une entreprise sérieuse, même à ses débuts.</h2>
        </div>
        <div className="reasonsGrid">
          {reasons.map((reason) => (
            <div className="reasonCard reveal" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section process">
        <div className="sectionHead reveal"><p className="eyebrow">Notre méthode</p><h2>Simple, claire et professionnelle.</h2></div>
        <div className="steps">
          <div className="stepItem reveal"><strong>01</strong><h3>Votre demande</h3><p>Vous nous transmettez les dimensions, le type de fini et des photos.</p></div>
          <div className="stepItem reveal"><strong>02</strong><h3>Analyse du projet</h3><p>Nous vérifions la surface, les contraintes et la finition souhaitée.</p></div>
          <div className="stepItem reveal"><strong>03</strong><h3>Prise de contact</h3><p>Nous vous recontactons rapidement pour discuter des prochaines étapes.</p></div>
        </div>
      </section>

      <section className="section quoteSection" id="soumission">
        <div className="quoteIntro reveal">
          <p className="eyebrow">Soumission gratuite</p>
          <h2>Parlez-nous de votre projet.</h2>
          <p>Remplissez le formulaire avec le plus de détails possible. Chaque projet est évalué individuellement.</p>
          <ul><li>Réponse personnalisée</li><li>Possibilité d&apos;ajouter des photos</li><li>Aucun engagement</li></ul>
        </div>

        {sent ? (
          <div className="successBox">
            <div className="successIcon">✓</div>
            <h2>Merci d&apos;avoir fait votre demande de soumission avec Épox&apos;Art.</h2>
            <p>Nous avons bien reçu vos informations. Notre équipe analysera votre projet et vous recontactera rapidement.</p>
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
              <label>État de la surface<select name="concrete_condition" defaultValue=""><option value="">Je ne sais pas</option><option>Bon état</option><option>Quelques fissures</option><option>Très fissurée ou endommagée</option><option>Peinte ou déjà recouverte</option></select></label>
              <label>Humidité visible<select name="humidity" defaultValue=""><option value="">Je ne sais pas</option><option>Non</option><option>Oui</option></select></label>
              <label className="full">Date ou période souhaitée<input name="desired_date" placeholder="Ex. août 2026" /></label>
              <label className="full">Description du projet<textarea name="description" rows={5} required placeholder="Décrivez la surface, le fini souhaité et toute information utile." /></label>
              <label className="full upload">Photos du projet<input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple /><small>Jusqu&apos;à 10 photos, 8 Mo maximum par photo.</small></label>
              <label className="full consent"><input type="checkbox" name="consent" required /> <span>J&apos;autorise Épox&apos;Art à utiliser ces informations uniquement pour traiter ma demande et me recontacter.</span></label>
            </div>
            {error && <p className="formError">{error}</p>}
            <button className="button submit" type="submit" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer ma demande'}</button>
          </form>
        )}
      </section>

      <footer>
        <div className="brand footerBrand"><Image src="/brand/logo-square.jpg" alt="Épox'Art" width={46} height={46} /><span>Épox&apos;Art</span></div>
        <div className="footerInfo">
          <p>Revêtements d&apos;époxy haut de gamme — Grand Montréal</p>
          {/* TODO: remplace par ton vrai courriel de contact public si différent */}
          <p><a href="mailto:info@epoxart.store">info@epoxart.store</a></p>
          {/* TODO: ajoute ta licence RBQ et ton NEQ ici dès qu'ils sont attribués, ex: "RBQ 0000-0000-00 · NEQ 0000000000" */}
        </div>
        <div className="footerLinks">
          <a href="/politique-confidentialite">Politique de confidentialité</a>
          <a href="/admin">Accès administrateur</a>
        </div>
      </footer>
    </main>
  );
}
