import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Microscope,
  ShieldAlert,
  Edit2
} from 'lucide-react';

const COMMON_SITES = [
  'Hemocultura - 1º Par (Veia Periférica D)',
  'Hemocultura - 2º Par (Veia Periférica E)',
  'Hemocultura - Cateter Venoso Central (CVC)',
  'Urocultura (Jato Médio / Sonda Vesical)',
  'Aspirado Traqueal / Lavado Bronco-Alveolar',
  'Líquido Cefalorraquidiano (LCR)',
  'Secreção Peritoneal / Cirúrgica',
  'Ponta de Cateter Venoso Central',
  'Líquido Pleural',
  'Swab Retal (Vigilância CCIH)',
  'Outro Sítio / Tecido'
];

const COMMON_PATHOGENS = [
  'Pseudomonas aeruginosa',
  'Klebsiella pneumoniae (KPC / BLEE)',
  'Staphylococcus aureus (MRSA)',
  'Staphylococcus aureus (MSSA)',
  'Escherichia coli (BLEE)',
  'Acinetobacter baumannii (MDR)',
  'Enterococcus faecalis (VRE)',
  'Enterococcus faecium',
  'Streptococcus pneumoniae',
  'Candida albicans',
  'Candida auris',
  'Burkholderia cepacia',
  'Stenotrophomonas maltophilia',
  'Negativo / Sem crescimento bacteriano'
];

const ANTIMICROBIAL_LIST = [
  'Amicacina',
  'Ampicilina + Sulbactam',
  'Cefazolina',
  'Ceftriaxona',
  'Cefepime',
  'Ceftazidima',
  'Ceftazidima + Avibactam',
  'Ciprofloxacino',
  'Clindamicina',
  'Colistina / Polimixina B',
  'Daptomicina',
  'Gentamicina',
  'Levofloxacino',
  'Linezolida',
  'Meropenem',
  'Oxacilina',
  'Piperacilina + Tazobactam',
  'Sulfametoxazol + Trimetoprima',
  'Tigeciclina',
  'Vancomicina'
];

export default function CulturesModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  const initialCultures = caseData.culturesList || [
    {
      id: 'cult-1',
      date: caseData.telemetryAndExams?.bloodCultureDateTime?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      time: '10:30',
      site: 'Hemocultura - 1º Par (Veia Periférica D)',
      result: caseData.telemetryAndExams?.isolatedPathogen ? 'Positiva' : 'Em andamento',
      pathogen: caseData.telemetryAndExams?.isolatedPathogen || 'Pseudomonas aeruginosa',
      tsa: [
        { antibiotic: 'Ceftriaxona', status: 'R', mic: '>= 64' },
        { antibiotic: 'Cefepime', status: 'S', mic: '<= 2' },
        { antibiotic: 'Meropenem', status: 'S', mic: '<= 0.5' },
        { antibiotic: 'Piperacilina + Tazobactam', status: 'S', mic: '<= 8' },
        { antibiotic: 'Amicacina', status: 'S', mic: '<= 4' },
        { antibiotic: 'Ciprofloxacino', status: 'R', mic: '>= 4' }
      ],
      notes: 'Coleta realizada antes da infusão de antimicrobiano conforme protocolo da 1ª hora.'
    },
    {
      id: 'cult-2',
      date: caseData.telemetryAndExams?.bloodCultureDateTime?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      time: '10:35',
      site: 'Hemocultura - 2º Par (Veia Periférica E)',
      result: 'Positiva',
      pathogen: 'Pseudomonas aeruginosa',
      tsa: [
        { antibiotic: 'Ceftriaxona', status: 'R', mic: '>= 64' },
        { antibiotic: 'Cefepime', status: 'S', mic: '<= 2' },
        { antibiotic: 'Meropenem', status: 'S', mic: '<= 0.5' }
      ],
      notes: 'Confirmação do 1º par com o mesmo perfil fenotípico.'
    },
    {
      id: 'cult-3',
      date: caseData.telemetryAndExams?.urineCultureDateTime?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      time: '10:45',
      site: 'Urocultura (Jato Médio / Sonda Vesical)',
      result: 'Negativa',
      pathogen: 'Sem crescimento bacteriano significativo',
      tsa: [],
      notes: 'Urocultura sem bacteriúria após 48h de incubação.'
    }
  ];

  const [cultures, setCultures] = useState(initialCultures);
  const [selectedCultureId, setSelectedCultureId] = useState(initialCultures[0]?.id || null);

  // New culture modal form states
  const [isAdding, setIsAdding] = useState(false);
  const [newSite, setNewSite] = useState(COMMON_SITES[0]);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState('11:00');
  const [newResult, setNewResult] = useState('Em andamento');
  const [newPathogen, setNewPathogen] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Antibiograma item adding
  const [newAtbName, setNewAtbName] = useState(ANTIMICROBIAL_LIST[0]);
  const [newAtbStatus, setNewAtbStatus] = useState('S'); // S, I, R
  const [newAtbMic, setNewAtbMic] = useState('');

  const selectedCulture = cultures.find(c => c.id === selectedCultureId) || cultures[0];

  // Identifica incompatibilidade com o antimicrobiano que o paciente está usando
  const currentAtbPrescribed = caseData.telemetryAndExams?.antibioticPrescribed || '';
  const isAtbInConflict = (atbName, status) => {
    if (status !== 'R') return false;
    if (!currentAtbPrescribed) return false;
    return currentAtbPrescribed.toLowerCase().includes(atbName.toLowerCase());
  };

  const handleAddCulture = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `cult-${Date.now()}`,
      date: newDate,
      time: newTime,
      site: newSite,
      result: newResult,
      pathogen: newResult === 'Positiva' ? (newPathogen || 'Patógeno em identificação') : (newResult === 'Negativa' ? 'Sem crescimento' : 'Aguardando bacterioscopia'),
      tsa: [],
      notes: newNotes
    };

    const updated = [newEntry, ...cultures];
    setCultures(updated);
    setSelectedCultureId(newEntry.id);
    setIsAdding(false);
  };

  const handleDeleteCulture = (id) => {
    const updated = cultures.filter(c => c.id !== id);
    setCultures(updated);
    if (selectedCultureId === id && updated.length > 0) {
      setSelectedCultureId(updated[0].id);
    }
  };

  const handleAddTsaItem = () => {
    if (!selectedCultureId) return;
    const item = {
      antibiotic: newAtbName,
      status: newAtbStatus,
      mic: newAtbMic || '-'
    };

    const updated = cultures.map(c => {
      if (c.id === selectedCultureId) {
        const existingIndex = (c.tsa || []).findIndex(t => t.antibiotic === newAtbName);
        let newTsa;
        if (existingIndex >= 0) {
          newTsa = [...c.tsa];
          newTsa[existingIndex] = item;
        } else {
          newTsa = [...(c.tsa || []), item];
        }
        return { ...c, tsa: newTsa };
      }
      return c;
    });

    setCultures(updated);
    setNewAtbMic('');
  };

  const handleRemoveTsaItem = (antibioticName) => {
    const updated = cultures.map(c => {
      if (c.id === selectedCultureId) {
        return { ...c, tsa: (c.tsa || []).filter(t => t.antibiotic !== antibioticName) };
      }
      return c;
    });
    setCultures(updated);
  };

  const handleSave = () => {
    // Coleta todas as resistências documentadas para sincronizar no caseData
    const allResistances = [];
    cultures.forEach(c => {
      (c.tsa || []).forEach(t => {
        if (t.status === 'R' && !allResistances.includes(t.antibiotic)) {
          allResistances.push(t.antibiotic);
        }
      });
    });

    const positiveCultures = cultures.filter(c => c.result === 'Positiva');
    const firstPathogen = positiveCultures[0]?.pathogen || caseData.telemetryAndExams?.isolatedPathogen;

    const updatedCase = {
      ...caseData,
      culturesList: cultures,
      telemetryAndExams: {
        ...caseData.telemetryAndExams,
        bloodCulture: cultures.some(c => c.site.toLowerCase().includes('hemocultura')),
        isolatedPathogen: firstPathogen,
        antibiogramResistance: allResistances
      }
    };

    onSaveCase(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 1060, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
            }}>
              <Microscope size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Culturas & Antibiograma (TSA)</h3>
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

        {/* Antimicrobial Current Alert Banner */}
        {currentAtbPrescribed && (
          <div style={{
            padding: '10px 24px',
            background: 'rgba(2, 132, 199, 0.08)',
            borderBottom: '1px solid rgba(2, 132, 199, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            flexShrink: 0
          }}>
            <div>
              <span style={{ color: 'var(--color-text-dim)' }}>Antibiótico Ativo em Uso: </span>
              <strong style={{ color: 'var(--color-primary-light)' }}>{currentAtbPrescribed}</strong>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
              Alerta de incompatibilidade ativo contra resistência (R) identificada no TSA
            </div>
          </div>
        )}

        {/* Content Layout: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Coluna 1: Lista de Culturas */}
          <div style={{
            borderRight: '1px solid var(--color-surface-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
                Culturas Coletadas ({cultures.length})
              </span>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setIsAdding(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                <Plus size={14} />
                <span>Nova Cultura</span>
              </button>
            </div>

            {/* List */}
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
              {cultures.map((cult) => {
                const isSelected = cult.id === selectedCultureId;
                const isPos = cult.result === 'Positiva';
                const hasConflict = cult.tsa?.some(t => isAtbInConflict(t.antibiotic, t.status));

                return (
                  <div
                    key={cult.id}
                    onClick={() => { setSelectedCultureId(cult.id); setIsAdding(false); }}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface-subtle)',
                      border: `1px solid ${isSelected ? 'var(--color-primary-light)' : 'var(--color-surface-border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: isPos ? 'rgba(239, 68, 68, 0.15)' : cult.result === 'Negativa' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isPos ? '#f87171' : cult.result === 'Negativa' ? '#34d399' : '#fbbf24'
                      }}>
                        {cult.result.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
                        {cult.date ? cult.date.split('-').reverse().join('/') : ''} {cult.time}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                      {cult.site}
                    </div>

                    {isPos && (
                      <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: 4, fontWeight: 600 }}>
                        🔬 {cult.pathogen}
                      </div>
                    )}

                    {hasConflict && (
                      <div style={{ 
                        marginTop: 6, 
                        fontSize: '0.7rem', 
                        color: '#f87171', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4 
                      }}>
                        <AlertTriangle size={12} />
                        <span>Resistência ao ATB em uso!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: Detalhes & Antibiograma */}
          <div style={{ padding: 20, overflowY: 'auto', background: 'var(--color-surface-subtle)' }}>
            
            {/* Modo de Criação de Nova Cultura */}
            {isAdding ? (
              <form onSubmit={handleAddCulture} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Registrar Nova Cultura</h4>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>
                    Cancelar
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data da Coleta</label>
                    <input 
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="input-control"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hora da Coleta</label>
                    <input 
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="input-control"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sítio de Coleta</label>
                  <select 
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    className="input-control"
                  >
                    {COMMON_SITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status do Resultado</label>
                  <select 
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    className="input-control"
                  >
                    <option value="Em andamento">Em andamento (Incubação)</option>
                    <option value="Positiva">Positiva (Isolamento de Microrganismo)</option>
                    <option value="Negativa">Negativa (Sem crescimento)</option>
                  </select>
                </div>

                {newResult === 'Positiva' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Patógeno Isolado</label>
                    <select 
                      value={newPathogen}
                      onChange={(e) => setNewPathogen(e.target.value)}
                      className="input-control"
                    >
                      <option value="">Selecione o microrganismo ou digite abaixo</option>
                      {COMMON_PATHOGENS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Observações da Coleta / Laboratório</label>
                  <textarea 
                    rows="2"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Informações adicionais, frascos aeróbio/anaeróbio..."
                    className="input-control"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                  <Plus size={16} />
                  <span>Salvar Nova Cultura</span>
                </button>
              </form>
            ) : selectedCulture ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Header da cultura selecionada */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className={`badge ${selectedCulture.result === 'Positiva' ? 'badge-danger' : selectedCulture.result === 'Negativa' ? 'badge-success' : 'badge-warning'}`}>
                        {selectedCulture.result}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                        Coletado em: {selectedCulture.date} às {selectedCulture.time}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedCulture.site}</h3>
                    {selectedCulture.result === 'Positiva' && (
                      <div style={{ fontSize: '0.92rem', color: '#f87171', fontWeight: 700, marginTop: 4 }}>
                        Agente Isolado: <em>{selectedCulture.pathogen}</em>
                      </div>
                    )}
                    {selectedCulture.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                        {selectedCulture.notes}
                      </p>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleDeleteCulture(selectedCulture.id)}
                    style={{ color: 'var(--color-text-dim)', padding: 6 }}
                    title="Excluir cultura"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Seção Antibiograma (TSA) */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Perfil de Sensibilidade aos Antimicrobianos (TSA)</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Interpretação EUCAST / BrCAST</p>
                    </div>
                  </div>

                  {/* Tabela do TSA */}
                  {selectedCulture.tsa && selectedCulture.tsa.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: 16 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-dim)', fontSize: '0.75rem', textAlign: 'left' }}>
                          <th style={{ padding: '8px 10px' }}>Antimicrobiano</th>
                          <th style={{ padding: '8px 10px' }}>Sensibilidade</th>
                          <th style={{ padding: '8px 10px' }}>MIC</th>
                          <th style={{ padding: '8px 10px' }}>Impacto Terapêutico</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCulture.tsa.map((tsaItem, idx) => {
                          const conflict = isAtbInConflict(tsaItem.antibiotic, tsaItem.status);
                          return (
                            <tr 
                              key={idx} 
                              style={{ 
                                borderBottom: '1px solid var(--color-surface-border)',
                                background: conflict ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                              }}
                            >
                              <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                                {tsaItem.antibiotic}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  background: tsaItem.status === 'S' ? 'rgba(16, 185, 129, 0.2)' : tsaItem.status === 'R' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                  color: tsaItem.status === 'S' ? '#34d399' : tsaItem.status === 'R' ? '#f87171' : '#fbbf24'
                                }}>
                                  {tsaItem.status === 'S' ? 'Sensível (S)' : tsaItem.status === 'R' ? 'Resistente (R)' : 'Intermediário (I)'}
                                </span>
                              </td>
                              <td style={{ padding: '8px 10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {tsaItem.mic}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                {conflict ? (
                                  <span style={{ color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <AlertTriangle size={13} />
                                    <span>Em uso com resistência!</span>
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>
                                    {tsaItem.status === 'S' ? 'Opção viável' : 'Inadequado'}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveTsaItem(tsaItem.antibiotic)}
                                  style={{ color: '#f87171', padding: 2 }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '14px', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.84rem' }}>
                      Nenhum teste de sensibilidade cadastrado para esta cultura ainda.
                    </div>
                  )}

                  {/* Adicionar Antimicrobiano ao TSA */}
                  <div style={{
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-surface-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap'
                  }}>
                    <select 
                      value={newAtbName}
                      onChange={(e) => setNewAtbName(e.target.value)}
                      className="input-control"
                      style={{ flex: 1, minWidth: 160 }}
                    >
                      {ANTIMICROBIAL_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <select 
                      value={newAtbStatus}
                      onChange={(e) => setNewAtbStatus(e.target.value)}
                      className="input-control"
                      style={{ width: 140 }}
                    >
                      <option value="S">Sensível (S)</option>
                      <option value="R">Resistente (R)</option>
                      <option value="I">Intermediário (I)</option>
                    </select>

                    <input 
                      type="text"
                      placeholder="MIC (Ex: <= 2)"
                      value={newAtbMic}
                      onChange={(e) => setNewAtbMic(e.target.value)}
                      className="input-control"
                      style={{ width: 110 }}
                    />

                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddTsaItem}
                    >
                      <Plus size={15} />
                      <span>Adicionar ao TSA</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-dim)', marginTop: 40 }}>
                Nenhuma cultura selecionada.
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
            <span>Salvar e Atualizar Culturas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
