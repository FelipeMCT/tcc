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
  type: 'STANDARD' | 'WEEKLY_DAILY';
  startDate: string | null;
  endDate: string | null;
  bonusPercentage: number | null;
  requiredCompletions: number | null;
}

interface MissionProgress {
  missionId: number;
  type: 'STANDARD' | 'WEEKLY_DAILY';
  completions: number;
  completedToday: boolean;
  bonusReceived: boolean;
  requiredCompletions: number | null;
  canCompleteToday: boolean;
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
  bonusEarned: number;
  totalUserPoints: number;
  completions: number;
  requiredCompletions: number | null;
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

export default function FuncionarioMissoes() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [progress, setProgress] = useState<MissionProgress[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [completing, setCompleting] = useState<number | null>(null);

  const localUser = JSON.parse(localStorage.getItem('user') ?? 'null') as { id: number } | null;

  const refreshData = useCallback(async () => {
    const [historyRes, progressRes] = await Promise.all([
      api.get<HistoryEntry[]>('/points/my-history'),
      api.get<MissionProgress[]>('/missions/my-progress'),
    ]);
    setHistory(historyRes.data);
    setProgress(progressRes.data);
  }, []);

  useEffect(() => {
    if (!localUser) {
      navigate('/login');
      return;
    }

    Promise.all([
      api.get<Mission[]>('/missions/active'),
      api.get<HistoryEntry[]>('/points/my-history'),
      api.get<MissionProgress[]>('/missions/my-progress'),
    ])
      .then(([missionsRes, historyRes, progressRes]) => {
        setMissions(missionsRes.data);
        setHistory(historyRes.data);
        setProgress(progressRes.data);
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
      if (data.bonusEarned > 0) {
        setSuccessMsg(
          `${data.message} +${data.pointsEarned} + ${data.bonusEarned} pts bônus. Total: ${data.totalUserPoints} pts.`,
        );
      } else {
        setSuccessMsg(
          `"${missionTitle}" concluída! +${data.pointsEarned} pontos. Total: ${data.totalUserPoints} pontos.`,
        );
      }
      await refreshData();
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

  const progressMap = new Map(progress.map((p) => [p.missionId, p]));
  const now = new Date();

  const standardMissions = missions.filter((m) => m.type === 'STANDARD');
  const weeklyMissions = missions.filter((m) => m.type === 'WEEKLY_DAILY');

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
            style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '24px' }}
          >
            {error}
          </p>
        )}

        {successMsg && (
          <p
            className="notice"
            style={{ background: '#dcfce7', borderColor: '#86efac', color: '#15803d', marginBottom: '24px' }}
          >
            {successMsg}
          </p>
        )}

        {/* Missões padrão */}
        <section style={{ marginTop: '24px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            Missões Padrão
          </h3>
          {standardMissions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma missão padrão disponível.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Pontos</th>
                    <th style={thStyle}>Prazo</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {standardMissions.map((m) => {
                    const p = progressMap.get(m.id);
                    const alreadyDone = (p?.completions ?? 0) > 0;
                    const expired = m.endDate ? now > new Date(m.endDate) : false;
                    const notStarted = m.startDate ? now < new Date(m.startDate) : false;
                    const isCompleting = completing === m.id;
                    const busy = completing !== null;

                    let btnLabel = 'Concluir missão';
                    let btnBg = 'var(--primary)';
                    let disabled = busy;

                    if (isCompleting) {
                      btnLabel = 'Concluindo...';
                    } else if (alreadyDone) {
                      btnLabel = 'Missão concluída';
                      btnBg = 'var(--success)';
                      disabled = true;
                    } else if (expired) {
                      btnLabel = 'Prazo encerrado';
                      btnBg = 'var(--text-muted)';
                      disabled = true;
                    } else if (notStarted) {
                      btnLabel = 'Não disponível';
                      btnBg = 'var(--text-muted)';
                      disabled = true;
                    }

                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>{m.title}</td>
                        <td style={tdStyle}>{m.description}</td>
                        <td style={tdStyle}>{m.points}</td>
                        <td style={{ ...tdStyle, fontSize: '13px', color: 'var(--text-muted)' }}>
                          {m.endDate ? formatDate(m.endDate) : '—'}
                        </td>
                        <td style={tdStyle}>
                          <button
                            className="btn"
                            onClick={() =>
                              !disabled && !alreadyDone && handleCompleteMission(m.id, m.title)
                            }
                            disabled={disabled}
                            style={{
                              background: btnBg,
                              color: '#fff',
                              fontSize: '13px',
                              padding: '6px 14px',
                              opacity: disabled && !alreadyDone ? 0.6 : 1,
                              cursor: disabled ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {btnLabel}
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

        {/* Missões semanais */}
        {weeklyMissions.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
              Missões Semanais Diárias
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {weeklyMissions.map((m) => {
                const p = progressMap.get(m.id);
                const req = m.requiredCompletions ?? 7;
                const completions = p?.completions ?? 0;
                const completedToday = p?.completedToday ?? false;
                const bonusReceived = p?.bonusReceived ?? false;
                const allDone = bonusReceived || completions >= req;
                const expired = m.endDate ? now > new Date(m.endDate) : false;
                const notStarted = m.startDate ? now < new Date(m.startDate) : false;
                const isCompleting = completing === m.id;
                const busy = completing !== null;

                let btnLabel = 'Concluir missão de hoje';
                let btnBg = 'var(--primary)';
                let disabled = busy;

                if (isCompleting) {
                  btnLabel = 'Concluindo...';
                } else if (allDone) {
                  btnLabel = 'Missão semanal concluída';
                  btnBg = 'var(--success)';
                  disabled = true;
                } else if (completedToday) {
                  btnLabel = 'Concluída hoje';
                  btnBg = '#6366f1';
                  disabled = true;
                } else if (expired) {
                  btnLabel = 'Prazo encerrado';
                  btnBg = 'var(--text-muted)';
                  disabled = true;
                } else if (notStarted) {
                  btnLabel = 'Ainda não disponível';
                  btnBg = 'var(--text-muted)';
                  disabled = true;
                }

                const progressPct = req > 0 ? Math.round((completions / req) * 100) : 0;

                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: '99px',
                            background: '#ede9fe',
                            color: '#6d28d9',
                          }}
                        >
                          Semanal Diária
                        </span>
                        {allDone && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '99px',
                              background: '#dcfce7',
                              color: '#15803d',
                            }}
                          >
                            Completa
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {m.description}
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span>
                        <strong style={{ color: 'var(--primary)' }}>{m.points}</strong> pts/dia
                      </span>
                      {m.bonusPercentage && (
                        <span style={{ color: '#6d28d9' }}>
                          Bônus: <strong>{m.bonusPercentage}%</strong> ao completar {req}/7
                        </span>
                      )}
                    </div>

                    {(m.startDate || m.endDate) && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Período:{' '}
                        {m.startDate && m.endDate
                          ? `${formatDate(m.startDate)} → ${formatDate(m.endDate)}`
                          : m.endDate
                            ? `Até ${formatDate(m.endDate)}`
                            : ''}
                      </div>
                    )}

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          fontWeight: 600,
                          marginBottom: '6px',
                          color: 'var(--text)',
                        }}
                      >
                        <span>Progresso</span>
                        <span style={{ color: allDone ? '#15803d' : 'var(--primary)' }}>
                          {completions}/{req} dias
                        </span>
                      </div>
                      <div
                        style={{
                          background: '#e5e7eb',
                          borderRadius: '99px',
                          height: '8px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background: allDone ? 'var(--success)' : 'var(--primary)',
                            width: `${progressPct}%`,
                            height: '8px',
                            borderRadius: '99px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className="btn"
                      onClick={() =>
                        !disabled && !allDone && !completedToday && handleCompleteMission(m.id, m.title)
                      }
                      disabled={disabled}
                      style={{
                        background: btnBg,
                        color: '#fff',
                        fontSize: '13px',
                        padding: '8px 16px',
                        opacity: disabled && !allDone && !completedToday ? 0.6 : 1,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        width: '100%',
                      }}
                    >
                      {btnLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {missions.length === 0 && (
          <p style={{ color: 'var(--text-muted)', marginTop: '24px' }}>
            Nenhuma missão disponível no momento.
          </p>
        )}
      </main>
    </div>
  );
}
