import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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


export default function DashboardGestor() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<RankingEntry[]>('/ranking')
      .then((res) => setRanking(res.data))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const rankingFuncionarios = ranking.filter((u) => u.role === 'FUNCIONARIO');

  return (
    <div className="page">
      <header className="header">
        <h1>GamaTec</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="role-badge">GESTOR</span>
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
        <h2 className="page-title">Painel do Gestor</h2>
        <p className="page-subtitle">
          Gerencie funcionários, missões e acompanhe o desempenho da equipe.
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
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
            ) : rankingFuncionarios.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Nenhum funcionário cadastrado.</p>
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
                    {rankingFuncionarios.map((u, index) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)', fontWeight: 600 }}>
                          #{index + 1}
                        </td>
                        <td style={tdStyle}>{u.name}</td>
                        <td style={tdStyle}>{u.level}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                          {u.points}
                        </td>
                      </tr>
                    ))}
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
                onClick={() => navigate('/gestor/missoes')}
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
                  Gerenciar
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Missões
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Criar, editar e ativar missões
                </div>
              </button>

              {/* Funcionários */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/gestor/funcionarios')}
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
                  Visualizar
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Funcionários
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Equipe, pontos e níveis
                </div>
              </button>

              {/* Feedbacks */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/gestor/feedbacks')}
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
                  Visualizar
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Feedbacks
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Opiniões enviadas pelos funcionários
                </div>
              </button>

              {/* Relatórios */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/gestor/relatorios')}
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
                  Análise
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Relatórios
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Participação e desempenho da equipe
                </div>
              </button>

              {/* Recompensas */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/gestor/recompensas')}
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
                  Gerenciar
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Recompensas
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Criar e gerenciar prêmios para resgate
                </div>
              </button>

              {/* Suporte */}
              <button
                style={cardBtnStyle}
                onClick={() => navigate('/gestor/suporte')}
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
                  Ajuda
                </div>
                <div
                  style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
                >
                  Suporte
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Reporte erros ou envie sugestões
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
