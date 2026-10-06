import React, { useState } from 'react';
import { 
  X, 
  HeartPulse, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  User, 
  Droplet,
  Wind,
  Thermometer,
  Trash2
} from 'lucide-react';

export function evaluateVitalAlerts(vital) {
  const alerts = [];
  const pas = parseFloat(vital.pas);
  const pad = parseFloat(vital.pad);
  const pam = (pas && pad) ? Math.round((pas + 2 * pad) / 3) : null;
  const fc = parseFloat(vital.fc);
  const fr = parseFloat(vital.fr);
  const temp = parseFloat(vital.temp);
  const spo2 = parseFloat(vital.spo2);
  const glasgow = parseFloat(vital.glasgow);
  const diuresis = parseFloat(vital.diuresis);

  if (pas && pas < 90) alerts.push({ type: 'critical', text: `Hipotensão: PAS ${pas} mmHg (< 90)` });
  if (pam && pam < 65) alerts.push({ type: 'critical', text: `Hipotensão Perfusional: PAM ${pam} mmHg (< 65)` });
  if (fc && fc > 90) alerts.push({ type: 'warning', text: `Taquicardia: FC ${fc} bpm (> 90 - Critério SIRS)` });
  if (fr && fr > 20) alerts.push({ type: 'warning', text: `Taquipneia: FR ${fr} irpm (> 20 - Critério SIRS)` });
  if (temp && temp > 37.8) alerts.push({ type: 'warning', text: `Febre: ${temp}°C (> 37.8°C)` });
  if (temp && temp < 36.0) alerts.push({ type: 'critical', text: `Hipotermia: ${temp}°C (< 36.0°C - Gravidade)` });
  if (spo2 && spo2 < 92) alerts.push({ type: 'critical', text: `Hipoxemia: SpO2 ${spo2}% (< 92%)` });
  if (glasgow && glasgow < 15) alerts.push({ type: 'critical', text: `Rebaixamento de Consciência: Glasgow ${glasgow}/15` });
  if (diuresis && diuresis < 30) alerts.push({ type: 'warning', text: `Oligúria Horária: ${diuresis} mL/h` });

  return { alerts, pam };
}

export default function VitalSignsModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  const initialVitals = caseData.vitalSignsHistory || [
    {
      id: 'vs-1',
      date: defaultDate,
      time: '08:00',
      pas: '85',
      pad: '50',
      fc: '112',
      fr: '24',
      temp: '38.4',
      spo2: '90',
      o2Device: 'Cateter nasal de O2 a 3L/min',
      glasgow: '14',
      diuresis: '25',
      dva: 'Noradrenalina em desmame (0.05 mcg/kg/min)',
      nurseName: 'Enf. Juliana Ramos - COREN-PB 512.441',
      notes: 'Paciente taquidispneico na admissão com sonolência leve.'
    },
    {
      id: 'vs-2',
      date: defaultDate,
      time: '12:00',
      pas: '105',
      pad: '65',
      fc: '94',
      fr: '21',
      temp: '37.3',
      spo2: '95',
      o2Device: 'Cateter nasal 2L/min',
      glasgow: '15',
      diuresis: '45',
      dva: 'Sem DVA no momento',
      nurseName: 'Enf. Carla Mendes - COREN-PB 341.209',
      notes: 'Melhora da perfusão após término da expansão volêmica guiada.'
    }
  ];

  const [vitals, setVitals] = useState(initialVitals);
  const [isAdding, setIsAdding] = useState(false);

  // New vital form
  const [formDate, setFormDate] = useState(defaultDate);
  const [formTime, setFormTime] = useState(defaultTime);
  const [pas, setPas] = useState('');
  const [pad, setPad] = useState('');
  const [fc, setFc] = useState('');
  const [fr, setFr] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [o2Device, setO2Device] = useState('Ar ambiente');
  const [glasgow, setGlasgow] = useState('15');
  const [diuresis, setDiuresis] = useState('');
  const [dva, setDva] = useState('Não');
  const [nurseName, setNurseName] = useState('Enf. Plantonista - COREN-PB');
  const [notes, setNotes] = useState('');

  const liveAlerts = evaluateVitalAlerts({ pas, pad, fc, fr, temp, spo2, glasgow, diuresis });

  const handleAddVital = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `vs-${Date.now()}`,
      date: formDate,
      time: formTime,
      pas,
      pad,
      fc,
      fr,
      temp,
      spo2,
      o2Device,
      glasgow,
      diuresis,
      dva,
      nurseName,
      notes
    };

    const updated = [newEntry, ...vitals];
    setVitals(updated);
    setIsAdding(false);

    // Limpa campos
    setPas('');
    setPad('');
    setFc('');
    setFr('');
    setTemp('');
    setSpo2('');
  };

  const handleDelete = (id) => {
    setVitals(vitals.filter(v => v.id !== id));
  };

  const handleSave = () => {
    const updatedCase = {
      ...caseData,
      vitalSignsHistory: vitals,
      updatedAt: new Date().toISOString()
    };
    onSaveCase(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 1040, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
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
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
            }}>
              <HeartPulse size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Evolução de Sinais Vitais (Enfermagem)</h3>
                <span className="badge badge-danger">{caseData.medicalRecord}</span>
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
          
          {/* Top Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Registros de Sinais Vitais</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                Destaque automático de sinais de instabilidade, SIRS e disfunção hemodinâmica
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
                <span>Inserir Nova Aferição</span>
              </button>
            )}
          </div>

          {/* Form para Inserir Nova Aferição */}
          {isAdding && (
            <form onSubmit={handleAddVital} style={{
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
                  Aferição de Sinais Vitais Beira-Leito
                </strong>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>
                  Cancelar
                </button>
              </div>

              {/* Data e Hora */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Data de Inserção</label>
                  <input 
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hora da Aferição</label>
                  <input 
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
              </div>

              {/* Grid de Sinais */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>PA Sistólica (mmHg)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 85"
                    value={pas}
                    onChange={(e) => setPas(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>PA Diastólica (mmHg)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 50"
                    value={pad}
                    onChange={(e) => setPad(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>FC (bpm)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 110"
                    value={fc}
                    onChange={(e) => setFc(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>FR (irpm)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 24"
                    value={fr}
                    onChange={(e) => setFr(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Temp (°C)</label>
                  <input 
                    type="number"
                    step="0.1"
                    placeholder="Ex: 38.5"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>SpO2 (%)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 91"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Glasgow</label>
                  <input 
                    type="number"
                    min="3"
                    max="15"
                    value={glasgow}
                    onChange={(e) => setGlasgow(e.target.value)}
                    className="input-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Diurese (mL/h)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 20"
                    value={diuresis}
                    onChange={(e) => setDiuresis(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              {/* O2 e DVA */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Suporte de Oxigênio</label>
                  <input 
                    type="text"
                    placeholder="Ex: Ar ambiente, Cateter nasal 2L/min, Máscara não reinalante..."
                    value={o2Device}
                    onChange={(e) => setO2Device(e.target.value)}
                    className="input-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Drogas Vasoativas (DVA)</label>
                  <input 
                    type="text"
                    placeholder="Ex: Sem DVA / Noradrenalina 0.1 mcg/kg/min"
                    value={dva}
                    onChange={(e) => setDva(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              {/* Alertas em tempo real detectados no preenchimento */}
              {liveAlerts.alerts.length > 0 && (
                <div style={{
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #ef4444',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <strong style={{ fontSize: '0.82rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={15} />
                    <span>Sinais Vitais Alterados Detectados:</span>
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {liveAlerts.alerts.map((al, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: al.type === 'critical' ? '#ef4444' : '#f59e0b',
                        color: '#fff',
                        fontWeight: 700
                      }}>
                        {al.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Identificação do profissional */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Responsável da Enfermagem</label>
                  <input 
                    type="text"
                    placeholder="Nome e COREN"
                    value={nurseName}
                    onChange={(e) => setNurseName(e.target.value)}
                    className="input-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Observações / Condutas Imediatas</label>
                  <input 
                    type="text"
                    placeholder="Ex: Comunicado médico assistente sobre PAS < 90..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                <CheckCircle2 size={16} />
                <span>Salvar e Registrar Aferição</span>
              </button>
            </form>
          )}

          {/* Lista de Aferições Anteriores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vitals.map((v) => {
              const { alerts, pam } = evaluateVitalAlerts(v);
              const hasCritical = alerts.some(a => a.type === 'critical');

              return (
                <div 
                  key={v.id} 
                  style={{
                    background: 'var(--color-surface)',
                    border: `1px solid ${hasCritical ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-surface-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    boxShadow: hasCritical ? '0 0 12px rgba(239, 68, 68, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                        {v.date ? v.date.split('-').reverse().join('/') : ''} às {v.time}
                      </span>
                      {alerts.length > 0 ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: hasCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: hasCritical ? '#f87171' : '#fbbf24',
                          border: `1px solid ${hasCritical ? '#ef4444' : '#f59e0b'}`
                        }}>
                          <AlertTriangle size={12} />
                          <span>{alerts.length} Parâmetro(s) Alterado(s)</span>
                        </span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Sinais Estáveis</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>{v.nurseName}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDelete(v.id)}
                        style={{ color: 'var(--color-text-dim)', padding: 4 }}
                        title="Excluir aferição"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Grid de Parâmetros Medidos */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: 10,
                    marginBottom: 10
                  }}>
                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>PA (PAM)</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.pas && parseFloat(v.pas) < 90) ? '#f87171' : 'var(--color-text-main)' }}>
                        {v.pas}/{v.pad} {pam ? `(${pam})` : ''}
                      </strong>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>FC</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.fc && parseFloat(v.fc) > 90) ? '#fbbf24' : 'var(--color-text-main)' }}>
                        {v.fc} bpm
                      </strong>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>FR</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.fr && parseFloat(v.fr) > 20) ? '#fbbf24' : 'var(--color-text-main)' }}>
                        {v.fr} irpm
                      </strong>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>Temperatura</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.temp && parseFloat(v.temp) > 37.8) ? '#f87171' : 'var(--color-text-main)' }}>
                        {v.temp}°C
                      </strong>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>SpO2</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.spo2 && parseFloat(v.spo2) < 92) ? '#f87171' : 'var(--color-text-main)' }}>
                        {v.spo2}%
                      </strong>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>Glasgow</span>
                      <strong style={{ fontSize: '0.95rem', color: (v.glasgow && parseFloat(v.glasgow) < 15) ? '#f87171' : 'var(--color-text-main)' }}>
                        {v.glasgow}/15
                      </strong>
                    </div>

                    {v.diuresis && (
                      <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-subtle)', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', display: 'block' }}>Diurese</span>
                        <strong style={{ fontSize: '0.95rem', color: (parseFloat(v.diuresis) < 30) ? '#fbbf24' : 'var(--color-text-main)' }}>
                          {v.diuresis} mL/h
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Alertas textuais listados */}
                  {alerts.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {alerts.map((al, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: al.type === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: al.type === 'critical' ? '#f87171' : '#fbbf24'
                        }}>
                          • {al.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Informações complementares */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      {v.o2Device && <span>O2: <strong>{v.o2Device}</strong> </span>}
                      {v.dva && <span>• DVA: <strong>{v.dva}</strong></span>}
                    </div>
                    {v.notes && <div>Obs: <em>{v.notes}</em></div>}
                  </div>
                </div>
              );
            })}
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
            <span>Salvar Histórico de Sinais Vitais</span>
          </button>
        </div>
      </div>
    </div>
  );
}
