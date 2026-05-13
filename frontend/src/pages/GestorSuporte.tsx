import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: '6px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: 'var(--bg)',
  color: 'var(--text)',
  boxSizing: 'border-box',
};

const fieldStyle: CSSProperties = {
  marginBottom: '20px',
};

type FormState = {
  nome: string;
  email: string;
  tipo: string;
  titulo: string;
  descricao: string;
  prioridade: string;
};

function readLocalUser(): { name?: string; email?: string } {
  try {
    return JSON.parse(localStorage.getItem('user') ?? '{}');
  } catch {
    return {};
  }
}

export default function GestorSuporte() {
  const navigate = useNavigate();
  const localUser = readLocalUser();

  const [form, setForm] = useState<FormState>({
    nome: localUser.name ?? '',
    email: localUser.email ?? '',
    tipo: '',
    titulo: '',
    descricao: '',
    prioridade: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nome.trim() || !form.email.trim() || !form.tipo || !form.titulo.trim() || !form.descricao.trim() || !form.prioridade) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setSuccess('Mensagem enviada com sucesso! Nossa equipe de desenvolvimento irá analisar sua solicitação.');
    setForm((prev) => ({ ...prev, tipo: '', titulo: '', descricao: '', prioridade: '' }));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
        <h2 className="page-title">Suporte</h2>
        <p className="page-subtitle">
          Use este formulário para relatar erros, problemas ou sugestões aos desenvolvedores.
        </p>

        {error && (
          <p
            className="notice"
            style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '24px' }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="notice"
            style={{ background: '#dcfce7', borderColor: '#86efac', color: '#15803d', marginBottom: '24px' }}
          >
            {success}
          </p>
        )}

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: '32px',
            maxWidth: '600px',
            marginTop: '24px',
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="nome">Nome *</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Seu nome"
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="tipo">Tipo de solicitação *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Selecione...</option>
                  <option value="Erro na aplicação">Erro na aplicação</option>
                  <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                  <option value="Dúvida">Dúvida</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="prioridade">Prioridade *</label>
                <select
                  id="prioridade"
                  name="prioridade"
                  value={form.prioridade}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Selecione...</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="titulo">Título do problema *</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={form.titulo}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Descreva brevemente o problema"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="descricao">Descrição detalhada *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={5}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Descreva o problema com o máximo de detalhes possível: o que aconteceu, quando ocorreu, quais passos realizou..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 600 }}
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
