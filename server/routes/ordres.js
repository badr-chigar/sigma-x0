import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../auth.js';

const r = Router();
r.use(authRequired);

const STATUTS = ['planifie', 'en_cours', 'termine', 'annule'];

r.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT o.*, a.nom AS article_nom, a.reference AS article_ref
     FROM ordres_production o JOIN articles a ON a.id=o.article_id
     ORDER BY o.cree_le DESC`
  );
  res.json(rows);
});

r.post('/', async (req, res) => {
  const { article_id, quantite, date_prevue } = req.body;
  if (!article_id || !quantite) return res.status(400).json({ error: 'Article et quantité requis' });
  const ref = 'OF-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const { rows } = await query(
    `INSERT INTO ordres_production (reference,article_id,quantite,date_prevue)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [ref, article_id, quantite, date_prevue || null]
  );
  res.status(201).json(rows[0]);
});

r.patch('/:id/statut', async (req, res) => {
  const { statut } = req.body;
  if (!STATUTS.includes(statut)) return res.status(400).json({ error: 'Statut invalide' });
  const { rows } = await query(
    'UPDATE ordres_production SET statut=$1 WHERE id=$2 RETURNING *',
    [statut, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Ordre introuvable' });
  // À la clôture, on enregistre l'entrée en stock du produit fini
  if (statut === 'termine') {
    await query(
      `INSERT INTO mouvements_stock (article_id,type,quantite,motif)
       VALUES ($1,'entree',$2,$3)`,
      [rows[0].article_id, rows[0].quantite, 'Production ' + rows[0].reference]
    );
  }
  res.json(rows[0]);
});

export default r;
