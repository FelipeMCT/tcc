import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface TopEmployee {
  id: number;
  name: string;
  email: string;
  points: number;
  level?: string;
  completedMissions?: number;
}

interface MostCompletedMission {
  id: number;
  title: string;
  description: string;
  completions: number;
  points: number;
}

interface EmployeeParticipation {
  id: number;
  name: string;
  email: string;
  points: number;
  level: string;
  completedMissions: number;
  participationRate: number;
}

interface EmployeeBasic {
  id: number;
  name: string;
  email: string;
  points: number;
}

interface ManagerSummary {
  totalEmployees: number;
  totalMissions: number;
  activeMissions: number;
  inactiveMissions: number;
  totalMissionCompletions: number;
  totalPointsDistributed: number;
  topEmployeeByPoints: TopEmployee | null;
  topEmployeeByCompletions: TopEmployee | null;
  mostCompletedMission: MostCompletedMission | null;
  employeeParticipation: EmployeeParticipation[];
  employeesWithoutCompletions: EmployeeBasic[];
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

const statCardStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow)',
  padding: '20px 24px',
};

const highlightCardStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow)',
  padding: '24px',
  flex: 1,
  minWidth: '200px',
};

const sectionTitleStyle: CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '16px',
  marginTop: '36px',
  color: 'var(--text)',
};

export default function GestorRelatorios() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<ManagerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<ManagerSummary>('/reports/manager-summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Erro ao carregar relatórios. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

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
        <h2 className="page-title">Relatórios</h2>
        <p className="page-subtitle">Visão geral do desempenho e participação da equipe.</p>

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

        {!summary && !error && (
          <p style={{ color: 'var(--text-muted)' }}>Sem dados disponíveis.</p>
        )}

        {summary && (
          <>
            {/* Resumo geral */}
            <h3 style={sectionTitleStyle}>Resumo Geral</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                { label: 'Funcionários', value: summary.totalEmployees },
                { label: 'Missões totais', value: summary.totalMissions },
                { label: 'Missões ativas', value: summary.activeMissions },
                { label: 'Missões inativas', value: summary.inactiveMissions },
                { label: 'Conclusões', value: summary.totalMissionCompletions },
                { label: 'Pontos distribuídos', value: summary.totalPointsDistributed },
              ].map((item) => (
                <div key={item.label} style={statCardStyle}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)' }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Destaques */}
            <h3 style={sectionTitleStyle}>Destaques</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Top por pontos */}
              <div style={highlightCardStyle}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                  }}
                >
                  Maior pontuação
                </div>
                {summary.topEmployeeByPoints ? (
                  <>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                      {summary.topEmployeeByPoints.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {summary.topEmployeeByPoints.email}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>
                      {summary.topEmployeeByPoints.points} pts
                    </div>
                    {summary.topEmployeeByPoints.level && (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Nível: {summary.topEmployeeByPoints.level}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sem dados.</p>
                )}
              </div>

              {/* Top por conclusões */}
              <div style={highlightCardStyle}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                  }}
                >
                  Mais missões concluídas
                </div>
                {summary.topEmployeeByCompletions ? (
                  <>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                      {summary.topEmployeeByCompletions.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {summary.topEmployeeByCompletions.email}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>
                      {summary.topEmployeeByCompletions.completedMissions ?? 0} missões
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {summary.topEmployeeByCompletions.points} pontos acumulados
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sem dados.</p>
                )}
              </div>

              {/* Missão mais concluída */}
              <div style={highlightCardStyle}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                  }}
                >
                  Missão mais concluída
                </div>
                {summary.mostCompletedMission ? (
                  <>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                      {summary.mostCompletedMission.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {summary.mostCompletedMission.description}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>
                      {summary.mostCompletedMission.completions}× concluída
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Vale {summary.mostCompletedMission.points} pontos
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sem dados.</p>
                )}
              </div>
            </div>

            {/* Participação */}
            <h3 style={sectionTitleStyle}>Participação dos Funcionários</h3>
            {summary.employeeParticipation.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Nenhum funcionário cadastrado.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>E-mail</th>
                      <th style={thStyle}>Nível</th>
                      <th style={thStyle}>Pontos</th>
                      <th style={thStyle}>Missões concluídas</th>
                      <th style={thStyle}>Taxa de participação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.employeeParticipation.map((e) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{e.name}</td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{e.email}</td>
                        <td style={tdStyle}>{e.level}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                          {e.points}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{e.completedMissions}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                flex: 1,
                                height: '6px',
                                background: 'var(--border)',
                                borderRadius: '99px',
                                overflow: 'hidden',
                                minWidth: '80px',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${e.participationRate}%`,
                                  background: 'var(--primary)',
                                  borderRadius: '99px',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '42px' }}>
                              {e.participationRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sem participação */}
            <h3 style={sectionTitleStyle}>Funcionários sem Participação</h3>
            {summary.employeesWithoutCompletions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Todos os funcionários já concluíram pelo menos uma missão.
              </p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>E-mail</th>
                      <th style={thStyle}>Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.employeesWithoutCompletions.map((e) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{e.name}</td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{e.email}</td>
                        <td style={tdStyle}>{e.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
