import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  FileText, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ANTIBIOTIC_SCHEMES, checkAntibiogramMismatch } from '../data/antibioticsGuide';

export default function AntibioticGuideModal({ 
  isOpen, 
  onClose, 
  onSelectDrugForDetail,
  onApplySchemeToPatient = null,
  initialFocus = null,
  currentPatient = null
}) {
  const [selectedFocus, setSelectedFocus] = useState(initialFocus || "Foco Não Identificado");
  const [filterQuery, setFilterQuery] = useState('');

  // Antibiogram checking interactive tool
  const [testedAntibiotic, setTestedAntibiotic] = useState(currentPatient?.telemetryAndExams?.antibioticPrescribed || "Ceftriaxona 2g EV");
  const [testedPathogen, setTestedPathogen] = useState("Pseudomonas aeruginosa");
  const [testedResistances, setTestedResistances] = useState(["Ceftriaxona"]);

  if (!isOpen) return null;

  const currentScheme = ANTIBIOTIC_SCHEMES.find(s => s.foco === selectedFocus) || ANTIBIOTIC_SCHEMES[0];
  const mismatchResult = checkAntibiogramMismatch(testedAntibiotic, testedPathogen, testedResistances);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 1040, height: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Pill size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-success">GUIA TERAPÊUTICO CHCF</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Esquemas Antimicrobianos & Antibiograma
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Padronização Oficial PTI.001.00 (Págs. 10 e 11) • Bulas Clínicas & Checagem de Resistência
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left: Lista de Focos Infecciosos */}
          <aside style={{
            width: 310,
            borderRight: '1px solid var(--color-surface-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-surface-border)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Selecione o Foco Clínico:
              </div>
            </div>

            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ANTIBIOTIC_SCHEMES.map(s => (
                <button
                  key={s.foco}
                  onClick={() => setSelectedFocus(s.foco)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: selectedFocus === s.foco ? 'var(--color-primary-bg)' : 'transparent',
                    color: selectedFocus === s.foco ? 'var(--color-primary-light)' : 'var(--color-text-main)',
                    border: selectedFocus === s.foco ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span>{s.foco}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>
                    {s.drugs}
                  </span>
                </button>
              ))}
            </div>

            {/* Acesso rápido às Bulas */}
            <div style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid var(--color-surface-border)', background: 'var(--color-surface-subtle)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: 8, textTransform: 'uppercase' }}>
                📖 Bulas Técnicas Disponíveis:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Vancomicina', 'Meropenem', 'Ceftriaxona', 'Cefepime', 'Tazocin', 'Polimixina', 'Linezolida', 'Teicoplanina', 'Metronidazol', 'Azitromicina'].map(drug => (
                  <button
                    key={drug}
                    onClick={() => onSelectDrugForDetail(drug.toLowerCase())}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '3px 7px' }}
                  >
                    {drug}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right: Esquema Selecionado + Checagem de Antibiograma */}
          <main style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Box do Esquema Oficial */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 20,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span className="badge badge-info">{currentScheme.foco}</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: 4 }}>
                    {currentScheme.drugs}
                  </h4>
                </div>

                {onApplySchemeToPatient && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onApplySchemeToPatient(currentScheme.regimeText)}
                  >
                    <span>Aplicar este Esquema ao Paciente</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              <div style={{
                padding: 14,
                background: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border)',
                marginBottom: 12
              }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--color-primary-light)', display: 'block', marginBottom: 4 }}>
                  Posologia e Modo de Administração:
                </strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontWeight: 600 }}>
                  {currentScheme.regimeText}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, fontSize: '0.84rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-dim)', fontWeight: 700 }}>Critérios / Observações:</span>
                  <div style={{ color: 'var(--color-text-main)', marginTop: 2 }}>{currentScheme.observacoes}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-dim)', fontWeight: 700 }}>Espectro Alvo Principal:</span>
                  <div style={{ color: 'var(--color-text-main)', marginTop: 2 }}>{currentScheme.spectrum}</div>
                </div>
              </div>

              {/* Botões para abrir as bulas dos remédios do esquema */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-surface-border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                  Consultar Bula dos Fármacos Deste Esquema:
                </span>
                {currentScheme.recommendedMeds.map(m => (
                  <button
                    key={m}
                    onClick={() => onSelectDrugForDetail(m)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '4px 10px', textTransform: 'capitalize' }}
                  >
                    <FileText size={13} color="var(--color-primary-light)" />
                    <span>Bula {m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alerta & Auditoria de Antibiograma */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <ShieldAlert size={20} color="#f59e0b" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                  Auditoria de Compatibilidade de Antibiograma
                </h4>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: 14 }}>
                Insira o antibiótico em uso e o germe isolado na cultura para detectar discordâncias microbiológicas e falha terapêutica precoce.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="form-label">Antibiótico em Uso pelo Paciente:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={testedAntibiotic}
                    onChange={(e) => setTestedAntibiotic(e.target.value)}
                    placeholder="Ex: Ceftriaxona 2g EV"
                  />
                </div>

                <div>
                  <label className="form-label">Microrganismo Isolado na Cultura:</label>
                  <select 
                    className="form-select"
                    value={testedPathogen}
                    onChange={(e) => {
                      setTestedPathogen(e.target.value);
                      if (e.target.value.includes("MRSA")) setTestedResistances(["Oxacilina"]);
                      else if (e.target.value.includes("Pseudomonas")) setTestedResistances(["Ceftriaxona"]);
                      else if (e.target.value.includes("ESBL")) setTestedResistances(["Ceftriaxona", "Cefepime"]);
                      else if (e.target.value.includes("KPC")) setTestedResistances(["Meropenem", "Carbapenêmicos"]);
                      else setTestedResistances([]);
                    }}
                  >
                    <option value="Pseudomonas aeruginosa">Pseudomonas aeruginosa</option>
                    <option value="Staphylococcus aureus (MRSA)">Staphylococcus aureus (MRSA)</option>
                    <option value="Klebsiella pneumoniae (ESBL)">Klebsiella pneumoniae (ESBL)</option>
                    <option value="Klebsiella pneumoniae (KPC / Carbapenemase)">Klebsiella pneumoniae (KPC)</option>
                    <option value="Acinetobacter baumannii MDR">Acinetobacter baumannii MDR</option>
                    <option value="Escherichia coli multissensível">Escherichia coli multissensível</option>
                    <option value="Streptococcus pneumoniae">Streptococcus pneumoniae</option>
                  </select>
                </div>
              </div>

              {/* Resultado da Checagem */}
              {mismatchResult.hasMismatch ? (
                <div style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontWeight: 800, fontSize: '0.92rem' }}>
                    <AlertTriangle size={18} />
                    <span>ALERTA CRÍTICO: ANTIBIOGRAMA INCOMPATÍVEL COM ESQUEMA ATUAL!</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', marginTop: 8 }}>
                    <strong>Isolado:</strong> {mismatchResult.mismatchDetails.pathogen}<br />
                    <strong>Motivo da Incompatibilidade:</strong> {mismatchResult.mismatchDetails.reason}
                  </div>
                  <div style={{
                    marginTop: 10,
                    padding: 10,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontSize: '0.84rem',
                    color: '#fca5a5'
                  }}>
                    💡 <strong>Conduta Recomendada pela CCIH:</strong> {mismatchResult.mismatchDetails.recommendation}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                    Esquema compatível ou sem resistência detectada para o isolado selecionado.
                  </div>
                </div>
              )}

            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
