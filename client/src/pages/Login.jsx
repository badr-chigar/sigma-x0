import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@sigma.ma');
  const [mdp, setMdp] = useState('admin123');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { token, user } = await api.login(email, mdp);
      onLogin(token, user);
      nav('/');
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <div className="brand big">SIGMA <span>X.0</span></div>
        <p className="muted">ERP de gestion de production industrielle</p>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" /></label>
        <label>Mot de passe<input value={mdp} onChange={e => setMdp(e.target.value)} type="password" /></label>
        {err && <div className="error">{err}</div>}
        <button type="submit">Se connecter</button>
        <small className="muted">Démo : admin@sigma.ma / admin123</small>
      </form>
    </div>
  );
}
