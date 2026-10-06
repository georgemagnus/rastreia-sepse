import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function AntibioticsUsageModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  // Calcula dias de uso a partir da data de implementação
  const calculateDaysOfUse = (startDateStr) => {
    if (!startDateStr) return 1;
    try {
      const start = new Date(startDateStr);
      const now = new Date();
      const diffMs = Math.max(0, now - start);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(1, days + 1); // Dia 1 no primeiro dia
    } catch {
      return 1;
    }
  };

  const initialUsage = caseData.antibioticsUsageRecord || {
    current: {
      name: caseData.telemetryAndExams?.antibioticPrescribed || 'Ceftriaxona 2g EV + Claritromicina 500mg EV',
      startDate: caseData.telemetryAndExams?.antibioticDateTime ? caseData.telemetryAndExams.antibioticDateTime.slice(0, 10) : new Date().toISOString().slice(0, 10),
      startTime: caseData.telemetryAndExams?.antibioticDateTime ? caseData.telemetryAndExams.antibioticDateTime.slice(11, 16) : '10:45',
      dosage: 'Ceftriaxona 2g EV 1x/dia + Claritromicina 500mg EV 12/12h',
      route: 'Endovenosa (EV)',
      infusionTime: 'Infusão lenta em 30-60 min',
      daysOfUse: calculateDaysOfUse(caseData.telemetryAndExams?.antibioticDateTime),
      indication: 'Pneumonia Adquirida na Comunidade Grave / Foco Pulmonar'
    },
    modifications: [
      {
        id: 'mod-1',
        date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10),
        time: '14:30',
        previousScheme: 'Ampicilina + Sulbactam 3g EV 6/6h',
        newScheme: 'Ceftriaxona 2g EV 24/24h + Claritromicina 500mg EV 12/12h',
        dosage: 'Ceftriaxona 2g EV 1x/dia + Claritromicina 500mg EV 12/12h',
        daysPlanned: 7,
        daysUsedBeforeSwitch: 1,
        reason: 'Escalonamento empírico por disfunção orgânica pulmonar com PaO2/FiO2 < 300',
        prescribedBy: 'Dr. Lucas Ferreira (CRM-PB 14.890)'
      }
    ]
  };

  const [current, setCurrent] = useState(initialUsage.current);
  const [modifications, setModifications] = useState(initialUsage.modifications || []);
  const [isAddingMod, setIsAddingMod] = useState(false);

  // New modification form states
  const [modDate, setModDate] = useState(new Date().toISOString().slice(0, 10));
  const [modTime, setModTime] = useState('12:00');
  const [modNewScheme, setModNewScheme] = useState('');
  const [modDosage, setModDosage] = useState('');
  const [modDaysPlanned, setModDaysPlanned] = useState(7);
  const [modReason, setModReason] = useState('Direcionamento por resultado de Antibiograma (TSA)');
  const [modDoctor, setModDoctor] = useState('Médico Assistente');

  const handleAddModification = (e) => {
    e.preventDefault();
    if (!modNewScheme) return;

    const newMod = {
      id: `mod-${Date.now()}`,
      date: modDate,
      time: modTime,
      previousScheme: current.name,
      newScheme: modNewScheme,
      dosage: modDosage || 'Conforme protocolo institucional',
      daysPlanned: modDaysPlanned,
      daysUsedBeforeSwitch: current.daysOfUse,
      reason: modReason,
      prescribedBy: modDoctor
    };

    // Atualiza o histórico e define o novo esquema como atual
    setModifications([newMod, ...modifications]);
    setCurrent({
      name: modNewScheme,
      startDate: modDate,
      startTime: modTime,
      dosage: modDosage || current.dosage,
      route: current.route,
      infusionTime: current.infusionTime,
      daysOfUse: 1,
      indication: `Modificado em ${modDate}: ${modReason}`
    });

    setIsAddingMod(false);
    setModNewScheme('');
    setModDosage('');
  };

  const handleSave = () => {
    const updatedCase = {
      ...caseData,
      antibioticsUsageRecord: {
        current,
        modifications,
        updatedAt: new Date().toISOString()
      },
      telemetryAndExams: {
        ...caseData.telemetryAndExams,
        antibioticPrescribed: current.name,
        antibioticDateTime: `${current.startDate}T${current.startTime}`
      }
    };

    onSaveCase(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 880, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}>
              <Pill size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Terapia Antimicrobiana & Modificações</h3>
                <span className="badge badge-success">{caseData.medicalRecord}</span>
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
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Card: Antimicrobiano Atual */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Esquema Antimicrobiano Atual em Uso
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: 4 }}>
                  {current.name}
                </h3>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>
                <Clock size={16} />
                <span>{current.daysOfUse}º Dia de Uso (D{current.daysOfUse})</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', display: 'block' }}>Data e Hora de Início:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>
                  {current.startDate ? current.startDate.split('-').reverse().join('/') : ''} às {current.startTime}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', display: 'block' }}>Posologia / Apresentação:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{current.dosage}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', display: 'block' }}>Via & Tempo de Infusão:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{current.route} • {current.infusionTime}</strong>
              </div>

              {current.indication && (
                <div>
                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', display: 'block' }}>Indicação Clínica:</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{current.indication}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botão de Abrir Nova Modificação */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={18} color="var(--color-primary-light)" />
              <span>Histórico de Modificações & Trocas de Esquema</span>
            </h4>

            {!isAddingMod && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddingMod(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={15} />
                <span>Adicionar Modificação / Troca de Antibiótico</span>
              </button>
            )}
          </div>

          {/* Formulário de Nova Modificação */}
          {isAddingMod && (
            <form onSubmit={handleAddModification} style={{
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
                  Registrar Alteração da Terapia Antimicrobiana
                </strong>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddingMod(false)}>
                  Cancelar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data da Modificação</label>
                  <input 
                    type="date"
                    value={modDate}
                    onChange={(e) => setModDate(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hora da Modificação</label>
                  <input 
                    type="time"
                    value={modTime}
                    onChange={(e) => setModTime(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Novo Antibiótico / Esquema Proposto</label>
                <input 
                  type="text"
                  placeholder="Ex: Cefepime 2g EV 8/8h (infusão estendida de 3h)"
                  value={modNewScheme}
                  onChange={(e) => setModNewScheme(e.target.value)}
                  className="input-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Posologia & Intervalo</label>
                  <input 
                    type="text"
                    placeholder="Ex: 2g EV a cada 8h por 7 dias"
                    value={modDosage}
                    onChange={(e) => setModDosage(e.target.value)}
                    className="input-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Dias de Uso Previstos</label>
                  <input 
                    type="number"
                    min="1"
                    max="28"
                    value={modDaysPlanned}
                    onChange={(e) => setModDaysPlanned(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Motivo da Modificação / Justificativa</label>
                <select 
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  className="input-control"
                >
                  <option value="Direcionamento por resultado de Antibiograma (TSA)">Direcionamento por Antibiograma (TSA - Sensibilidade)</option>
                  <option value="Falha terapêutica empírica / Piora de disfunção orgânica">Falha terapêutica empírica / Piora clínica</option>
                  <option value="Descalonamento antimicrobiano orientado por cultura">Descalonamento (Redução de espectro)</option>
                  <option value="Adequação posológica para Clearance de Creatinina / KDIGO">Ajuste de dose por Disfunção Renal (KDIGO)</option>
                  <option value="Parecer e autorização da CCIH / Infectologia">Parecer da CCIH / Germe Multirresistente</option>
                  <option value="Suspeita de reação adversa / Toxicidade medicamentosa">Toxicidade / Alergia / Efeito Adverso</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Médico Prescritor / CRM</label>
                <input 
                  type="text"
                  placeholder="Nome do médico e CRM"
                  value={modDoctor}
                  onChange={(e) => setModDoctor(e.target.value)}
                  className="input-control"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                <CheckCircle2 size={16} />
                <span>Confirmar Modificação e Atualizar Esquema</span>
              </button>
            </form>
          )}

          {/* Lista de Modificações / Linha do Tempo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {modifications && modifications.length > 0 ? (
              modifications.map((mod, idx) => (
                <div key={mod.id || idx} style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                        Modificação #{modifications.length - idx}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                        {mod.date ? mod.date.split('-').reverse().join('/') : ''} às {mod.time}
                      </strong>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                      Prescrito por: {mod.prescribedBy || 'Corpo Clínico'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    margin: '8px 0',
                    fontSize: '0.88rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ textDecoration: 'line-through', color: '#f87171' }}>
                      {mod.previousScheme}
                    </span>
                    <ArrowRight size={16} color="var(--color-primary-light)" />
                    <span style={{ fontWeight: 800, color: '#34d399' }}>
                      {mod.newScheme}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    <strong>Motivo:</strong> {mod.reason}
                  </div>
                  {mod.dosage && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                      Posologia: {mod.dosage} • Previsto para {mod.daysPlanned || 7} dias
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                Nenhuma modificação registrada até o momento. O esquema inicial permanece ativo.
              </div>
            )}
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
            <span>Salvar Histórico de Antibióticos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
