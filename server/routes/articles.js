import { Router } from 'express';
import { query } from '../db.js';
import { authRequired, adminOnly } from '../auth.js';

const r = Router();
r.use(authRequired);

r.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM articles ORDER BY reference');
  res.json(rows);
});

r.post('/', adminOnly, async (req, res) => {
  const { reference, nom, type, unite, prix, seuil_reappro } = req.body;
  if (!reference || !nom) return res.status(400).json({ error: 'Référence et nom requis' });
  try {
    const { rows } = await query(
      `INSERT INTO articles (reference,nom,type,unite,prix,seuil_reappro)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [reference, nom, type || 'produit', unite || 'u', prix || 0, seuil_reappro || 0]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: 'Référence déjà existante ?' });
  }
});

r.put('/:id', adminOnly, async (req, res) => {
  const { nom, type, unite, prix, seuil_reappro } = req.body;
  const { rows } = await query(
    `UPDATE articles SET nom=$1,type=$2,unite=$3,prix=$4,seuil_reappro=$5 WHERE id=$6 RETURNING *`,
    [nom, type, unite, prix, seuil_reappro, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });
  res.json(rows[0]);
});

r.delete('/:id', adminOnly, async (req, res) => {
  await query('DELETE FROM articles WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

export default r;
