import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.stats().then(setS).catch(e => setErr(e.message)); }, []);
  if (err) return <div className="error">{err}</div>;
  if (!s) return <div className="muted">Chargement…</div>;
  const cards = [
    ['Ordres en cours', s.ordresEnCours, 'accent'],
    ['Ordres planifiés', s.ordresPlanifies, ''],
    ['Valeur du stock', s.valeurStock.toLocaleString('fr-FR') + ' MAD', 'ok'],
    ['Articles en rupture', s.ruptures, s.ruptures > 0 ? 'warn' : 'ok'],
  ];
  return (
    <div>
      <div className="kpis">
        {cards.map(([l, v, c]) => (
          <div key={l} className={'kpi ' + c}><div className="kpi-v">{v}</div><div className="kpi-l">{l}</div></div>
        ))}
      </div>
      <h2>Derniers mouvements de stock</h2>
      <table>
        <thead><tr><th>Article</th><th>Type</th><th>Quantité</th><th>Date</th></tr></thead>
        <tbody>
          {s.derniers.map((m, i) => (
            <tr key={i}>
              <td>{m.article_nom}</td>
              <td><span className={'tag ' + (m.type === 'entree' ? 'ok' : 'warn')}>{m.type}</span></td>
              <td>{m.quantite}</td>
              <td>{new Date(m.cree_le).toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
