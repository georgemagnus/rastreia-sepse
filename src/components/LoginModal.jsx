import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { User, Lock, Mail, Stethoscope, Award, Building, CheckCircle2, X } from 'lucide-react';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function LoginModal({ isOpen, onClose }) {
  const { login, register, demoUsers, loginAsDemo } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register extra states
  const [name, setName] = useState('');
  const [role, setRole] = useState('medico'); // 'medico' | 'enfermeiro'
  const [councilNumber, setCouncilNumber] = useState('');
  const [councilUf, setCouncilUf] = useState('PB');
  const [sector, setSector] = useState('Pronto Atendimento / Emergência');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegisterMode) {
      if (!name || !email || !councilNumber) {
        setError('Preencha todos os campos obrigatórios.');
        return;
      }
      const res = register({
        name,
        email,
        role,
        councilNumber,
        councilUf,
        sector
      });
      if (res.success) {
        setSuccessMsg('Cadastro realizado com sucesso!');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } else {
      const res = login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-subtle)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {isRegisterMode ? 'Cadastro de Profissional de Saúde' : 'Acesso ao Rastreia Sepse'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
              {isRegisterMode 
                ? 'Informe seus dados de conselho de classe (CRM / COREN)' 
                : 'Identifique-se para assinar condutas e registrar triagens'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ color: 'var(--color-text-dim)', padding: 6, borderRadius: 'var(--radius-sm)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 24, overflowY: 'auto' }}>
          {error && (
            <div style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              color: '#34d399',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 size={16} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isRegisterMode && (
              <>
                {/* Seleção de Categoria Profissional */}
                <div>
                  <label className="form-label">Categoria Profissional *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div 
                      className={`checkbox-card ${role === 'medico' ? 'checked' : ''}`}
                      onClick={() => setRole('medico')}
                      style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Stethoscope size={18} color={role === 'medico' ? '#0284c7' : 'var(--color-text-dim)'} />
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Médico (CRM)</span>
                    </div>

                    <div 
                      className={`checkbox-card ${role === 'enfermeiro' ? 'checked' : ''}`}
                      onClick={() => setRole('enfermeiro')}
                      style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Award size={18} color={role === 'enfermeiro' ? '#10b981' : 'var(--color-text-dim)'} />
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Enfermeiro (COREN)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={role === 'medico' ? 'Ex: Dr. Pedro Miranda' : 'Ex: Enf. Mariana Castro'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div>
                    <label className="form-label">
                      Número do {role === 'medico' ? 'CRM' : 'COREN'} *
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: 12345"
                      value={councilNumber}
                      onChange={(e) => setCouncilNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">UF do Conselho *</label>
                    <select 
                      className="form-select"
                      value={councilUf}
                      onChange={(e) => setCouncilUf(e.target.value)}
                    >
                      {BRAZILIAN_STATES.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Setor / Lotação Hospitalar</label>
                  <select 
                    className="form-select"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    <option value="Pronto Atendimento / Triagem">Pronto Atendimento / Triagem</option>
                    <option value="Time de Resposta Rápida (TRR)">Time de Resposta Rápida (TRR)</option>
                    <option value="UTI Geral / Infectologia">UTI Geral / Infectologia</option>
                    <option value="Enfermaria de Clínica Médica">Enfermaria de Clínica Médica</option>
                    <option value="SCIRAS / CCIH">SCIRAS / CCIH</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="form-label">E-mail Institucional *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="seu.nome@clementinofraga.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Senha de Acesso *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ marginTop: 6, padding: '12px' }}
            >
              {isRegisterMode ? 'Concluir Cadastro & Entrar' : 'Acessar Sistema'}
            </button>
          </form>

          {/* Alternar entre login e cadastro */}
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button 
              onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
              style={{ color: 'var(--color-primary-light)', fontSize: '0.85rem', fontWeight: 600 }}
            >
              {isRegisterMode 
                ? 'Já possui cadastro? Clique para Fazer Login' 
                : 'Novo profissional? Cadastre-se com CRM ou COREN'}
            </button>
          </div>

          {/* Perfis rápidos para demonstração */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--color-surface-border)'
          }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-text-dim)', marginBottom: 10, textAlign: 'center' }}>
              ⚡ Acesso Rápido de Demonstração (Equipe Hospitalar):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {demoUsers.slice(0, 2).map((user, idx) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => { loginAsDemo(idx); onClose(); }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '8px 10px', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: 700 }}>{user.name.split(' ')[0]} {user.name.split(' ')[1]}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)' }}>
                    {user.councilType}-{user.councilUf} ({user.role === 'medico' ? 'Médico TRR' : 'Enfermeiro'})
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
