import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const vide = { reference: '', nom: '', type: 'produit', unite: 'u', prix: 0, seuil_reappro: 0 };

export default function Articles() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(vide);
  const [err, setErr] = useState('');
  const load = () => api.articles().then(setList).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);
  async function add(e) {
    e.preventDefault(); setErr('');
    try { await api.createArticle(f); setF(vide); load(); } catch (e) { setErr(e.message); }
  }
  async function del(id) { if (confirm('Supprimer cet article ?')) { await api.deleteArticle(id); load(); } }
  return (
    <div>
      <form className="row-form" onSubmit={add}>
        <input placeholder="Référence" value={f.reference} onChange={e => setF({ ...f, reference: e.target.value })} required />
        <input placeholder="Nom" value={f.nom} onChange={e => setF({ ...f, nom: e.target.value })} required />
        <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>
          <option value="produit">Produit fini</option><option value="matiere">Matière première</option>
        </select>
        <input placeholder="Unité" value={f.unite} onChange={e => setF({ ...f, unite: e.target.value })} style={{ width: 60 }} />
        <input type="number" step="0.01" placeholder="Prix" value={f.prix} onChange={e => setF({ ...f, prix: e.target.value })} style={{ width: 90 }} />
        <input type="number" placeholder="Seuil" value={f.seuil_reappro} onChange={e => setF({ ...f, seuil_reappro: e.target.value })} style={{ width: 80 }} />
        <button type="submit">+ Ajouter</button>
      </form>
      {err && <div className="error">{err}</div>}
      <table>
        <thead><tr><th>Réf.</th><th>Nom</th><th>Type</th><th>Unité</th><th>Prix</th><th>Seuil</th><th></th></tr></thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.reference}</td><td>{a.nom}</td>
              <td><span className="tag">{a.type}</span></td>
              <td>{a.unite}</td><td>{(+a.prix).toFixed(2)}</td><td>{a.seuil_reappro}</td>
              <td><button className="link-danger" onClick={() => del(a.id)}>Suppr.</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
