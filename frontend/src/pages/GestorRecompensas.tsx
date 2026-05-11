import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  quantity: number;
  active: boolean;
  createdAt: string;
  redeemed: number;
  remaining: number;
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

export default function GestorRecompensas() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formActive, setFormActive] = useState(true);

  async function loadRewards() {
    const res = await api.get<Reward[]>('/rewards');
    setRewards(res.data);
  }

  useEffect(() => {
    loadRewards()
      .catch(() => setError('Erro ao carregar recompensas. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(r: Reward) {
    setEditingId(r.id);
    setFormTitle(r.title);
    setFormDescription(r.description);
    setFormCost(String(r.cost));
    setFormQuantity(String(r.quantity));
    setFormActive(r.active);
    setFormError('');
    setFormSuccess('');
  }

  function cancelEdit() {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormCost('');
    setFormQuantity('');
    setFormActive(true);
    setFormError('');
    setFormSuccess('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        cost: Number(formCost),
        quantity: Number(formQuantity),
        active: formActive,
      };
      if (editingId !== null) {
        await api.patch(`/rewards/${editingId}`, payload);
        setFormSuccess('Recompensa atualizada com sucesso!');
      } else {
        await api.post('/rewards', payload);
        setFormSuccess('Recompensa criada com sucesso!');
      }
      cancelEdit();
      await loadRewards();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string | string[] }>;
      const msg = axiosErr.response?.data?.message ?? 'Erro ao salvar recompensa.';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(r: Reward) {
    setTogglingId(r.id);
    setFormError('');
    setFormSuccess('');
    try {
      await api.patch(`/rewards/${r.id}/toggle-active`);
      await loadRewards();
    } catch {
      setFormError('Erro ao alterar status da recompensa.');
    } finally {
      setTogglingId(null);
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

  const isEditing = editingId !== null;

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
        <h2 className="page-title">Recompensas</h2>
        <p className="page-subtitle">Crie e gerencie recompensas que os funcionários podem resgatar com seus pontos.</p>

        {error && (
          <p className="notice" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '24px' }}>
            {error}
          </p>
        )}

        {/* Formulário */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            {isEditing ? 'Editar Recompensa' : 'Nova Recompensa'}
          </h3>

          {formError && (
            <p className="notice" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '16px' }}>
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="notice" style={{ background: '#dcfce7', borderColor: '#86efac', color: '#15803d', marginBottom: '16px' }}>
              {formSuccess}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Nome do prêmio
              </label>
              <input
                className="input"
                type="text"
                placeholder="Ex: Vale-presente"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Descrição
              </label>
              <input
                className="input"
                type="text"
                placeholder="Descreva a recompensa"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Custo em pontos
              </label>
              <input
                className="input"
                type="number"
                min={1}
                placeholder="Ex: 100"
                value={formCost}
                onChange={(e) => setFormCost(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Quantidade disponível
              </label>
              <input
                className="input"
                type="number"
                min={1}
                placeholder="Ex: 10"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
              <input
                type="checkbox"
                id="formActive"
                checked={formActive}
                onChange={(e) => setFormActive(e.target.checked)}
                disabled={submitting}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="formActive" style={{ fontSize: '14px', cursor: 'pointer' }}>
                Ativa
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <button
                type="submit"
                className="btn"
                disabled={submitting}
                style={{ background: 'var(--primary)', color: '#fff', opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar recompensa'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn"
                  onClick={cancelEdit}
                  disabled={submitting}
                  style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Tabela */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            Recompensas Cadastradas
          </h3>
          {rewards.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma recompensa cadastrada ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Custo</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Resgatadas</th>
                    <th style={thStyle}>Restantes</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((r) => {
                    const isToggling = togglingId === r.id;
                    const busy = submitting || togglingId !== null;
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{r.title}</td>
                        <td style={tdStyle}>{r.description}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                          {r.cost} pts
                        </td>
                        <td style={tdStyle}>{r.quantity}</td>
                        <td style={tdStyle}>{r.redeemed}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: r.remaining === 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {r.remaining}
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '99px',
                              background: r.active ? '#dcfce7' : '#fee2e2',
                              color: r.active ? '#15803d' : '#991b1b',
                            }}
                          >
                            {r.active ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, display: 'flex', gap: '8px' }}>
                          <button
                            className="btn"
                            onClick={() => startEdit(r)}
                            disabled={busy}
                            style={{ fontSize: '12px', padding: '5px 12px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                          >
                            Editar
                          </button>
                          <button
                            className="btn"
                            onClick={() => handleToggleActive(r)}
                            disabled={busy}
                            style={{
                              fontSize: '12px',
                              padding: '5px 12px',
                              background: r.active ? '#fee2e2' : '#dcfce7',
                              color: r.active ? '#991b1b' : '#15803d',
                              opacity: isToggling ? 0.6 : 1,
                            }}
                          >
                            {isToggling ? '...' : r.active ? 'Desativar' : 'Ativar'}
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
