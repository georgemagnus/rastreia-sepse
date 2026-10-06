import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../services/authContext';

export default function CcihEvolutionModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  const { currentUser } = useAuth();
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  const initialEvolutions = caseData.ccihEvolutionsList || [
    {
      id: 'ccih-1',
      date: caseData.sciras?.assessmentDate || defaultDate,
      time: '14:30',
      professional: caseData.sciras?.scirasDoctorSignature || 'Dra. Patrícia Albuquerque (CRM-PB 9.870 - CCIH)',
      requestReason: 'Avaliação de Antimicrobiano de Uso Restrito & Foco Infeccioso',
      evolutionText: caseData.sciras?.scirasEvolution || 'Parecer inicial da CCIH: Paciente admitido com Sepse comunitária grave. Esquema antimicrobiano prescrito de acordo com protocolo institucional. Solicitado vigilância de hemoculturas e reavaliação em 48-72h para programação de descalonamento. Instituída precaução padrão.',
      isolationType: 'Precaução Padrão',
      status: 'Aprovado / Em Acompanhamento',
      recommendations: 'Revisar tempo de antimicrobiano com 7 dias; manter culturas vigiadas.'
    }
  ];

  const [evolutions, setEvolutions] = useState(initialEvolutions);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [professional, setProfessional] = useState(currentUser?.name ? `${currentUser.name} (${currentUser.councilType || 'CRM'}-${currentUser.councilUf || 'PB'} ${currentUser.councilNumber || ''} - CCIH)` : 'Médico(a) Infectologista / CCIH');
  const [requestReason, setRequestReason] = useState('Avaliação de Antimicrobiano de Uso Restrito');
  const [isolationType, setIsolationType] = useState('Precaução Padrão');
  const [evolutionText, setEvolutionText] = useState('');
  const [status, setStatus] = useState('Aprovado / Em Acompanhamento');
  const [recommendations, setRecommendations] = useState('');

  const handleAddEvolution = (e) => {
    e.preventDefault();
    if (!evolutionText) return;

    const newEntry = {
      id: `ccih-${Date.now()}`,
      date,
      time,
      professional,
      requestReason,
      isolationType,
      evolutionText,
      status,
      recommendations
    };

    const updated = [newEntry, ...evolutions];
    setEvolutions(updated);
    setIsAdding(false);

    setEvolutionText('');
    setRecommendations('');
  };

  const handleDelete = (id) => {
    setEvolutions(evolutions.filter(e => e.id !== id));
  };

  const handleSave = () => {
    const updatedCase = {
      ...caseData,
      ccihEvolutionsList: evolutions,
      sciras: {
        ...caseData.sciras,
        scirasEvolution: evolutions[0]?.evolutionText || caseData.sciras?.scirasEvolution,
        scirasDoctorSignature: evolutions[0]?.professional || caseData.sciras?.scirasDoctorSignature
      },
      updatedAt: new Date().toISOString()
    };

    onSaveCase(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 980, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Evolução & Pareceres da CCIH / SCIRAS</h3>
                <span className="badge badge-purple">{caseData.medicalRecord}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Paciente: <strong>{caseData.patientName}</strong> • {caseData.bed}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Tabela de Evoluções e Pareceres Solicitados</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                Auditoria de antimicrobianos, validação de bundles, vigilância de germes multirresistentes e precauções
              </p>
            </div>

            {!isAdding && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setIsAdding(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={16} />
                <span>Novo Parecer da CCIH</span>
              </button>
            )}
          </div>

          {/* Form de Novo Parecer */}
          {isAdding && (
            <form onSubmit={handleAddEvolution} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-purple)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#c084fc' }}>
                  Registrar Parecer da CCIH / Gestão de Antimicrobianos
                </strong>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>
                  Cancelar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data do Parecer</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hora</label>
                  <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Profissional da CCIH / CRM</label>
                  <input 
                    type="text"
                    value={professional}
                    onChange={(e) => setProfessional(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Motivo da Interconsulta</label>
                  <select 
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="input-control"
                  >
                    <option value="Avaliação de Antimicrobiano de Uso Restrito">Liberação de ATB de Uso Restrito</option>
                    <option value="Adequação por Antibiograma (TSA)">Adequação por Cultura / Antibiograma</option>
                    <option value="Descalonamento Terapêutico">Descalonamento Terapêutico</option>
                    <option value="Suspeita de Infecção Associada aos Cuidados (IRAS)">Investigação de IRAS / Foco</option>
                    <option value="Manejo de Microrganismo Multirresistente">Germe Multirresistente (MDR / KPC)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Tipo de Precaução Instituída</label>
                  <select 
                    value={isolationType}
                    onChange={(e) => setIsolationType(e.target.value)}
                    className="input-control"
                  >
                    <option value="Precaução Padrão">Precaução Padrão</option>
                    <option value="Precaução de Contato">Precaução de Contato</option>
                    <option value="Precaução por Gotículas">Precaução por Gotículas</option>
                    <option value="Precaução por Aerossóis">Precaução por Aerossóis</option>
                    <option value="Contato + Gotículas">Contato + Gotículas</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status do Parecer</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-control"
                  >
                    <option value="Aprovado / Em Acompanhamento">Aprovado / Em Acompanhamento</option>
                    <option value="Ajuste Posológico Recomendado">Ajuste Posológico Recomendado</option>
                    <option value="Descalonamento Solicitado">Descalonamento Solicitado</option>
                    <option value="Troca Imediata Indicada">Troca Imediata Indicada</option>
                    <option value="Quadro Afastado da Sepse">Quadro Afastado da Sepse</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Texto da Evolução / Parecer Técnico da CCIH</label>
                <textarea 
                  rows="4"
                  placeholder="Relatório detalhado da comissão: avaliação de foco infeccioso, adequação de espectro, justificativa para liberação ou troca de antimicrobianos..."
                  value={evolutionText}
                  onChange={(e) => setEvolutionText(e.target.value)}
                  className="input-control"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Recomendações e Prazo de Reavaliação</label>
                <input 
                  type="text"
                  placeholder="Ex: Reavaliação em 72h com resultado final da urocultura; manter vigilância."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="input-control"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                <CheckCircle2 size={16} />
                <span>Salvar Parecer da CCIH</span>
              </button>
            </form>
          )}

          {/* Tabela e Linha do Tempo dos Pareceres */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {evolutions.map((item) => (
              <div key={item.id} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: 18
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
                        {item.date ? item.date.split('-').reverse().join('/') : ''} às {item.time}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                        {item.isolationType}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc' }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                      Profissional: <strong>{item.professional}</strong> • Motivo: <em>{item.requestReason}</em>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleDelete(item.id)}
                    style={{ color: 'var(--color-text-dim)', padding: 4 }}
                    title="Excluir parecer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-surface-border)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text-main)',
                  whiteSpace: 'pre-wrap',
                  marginBottom: 8
                }}>
                  {item.evolutionText}
                </div>

                {item.recommendations && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    <strong>Recomendações:</strong> {item.recommendations}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}
          >
            <Save size={18} />
            <span>Salvar Evoluções da CCIH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
