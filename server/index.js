import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, pool } from './db.js';
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import ordresRoutes from './routes/ordres.js';
import stockRoutes from './routes/stock.js';
import statsRoutes from './routes/stats.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'SIGMA X.0 API' }));
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/ordres', ordresRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/stats', statsRoutes);

// Création idempotente du compte admin de démonstration
async function bootstrapAdmin() {
  try {
    const { rows } = await query("SELECT id FROM utilisateurs WHERE email='admin@sigma.ma'");
    if (rows.length === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await query(
        "INSERT INTO utilisateurs (nom,email,mot_de_passe,role) VALUES ($1,$2,$3,'admin')",
        ['Badr Chigar', 'admin@sigma.ma', hash]
      );
      console.log('✓ Compte admin créé : admin@sigma.ma / admin123');
    }
  } catch (e) {
    console.warn('Bootstrap admin ignoré (base non initialisée ?)', e.message);
  }
}

const PORT = process.env.PORT || 4000;
pool.connect()
  .then(c => { c.release(); return bootstrapAdmin(); })
  .catch(e => console.warn('PostgreSQL non joignable au démarrage :', e.message))
  .finally(() => app.listen(PORT, () => console.log(`SIGMA X.0 API → http://localhost:${PORT}`)));
