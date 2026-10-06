import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  HeartPulse, 
  Wind, 
  Activity, 
  Calculator, 
  CheckCircle2, 
  ChevronRight, 
  Flame, 
  ShieldAlert, 
  Droplet, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function CrisisProtocolsModal({ isOpen, onClose, initialTab = 'hemodynamic', currentPatient = null }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'hemodynamic' | 'respiratory' | 'renal'

  // KDIGO Calculator State
  const [baselineCreatinine, setBaselineCreatinine] = useState('1.0');
  const [currentCreatinine, setCurrentCreatinine] = useState(currentPatient?.organDysfunction?.creatinineDiuresis ? '2.4' : '1.8');
  const [urineOutputRate, setUrineOutputRate] = useState(currentPatient?.organDysfunction?.creatinineDiuresis ? '0.4' : '0.7'); // mL/kg/h
  const [urineDurationHours, setUrineDurationHours] = useState('8');
  const [patientWeight, setPatientWeight] = useState(currentPatient?.hemodynamicOptimization?.patientWeightKg || '70');

  if (!isOpen) return null;

  // Real-time KDIGO calculation
  const calculateKdigo = () => {
    const base = parseFloat(baselineCreatinine) || 1.0;
    const curr = parseFloat(currentCreatinine) || base;
    const ratio = curr / base;
    const diff = curr - base;
    const urineRate = parseFloat(urineOutputRate) || 1.0;
    const urineHours = parseFloat(urineDurationHours) || 0;

    let stage = 0;
    let reason = "Função renal preservada ou sem critérios atuais para LRA.";
    let alertClass = "badge-success";

    // Check Stage 3
    if (ratio >= 3.0 || curr >= 4.0 || (urineRate < 0.3 && urineHours >= 24) || (urineRate === 0 && urineHours >= 12)) {
      stage = 3;
      reason = "Estágio 3: Creatinina ≥ 3x o valor basal OU ≥ 4,0 mg/dL, ou oligúria grave sustentada (< 0,3 mL/kg/h por 24h). Alto risco de necessidade de diálise!";
      alertClass = "badge-danger";
    }
    // Check Stage 2
    else if (ratio >= 2.0 || (urineRate < 0.5 && urineHours >= 12)) {
      stage = 2;
      reason = "Estágio 2: Creatinina 2,0 a 2,9x o basal OU diurese < 0,5 mL/kg/h por ≥ 12 horas. Lesão renal aguda moderada.";
      alertClass = "badge-warning";
    }
    // Check Stage 1
    else if (diff >= 0.3 || ratio >= 1.5 || (urineRate < 0.5 && urineHours >= 6)) {
      stage = 1;
      reason = "Estágio 1: Aumento de Creatinina ≥ 0,3 mg/dL ou 1,5 a 1,9x basal, OU diurese < 0,5 mL/kg/h por 6 a 12 horas.";
      alertClass = "badge-warning";
    }

    return { stage, reason, alertClass, ratio: ratio.toFixed(1) };
  };

  const kdigo = calculateKdigo();
  const resuscitationVol = Math.round((parseFloat(patientWeight) || 70) * 30);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 960, height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}>
              <ShieldAlert size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-danger">SITUAÇÕES DE CRISE</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Condutas Imediatas em Complicações Críticas
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Protocolo Institucional PTI.001.00 • Manejo de Choque, Falência Respiratória e Renal
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab selection */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface)'
        }}>
          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('hemodynamic')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'hemodynamic' ? '3px solid #ef4444' : '3px solid transparent',
              color: activeTab === 'hemodynamic' ? '#f87171' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <HeartPulse size={18} />
            <span>1. Colapso Hemodinâmico / Choque</span>
          </button>

          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('respiratory')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'respiratory' ? '3px solid #38bdf8' : '3px solid transparent',
              color: activeTab === 'respiratory' ? '#38bdf8' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Wind size={18} />
            <span>2. Insuficiência Respiratória (SDRA)</span>
          </button>

          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('renal')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'renal' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'renal' ? '#fbbf24' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Droplet size={18} />
            <span>3. Insuficiência Renal Aguda (KDIGO)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* TAB 1: COLAPSO HEMODINÂMICO */}
          {activeTab === 'hemodynamic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px'
              }}>
                <h4 style={{ color: '#f87171', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} /> Definindo Choque Séptico: Hipotensão persistente com necessidade de DVA para manter PAM ≥ 65 mmHg e Lactato &gt; 2 µmol/dL apesar de ressuscitação volêmica adequada.
                </h4>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', marginTop: 6 }}>
                  <strong>Regra de Ouro:</strong> NÃO tolerar PAM abaixo de 65 mmHg por períodos superiores a 30-40 minutos! A isquemia tecidual e celular desencadeia disfunção de múltiplos órgãos rapidamente.
                </div>
              </div>

              {/* Linha de Conduta Passo a Passo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                
                {/* Passo 1: Volume */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-info">PASSO 1</span>
                    <strong style={{ fontSize: '0.9rem' }}>Expansão Volêmica Imediata</strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Infusão rápida de <strong>30 ml/Kg de Cristalóide</strong> (Ringer Lactato ou SF 0,9%) em 30 a 60 minutos.
                  </div>
                  <div style={{
                    marginTop: 10,
                    padding: 8,
                    background: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}>
                    💡 Para peso de {patientWeight} kg: Administrar <strong>{resuscitationVol} mL</strong> de cristaloide na 1ª hora.
                  </div>
                </div>

                {/* Passo 2: Noradrenalina */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-danger">PASSO 2</span>
                    <strong style={{ fontSize: '0.9rem', color: '#f87171' }}>Noradrenalina (1ª Escolha)</strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Iniciar vasopressor precocemente se PAM &lt; 65 mmHg persistir. Não esperar o término dos 30ml/kg se hipotensão for profunda.
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                    • Dose: 0,05 a 2,0 mcg/Kg/min em Bomba de Infusão Contínua.<br />
                    • Diluição: 4 ampolas (16mg) em 234 mL SG 5% (64 mcg/mL).
                  </div>
                </div>

                {/* Passo 3: Vasopressina */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-warning">PASSO 3</span>
                    <strong style={{ fontSize: '0.9rem' }}>Vasopressina Adjuvante</strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Adicionar Vasopressina com intuito de desmame ou poupar catecolaminas quando a dose de noradrenalina estiver em ascensão (&gt; 0,25 mcg/kg/min).
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                    • Dose fixa: <strong>0,03 a 0,04 UI/min</strong> (não titular).
                  </div>
                </div>

                {/* Passo 4: Dobutamina */}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-purple">PASSO 4</span>
                    <strong style={{ fontSize: '0.9rem' }}>Dobutamina (Inotrópico)</strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Indicada se houver evidência de disfunção miocárdica séptica, baixo débito cardíaco, livedo, oligúria refratária ou SvO2 &lt; 70%.
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                    • Dose: 2,5 a 20 mcg/Kg/min em BIC.
                  </div>
                </div>

              </div>

              {/* Metas Adicionais */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: 16
              }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, color: 'var(--color-primary-light)' }}>
                  Metas Perfusionais & Hemodinâmicas Complementares:
                </h5>
                <ul style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: 20 }}>
                  <li><strong>Pressão Arterial Invasiva (PAI):</strong> Monitorar em linha arterial contínua em UTI. Manguito não é confiável em altas doses de DVA.</li>
                  <li><strong>Clareamento de Lactato:</strong> Redosagem obrigatória em 2 a 4 horas com meta de queda &gt; 20% do valor inicial.</li>
                  <li><strong>Transfusão de Hemácias:</strong> Indicada se Hemoglobina &lt; 7,0 g/dL em pacientes com sinais de hipoperfusão tecidual (alvo Hb 7-8 g/dL).</li>
                  <li><strong>Corticosteroide:</strong> Hidrocortisona 200 mg/dia EV (50mg 6/6h) se choque refratário a altas doses de vasopressor.</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: INSUFICIÊNCIA RESPIRATÓRIA */}
          {activeTab === 'respiratory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px'
              }}>
                <h4 style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Wind size={18} /> Disfunção Respiratória / Síndrome do Desconforto Respiratório Agudo (SDRA) na Sepse
                </h4>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', marginTop: 6 }}>
                  Definida no protocolo por <strong>relação PaO2/FiO2 &lt; 300 mmHg</strong> ou necessidade crescente de oxigenoterapia para manter SpO2 &gt; 90%.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-light)', display: 'block', marginBottom: 6 }}>
                    Classificação de Berlim (SDRA):
                  </strong>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: 18 }}>
                    <li><strong>Leve:</strong> PaO2/FiO2 entre 201 e 300 mmHg com PEEP ≥ 5.</li>
                    <li><strong>Moderada:</strong> PaO2/FiO2 entre 101 e 200 mmHg com PEEP ≥ 5.</li>
                    <li><strong>Grave:</strong> PaO2/FiO2 ≤ 100 mmHg com PEEP ≥ 5.</li>
                  </ul>
                </div>

                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16
                }}>
                  <strong style={{ fontSize: '0.9rem', color: '#10b981', display: 'block', marginBottom: 6 }}>
                    Metas de Ventilação Protetora:
                  </strong>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: 18 }}>
                    <li>Volume Corrente baixo: <strong>4 a 6 mL/kg de peso predito</strong>.</li>
                    <li>Pressão de Platô: <strong>≤ 30 cmH2O</strong>.</li>
                    <li>Driving Pressure (Pressão de Distensão): <strong>≤ 15 cmH2O</strong>.</li>
                    <li>Posição Prona precoce (&gt; 16 horas/dia) se PaO2/FiO2 &lt; 150.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INSUFICIÊNCIA RENAL AGUDA (KDIGO) */}
          {activeTab === 'renal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px'
              }}>
                <h4 style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Droplet size={18} /> Classificação Internacional KDIGO para Lesão Renal Aguda (LRA) na Sepse
                </h4>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', marginTop: 6 }}>
                  A sepse é a principal causa de injúria renal aguda hospitalar. O estadiamento precoce previne sobrecarga volêmica, acidose refratária e toxicidade farmacológica.
                </div>
              </div>

              {/* Calculadora KDIGO */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Calculator size={18} color="var(--color-primary-light)" />
                  <strong style={{ fontSize: '0.92rem' }}>Calculadora e Estadiamento KDIGO:</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label className="form-label">Creatinina Basal (mg/dL)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-input" 
                      value={baselineCreatinine}
                      onChange={(e) => setBaselineCreatinine(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Creatinina Atual (mg/dL)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-input" 
                      value={currentCreatinine}
                      onChange={(e) => setCurrentCreatinine(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Débito Urinário (mL/Kg/h)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-input" 
                      value={urineOutputRate}
                      onChange={(e) => setUrineOutputRate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label">Duração da Oligúria (Horas)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={urineDurationHours}
                      onChange={(e) => setUrineDurationHours(e.target.value)}
                    />
                  </div>
                </div>

                {/* Resultado KDIGO */}
                <div style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: kdigo.stage === 3 ? 'rgba(239, 68, 68, 0.15)' : kdigo.stage >= 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${kdigo.stage === 3 ? '#ef4444' : kdigo.stage >= 1 ? '#f59e0b' : '#10b981'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: kdigo.stage === 3 ? '#f87171' : kdigo.stage >= 1 ? '#fbbf24' : '#34d399' }}>
                      {kdigo.stage === 0 ? 'Sem Critério de LRA KDIGO' : `KDIGO ESTÁGIO ${kdigo.stage}`}
                    </div>
                    <span className="badge badge-info">Elevação Cr: {kdigo.ratio}x basal</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                    {kdigo.reason}
                  </div>
                </div>

              </div>

              {/* Condutas por Estágio KDIGO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                
                <div style={{ padding: 14, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#fbbf24' }}>KDIGO 1 (Alerta Inicial)</strong>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 8, paddingLeft: 16, lineHeight: 1.5 }}>
                    <li>Sondagem vesical de demora para controle horário rigoroso.</li>
                    <li>Suspender nefrotóxicos (AINEs, aminoglicosídeos).</li>
                    <li>Adequar volemia (evitar tanto hipovolemia quanto sobrecarga).</li>
                  </ul>
                </div>

                <div style={{ padding: 14, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#f97316' }}>KDIGO 2 (Moderado)</strong>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 8, paddingLeft: 16, lineHeight: 1.5 }}>
                    <li>Ajustar dosagem de antibióticos com base no Clearance.</li>
                    <li>Monitorar eletrólitos (K+, gasometria).</li>
                    <li>Considerar avaliação nefrológica presencial.</li>
                  </ul>
                </div>

                <div style={{ padding: 14, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>KDIGO 3 (Crítico / TRS)</strong>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 8, paddingLeft: 16, lineHeight: 1.5 }}>
                    <li>Avaliar indicação urgente de Terapia Renal Substitutiva (Hemodiálise contínua ou intermitente).</li>
                    <li>Critérios clássicos: Hipercalemia refratária, Acidose pH &lt; 7,15, Edema agudo de pulmão hipervolêmico, Uremia sintomática.</li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
