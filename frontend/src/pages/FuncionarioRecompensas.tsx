import { useEffect, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { AxiosError } from 'axios';
import CongratulationsEffect from '../components/CongratulationsEffect';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  points: number;
  level: string;
}

interface ActiveReward {
  id: number;
  title: string;
  description: string;
  cost: number;
  quantity: number;
  active: boolean;
  remaining: number;
  redeemed: number;
}

interface MyRedemption {
  id: number;
  cost: number;
  createdAt: string;
  reward: { id: number; title: string; description: string };
}

interface RedeemResponse {
  message: string;
  reward: { id: number; title: string };
  cost: number;
  remainingPoints: number;
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

export default function FuncionarioRecompensas() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [rewards, setRewards] = useState<ActiveReward[]>([]);
  const [redemptions, setRedemptions] = useState<MyRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [congrats, setCongrats] = useState({ show: false, title: '', message: '' });

  const localUser = JSON.parse(localStorage.getItem('user') ?? 'null') as { id: number } | null;

  const refreshData = useCallback(async () => {
    const [rewardsRes, redemptionsRes] = await Promise.all([
      api.get<ActiveReward[]>('/rewards/active'),
      api.get<MyRedemption[]>('/rewards/my-redemptions'),
    ]);
    setRewards(rewardsRes.data);
    setRedemptions(redemptionsRes.data);
  }, []);

  useEffect(() => {
    if (!localUser) {
      navigate('/login');
      return;
    }

    Promise.all([
      api.get<User>(`/users/${localUser.id}`),
      api.get<ActiveReward[]>('/rewards/active'),
      api.get<MyRedemption[]>('/rewards/my-redemptions'),
    ])
      .then(([userRes, rewardsRes, redemptionsRes]) => {
        setUser(userRes.data);
        setRewards(rewardsRes.data);
        setRedemptions(redemptionsRes.data);
      })
      .catch(() => setError('Erro ao carregar dados. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleRedeem(reward: ActiveReward) {
    setRedeeming(reward.id);
    setSuccessMsg('');
    setError('');
    try {
      const { data } = await api.post<RedeemResponse>(`/rewards/${reward.id}/redeem`);
      setSuccessMsg(`"${data.reward.title}" resgatada! −${data.cost} pontos. Saldo: ${data.remainingPoints} pontos.`);
      setCongrats({
        show: true,
        title: 'Recompensa resgatada!',
        message: `Parabéns! Você resgatou "${data.reward.title}" com sucesso.\nSeus pontos foram atualizados. Saldo atual: ${data.remainingPoints} pontos.`,
      });
      setUser((prev) => (prev ? { ...prev, points: data.remainingPoints } : prev));
      await refreshData();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message ?? 'Erro ao resgatar recompensa.';
      setError(msg);
    } finally {
      setRedeeming(null);
    }
  }

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
        <h2 className="page-title">Recompensas</h2>
        <p className="page-subtitle">
          Seus pontos:{' '}
          <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{user?.points ?? 0}</strong>
          {' · '}
          Nível: <strong style={{ color: 'var(--primary)' }}>{user?.level ?? '—'}</strong>
        </p>

        {error && (
          <p className="notice" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '24px' }}>
            {error}
          </p>
        )}
        {successMsg && (
          <p className="notice" style={{ background: '#dcfce7', borderColor: '#86efac', color: '#15803d', marginBottom: '24px' }}>
            {successMsg}
          </p>
        )}

        {/* Recompensas disponíveis */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            Recompensas Disponíveis
          </h3>
          {rewards.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma recompensa disponível no momento.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Custo</th>
                    <th style={thStyle}>Restantes</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r) => {
                    const hasPoints = (user?.points ?? 0) >= r.cost;
                    const isRedeeming = redeeming === r.id;
                    const busy = redeeming !== null;
                    const esgotado = r.remaining === 0;

                    let btnLabel = 'Resgatar';
                    if (isRedeeming) btnLabel = 'Resgatando...';
                    else if (esgotado) btnLabel = 'Esgotado';
                    else if (!hasPoints) btnLabel = 'Pontos insuficientes';

                    const canRedeem = hasPoints && !esgotado && !busy;

                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{r.title}</td>
                        <td style={tdStyle}>{r.description}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--primary)' }}>
                          {r.cost} pts
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: r.remaining === 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {r.remaining}
                        </td>
                        <td style={tdStyle}>
                          <button
                            className="btn"
                            onClick={() => canRedeem && handleRedeem(r)}
                            disabled={!canRedeem}
                            style={{
                              fontSize: '13px',
                              padding: '6px 14px',
                              background: esgotado
                                ? 'var(--text-muted)'
                                : !hasPoints
                                  ? '#fee2e2'
                                  : 'var(--primary)',
                              color: (!hasPoints && !esgotado) ? '#991b1b' : '#fff',
                              opacity: !canRedeem && !isRedeeming ? 0.65 : 1,
                              cursor: canRedeem ? 'pointer' : 'not-allowed',
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

        {/* Minhas recompensas resgatadas */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            Minhas Recompensas Resgatadas
          </h3>
          {redemptions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Você ainda não resgatou nenhuma recompensa.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Custo pago</th>
                    <th style={thStyle}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((rd) => (
                    <tr key={rd.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{rd.reward.title}</td>
                      <td style={tdStyle}>{rd.reward.description}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--danger)' }}>
                        −{rd.cost} pts
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                        {new Date(rd.createdAt).toLocaleDateString('pt-BR', {
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
      <CongratulationsEffect
        show={congrats.show}
        title={congrats.title}
        message={congrats.message}
        onClose={() => setCongrats((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
