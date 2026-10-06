import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  FileText,
  Activity,
  Trash2
} from 'lucide-react';
import { useAuth } from '../services/authContext';

export default function MedicalEvolutionModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  const { currentUser } = useAuth();
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  const initialEvolutions = caseData.medicalEvolutionsList || [
    {
      id: 'med-evo-1',
      date: caseData.protocolOpening?.date || defaultDate,
      time: '11:00',
      doctorName: caseData.doctorSignature || 'Dr. Alexandre Nóbrega (CRM-PB 11.450)',
      statusImpression: caseData.status === 'choque_septico' ? 'Choque Séptico em Otimização Hemodinâmica' : 'Sepse Confirmada com Resposta Volêmica',
      sofaScore: 'SOFA estimado: 4 (Neurológico 1, Renal 1, Respiratório 2)',
      clinicalNotes: caseData.medicalNotes || 'Paciente admitido com quadro compatível com sepse grave. Realizada expansão volêmica imediata com cristaloide 30 ml/kg. Lactato inicial coletado e hemoculturas pareadas encaminhadas ao laboratório. Prescrito antimicrobiano conforme diretriz institucional da 1ª hora.',
      planAndConduct: '1. Manter PAM >= 65 mmHg;\n2. Controle gasométrico e dosagem de lactato em 2-4 horas para avaliar clareamento;\n3. Vigiar débito urinário horário (meta > 0.5 mL/kg/h);\n4. Reavaliação pelo TRR se persistir necessidade de vasopressor.'
    }
  ];

  const [evolutions, setEvolutions] = useState(initialEvolutions);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [doctorName, setDoctorName] = useState(currentUser?.name ? `${currentUser.name} (${currentUser.councilType || 'CRM'}-${currentUser.councilUf || 'PB'} ${currentUser.councilNumber || ''})` : 'Dr(a). Médico(a) Assistente');
  const [statusImpression, setStatusImpression] = useState('Em melhora clínica / Estável');
  const [sofaScore, setSofaScore] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [planAndConduct, setPlanAndConduct] = useState('');

  const handleAddEvolution = (e) => {
    e.preventDefault();
    if (!clinicalNotes) return;

    const newEvo = {
      id: `med-evo-${Date.now()}`,
      date,
      time,
      doctorName,
      statusImpression,
      sofaScore,
      clinicalNotes,
      planAndConduct
    };

    const updated = [newEvo, ...evolutions];
    setEvolutions(updated);
    setIsAdding(false);

    setClinicalNotes('');
    setPlanAndConduct('');
  };

  const handleDelete = (id) => {
    setEvolutions(evolutions.filter(e => e.id !== id));
  };

  const handleSave = () => {
    const updatedCase = {
      ...caseData,
      medicalEvolutionsList: evolutions,
      medicalNotes: evolutions[0]?.clinicalNotes || caseData.medicalNotes,
      updatedAt: new Date().toISOString()
    };
    onSaveCase(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 960, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
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
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
            }}>
              <Stethoscope size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Evoluções Médicas & Condutas Clínicas</h3>
                <span className="badge badge-info">{caseData.medicalRecord}</span>
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
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Registro de Visitas & Evoluções</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                Histórico temporal de impressões clínicas, respostas a bundles e planejamento terapêutico
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
                <span>Nova Evolução Médica</span>
              </button>
            )}
          </div>

          {/* Form de Nova Evolução */}
          {isAdding && (
            <form onSubmit={handleAddEvolution} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary-light)' }}>
                  Registrar Nova Evolução Clínica
                </strong>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>
                  Cancelar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data da Evolução</label>
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
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Médico Assistente / CRM</label>
                  <input 
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Impressão Clínica / Resposta Terapêutica</label>
                  <select 
                    value={statusImpression}
                    onChange={(e) => setStatusImpression(e.target.value)}
                    className="input-control"
                  >
                    <option value="Em melhora clínica / Estável">Em melhora clínica / Estável</option>
                    <option value="Choque Séptico em Otimização Hemodinâmica">Choque Séptico em Otimização Hemodinâmica</option>
                    <option value="Resposta satisfatória à expansão volêmica inicial">Resposta volêmica favorável (Respondedor)</option>
                    <option value="Hipotensão refratária / Necessidade de ajuste de DVA">Hipotensão refratária / Aumento de DVA</option>
                    <option value="Disfunção respiratória aguda / SDRA">Disfunção respiratória aguda / SDRA</option>
                    <option value="Piora de disfunção renal / Oligúria (KDIGO)">Piora de disfunção renal / Oligúria (KDIGO)</option>
                    <option value="Quadro infeccioso controlado / Descalonamento provável">Infecção controlada / Programar descalonamento</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Escore SOFA / Gravidade (Opcional)</label>
                  <input 
                    type="text"
                    placeholder="Ex: SOFA 4 (Neurológico 1, Respiratório 2, Renal 1)"
                    value={sofaScore}
                    onChange={(e) => setSofaScore(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Texto da Evolução Médica (Anamnese, Exame Físico Beira-Leito)</label>
                <textarea 
                  rows="4"
                  placeholder="Descreva o estado geral, parâmetros hemodinâmicos, ventilação, abdome, diurese, resposta aos antimicrobianos..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="input-control"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Plano Terapêutico & Condutas</label>
                <textarea 
                  rows="3"
                  placeholder="Metas de PAM, metas de lactato, antibióticos mantidos ou modificados, exames laboratoriais de controle solicitados..."
                  value={planAndConduct}
                  onChange={(e) => setPlanAndConduct(e.target.value)}
                  className="input-control"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                <CheckCircle2 size={16} />
                <span>Salvar e Assinar Evolução Médica</span>
              </button>
            </form>
          )}

          {/* Lista de Evoluções */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {evolutions.map((evo) => (
              <div key={evo.id} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: 18
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                        {evo.date ? evo.date.split('-').reverse().join('/') : ''} às {evo.time}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-light)' }}>
                        {evo.statusImpression}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                      Médico: <strong>{evo.doctorName}</strong>
                      {evo.sofaScore && <span> • {evo.sofaScore}</span>}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleDelete(evo.id)}
                    style={{ color: 'var(--color-text-dim)', padding: 4 }}
                    title="Excluir evolução"
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
                  marginBottom: 10
                }}>
                  {evo.clinicalNotes}
                </div>

                {evo.planAndConduct && (
                  <div style={{
                    padding: 10,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(2, 132, 199, 0.08)',
                    border: '1px solid rgba(2, 132, 199, 0.2)',
                    fontSize: '0.82rem',
                    lineHeight: 1.4,
                    color: 'var(--color-text-muted)'
                  }}>
                    <strong style={{ color: 'var(--color-primary-light)', display: 'block', marginBottom: 4 }}>
                      Condutas & Planejamento:
                    </strong>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{evo.planAndConduct}</div>
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
            <span>Salvar Evoluções Médicas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
