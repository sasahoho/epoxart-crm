'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase';

type Quote = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  project_type: string;
  square_feet: number;
  desired_date: string | null;
  description: string;
  status: string;
  notes: string | null;
  photo_urls?: string[];
};

const statuses = ['Nouvelle', 'À contacter', 'Contacté', 'Visite planifiée', 'Soumission envoyée', 'Acceptée', 'Refusée', 'Travaux en cours', 'Terminée'];

export default function AdminPage() {
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowser();
    } catch {
      return null;
    }
  }, []);
  const [sessionReady, setSessionReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('karassekaldas3@gmail.com');
  const [password, setPassword] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  async function loadQuotes() {
    const response = await fetch('/api/admin/quotes');
    if (response.status === 401) return;
    const data = await response.json();
    if (response.ok) setQuotes(data.quotes);
  }

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const hasSession = Boolean(data.session);
      setAuthenticated(hasSession);
      setSessionReady(true);
      if (hasSession) loadQuotes();
    });
  }, [supabase]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    if (!supabase) return setMessage('Configuration Supabase manquante dans Vercel.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);
    setAuthenticated(true);
    await loadQuotes();
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setAuthenticated(false);
    setQuotes([]);
    setSelected(null);
  }

  async function updateQuote(id: string, changes: Partial<Quote>) {
    const response = await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...changes })
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Erreur de mise à jour');
    setQuotes((current) => current.map((q) => q.id === id ? { ...q, ...changes } : q));
    setSelected((current) => current?.id === id ? { ...current, ...changes } : current);
  }

  const filtered = quotes.filter((q) => `${q.full_name} ${q.city} ${q.project_type} ${q.status}`.toLowerCase().includes(search.toLowerCase()));

  if (!sessionReady) return <main className="adminShell"><p>Chargement…</p></main>;

  if (!supabase) {
    return (
      <main className="adminLogin">
        <section className="loginCard">
          <img src="/brand/logo-square.jpg" alt="Épox'Art" />
          <h1>Configuration requise</h1>
          <p>Ajoute les variables Supabase dans Vercel, puis redéploie le projet.</p>
          <a href="/">Retour au site</a>
        </section>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="adminLogin">
        <form onSubmit={login} className="loginCard">
          <img src="/brand/logo-square.jpg" alt="Épox'Art" />
          <h1>Administration Épox&apos;Art</h1>
          <p>Accès privé aux demandes de soumission.</p>
          <label>Courriel<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {message && <p className="formError">{message}</p>}
          <button className="button" type="submit">Se connecter</button>
          <a href="/">Retour au site</a>
        </form>
      </main>
    );
  }

  return (
    <main className="adminShell">
      <header className="adminTop"><div><p className="eyebrow">Épox&apos;Art CRM</p><h1>Demandes de soumission</h1></div><button className="ghostButton" onClick={logout}>Déconnexion</button></header>
      <section className="stats">
        <div><strong>{quotes.length}</strong><span>Total</span></div>
        <div><strong>{quotes.filter(q => q.status === 'Nouvelle').length}</strong><span>Nouvelles</span></div>
        <div><strong>{quotes.filter(q => q.status === 'Acceptée').length}</strong><span>Acceptées</span></div>
        <div><strong>{quotes.filter(q => q.status === 'Terminée').length}</strong><span>Terminées</span></div>
      </section>
      <input className="searchInput" placeholder="Rechercher un client, une ville ou un statut…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="adminGrid">
        <section className="quoteList">
          {filtered.map((quote) => (
            <button className={`quoteRow ${selected?.id === quote.id ? 'active' : ''}`} key={quote.id} onClick={() => setSelected(quote)}>
              <div><strong>{quote.full_name}</strong><span>{quote.project_type} · {quote.square_feet} pi²</span></div>
              <div><span>{quote.city}</span><em>{quote.status}</em></div>
            </button>
          ))}
        </section>
        <section className="quoteDetail">
          {selected ? (
            <>
              <div className="detailHeader"><div><h2>{selected.full_name}</h2><p>{new Date(selected.created_at).toLocaleString('fr-CA')}</p></div><select value={selected.status} onChange={(e) => updateQuote(selected.id, { status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="detailInfo">
                <p><strong>Courriel</strong><a href={`mailto:${selected.email}`}>{selected.email}</a></p>
                <p><strong>Téléphone</strong><a href={`tel:${selected.phone}`}>{selected.phone}</a></p>
                <p><strong>Adresse</strong><span>{selected.address}, {selected.city}</span></p>
                <p><strong>Projet</strong><span>{selected.project_type} — {selected.square_feet} pi²</span></p>
                <p><strong>Période souhaitée</strong><span>{selected.desired_date || 'Non précisée'}</span></p>
                <p className="wide"><strong>Description</strong><span>{selected.description}</span></p>
              </div>
              {!!selected.photo_urls?.length && <div className="adminPhotos">{selected.photo_urls.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}><img src={url} alt="Photo du projet" /></a>)}</div>}
              <label className="notes">Notes internes<textarea value={selected.notes || ''} onChange={(e) => setSelected({ ...selected, notes: e.target.value })} rows={6} /><button className="button small" onClick={() => updateQuote(selected.id, { notes: selected.notes })}>Enregistrer les notes</button></label>
            </>
          ) : <div className="emptyDetail">Sélectionne une demande pour voir tous les détails.</div>}
        </section>
      </div>
    </main>
  );
}
