-- SIGMA X.0 — schéma PostgreSQL
DROP TABLE IF EXISTS mouvements_stock CASCADE;
DROP TABLE IF EXISTS ordres_production CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

CREATE TABLE utilisateurs (
  id          SERIAL PRIMARY KEY,
  nom         VARCHAR(120) NOT NULL,
  email       VARCHAR(160) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(200) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'operateur',  -- admin | operateur
  cree_le     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id          SERIAL PRIMARY KEY,
  reference   VARCHAR(40) UNIQUE NOT NULL,
  nom         VARCHAR(160) NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'produit',    -- matiere | produit
  unite       VARCHAR(12) NOT NULL DEFAULT 'u',
  prix        NUMERIC(12,2) NOT NULL DEFAULT 0,
  seuil_reappro INTEGER NOT NULL DEFAULT 0,
  cree_le     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE ordres_production (
  id          SERIAL PRIMARY KEY,
  reference   VARCHAR(40) UNIQUE NOT NULL,
  article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE RESTRICT,
  quantite    INTEGER NOT NULL CHECK (quantite > 0),
  statut      VARCHAR(20) NOT NULL DEFAULT 'planifie',   -- planifie | en_cours | termine | annule
  date_prevue DATE,
  cree_le     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE mouvements_stock (
  id          SERIAL PRIMARY KEY,
  article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  type        VARCHAR(10) NOT NULL,                       -- entree | sortie
  quantite    INTEGER NOT NULL CHECK (quantite > 0),
  motif       VARCHAR(160),
  cree_le     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_mouv_article ON mouvements_stock(article_id);
CREATE INDEX idx_ordres_statut ON ordres_production(statut);

-- Vue : stock courant par article
CREATE OR REPLACE VIEW v_stock AS
SELECT a.id, a.reference, a.nom, a.unite, a.seuil_reappro,
       COALESCE(SUM(CASE WHEN m.type='entree' THEN m.quantite
                         WHEN m.type='sortie' THEN -m.quantite ELSE 0 END),0)::int AS stock
FROM articles a
LEFT JOIN mouvements_stock m ON m.article_id = a.id
GROUP BY a.id, a.reference, a.nom, a.unite, a.seuil_reappro;
