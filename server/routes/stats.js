import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../auth.js';

const r = Router();
r.use(authRequired);

r.get('/', async (_req, res) => {
  const ordresEnCours = (await query("SELECT COUNT(*) FROM ordres_production WHERE statut='en_cours'")).rows[0].count;
  const ordresPlanifies = (await query("SELECT COUNT(*) FROM ordres_production WHERE statut='planifie'")).rows[0].count;
  const valeurStock = (await query(
    `SELECT COALESCE(SUM(s.stock * a.prix),0)::numeric(14,2) AS v
     FROM v_stock s JOIN articles a ON a.id=s.id`
  )).rows[0].v;
  const ruptures = (await query('SELECT COUNT(*) FROM v_stock WHERE stock <= seuil_reappro')).rows[0].count;
  const derniers = (await query(
    `SELECT m.type, m.quantite, m.cree_le, a.nom AS article_nom
     FROM mouvements_stock m JOIN articles a ON a.id=m.article_id
     ORDER BY m.cree_le DESC LIMIT 8`
  )).rows;
  res.json({
    ordresEnCours: +ordresEnCours,
    ordresPlanifies: +ordresPlanifies,
    valeurStock: +valeurStock,
    ruptures: +ruptures,
    derniers,
  });
});

export default r;
