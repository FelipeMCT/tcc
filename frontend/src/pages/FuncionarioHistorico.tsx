import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface HistoryEntry {
  id: number;
  points: number;
  createdAt: string;
  missionId: number;
  mission: { title: string; description: string };
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

export default function FuncionarioHistorico() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<HistoryEntry[]>('/points/my-history')
      .then((res) => setHistory(res.data))
      .catch(() => setError('Erro ao carregar histórico. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const totalHistorico = history.reduce((acc, h) => acc + h.points, 0);

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
        <h2 className="page-title">Histórico de Pontos</h2>

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

        {history.length > 0 && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Total ganho no histórico:{' '}
            <strong style={{ color: 'var(--primary)' }}>{totalHistorico} pontos</strong>
          </p>
        )}

        <section style={{ marginBottom: '40px' }}>
          {history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Você ainda não concluiu nenhuma missão.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Missão</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Pontos</th>
                    <th style={thStyle}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{h.mission.title}</td>
                      <td style={tdStyle}>{h.mission.description}</td>
                      <td style={{ ...tdStyle, color: 'var(--success)', fontWeight: 600 }}>
                        +{h.points}
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                        {new Date(h.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
