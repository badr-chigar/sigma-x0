import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [articles, setArticles] = useState([]);
  const [f, setF] = useState({ article_id: '', type: 'entree', quantite: 1, motif: '' });
  const [err, setErr] = useState('');
  const load = () => { api.stock().then(setStock); };
  useEffect(() => { load(); api.articles().then(setArticles); }, []);
  async function add(e) {
    e.preventDefault(); setErr('');
    try { await api.addMouvement(f); setF({ article_id: '', type: 'entree', quantite: 1, motif: '' }); load(); }
    catch (e) { setErr(e.message); }
  }
  return (
    <div>
      <form className="row-form" onSubmit={add}>
        <select value={f.article_id} onChange={e => setF({ ...f, article_id: e.target.value })} required>
          <option value="">— Article —</option>
          {articles.map(a => <option key={a.id} value={a.id}>{a.reference} · {a.nom}</option>)}
        </select>
        <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>
          <option value="entree">Entrée</option><option value="sortie">Sortie</option>
        </select>
        <input type="number" min="1" value={f.quantite} onChange={e => setF({ ...f, quantite: e.target.value })} style={{ width: 90 }} />
        <input placeholder="Motif" value={f.motif} onChange={e => setF({ ...f, motif: e.target.value })} />
        <button type="submit">Enregistrer</button>
      </form>
      {err && <div className="error">{err}</div>}
      <table>
        <thead><tr><th>Réf.</th><th>Article</th><th>Stock</th><th>Seuil</th><th>État</th></tr></thead>
        <tbody>
          {stock.map(s => (
            <tr key={s.id}>
              <td>{s.reference}</td><td>{s.nom}</td>
              <td><b>{s.stock}</b> {s.unite}</td><td>{s.seuil_reappro}</td>
              <td>{s.alerte ? <span className="tag warn">Réappro</span> : <span className="tag ok">OK</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
