import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RankingChart from '../components/RankingChart';

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
  name: string;
  role: 'GESTOR' | 'FUNCIONARIO';
  points: number;
  level: string;
}

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

    (async () => {
      try { await api.post('/users/activity'); } catch { /* streak update silencioso */ }

      const [userRes, rankingRes] = await Promise.all([
        api.get<User>(`/users/${localUser.id}`),
        api.get<RankingEntry[]>('/ranking'),
      ]);
      setUser(userRes.data);
      setRanking(rankingRes.data);
      setLoading(false);
    })();
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
          {' · '}
          Sequência:{' '}
          <strong style={{ color: '#f59e0b' }}>{user?.currentStreak ?? 0} dia{(user?.currentStreak ?? 0) !== 1 ? 's' : ''}</strong>
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
            <RankingChart top3={rankingFuncionarios.slice(0, 3)} currentUserId={user?.id} />
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
