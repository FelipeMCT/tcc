import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface FeedbackUser {
  id: number;
  name: string;
  email: string;
  role: 'GESTOR' | 'FUNCIONARIO';
  points: number;
  level: string;
}

interface FeedbackEntry {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  user: FeedbackUser;
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

export default function GestorFeedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<FeedbackEntry[]>('/feedbacks')
      .then((res) => setFeedbacks(res.data))
      .catch(() => setError('Erro ao carregar feedbacks. Verifique se o backend está ativo.'))
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
        <h2 className="page-title">Feedbacks dos Funcionários</h2>
        <p className="page-subtitle">Opiniões e sugestões enviadas pela equipe.</p>

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

        <section style={{ marginTop: '24px', marginBottom: '40px' }}>
          {feedbacks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum feedback enviado ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Funcionário</th>
                    <th style={thStyle}>E-mail</th>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Mensagem</th>
                    <th style={thStyle}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{f.user.name}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{f.user.email}</td>
                      <td style={tdStyle}>{f.title}</td>
                      <td style={tdStyle}>{f.message}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
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
