import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'GESTOR' | 'FUNCIONARIO';
    points: number;
  };
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'GESTOR') {
        navigate('/gestor');
      } else {
        navigate('/funcionario');
      }
    } catch {
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="login-box">
        <div>
          <p className="app-name">GamaTec</p>
          <h1>Login</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="notice" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
