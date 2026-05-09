import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'GESTOR' | 'FUNCIONARIO';
  points: number;
  level: string;
}

interface RankingEntry {
  id: number;
  role: 'GESTOR' | 'FUNCIONARIO';
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 0',
  borderBottom: '1px solid var(--border)',
  fontSize: '14px',
} as const;

export default function FuncionarioPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posicao, setPosicao] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const localUser = JSON.parse(localStorage.getItem('user') ?? 'null') as { id: number } | null;

  useEffect(() => {
    if (!localUser) {
      navigate('/login');
      return;
    }

    Promise.all([
      api.get<User>(`/users/${localUser.id}`),
      api.get<RankingEntry[]>('/ranking'),
    ])
      .then(([userRes, rankingRes]) => {
        setUser(userRes.data);
        const rankingFuncionarios = rankingRes.data.filter((u) => u.role === 'FUNCIONARIO');
        const pos = rankingFuncionarios.findIndex((u) => u.id === localUser.id) + 1;
        setPosicao(pos);
      })
      .catch(() => setError('Erro ao carregar perfil. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="page-center">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1>GamaTec</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="role-badge">FUNCIONÁRIO</span>
          <button
            className="btn"
            onClick={() => navigate('/funcionario')}
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Voltar ao painel
          </button>
          <button
            className="btn"
            onClick={handleLogout}
            style={{ background: 'var(--danger)', color: '#fff' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="page-title">Meu Perfil</h2>
        <p className="page-subtitle">Informações da sua conta e desempenho na gamificação.</p>

        {error && (
          <p
            className="notice"
            style={{
              background: '#fee2e2',
              borderColor: '#fca5a5',
              color: '#991b1b',
              marginBottom: '24px',
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: '24px 32px',
            maxWidth: '480px',
            marginTop: '24px',
            marginBottom: '40px',
          }}
        >
          <div style={rowStyle}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Nome</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.name ?? '—'}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>E-mail</span>
            <span style={{ color: 'var(--text)' }}>{user?.email ?? '—'}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Pontos acumulados</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '16px' }}>
              {user?.points ?? 0}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Nível atual</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.level ?? '—'}</span>
          </div>
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Posição no ranking</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '16px' }}>
              {posicao > 0 ? `#${posicao}` : '—'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
