import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken, authRequired } from '../auth.js';

const r = Router();

r.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) return res.status(400).json({ error: 'Email et mot de passe requis' });
  const { rows } = await query('SELECT * FROM utilisateurs WHERE email=$1', [email]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(mot_de_passe, user.mot_de_passe))
    return res.status(401).json({ error: 'Identifiants invalides' });
  res.json({ token: signToken(user), user: { id: user.id, nom: user.nom, role: user.role } });
});

r.get('/me', authRequired, (req, res) => res.json(req.user));

export default r;
