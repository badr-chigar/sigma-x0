import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Articles from './pages/Articles.jsx';
import Ordres from './pages/Ordres.jsx';
import Stock from './pages/Stock.jsx';

function useAuth() {
  const [token, setTok] = useState(localStorage.getItem('sigma_token'));
  const login = (t, u) => { localStorage.setItem('sigma_token', t); localStorage.setItem('sigma_user', JSON.stringify(u)); setTok(t); };
  const logout = () => { localStorage.removeItem('sigma_token'); localStorage.removeItem('sigma_user'); setTok(null); };
  return { token, login, logout };
}

export default function App() {
  const auth = useAuth();
  const Private = ({ children }) => (auth.token ? children : <Navigate to="/login" replace />);
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={auth.login} />} />
        <Route element={<Private><Layout onLogout={auth.logout} /></Private>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/ordres" element={<Ordres />} />
          <Route path="/stock" element={<Stock />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
