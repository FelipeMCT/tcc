import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'GESTOR' | 'FUNCIONARIO';
  points: number;
  level: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

interface RankingEntry {
  id: number;
  role: 'GESTOR' | 'FUNCIONARIO';
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  color: 'var(--text)',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow)',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function GestorFuncionarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rankingIds, setRankingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get<User[]>('/users'), api.get<RankingEntry[]>('/ranking')])
      .then(([usersRes, rankingRes]) => {
        setUsers(usersRes.data);
        setRankingIds(
          rankingRes.data.filter((u) => u.role === 'FUNCIONARIO').map((u) => u.id),
        );
      })
      .catch(() => setError('Erro ao carregar dados. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const funcionarios = users
    .filter((u) => u.role === 'FUNCIONARIO')
    .sort((a, b) => rankingIds.indexOf(a.id) - rankingIds.indexOf(b.id));

  function getPosition(userId: number): number {
    const pos = rankingIds.indexOf(userId);
    return pos >= 0 ? pos + 1 : 0;
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
          <span className="role-badge">GESTOR</span>
          <button
            className="btn"
            onClick={() => navigate('/gestor')}
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
        <h2 className="page-title">Funcionários</h2>
        <p className="page-subtitle">Visualize a equipe, pontuações e sequências de acesso.</p>

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

        <section style={{ marginTop: '24px', marginBottom: '40px' }}>
          {funcionarios.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum funcionário cadastrado.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Posição</th>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>E-mail</th>
                    <th style={thStyle}>Nível</th>
                    <th style={thStyle}>Pontos</th>
                    <th style={thStyle}>Sequência</th>
                    <th style={thStyle}>Maior Seq.</th>
                    <th style={thStyle}>Última Atividade</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((u) => {
                    const pos = getPosition(u.id);
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)', fontWeight: 600 }}>
                          {pos > 0 ? `#${pos}` : '—'}
                        </td>
                        <td style={tdStyle}>{u.name}</td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={tdStyle}>{u.level}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                          {u.points}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: '#f59e0b' }}>
                          {u.currentStreak} dia{u.currentStreak !== 1 ? 's' : ''}
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                          {u.longestStreak} dia{u.longestStreak !== 1 ? 's' : ''}
                        </td>
                        <td style={{ ...tdStyle, fontSize: '13px', color: 'var(--text-muted)' }}>
                          {u.lastActivityDate ? formatDate(u.lastActivityDate) : 'Nunca acessou'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
