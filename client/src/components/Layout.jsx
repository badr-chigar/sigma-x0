import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

const links = [
  ['/', 'Tableau de bord'],
  ['/articles', 'Articles'],
  ['/ordres', 'Ordres de production'],
  ['/stock', 'Stock'],
];

const META = {
  '/':         ['Tableau de bord', 'Vue d’ensemble de la production'],
  '/articles': ['Articles', 'Matières premières & produits finis'],
  '/ordres':   ['Ordres de production', 'Suivi des ordres de fabrication'],
  '/stock':    ['Stock', 'Niveaux de stock et réapprovisionnement'],
};

export default function Layout({ onLogout }) {
  const nav = useNavigate();
  const loc = useLocation();
  const user = JSON.parse(localStorage.getItem('sigma_user') || '{}');
  const initials = (user.nom || 'BA').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const [title, sub] = META[loc.pathname] || ['SIGMA X.0', ''];
  return (
    <div className="app">
      <aside className="side">
        <div className="brand">SIGMA <span>X.0</span></div>
        <div className="sub">Manufacturing Dashboard</div>
        <div className="lab">PILOTAGE</div>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="who">{user.nom} · {user.role}</div>
          <button onClick={() => { onLogout(); nav('/login'); }}>Déconnexion</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="tt">
            <h1>{title}</h1>
            <div className="sub">{sub}</div>
          </div>
          <input className="search" placeholder="Rechercher…" />
          <div className="avatar">{initials}</div>
        </header>
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}
