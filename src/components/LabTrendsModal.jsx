import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  Droplet,
  FlaskConical,
  Clock
} from 'lucide-react';

export default function LabTrendsModal({ isOpen, onClose, caseData }) {
  if (!isOpen || !caseData) return null;

  // Monta histórico de exames laboratoriais a partir dos dados do caso ou de série temporal simulada consistente
  const initialHistory = caseData.labHistorySeries || [
    {
      day: 'D0 (Admissão)',
      date: caseData.protocolOpening?.date || '2026-10-04',
      leukocytes: 18400,
      platelets: 140000,
      lactate: 3.4,
      pcr: 160,
      creatinine: 2.1,
      bilirubin: 1.8,
      ph: 7.28
    },
    {
      day: 'D0 (+6h)',
      date: caseData.protocolOpening?.date || '2026-10-04',
      leukocytes: 17200,
      platelets: 135000,
      lactate: 2.2, // Clareamento de lactato em 6h
      pcr: 155,
      creatinine: 1.9,
      bilirubin: 1.7,
      ph: 7.33
    },
    {
      day: 'D1 (24h)',
      date: '2026-10-05',
      leukocytes: 14100,
      platelets: 155000,
      lactate: 1.6, // Normalizado
      pcr: 110,
      creatinine: 1.4,
      bilirubin: 1.3,
      ph: 7.38
    },
    {
      day: 'D2 (Hoje)',
      date: '2026-10-06',
      leukocytes: 11200,
      platelets: 180000,
      lactate: 1.2,
      pcr: 65,
      creatinine: 1.1,
      bilirubin: 0.9,
      ph: 7.41
    }
  ];

  const [activeExam, setActiveExam] = useState('lactate');

  const EXAM_CONFIGS = {
    lactate: {
      label: 'Lactato Sérico / Gasométrico',
      unit: 'mmol/L',
      refMin: 0.5,
      refMax: 2.0,
      critical: 4.0,
      lowerIsBetter: true,
      description: 'Marcador essencial de hipoperfusão celular e choque. A redução >= 20% em 2 a 6 horas reflete ressuscitação eficaz.',
      key: 'lactate'
    },
    leukocytes: {
      label: 'Leucócitos Totais',
      unit: '/mm³',
      refMin: 4000,
      refMax: 10000,
      critical: 12000,
      lowerIsBetter: true,
      description: 'Avaliação da resposta inflamatória sistêmica (SIRS) e resposta aos antibióticos.',
      key: 'leukocytes'
    },
    platelets: {
      label: 'Plaquetas',
      unit: '/mm³',
      refMin: 150000,
      refMax: 450000,
      critical: 100000,
      lowerIsBetter: false, // Subir é melhor se estiver plaquetopênico
      description: 'Contagem plaquetária para monitoramento de coagulopatia de consumo e escore SOFA.',
      key: 'platelets'
    },
    pcr: {
      label: 'Proteína C Reativa (PCR)',
      unit: 'mg/L',
      refMin: 0,
      refMax: 5,
      critical: 50,
      lowerIsBetter: true,
      description: 'Cinética de proteína de fase aguda para avaliar controle do foco infeccioso.',
      key: 'pcr'
    },
    creatinine: {
      label: 'Creatinina Sérica',
      unit: 'mg/dL',
      refMin: 0.6,
      refMax: 1.2,
      critical: 2.0,
      lowerIsBetter: true,
      description: 'Vigilância de Lesão Renal Aguda (KDIGO) associada à sepse.',
      key: 'creatinine'
    },
    bilirubin: {
      label: 'Bilirrubina Total',
      unit: 'mg/dL',
      refMin: 0.2,
      refMax: 1.2,
      critical: 2.0,
      lowerIsBetter: true,
      description: 'Monitorização de disfunção hepática no contexto de sepse.',
      key: 'bilirubin'
    },
    ph: {
      label: 'pH Arterial',
      unit: '',
      refMin: 7.35,
      refMax: 7.45,
      critical: 7.30,
      lowerIsBetter: null,
      description: 'Equilíbrio ácido-básico, presença de acidose metabólica lática e compensação.',
      key: 'ph'
    }
  };

  const currentCfg = EXAM_CONFIGS[activeExam];
  const seriesValues = initialHistory.map(h => ({
    day: h.day,
    date: h.date,
    value: h[currentCfg.key]
  }));

  const firstVal = seriesValues[0]?.value;
  const lastVal = seriesValues[seriesValues.length - 1]?.value;
  
  // Análise de tendência
  let trendType = 'neutral';
  let trendText = 'Estável';
  let trendPercent = 0;

  if (firstVal && lastVal) {
    const diff = lastVal - firstVal;
    trendPercent = Math.round((Math.abs(diff) / firstVal) * 100);

    if (currentCfg.lowerIsBetter === true) {
      if (diff < 0) {
        trendType = 'positive';
        trendText = `Queda favorável de ${trendPercent}% em relação à admissão`;
      } else if (diff > 0) {
        trendType = 'negative';
        trendText = `Elevação desfavorável de ${trendPercent}%`;
      }
    } else if (currentCfg.lowerIsBetter === false) {
      if (diff > 0) {
        trendType = 'positive';
        trendText = `Recuperação favorável de ${trendPercent}%`;
      } else if (diff < 0) {
        trendType = 'negative';
        trendText = `Queda desfavorável de ${trendPercent}%`;
      }
    } else {
      // pH
      if (lastVal >= 7.35 && lastVal <= 7.45) {
        trendType = 'positive';
        trendText = 'Normalização do pH arterial na faixa fisiológica';
      } else {
        trendType = 'negative';
        trendText = 'Distúrbio ácido-básico persistente';
      }
    }
  }

  // Gera coordenadas SVG do gráfico
  const minVal = Math.min(...seriesValues.map(s => s.value), currentCfg.refMin);
  const maxVal = Math.max(...seriesValues.map(s => s.value), currentCfg.refMax * 1.2);
  const range = maxVal - minVal || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;

  const points = seriesValues.map((pt, idx) => {
    const x = paddingX + (idx / (seriesValues.length - 1)) * (svgWidth - 2 * paddingX);
    const y = svgHeight - paddingY - ((pt.value - minVal) / range) * (svgHeight - 2 * paddingY);
    return { ...pt, x, y };
  });

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

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
              <TrendingUp size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Estatísticas & Análise de Tendência de Exames</h3>
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

        {/* Exam Selectors Tabs */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-surface-border)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {Object.entries(EXAM_CONFIGS).map(([key, cfg]) => {
            const isSel = activeExam === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveExam(key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSel ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                  color: isSel ? '#ffffff' : 'var(--color-text-dim)',
                  border: `1px solid ${isSel ? 'var(--color-primary)' : 'var(--color-surface-border)'}`,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Card de Análise da Tendência Atual */}
          <div style={{
            background: trendType === 'positive' ? 'rgba(16, 185, 129, 0.08)' : trendType === 'negative' ? 'rgba(239, 68, 68, 0.08)' : 'var(--color-surface)',
            border: `1px solid ${trendType === 'positive' ? 'rgba(16, 185, 129, 0.3)' : trendType === 'negative' ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-surface-border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>ANÁLISE DE CINÉTICA CLÍNICA</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                  Faixa de Referência: <strong>{currentCfg.refMin} a {currentCfg.refMax} {currentCfg.unit}</strong>
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentCfg.label}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4, maxWidth: 600 }}>
                {currentCfg.description}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: trendType === 'positive' ? 'rgba(16, 185, 129, 0.2)' : trendType === 'negative' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                color: trendType === 'positive' ? '#34d399' : trendType === 'negative' ? '#f87171' : '#cbd5e1',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                {trendType === 'positive' ? <TrendingDown size={16} /> : trendType === 'negative' ? <TrendingUp size={16} /> : <Minus size={16} />}
                <span>{trendText}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 6 }}>
                Entrada: <strong>{firstVal} {currentCfg.unit}</strong> → Atual: <strong style={{ color: trendType === 'positive' ? '#34d399' : '#f87171' }}>{lastVal} {currentCfg.unit}</strong>
              </div>
            </div>
          </div>

          {/* Gráfico Vetorial de Tendência */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 20
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
              Curva Temporal de Evolução
            </h4>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', maxHeight: 220, overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Linhas de Grade e Fundo */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="var(--color-surface-border)" strokeDasharray="4 4" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="var(--color-surface-border)" />

                {/* Curva de Tendência */}
                <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Pontos de Dados */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                      {pt.value} {currentCfg.unit}
                    </text>
                    <text x={pt.x} y={svgHeight - 10} textAnchor="middle" fill="#94a3b8" fontSize="10">
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Tabela Cronológica Detalhada */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 16
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
              Histórico Cronológico Consolidado de Exames
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-dim)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Momento / Dia</th>
                    <th style={{ padding: '8px 10px' }}>Data</th>
                    <th style={{ padding: '8px 10px' }}>Lactato</th>
                    <th style={{ padding: '8px 10px' }}>Leucócitos</th>
                    <th style={{ padding: '8px 10px' }}>Plaquetas</th>
                    <th style={{ padding: '8px 10px' }}>PCR</th>
                    <th style={{ padding: '8px 10px' }}>Creatinina</th>
                    <th style={{ padding: '8px 10px' }}>pH</th>
                  </tr>
                </thead>
                <tbody>
                  {initialHistory.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        {row.day}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--color-text-dim)' }}>
                        {row.date ? row.date.split('-').reverse().join('/') : ''}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700, color: row.lactate > 2.0 ? '#f87171' : '#34d399' }}>
                        {row.lactate} mmol/L
                      </td>
                      <td style={{ padding: '10px', color: row.leukocytes > 12000 ? '#f87171' : 'var(--color-text-main)' }}>
                        {row.leukocytes}
                      </td>
                      <td style={{ padding: '10px', color: row.platelets < 150000 ? '#f87171' : 'var(--color-text-main)' }}>
                        {row.platelets}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {row.pcr} mg/L
                      </td>
                      <td style={{ padding: '10px', color: row.creatinine > 1.5 ? '#fbbf24' : 'var(--color-text-main)' }}>
                        {row.creatinine} mg/dL
                      </td>
                      <td style={{ padding: '10px' }}>
                        {row.ph}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexShrink: 0
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar Análise
          </button>
        </div>
      </div>
    </div>
  );
}
