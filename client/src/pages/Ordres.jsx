import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const LABELS = { planifie: 'Planifié', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' };
const NEXT = { planifie: 'en_cours', en_cours: 'termine' };

export default function Ordres() {
  const [list, setList] = useState([]);
  const [articles, setArticles] = useState([]);
  const [f, setF] = useState({ article_id: '', quantite: 1, date_prevue: '' });
  const [err, setErr] = useState('');
  const load = () => { api.ordres().then(setList).catch(e => setErr(e.message)); };
  useEffect(() => { load(); api.articles().then(setArticles); }, []);
  async function add(e) {
    e.preventDefault(); setErr('');
    try { await api.createOrdre(f); setF({ article_id: '', quantite: 1, date_prevue: '' }); load(); }
    catch (e) { setErr(e.message); }
  }
  async function avancer(o) { await api.setStatut(o.id, NEXT[o.statut]); load(); }
  async function annuler(o) { await api.setStatut(o.id, 'annule'); load(); }
  return (
    <div>
      <h1>Ordres de production</h1>
      <form className="row-form" onSubmit={add}>
        <select value={f.article_id} onChange={e => setF({ ...f, article_id: e.target.value })} required>
          <option value="">— Produit —</option>
          {articles.filter(a => a.type === 'produit').map(a => <option key={a.id} value={a.id}>{a.reference} · {a.nom}</option>)}
        </select>
        <input type="number" min="1" value={f.quantite} onChange={e => setF({ ...f, quantite: e.target.value })} style={{ width: 90 }} />
        <input type="date" value={f.date_prevue} onChange={e => setF({ ...f, date_prevue: e.target.value })} />
        <button type="submit">+ Lancer un ordre</button>
      </form>
      {err && <div className="error">{err}</div>}
      <table>
        <thead><tr><th>Réf.</th><th>Produit</th><th>Qté</th><th>Statut</th><th>Date prévue</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(o => (
            <tr key={o.id}>
              <td>{o.reference}</td><td>{o.article_nom}</td><td>{o.quantite}</td>
              <td><span className={'tag s-' + o.statut}>{LABELS[o.statut]}</span></td>
              <td>{o.date_prevue ? new Date(o.date_prevue).toLocaleDateString('fr-FR') : '—'}</td>
              <td>
                {NEXT[o.statut] && <button onClick={() => avancer(o)}>→ {LABELS[NEXT[o.statut]]}</button>}
                {o.statut !== 'termine' && o.statut !== 'annule' &&
                  <button className="link-danger" onClick={() => annuler(o)}>Annuler</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
