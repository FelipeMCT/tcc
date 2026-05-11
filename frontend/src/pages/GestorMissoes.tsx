import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
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

export default function GestorMissoes() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPoints, setFormPoints] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formType, setFormType] = useState<'STANDARD' | 'WEEKLY_DAILY'>('STANDARD');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<Mission[]>('/missions')
      .then((res) => setMissions(res.data))
      .catch(() => setError('Erro ao carregar missões. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  function handleTypeChange(newType: 'STANDARD' | 'WEEKLY_DAILY') {
    setFormType(newType);
    setFormStartDate('');
    setFormEndDate('');
  }

  function handleEditClick(m: Mission) {
    setEditingId(m.id);
    setFormTitle(m.title);
    setFormDescription(m.description);
    setFormPoints(String(m.points));
    setFormActive(m.active);
    setFormType(m.type);
    setFormStartDate(m.startDate ? m.startDate.slice(0, 10) : '');
    setFormEndDate(m.endDate ? m.endDate.slice(0, 10) : '');
    setFormError('');
    setFormSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
    setFormActive(true);
    setFormType('STANDARD');
    setFormStartDate('');
    setFormEndDate('');
    setFormError('');
    setFormSuccess('');
  }

  async function handleSubmitMission(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const points = Number(formPoints);
    if (!formTitle.trim() || !formDescription.trim() || !formPoints) {
      setFormError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (isNaN(points) || points < 1) {
      setFormError('Pontos deve ser um número maior que 0.');
      return;
    }
    if (formType === 'WEEKLY_DAILY' && !formStartDate) {
      setFormError('Data de início é obrigatória para missões semanais.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        points,
        active: formActive,
        type: formType,
      };
      if (formStartDate) payload.startDate = formStartDate;
      if (formEndDate) payload.endDate = formEndDate;

      if (editingId !== null) {
        const { data: updated } = await api.patch<Mission>(`/missions/${editingId}`, payload);
        setMissions((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setFormSuccess(`Missão "${updated.title}" atualizada com sucesso!`);
        setEditingId(null);
      } else {
        const { data: created } = await api.post<Mission>('/missions', payload);
        setMissions((prev) => [...prev, created]);
        setFormSuccess(`Missão "${created.title}" criada com sucesso!`);
      }
      setFormTitle('');
      setFormDescription('');
      setFormPoints('');
      setFormActive(true);
      setFormType('STANDARD');
      setFormStartDate('');
      setFormEndDate('');
    } catch {
      setFormError(
        editingId !== null
          ? 'Erro ao atualizar missão. Tente novamente.'
          : 'Erro ao criar missão. Tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(m: Mission) {
    if (!window.confirm(`Excluir a missão "${m.title}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(m.id);
    try {
      await api.delete(`/missions/${m.id}`);
      setMissions((prev) => prev.filter((item) => item.id !== m.id));
    } catch {
      setError('Erro ao excluir missão. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(m: Mission) {
    setTogglingId(m.id);
    try {
      const { data: updated } = await api.patch<Mission>(`/missions/${m.id}/toggle-active`);
      setMissions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      setError('Erro ao atualizar status da missão.');
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

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  };

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
        <h2 className="page-title">Missões</h2>
        <p className="page-subtitle">Crie, edite e gerencie as missões disponíveis para os funcionários.</p>

        {error && (
          <p
            className="notice"
            style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '24px' }}
          >
            {error}
          </p>
        )}

        {/* Formulário criar / editar */}
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            {editingId !== null ? 'Editar Missão' : 'Nova Missão'}
          </h3>
          <div
            style={{
              background: 'var(--surface)',
              border: `1px solid ${editingId !== null ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              maxWidth: '640px',
            }}
          >
            {formError && (
              <p
                className="notice"
                style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '16px' }}
              >
                {formError}
              </p>
            )}
            {formSuccess && (
              <p
                className="notice"
                style={{ background: '#dcfce7', borderColor: '#86efac', color: '#15803d', marginBottom: '16px' }}
              >
                {formSuccess}
              </p>
            )}
            <form
              onSubmit={handleSubmitMission}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Tipo de missão */}
              <div>
                <label style={labelStyle}>Tipo de missão</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(['STANDARD', 'WEEKLY_DAILY'] as const).map((t) => (
                    <label
                      key={t}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontWeight: formType === t ? 600 : 400,
                        color: formType === t ? 'var(--primary)' : 'var(--text)',
                      }}
                    >
                      <input
                        type="radio"
                        name="missionType"
                        value={t}
                        checked={formType === t}
                        onChange={() => handleTypeChange(t)}
                        disabled={submitting}
                      />
                      {t === 'STANDARD' ? 'Missão padrão' : 'Missão semanal diária'}
                    </label>
                  ))}
                </div>
              </div>

              {formType === 'WEEKLY_DAILY' && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#eff6ff',
                    borderRadius: 'var(--radius)',
                    fontSize: '13px',
                    color: '#1e40af',
                    lineHeight: 1.5,
                  }}
                >
                  O funcionário pode concluir 1 vez por dia durante 7 dias. Ao completar os 7 dias,
                  recebe bônus de 25% sobre o total de pontos da missão.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="mission-title">Título</label>
                <input
                  id="mission-title"
                  type="text"
                  placeholder="Ex: Participar da reunião semanal"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mission-desc">Descrição</label>
                <input
                  id="mission-desc"
                  type="text"
                  placeholder="Ex: Participar da reunião de alinhamento da equipe"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mission-points">
                  {formType === 'WEEKLY_DAILY' ? 'Pontos por dia' : 'Pontos'}
                </label>
                <input
                  id="mission-points"
                  type="number"
                  min={1}
                  placeholder="Ex: 40"
                  value={formPoints}
                  onChange={(e) => setFormPoints(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {formType === 'WEEKLY_DAILY' && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                    <label htmlFor="mission-start">Data de início *</label>
                    <input
                      id="mission-start"
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                    <label htmlFor="mission-end">
                      Data final{' '}
                      <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                        (auto: início + 7 dias)
                      </span>
                    </label>
                    <input
                      id="mission-end"
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>
              )}

              {formType === 'STANDARD' && (
                <div className="form-group">
                  <label htmlFor="mission-deadline">
                    Prazo final{' '}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional)</span>
                  </label>
                  <input
                    id="mission-deadline"
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="mission-active"
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  disabled={submitting}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="mission-active"
                  style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Missão ativa
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  {submitting
                    ? editingId !== null
                      ? 'Salvando...'
                      : 'Criando...'
                    : editingId !== null
                      ? 'Salvar alterações'
                      : 'Criar missão'}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    className="btn"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    style={{
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Tabela de missões */}
        <section style={{ marginTop: '40px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Missões Cadastradas
          </h3>
          {missions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma missão cadastrada.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Tipo</th>
                    <th style={thStyle}>Pontos</th>
                    <th style={thStyle}>Período / Prazo</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{m.title}</td>
                      <td style={tdStyle}>{m.description}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: '99px',
                            background: m.type === 'WEEKLY_DAILY' ? '#ede9fe' : '#f1f5f9',
                            color: m.type === 'WEEKLY_DAILY' ? '#6d28d9' : 'var(--text-muted)',
                          }}
                        >
                          {m.type === 'WEEKLY_DAILY' ? 'Semanal' : 'Padrão'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {m.points}
                        {m.type === 'WEEKLY_DAILY' && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/dia</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, fontSize: '13px', color: 'var(--text-muted)' }}>
                        {m.startDate && m.endDate
                          ? `${formatDate(m.startDate)} → ${formatDate(m.endDate)}`
                          : m.endDate
                            ? `Até ${formatDate(m.endDate)}`
                            : '—'}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: m.active ? '#dcfce7' : '#f1f5f9',
                            color: m.active ? '#15803d' : 'var(--text-muted)',
                          }}
                        >
                          {m.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <button
                          className="btn"
                          onClick={() => handleEditClick(m)}
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            background: 'var(--primary)',
                            color: '#fff',
                            marginRight: '8px',
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleToggleActive(m)}
                          disabled={togglingId === m.id || deletingId === m.id}
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            background: m.active ? '#f59e0b' : 'var(--success)',
                            color: '#fff',
                            marginRight: '8px',
                            opacity: togglingId === m.id ? 0.6 : 1,
                            cursor: togglingId === m.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {togglingId === m.id ? '...' : m.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleDelete(m)}
                          disabled={deletingId === m.id || togglingId === m.id}
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            background: 'var(--danger)',
                            color: '#fff',
                            opacity: deletingId === m.id ? 0.6 : 1,
                            cursor: deletingId === m.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {deletingId === m.id ? '...' : 'Excluir'}
                        </button>
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
