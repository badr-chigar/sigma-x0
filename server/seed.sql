-- SIGMA X.0 — données de démonstration
-- (le compte admin@sigma.ma / admin123 est créé automatiquement au démarrage du serveur)

INSERT INTO articles (reference, nom, type, unite, prix, seuil_reappro) VALUES
('MP-ACIER',  'Acier S235 (tôle)',        'matiere', 'kg', 12.50, 500),
('MP-VIS',    'Vis M6 inox',              'matiere', 'u',   0.15, 2000),
('MP-PEINT',  'Peinture époxy grise',     'matiere', 'L',  45.00, 50),
('PF-CHASSIS','Châssis assemblé SX-100',  'produit', 'u', 320.00, 10),
('PF-CARTER', 'Carter usiné CX-20',       'produit', 'u', 180.00, 15),
('PF-SUPPORT','Support mural MX-7',        'produit', 'u',  95.00, 25);

INSERT INTO ordres_production (reference, article_id, quantite, statut, date_prevue) VALUES
('OF-2026-001', 4, 20, 'en_cours', CURRENT_DATE + 3),
('OF-2026-002', 5, 40, 'planifie', CURRENT_DATE + 7),
('OF-2026-003', 6, 60, 'termine',  CURRENT_DATE - 2);

INSERT INTO mouvements_stock (article_id, type, quantite, motif) VALUES
(1, 'entree', 1200, 'Réception fournisseur'),
(2, 'entree', 5000, 'Réception fournisseur'),
(3, 'entree',  120, 'Réception fournisseur'),
(1, 'sortie',  300, 'Consommation OF-2026-003'),
(4, 'entree',   8,  'Production terminée'),
(6, 'entree',  60,  'Production OF-2026-003'),
(6, 'sortie',  45,  'Expédition client'),
(5, 'entree',  10,  'Production partielle');
