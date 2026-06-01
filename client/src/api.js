const BASE = '/api';

function token() { return localStorage.getItem('sigma_token'); }

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: 'Bearer ' + token() } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) { localStorage.removeItem('sigma_token'); location.hash = '#/login'; }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur serveur');
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (email, mot_de_passe) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, mot_de_passe }) }),
  articles: () => request('/articles'),
  createArticle: (data) => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
  deleteArticle: (id) => request('/articles/' + id, { method: 'DELETE' }),
  ordres: () => request('/ordres'),
  createOrdre: (data) => request('/ordres', { method: 'POST', body: JSON.stringify(data) }),
  setStatut: (id, statut) => request('/ordres/' + id + '/statut', { method: 'PATCH', body: JSON.stringify({ statut }) }),
  stock: () => request('/stock'),
  mouvements: () => request('/stock/mouvements'),
  addMouvement: (data) => request('/stock/mouvement', { method: 'POST', body: JSON.stringify(data) }),
  stats: () => request('/stats'),
};
