import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const links = [
  ['/', 'Tableau de bord'],
  ['/articles', 'Articles'],
  ['/ordres', 'Ordres de production'],
  ['/stock', 'Stock'],
];

export default function Layout({ onLogout }) {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('sigma_user') || '{}');
  return (
    <div className="app">
      <aside className="side">
        <div className="brand">SIGMA <span>X.0</span></div>
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
      <main className="main"><Outlet /></main>
    </div>
  );
}
