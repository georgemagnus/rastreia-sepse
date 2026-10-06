import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Droplet, 
  FlaskConical, 
  Syringe, 
  Stethoscope, 
  ShieldCheck, 
  Edit3 
} from 'lucide-react';
import { checkCasePendencies, calculateEvolution } from '../services/caseService';

export default function PendingDetailModal({ isOpen, onClose, caseData, onEditCase }) {
  if (!isOpen || !caseData) return null;

  const { flags, pendingCount } = checkCasePendencies(caseData);
  const evolution = calculateEvolution(caseData);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 620 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-info">{caseData.medicalRecord}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Pendências & Pacote de Sepse
              </h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
              {caseData.patientName} • {caseData.bed} • {evolution.text} de evolução
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: 'auto' }}>
          
          {/* Status summary banner */}
          <div style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: pendingCount > 0 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
            border: `1px solid ${pendingCount > 0 ? 'var(--color-warning-border)' : 'var(--color-success-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {pendingCount > 0 ? (
                <AlertCircle size={22} color="#f59e0b" />
              ) : (
                <CheckCircle2 size={22} color="#10b981" />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: pendingCount > 0 ? '#fbbf24' : '#34d399' }}>
                  {pendingCount > 0 
                    ? `${pendingCount} item(ns) requerem atenção assistencial`
                    : 'Pacote da 1ª hora e etapas cumpridos!'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                  Abertura do protocolo: {caseData.protocolOpening?.date || 'N/D'} às {caseData.protocolOpening?.time || 'N/D'}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist dos 5 itens críticos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            {/* 1. Lactato Sérico */}
            <div style={{
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: flags.lactate.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Droplet size={18} color={flags.lactate.status === 'ok' ? '#10b981' : '#ef4444'} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Dosagem de Lactato Sérico</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {flags.lactate.status === 'ok' 
                      ? `Coletado: ${flags.lactate.value || 'Sim'} µmol/dl (${caseData.telemetryAndExams?.lactateDateTime?.replace('T', ' ') || ''})`
                      : 'Pendente de coleta imediata'}
                  </div>
                </div>
              </div>
              <span className={`badge ${flags.lactate.status === 'ok' ? 'badge-success' : 'badge-danger'}`}>
                {flags.lactate.status === 'ok' ? 'Concluído' : 'Pendente'}
              </span>
            </div>

            {/* 2. Culturas antes do ATB */}
            <div style={{
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: flags.cultures.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FlaskConical size={18} color={flags.cultures.status === 'ok' ? '#10b981' : '#f59e0b'} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Hemoculturas (Antes do ATB)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {flags.cultures.status === 'ok' 
                      ? `Par coletado em: ${caseData.telemetryAndExams?.bloodCultureDateTime?.replace('T', ' ') || 'Registrado'}`
                      : 'Não registrado. Coletar 2 pares antes da 1ª dose de antibiótico.'}
                  </div>
                </div>
              </div>
              <span className={`badge ${flags.cultures.status === 'ok' ? 'badge-success' : 'badge-warning'}`}>
                {flags.cultures.status === 'ok' ? 'Concluído' : 'Pendente'}
              </span>
            </div>

            {/* 3. Antimicrobiano na 1ª hora */}
            <div style={{
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: flags.antibiotic.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Syringe size={18} color={flags.antibiotic.status === 'ok' ? '#10b981' : '#ef4444'} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Antibioticoterapia de Amplo Espectro</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {flags.antibiotic.status === 'ok' 
                      ? `${flags.antibiotic.value} (Início: ${caseData.telemetryAndExams?.antibioticDateTime?.replace('T', ' ') || ''})`
                      : 'CRÍTICO: Prescrever e iniciar imediatamente (Golden Hour).'}
                  </div>
                </div>
              </div>
              <span className={`badge ${flags.antibiotic.status === 'ok' ? 'badge-success' : 'badge-danger'}`}>
                {flags.antibiotic.status === 'ok' ? 'Iniciado' : 'Pendente'}
              </span>
            </div>

            {/* 4. Avaliação TRR / Conduta Médica */}
            <div style={{
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: flags.medicalEvaluation.status === 'ok' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={18} color={flags.medicalEvaluation.status === 'ok' ? '#38bdf8' : '#f59e0b'} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Avaliação Médica Assistente / TRR</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {caseData.doctorSignature ? caseData.doctorSignature : 'Médico assistente ainda não assinou a ficha'}
                  </div>
                </div>
              </div>
              <span className={`badge ${flags.medicalEvaluation.status === 'ok' ? 'badge-info' : 'badge-warning'}`}>
                {flags.medicalEvaluation.status === 'ok' ? 'Avaliado' : 'Pendente'}
              </span>
            </div>

            {/* 5. Auditoria SCIRAS / CCIH */}
            <div style={{
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: flags.sciras.status === 'ok' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={18} color={flags.sciras.status === 'ok' ? '#a855f7' : '#94a3b8'} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Vigilância SCIRAS / CCIH</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {caseData.sciras?.scirasStatus ? `Situação: ${caseData.sciras.scirasStatus}` : 'Caso aguardando parecer ou revisão da comissão'}
                  </div>
                </div>
              </div>
              <span className={`badge ${flags.sciras.status === 'ok' ? 'badge-purple' : 'badge-neutral'}`}>
                {flags.sciras.status === 'ok' ? 'Revisado' : 'Aguardando'}
              </span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
          >
            Fechar
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose();
              onEditCase(caseData);
            }}
          >
            <Edit3 size={15} />
            <span>Editar Caso & Resolver Pendências</span>
          </button>
        </div>
      </div>
    </div>
  );
}
