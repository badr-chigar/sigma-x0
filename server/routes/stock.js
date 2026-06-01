import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../auth.js';

const r = Router();
r.use(authRequired);

// stock courant + alertes
r.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM v_stock ORDER BY reference');
  res.json(rows.map(x => ({ ...x, alerte: x.stock <= x.seuil_reappro })));
});

r.get('/mouvements', async (_req, res) => {
  const { rows } = await query(
    `SELECT m.*, a.nom AS article_nom, a.reference AS article_ref
     FROM mouvements_stock m JOIN articles a ON a.id=m.article_id
     ORDER BY m.cree_le DESC LIMIT 50`
  );
  res.json(rows);
});

r.post('/mouvement', async (req, res) => {
  const { article_id, type, quantite, motif } = req.body;
  if (!['entree', 'sortie'].includes(type)) return res.status(400).json({ error: 'Type invalide' });
  if (!article_id || !quantite || quantite <= 0) return res.status(400).json({ error: 'Article et quantité valides requis' });
  const { rows } = await query(
    `INSERT INTO mouvements_stock (article_id,type,quantite,motif)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [article_id, type, quantite, motif || null]
  );
  res.status(201).json(rows[0]);
});

export default r;
