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
}

interface RankingEntry {
  id: number;
  name: string;
  role: 'GESTOR' | 'FUNCIONARIO';
  points: number;
  level: string;
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: CSSProperties = {
  padding: '10px 14px',
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

const cardBtnStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow)',
  padding: '36px 24px',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
};


export default function DashboardFuncionario() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
        setRanking(rankingRes.data);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const rankingFuncionarios = ranking.filter((u) => u.role === 'FUNCIONARIO');
  const posicao = user ? rankingFuncionarios.findIndex((u) => u.id === user.id) + 1 : 0;

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
            onClick={handleLogout}
            style={{ background: 'var(--danger)', color: '#fff' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="page-title">Olá, {user?.name ?? 'Funcionário'}</h2>
        <p className="page-subtitle">
          Nível:{' '}
          <strong style={{ color: 'var(--primary)' }}>{user?.level ?? '—'}</strong>
          {' · '}
          Pontos:{' '}
          <strong style={{ color: 'var(--primary)' }}>{user?.points ?? 0}</strong>
          {' · '}
          Posição:{' '}
          <strong style={{ color: 'var(--primary)' }}>{posicao > 0 ? `#${posicao}` : '—'}</strong>
        </p>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Coluna esquerda: ranking */}
          <div style={{ flex: '0 0 320px', minWidth: '260px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
              Ranking de Funcionários
            </h3>
            {rankingFuncionarios.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Sem dados de ranking.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>Nível</th>
                      <th style={thStyle}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingFuncionarios.map((u, index) => {
                      const isMe = user !== null && u.id === user.id;
                      return (
                        <tr
                          key={u.id}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: isMe ? '#eff6ff' : undefined,
                          }}
                        >
                          <td style={{ ...tdStyle, color: 'var(--text-muted)', fontWeight: 600 }}>
                            #{index + 1}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: isMe ? 600 : undefined }}>
                            {u.name}
                            {isMe && (
                              <span
                                style={{
                                  marginLeft: '6px',
                                  fontSize: '11px',
                                  color: 'var(--primary)',
                                }}
                              >
                                (Você)
                              </span>
                            )}
                          </td>
                          <td style={tdStyle}>{u.level}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                            {u.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Coluna direita: cards de acesso rápido */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
              Acesso Rápido
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
              }}
            >
              {/* Missões */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/funcionario/missoes')}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.18)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  Disponíveis
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Missões
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Ver e concluir missões ativas
                </div>
              </button>

              {/* Histórico */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/funcionario/historico')}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.18)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  Pontuação
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Histórico
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Missões concluídas e pontos ganhos
                </div>
              </button>

              {/* Perfil */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/funcionario/perfil')}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.18)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  Minha conta
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Perfil
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Nome, nível e posição no ranking
                </div>
              </button>

              {/* Feedback */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/funcionario/feedback')}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.18)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  Opinião
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Feedback
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Envie sua opinião sobre a empresa
                </div>
              </button>

              {/* Recompensas */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/funcionario/recompensas')}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.18)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  Pontos
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '6px',
                  }}
                >
                  Recompensas
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Resgate prêmios com seus pontos
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
