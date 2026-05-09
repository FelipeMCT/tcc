import { useEffect, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  active: boolean;
}

interface HistoryEntry {
  id: number;
  points: number;
  createdAt: string;
  missionId: number;
  mission: { title: string; description: string };
}

interface CompleteMissionResponse {
  message: string;
  mission: { id: number; title: string };
  pointsEarned: number;
  totalPoints: number;
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

export default function FuncionarioMissoes() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [completing, setCompleting] = useState<number | null>(null);

  const localUser = JSON.parse(localStorage.getItem('user') ?? 'null') as { id: number } | null;

  const refreshHistory = useCallback(async () => {
    const res = await api.get<HistoryEntry[]>('/points/my-history');
    setHistory(res.data);
  }, []);

  useEffect(() => {
    if (!localUser) {
      navigate('/login');
      return;
    }

    Promise.all([
      api.get<Mission[]>('/missions/active'),
      api.get<HistoryEntry[]>('/points/my-history'),
    ])
      .then(([missionsRes, historyRes]) => {
        setMissions(missionsRes.data);
        setHistory(historyRes.data);
      })
      .catch(() => setError('Erro ao carregar dados. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleCompleteMission(missionId: number, missionTitle: string) {
    setCompleting(missionId);
    setSuccessMsg('');
    setError('');
    try {
      const { data } = await api.post<CompleteMissionResponse>(
        `/points/complete-mission/${missionId}`,
      );
      setSuccessMsg(
        `"${missionTitle}" concluída! +${data.pointsEarned} pontos. Total: ${data.totalPoints} pontos.`,
      );
      await refreshHistory();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message ?? 'Erro ao concluir missão. Tente novamente.';
      setError(msg);
    } finally {
      setCompleting(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const completedMissionIds = new Set(history.map((h) => h.missionId));

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
        <h2 className="page-title">Missões Disponíveis</h2>
        <p className="page-subtitle">Conclua missões para acumular pontos e subir no ranking.</p>

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

        {successMsg && (
          <p
            className="notice"
            style={{
              background: '#dcfce7',
              borderColor: '#86efac',
              color: '#15803d',
              marginBottom: '24px',
            }}
          >
            {successMsg}
          </p>
        )}

        <section style={{ marginTop: '24px', marginBottom: '40px' }}>
          {missions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma missão disponível no momento.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Pontos</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((m) => {
                    const alreadyDone = completedMissionIds.has(m.id);
                    const isCompleting = completing === m.id;
                    const disabled = alreadyDone || completing !== null;
                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>{m.title}</td>
                        <td style={tdStyle}>{m.description}</td>
                        <td style={tdStyle}>{m.points}</td>
                        <td style={tdStyle}>
                          <button
                            className="btn"
                            onClick={() => !alreadyDone && handleCompleteMission(m.id, m.title)}
                            disabled={disabled}
                            style={{
                              background: alreadyDone ? 'var(--success)' : 'var(--primary)',
                              color: '#fff',
                              fontSize: '13px',
                              padding: '6px 14px',
                              opacity: disabled ? 0.6 : 1,
                              cursor: disabled ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isCompleting
                              ? 'Concluindo...'
                              : alreadyDone
                                ? 'Missão concluída'
                                : 'Concluir missão'}
                          </button>
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
