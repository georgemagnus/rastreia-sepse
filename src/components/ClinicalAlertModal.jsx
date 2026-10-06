import React from 'react';
import { 
  X, 
  AlertCircle, 
  AlertTriangle, 
  HeartPulse, 
  Droplet, 
  ShieldAlert, 
  Pill, 
  Clock, 
  ArrowRight,
  Stethoscope,
  Activity
} from 'lucide-react';
import { checkCasePendencies } from '../services/caseService';

export function getCaseCriticalAlerts(caseData) {
  if (!caseData) return [];
  const alerts = [];
  const { mismatch } = checkCasePendencies(caseData);

  // 1. Choque Séptico
  if (caseData.status === 'choque_septico') {
    alerts.push({
      level: 'critical',
      title: 'Choque Séptico Instalado',
      description: 'Hipotensão refratária à ressuscitação volêmica com necessidade de drogas vasoativas (Noradrenalina) para manter PAM >= 65 mmHg.',
      conduct: 'Acionar conduta de Colapso Hemodinâmico imediato, monitorizar PAM invasiva e titular vasopressores.'
    });
  }

  // 2. Lactato Sérico Elevado
  const lactVal = parseFloat(caseData.telemetryAndExams?.lactateVal);
  if (lactVal >= 4.0) {
    alerts.push({
      level: 'critical',
      title: `Hiperlactatemia Grave: ${lactVal} mmol/L (>= 4.0)`,
      description: 'Hipoperfusão tecidual severa com acidose lática descompensada. Critério clássico de ressuscitação volêmica agressiva guiada por metas.',
      conduct: 'Infusão de 30 mL/kg de cristaloides balanceados, dosar lactato seriado a cada 2-4h para verificar clareamento >= 20%.'
    });
  } else if (lactVal > 2.0) {
    alerts.push({
      level: 'warning',
      title: `Lactato Alterado: ${lactVal} mmol/L (> 2.0)`,
      description: 'Marcador precoce de sofrimento celular antes de hipotensão manifesta.',
      conduct: 'Otimização hemodinâmica e nova coleta de controle em 2h a 4h.'
    });
  }

  // 3. Antibiograma Incompatível
  if (mismatch?.hasMismatch) {
    alerts.push({
      level: 'critical',
      title: 'Incompatibilidade de Antibiograma (TSA)!',
      description: `O patógeno isolado (${mismatch.mismatchDetails?.pathogen}) apresenta RESISTÊNCIA ao antimicrobiano em uso (${mismatch.mismatchDetails?.currentDrug}).`,
      conduct: 'Troca imediata do antimicrobiano por agente com sensibilidade comprovada no antibiograma (consultar Guia de Antibióticos / CCIH).'
    });
  }

  // 4. Disfunção Orgânica Renal / KDIGO
  const od = caseData.organDysfunction || {};
  if (od.creatinineDiuresis) {
    alerts.push({
      level: 'warning',
      title: 'Disfunção Renal Aguda (KDIGO)',
      description: 'Creatinina sérica > 2.0 mg/dL ou débito urinário < 0.5 mL/kg/h por mais de 2 horas.',
      conduct: 'Ajustar posologia de antibióticos hidrossolúveis (Vancomicina, Aminoglicosídeos) e evitar nefrotoxinas adicionais.'
    });
  }

  // 5. Plaquetopenia Grave
  if (od.platelets) {
    alerts.push({
      level: 'warning',
      title: 'Disfunção Hematológica (Plaquetas < 100.000 /mm³)',
      description: 'Consumo plaquetário no escore SOFA, sugerindo coagulopatia intravascular induzida por sepse (SIC).',
      conduct: 'Monitorar TAP/TTPA, fibrinogênio e investigar sangramentos ocultos.'
    });
  }

  // 6. Hipoxemia / PaO2/FiO2 < 300
  if (od.hypoxemia || od.o2Need) {
    alerts.push({
      level: 'warning',
      title: 'Insuficiência Respiratória Aguda (PaO2/FiO2 < 300)',
      description: 'Comprometimento da troca gasosa com necessidade de oxigenoterapia suplementar ou ventilação mecânica.',
      conduct: 'Protocolo de Insuficiência Respiratória: titular PEEP, considerar VNI ou intubação em caso de fadiga diafragmática.'
    });
  }

  // 7. Pendências Críticas da Golden Hour
  const te = caseData.telemetryAndExams || {};
  if (!te.bloodCulture) {
    alerts.push({
      level: 'warning',
      title: 'Hemoculturas Pendentes de Coleta',
      description: 'Hemoculturas não foram registradas como coletadas antes do início do antimicrobiano.',
      conduct: 'Coletar 2 pares de hemoculturas imediatamente (em sítios de punção distintos).'
    });
  }
  if (!te.antibioticPrescribed) {
    alerts.push({
      level: 'critical',
      title: 'Antimicrobiano NÃO Iniciado!',
      description: 'Risco de quebra da Meta da 1ª Hora (Golden Hour da Sepse). Cada hora de atraso eleva a mortalidade em até 7.6%.',
      conduct: 'Iniciar antibiótico de amplo espectro na primeira hora da triagem.'
    });
  }

  return alerts;
}

export default function ClinicalAlertModal({ 
  isOpen, 
  onClose, 
  caseData,
  onOpenCrisisProtocols,
  onOpenAntibioticGuide,
  onOpenLabExams
}) {
  if (!isOpen || !caseData) return null;

  const alerts = getCaseCriticalAlerts(caseData);
  const criticalCount = alerts.filter(a => a.level === 'critical').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 740, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Pulsar de Alerta */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="alert-blink" style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-full)',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.6)',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>
                  Sinais de Alerta Clínico & Riscos Críticos
                </h3>
                <span className="badge badge-danger">
                  {alerts.length} ALERTA(S)
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Paciente: <strong>{caseData.patientName}</strong> • {caseData.bed} • Prontuário: <strong>{caseData.medicalRecord}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Status Atual do Protocolo:
              </span>
              <span className={`badge ${caseData.status === 'choque_septico' ? 'badge-danger' : 'badge-info'}`} style={{ marginLeft: 8 }}>
                {caseData.status === 'choque_septico' ? 'CHOQUE SÉPTICO' : 'SEPSE CONFIRMADA'}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
              {criticalCount > 0 ? (
                <span style={{ color: '#f87171', fontWeight: 700 }}>
                  ⚠️ {criticalCount} Alerta(s) Crítico(s) Imediato(s)
                </span>
              ) : (
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                  Atenção Assistencial Requerida
                </span>
              )}
            </div>
          </div>

          {/* Lista de Alertas Detalhados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.length > 0 ? (
              alerts.map((al, idx) => (
                <div key={idx} style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: al.level === 'critical' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                  border: `1px solid ${al.level === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.35)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: al.level === 'critical' ? '#ef4444' : '#f59e0b',
                        color: '#ffffff'
                      }}>
                        {al.level === 'critical' ? 'CRÍTICO' : 'ALTO RISCO'}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: al.level === 'critical' ? '#f87171' : '#fbbf24' }}>
                        {al.title}
                      </strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    {al.description}
                  </p>

                  <div style={{
                    marginTop: 4,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-surface-border)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-main)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6
                  }}>
                    <strong style={{ color: 'var(--color-primary-light)', whiteSpace: 'nowrap' }}>Conduta Imediata:</strong>
                    <span>{al.conduct}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#34d399', fontSize: '0.9rem' }}>
                ✓ Nenhum alerta crítico ativo no momento. Paciente em estabilidade assistencial.
              </div>
            )}
          </div>
        </div>

        {/* Footer com Ações Rápidas de Emergência */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          flexShrink: 0
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {onOpenCrisisProtocols && (
              <button 
                type="button" 
                className="btn btn-danger btn-sm"
                onClick={() => { onClose(); onOpenCrisisProtocols('hemodynamic', caseData); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ShieldAlert size={15} />
                <span>Condutas de Crise & KDIGO</span>
              </button>
            )}

            {onOpenAntibioticGuide && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => { onClose(); onOpenAntibioticGuide(caseData.sciras?.specificFocus, caseData); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Pill size={15} />
                <span>Ajustar Antibióticos</span>
              </button>
            )}

            {onOpenLabExams && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => { onClose(); onOpenLabExams(caseData); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Droplet size={15} />
                <span>Ver Exames / Lactato</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
