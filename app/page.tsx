'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';

const services = [
  { n: '01', title: 'Garage résidentiel', text: 'Revêtement décoratif durable, facile à nettoyer et conçu pour faire face au sel, aux pneus et à l’usage quotidien.' },
  { n: '02', title: 'Sous-sol & atelier', text: 'Une surface uniforme qui modernise l’espace et simplifie l’entretien.' },
  { n: '03', title: 'Escaliers & entrées', text: 'Systèmes texturés et finition soignée pour les marches et surfaces de transition.' },
  { n: '04', title: 'Commercial', text: 'Solutions professionnelles pour commerces, ateliers, salles d’exposition et zones de travail.' },
];

const steps = [
  ['Inspection', 'Mesure de la surface, état du béton, fissures, revêtement existant et signes d’humidité.'],
  ['Préparation', 'Dégraissage au besoin, réparations mineures et meulage diamant avec aspiration.'],
  ['Application', 'Primaire au besoin, couche de base époxy, flocons décoratifs et finition protectrice.'],
  ['Contrôle qualité', 'Vérification des bordures, de l’uniformité, nettoyage du chantier et consignes de cure.'],
];

const finishes = [
  { cls: 'flake graphite', name: 'Graphite', sub: 'Flocons · look moderne' },
  { cls: 'flake glacier', name: 'Glacier', sub: 'Flocons · clair et propre' },
  { cls: 'flake cobalt', name: 'Cobalt', sub: 'Accent bleu Épox’Art' },
  { cls: 'metallic obsidian', name: 'Obsidienne', sub: 'Métallique · noir profond' },
];

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  if (file.size < 700_000) return file;

  const bitmap = await createImageBitmap(file);
  const maxSide = 1400;
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.76));
  if (!blob || blob.size >= file.size) return file;
  const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const photoLabel = useMemo(() => {
    if (!photos.length) return 'Aucune photo sélectionnée';
    return `${photos.length} photo${photos.length > 1 ? 's' : ''} sélectionnée${photos.length > 1 ? 's' : ''}`;
  }, [photos]);

  async function onPhotosChange(files: FileList | null) {
    setError('');
    if (!files) return setPhotos([]);
    const originals = Array.from(files).slice(0, 5);
    try {
      const compressed = await Promise.all(originals.map(compressImage));
      const total = compressed.reduce((sum, f) => sum + f.size, 0);
      if (total > 3_500_000) {
        setPhotos([]);
        setError('Les photos sont encore trop lourdes après compression. Choisissez moins de photos ou des images plus petites.');
        return;
      }
      setPhotos(compressed);
    } catch {
      setPhotos(originals);
    }
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSending(true);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    form.delete('photos');
    photos.forEach((photo) => form.append('photos', photo, photo.name));

    try {
      const response = await fetch('/api/quotes', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d'envoyer la demande.");
      setSent(true);
      setPhotos([]);
      formEl.reset();
      document.getElementById('soumission')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <header className="siteNav">
        <a href="#accueil" className="brand" aria-label="Épox'Art — accueil">
          <Image src="/brand/logo-square.jpg" alt="Logo Épox’Art" width={52} height={52} priority />
          <div><strong>ÉPOX’ART</strong><span>Sols & revêtements époxy</span></div>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#services">Services</a>
          <a href="#finitions">Finitions</a>
          <a href="#realisations">Réalisations</a>
          <a href="#methode">Méthode</a>
          <a href="#faq">FAQ</a>
          <a className="navButton" href="#soumission">Soumission gratuite</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <div className="heroTexture" />
        <div className="heroGlow" />
        <div className="heroCopy">
          <p className="eyebrow">Rive-Sud de Montréal · Résidentiel & commercial</p>
          <h1>Le béton devient<br /><em>une finition haut de gamme.</em></h1>
          <p className="lead">Préparation mécanique du béton, systèmes époxy décoratifs et finition protectrice. Une exécution méthodique, du premier meulage au dernier contrôle qualité.</p>
          <div className="heroActions">
            <a className="button primary" href="#soumission">Obtenir une soumission gratuite</a>
            <a className="button secondary" href="#finitions">Voir les finitions</a>
          </div>
          <div className="heroProof">
            <span><i>✓</i> Meulage diamant</span>
            <span><i>✓</i> Réparation mineure</span>
            <span><i>✓</i> Finition protectrice</span>
          </div>
        </div>
        <div className="heroMark" aria-hidden="true">
          <Image src="/brand/logo-square.jpg" alt="" width={620} height={620} priority />
        </div>
      </section>

      <section className="trustStrip" aria-label="Points clés">
        <div><strong>Préparation</strong><span>Inspection, nettoyage et profilage du béton</span></div>
        <div><strong>Protection</strong><span>Époxy + finition polyaspartique ou polyuréthane</span></div>
        <div><strong>Contrôle</strong><span>Vérification finale et consignes de cure</span></div>
      </section>

      <section className="section" id="services">
        <div className="sectionHead split">
          <div><p className="eyebrow">Nos services</p><h2>Un système pensé pour votre espace.</h2></div>
          <p>Chaque projet commence par l’état réel du béton. La préparation, les réparations et le système de couches sont adaptés à l’usage de la surface.</p>
        </div>
        <div className="serviceGrid">
          {services.map((s) => <article className="serviceCard" key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></article>)}
        </div>
      </section>

      <section className="section systemSection">
        <div className="systemCard">
          <div className="systemCopy">
            <p className="eyebrow">Le système</p>
            <h2>La finition est seulement aussi solide que la préparation en dessous.</h2>
            <p>Pour un garage résidentiel standard, le processus type est : meulage diamant, couche de base époxy, flocons décoratifs et couche de finition protectrice.</p>
          </div>
          <div className="layerStack" aria-label="Couches du système époxy">
            <div><span>05</span><b>Polyaspartique / polyuréthane</b><small>Protection contre l’usure, le sel, les produits chimiques et les UV</small></div>
            <div><span>04</span><b>Flocons décoratifs</b><small>Texture et apparence</small></div>
            <div><span>03</span><b>Époxy 100 % solides</b><small>Couche de base et couleur</small></div>
            <div><span>02</span><b>Primaire / pare-humidité</b><small>Au besoin selon le béton et le système</small></div>
            <div><span>01</span><b>Béton préparé</b><small>Meulage diamant et réparations</small></div>
          </div>
        </div>
      </section>

      <section className="section finishesSection" id="finitions">
        <div className="sectionHead">
          <p className="eyebrow">Finitions</p>
          <h2>Une apparence qui complète l’espace.</h2>
          <p>Quelques directions visuelles possibles. Les couleurs exactes sont confirmées avant les travaux.</p>
        </div>
        <div className="finishGrid">
          {finishes.map((f) => <article className={`finishCard ${f.cls}`} key={f.name}><div><strong>{f.name}</strong><span>{f.sub}</span></div></article>)}
        </div>
        <p className="finePrint">Aperçus décoratifs seulement — ils ne représentent pas des réalisations clients spécifiques.</p>
      </section>

      <section className="section projectsSection" id="realisations">
        <div className="sectionHead split">
          <div><p className="eyebrow">Nos réalisations</p><h2>Avant / après : une transformation réelle.</h2></div>
          <p>Voici un exemple de travaux réalisés sur un escalier extérieur en béton. La surface a été préparée puis recouverte afin d’obtenir une finition uniforme, propre et plus moderne.</p>
        </div>
        <div className="beforeAfterGrid">
          <figure className="projectPhoto">
            <div className="projectImageWrap"><Image src="/realisations/escalier-avant.jpeg" alt="Escalier extérieur en béton avant les travaux Épox’Art" width={1242} height={2208} /></div>
            <figcaption><span>Avant</span><strong>Surface existante</strong><p>Revêtement usé et apparence irrégulière avant la préparation.</p></figcaption>
          </figure>
          <figure className="projectPhoto featured">
            <div className="projectImageWrap"><Image src="/realisations/escalier-apres.jpeg" alt="Escalier extérieur après les travaux Épox’Art" width={1152} height={1536} /></div>
            <figcaption><span>Après</span><strong>Finition Épox’Art</strong><p>Escalier remis au propre avec une finition texturée et uniforme.</p></figcaption>
          </figure>
        </div>
        <p className="projectNote">Photos d’un projet réel réalisé par Épox’Art.</p>
      </section>

      <section className="section methodSection" id="methode">
        <div className="sectionHead split">
          <div><p className="eyebrow">Notre méthode</p><h2>Un processus clair, du béton brut au plancher fini.</h2></div>
          <p>La qualité d’un revêtement époxy dépend fortement de l’inspection, de la préparation et du respect des temps de cure.</p>
        </div>
        <div className="steps">
          {steps.map((step, i) => <article key={step[0]}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{step[0]}</h3><p>{step[1]}</p></div></article>)}
        </div>
      </section>

      <section className="section assuranceSection">
        <div className="assuranceGrid">
          <article><p className="eyebrow">Inclus</p><h3>Le chantier essentiel</h3><ul><li>Préparation du béton</li><li>Réparation mineure des fissures</li><li>Meulage diamant</li><li>Application du système choisi</li><li>Nettoyage du chantier</li></ul></article>
          <article><p className="eyebrow">Évalué séparément</p><h3>Selon le projet</h3><ul><li>Réparations majeures du béton</li><li>Problèmes d’humidité importants</li><li>Déplacement d’objets lourds</li><li>Matériaux selon le système choisi</li></ul></article>
          <article className="guarantee"><p className="eyebrow">Garantie limitée</p><h3>Adhérence du revêtement</h3><p>Une garantie limitée peut s’appliquer à l’adhérence, sous réserve de l’état du béton et de l’absence de problèmes d’humidité non détectables à l’inspection initiale. Les impacts, produits chimiques agressifs, fissures structurelles et mouvements du béton sont exclus.</p></article>
        </div>
      </section>

      <section className="section faqSection" id="faq">
        <div className="sectionHead"><p className="eyebrow">Questions fréquentes</p><h2>Les réponses avant de commencer.</h2></div>
        <div className="faqGrid">
          <details><summary>Combien de temps avant de marcher sur le plancher?</summary><p>La marche légère est souvent possible après environ 24 heures. Le délai final dépend du produit, de la température et des conditions de cure.</p></details>
          <details><summary>Quand peut-on remettre un véhicule?</summary><p>En général, il faut prévoir environ 3 à 7 jours selon le système utilisé et les conditions de cure.</p></details>
          <details><summary>Que se passe-t-il si le béton est humide?</summary><p>Si des signes d’humidité sont observés, un test peut être recommandé. Une barrière contre l’humidité peut être nécessaire avant l’époxy.</p></details>
          <details><summary>Pourquoi meuler le béton?</summary><p>Le meulage diamant élimine les contaminants, anciennes couches et irrégularités tout en créant un profil favorisant l’adhérence du revêtement.</p></details>
          <details><summary>Comment fonctionne le paiement?</summary><p>Les modalités sont confirmées dans la soumission. Un dépôt peut être demandé avant le début des travaux et les matériaux peuvent devoir être payés avant leur achat.</p></details>
          <details><summary>Le prix peut-il être donné sans voir le béton?</summary><p>Une première estimation est possible avec les dimensions et des photos, mais le prix final dépend notamment de la superficie, de l’état du béton, des réparations et du système choisi.</p></details>
        </div>
      </section>

      <section className="quoteSection" id="soumission">
        <div className="quoteIntro">
          <p className="eyebrow">Soumission gratuite</p>
          <h2>Montrez-nous votre projet.</h2>
          <p>Ajoutez vos coordonnées, les dimensions approximatives et quelques photos. La demande est enregistrée dans notre système et envoyée directement par courriel à Épox’Art.</p>
          <div className="quotePoints"><span>✓ Sans engagement</span><span>✓ Photos acceptées</span><span>✓ Nous vous rappelons</span></div>
          <div className="callbackBlock"><small>Pas besoin d’appeler.</small><strong>Laissez votre numéro dans la soumission et nous vous recontacterons.</strong></div>
        </div>

        {sent ? (
          <div className="successBox">
            <div className="successIcon">✓</div>
            <p className="eyebrow">Demande reçue</p>
            <h2>Merci. Votre projet est maintenant dans notre dossier de soumissions.</h2>
            <p>Épox’Art a reçu vos coordonnées, les détails du projet et vos photos. Nous analyserons votre demande et nous vous recontacterons au numéro fourni. Une confirmation vous a aussi été envoyée par courriel lorsque le service d’envoi est configuré.</p>
            <button className="button secondary" onClick={() => setSent(false)}>Faire une autre demande</button>
          </div>
        ) : (
          <form className="quoteForm" onSubmit={submitQuote} encType="multipart/form-data">
            <div className="formTitle"><span>01</span><div><h3>Vos coordonnées</h3><p>Votre numéro reste privé et sert uniquement à vous rappeler concernant votre projet.</p></div></div>
            <div className="formGrid">
              <label>Nom complet *<input name="full_name" required autoComplete="name" placeholder="Votre nom" /></label>
              <label>Courriel *<input type="email" name="email" required autoComplete="email" placeholder="nom@courriel.com" /></label>
              <label>Téléphone pour vous rappeler *<input type="tel" name="phone" required autoComplete="tel" placeholder="514 000-0000" /></label>
              <label>Ville *<input name="city" required autoComplete="address-level2" placeholder="Ex. Longueuil" /></label>
              <label className="full">Adresse du projet *<input name="address" required autoComplete="street-address" placeholder="Adresse où les travaux auront lieu" /></label>
            </div>

            <div className="formTitle"><span>02</span><div><h3>Le projet</h3><p>Les informations qui aident à préparer une première évaluation.</p></div></div>
            <div className="formGrid">
              <label>Type de projet *<select name="project_type" required defaultValue=""><option value="" disabled>Sélectionner</option><option>Garage</option><option>Escalier extérieur</option><option>Entrée extérieure</option><option>Sous-sol</option><option>Atelier</option><option>Commerce</option><option>Entrepôt</option><option>Autre</option></select></label>
              <label>Superficie approximative (pi²) *<input type="number" name="square_feet" min="1" required placeholder="Ex. 400" /></label>
              <label>Longueur approx. (pi)<input type="number" name="length_ft" min="0" step="0.1" placeholder="Ex. 20" /></label>
              <label>Largeur approx. (pi)<input type="number" name="width_ft" min="0" step="0.1" placeholder="Ex. 20" /></label>
              <label>État du béton<select name="concrete_condition" defaultValue=""><option value="">Je ne sais pas</option><option>Bon état</option><option>Quelques fissures</option><option>Très fissuré ou endommagé</option><option>Peint / déjà recouvert</option><option>Taches d’huile / graisse</option></select></label>
              <label>Signes d’humidité<select name="humidity" defaultValue=""><option value="">Je ne sais pas</option><option>Non</option><option>Oui</option></select></label>
              <label className="full">Date ou période souhaitée<input name="desired_date" placeholder="Ex. octobre 2026" /></label>
              <label className="full">Description du projet *<textarea name="description" rows={5} required placeholder="Décrivez l’état du béton, la finition souhaitée et toute information utile." /></label>
            </div>

            <div className="formTitle"><span>03</span><div><h3>Photos</h3><p>Des photos claires du plancher et des fissures permettent une meilleure première analyse.</p></div></div>
            <label className="uploadBox">
              <input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => onPhotosChange(e.target.files)} />
              <span className="uploadIcon">＋</span><strong>Ajouter jusqu’à 5 photos</strong><small>JPG, PNG ou WebP. Les images lourdes sont compressées automatiquement.</small><em>{photoLabel}</em>
            </label>

            <label className="hpField" aria-hidden="true">Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="consent"><input type="checkbox" name="consent" required /><span>J’autorise Épox’Art à utiliser les informations et photos transmises uniquement afin d’évaluer ma demande et de me recontacter.</span></label>
            {error && <p className="formError" role="alert">{error}</p>}
            <button className="button primary submit" type="submit" disabled={sending}>{sending ? 'Envoi de votre demande…' : 'Envoyer ma demande de soumission'}</button>
            <p className="formFoot">Les champs marqués d’un * sont obligatoires.</p>
          </form>
        )}
      </section>

      <footer>
        <div className="footerBrand"><Image src="/brand/logo-square.jpg" alt="Épox’Art" width={60} height={60} /><div><strong>ÉPOX’ART</strong><span>Sols & revêtements époxy</span></div></div>
        <div className="footerLinks"><a href="#services">Services</a><a href="#finitions">Finitions</a><a href="#soumission">Soumission gratuite</a></div>
        <p>© {new Date().getFullYear()} Épox’Art. Tous droits réservés.</p>
      </footer>
    </main>
  );
}
