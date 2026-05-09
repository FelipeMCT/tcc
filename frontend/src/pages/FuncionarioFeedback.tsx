import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface FeedbackEntry {
  id: number;
  title: string;
  message: string;
  createdAt: string;
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

export default function FuncionarioFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<FeedbackEntry[]>('/feedbacks/my')
      .then((res) => setFeedbacks(res.data))
      .catch(() => setError('Erro ao carregar feedbacks. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg('');
    setError('');
    setSubmitting(true);
    try {
      await api.post('/feedbacks', { title, message });
      setSuccessMsg('Feedback enviado com sucesso!');
      setTitle('');
      setMessage('');
      const res = await api.get<FeedbackEntry[]>('/feedbacks/my');
      setFeedbacks(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message ?? 'Erro ao enviar feedback. Tente novamente.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
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
        <h2 className="page-title">Enviar Feedback</h2>
        <p className="page-subtitle">Compartilhe sua opinião sobre o ambiente de trabalho ou o serviço.</p>

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

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: '24px 32px',
            maxWidth: '780px',
            marginBottom: '40px',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}
            >
              Título
            </label>
            <input
              className="input"
              type="text"
              placeholder="Ex: Sugestão de melhoria"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}
            >
              Mensagem
            </label>
            <textarea
              className="input"
              placeholder="Descreva seu feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={submitting}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={submitting}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Enviando...' : 'Enviar feedback'}
          </button>
        </form>

        <section>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
            Feedbacks Enviados
          </h3>
          {feedbacks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Você ainda não enviou nenhum feedback.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Mensagem</th>
                    <th style={thStyle}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{f.title}</td>
                      <td style={tdStyle}>{f.message}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                        {new Date(f.createdAt).toLocaleDateString('pt-BR', {
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
