import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Printer, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Droplet, 
  FlaskConical, 
  Syringe, 
  Stethoscope, 
  ShieldCheck, 
  Calendar, 
  Bed, 
  CheckCircle2, 
  Info,
  ChevronRight,
  TrendingUp, 
  Activity, 
  UserCheck,
  HeartPulse,
  BookOpen,
  Pill,
  Wind,
  ShieldAlert,
  Microscope,
  FileText,
  ClipboardList
} from 'lucide-react';
import { calculateEvolution, checkCasePendencies } from '../services/caseService';
import { getCaseCriticalAlerts } from './ClinicalAlertModal';

export default function Dashboard({ 
  cases, 
  onNewCase, 
  onEditCase, 
  onPrintCase, 
  onDeleteCase,
  onOpenPendencies,
  onOpenProtocolDoc,
  onOpenCrisisProtocols,
  onOpenAntibioticGuide,
  onOpenDrugDetail,
  onOpenLabExams,
  onOpenCultures,
  onOpenAntibioticsUsage,
  onOpenVitalSigns,
  onOpenMedicalEvolution,
  onOpenLabTrends,
  onOpenCcihEvolution,
  onOpenAlertDetails
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter cases
  const filteredCases = cases.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      c.patientName?.toLowerCase().includes(term) ||
      c.medicalRecord?.toLowerCase().includes(term) ||
      c.bed?.toLowerCase().includes(term) ||
      c.initialDiagnosis?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (statusFilter === 'todos') return true;
    if (statusFilter === 'ativos') return c.status === 'sepse' || c.status === 'choque_septico' || c.status === 'em_investigacao';
    return c.status === statusFilter;
  });

  // Calculate quick metrics
  const totalOpen = cases.length;
  const activeSepsis = cases.filter(c => c.status === 'sepse').length;
  const septicShock = cases.filter(c => c.status === 'choque_septico').length;
  const discarded = cases.filter(c => c.status === 'afastado').length;
  const goldenHourSuccess = cases.filter(c => c.telemetryAndExams?.antibioticPrescribed && c.telemetryAndExams?.bloodCulture).length;
  const complianceRate = totalOpen > 0 ? Math.round((goldenHourSuccess / totalOpen) * 100) : 0;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Institutional Banner & Top Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-info">PTI.001.00</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
              Monitoramento de Sepse Beira-Leito
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Protocolo Institucional de Triagem Rápida, Bundles de Sobrevivência e Auditoria SCIRAS
          </p>
        </div>

        {/* Action Buttons Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={onOpenProtocolDoc}
            title="Acessar o documento oficial completo do Protocolo PTI.001.00"
            style={{ borderColor: 'var(--color-primary-light)', color: 'var(--color-primary-light)' }}
          >
            <BookOpen size={17} />
            <span>Documento PTI.001.00</span>
          </button>

          <button 
            className="btn btn-outline-danger"
            onClick={() => onOpenCrisisProtocols && onOpenCrisisProtocols('hemodynamic')}
            title="Condutas de Emergência: Choque, Falência Respiratória e Classificação KDIGO"
          >
            <ShieldAlert size={17} />
            <span>Condutas de Crise & KDIGO</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => onOpenAntibioticGuide && onOpenAntibioticGuide()}
            title="Guia oficial de escolha empírica e bulas de antimicrobianos do CHCF"
            style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
          >
            <Pill size={17} />
            <span>Guia Antibióticos & Antibiograma</span>
          </button>

          <button 
            className="btn"
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: '#fff',
              padding: '10px 18px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' 
            }}
            onClick={onNewCase}
          >
            <PlusCircle size={18} />
            <span>Abrir Protocolo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>TOTAL DE PROTOCOLOS</span>
            <Activity size={20} color="var(--color-primary-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalOpen}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Casos cadastrados na instituição
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>SEPSE CONFIRMADA</span>
            <AlertTriangle size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{activeSepsis}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Disfunção orgânica documentada
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>CHOQUE SÉPTICO</span>
            <HeartPulse size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{septicShock}</div>
          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: 4 }}>
            Uso de DVA / Hipotensão refratária
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>ADESÃO PACOTE 1ª HORA</span>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{complianceRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Culturas + ATB na Golden Hour
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          minWidth: 280,
          flex: 1
        }}>
          <Search size={18} color="var(--color-text-dim)" />
          <input 
            type="text" 
            placeholder="Buscar por paciente, prontuário, leito ou diagnóstico..."
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-main)',
              outline: 'none',
              width: '100%',
              fontSize: '0.88rem'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'ativos', label: 'Ativos' },
            { id: 'sepse', label: 'Sepse' },
            { id: 'choque_septico', label: 'Choque Séptico' },
            { id: 'afastado', label: 'Afastados' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`btn btn-sm ${statusFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cases Table Container */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        {filteredCases.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Activity size={48} color="var(--color-text-dim)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Nenhum caso encontrado
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginTop: 4, marginBottom: 16 }}>
              Não há pacientes correspondentes aos filtros selecionados.
            </p>
            <button className="btn btn-primary" onClick={onNewCase}>
              <PlusCircle size={16} />
              <span>Abrir Novo Caso de Sepse</span>
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{
                  background: 'var(--color-surface-subtle)',
                  borderBottom: '1px solid var(--color-surface-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Paciente & Localização</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Abertura Protocolo</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Evolução</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Classificação & Crise</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>
                    <span className="btn-responsive-text">Pendências & Antibiograma</span>
                    <span className="only-mobile-inline">Pendências</span>
                  </th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => {
                  const evolution = calculateEvolution(c);
                  const { flags, pendingCount, mismatch } = checkCasePendencies(c);
                  const caseAlerts = getCaseCriticalAlerts(c);

                  return (
                    <tr 
                      key={c.id} 
                      style={{
                        borderBottom: '1px solid var(--color-surface-border)',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Paciente e Leito + Sinais de Alerta com Blink */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '0.94rem' }}>
                            {c.patientName}
                          </span>
                          
                          {/* SINAL DE ALERTA COM BLINK ANIMADO */}
                          {caseAlerts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenAlertDetails && onOpenAlertDetails(c)}
                              className="alert-blink"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: caseAlerts.some(a => a.level === 'critical') ? '#ef4444' : '#f59e0b',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
                              }}
                              title="SINAIS DE ALERTA ATIVOS! Clique para ver motivos detalhados e condutas imediatas"
                            >
                              <AlertTriangle size={12} />
                              <span>{caseAlerts.length} ALERTA(S)</span>
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 3 }}>
                          <span>Prontuário: <strong>{c.medicalRecord}</strong></span>
                          <span>•</span>
                          <span>{c.bed || 'Leito não definido'}</span>
                          {c.age && <span>({c.age} anos)</span>}
                        </div>
                        {c.initialDiagnosis && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2, fontStyle: 'italic' }}>
                            Dx: {c.initialDiagnosis}
                          </div>
                        )}
                      </td>

                      {/* Data de Abertura */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                          <Calendar size={14} color="var(--color-text-dim)" />
                          <span>{c.protocolOpening?.date ? c.protocolOpening.date.split('-').reverse().join('/') : 'N/D'}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} />
                          <span>{c.protocolOpening?.time || '--:--'}</span>
                          {c.protocolOpening?.ward && <span>({c.protocolOpening.ward})</span>}
                        </div>
                      </td>

                      {/* Dias de Evolução da Doença */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          background: evolution.days >= 3 ? 'rgba(239, 68, 68, 0.15)' : evolution.days >= 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                          color: evolution.days >= 3 ? '#f87171' : evolution.days >= 1 ? '#fbbf24' : '#38bdf8',
                          border: `1px solid ${evolution.days >= 3 ? 'rgba(239, 68, 68, 0.3)' : evolution.days >= 1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`
                        }}>
                          <Clock size={13} />
                          <span>{evolution.text}</span>
                        </div>
                      </td>

                      {/* Classificação Clínica & Link para Crise */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        <div>
                          {c.status === 'choque_septico' ? (
                            <span className="badge badge-danger">CHOQUE SÉPTICO</span>
                          ) : c.status === 'sepse' ? (
                            <span className="badge badge-info">SEPSE CONFIRMADA</span>
                          ) : c.status === 'afastado' ? (
                            <span className="badge badge-neutral">QUADRO AFASTADO</span>
                          ) : (
                            <span className="badge badge-warning">EM INVESTIGAÇÃO</span>
                          )}
                        </div>

                        {/* Botão direto para Crise/KDIGO se o paciente estiver grave */}
                        {(c.status === 'choque_septico' || c.status === 'sepse') && (
                          <button
                            type="button"
                            onClick={() => onOpenCrisisProtocols && onOpenCrisisProtocols('hemodynamic', c)}
                            className="btn btn-outline-danger btn-sm"
                            style={{ padding: '2px 8px', fontSize: '0.7rem', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            title="Acessar condutas de colapso hemodinâmico, ventilação e KDIGO para este paciente"
                          >
                            <ShieldAlert size={12} />
                            <span>Condutas Crise & KDIGO</span>
                          </button>
                        )}

                        {c.sciras?.specificFocus && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                            Foco: {c.sciras.specificFocus}
                          </div>
                        )}
                      </td>

                      {/* Coluna: Modais Clínicos & Pendências */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          
                          {/* 1. Botão Exames Laboratoriais */}
                          <button
                            type="button"
                            onClick={() => onOpenLabExams && onOpenLabExams(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(2, 132, 199, 0.1)',
                              border: '1px solid rgba(2, 132, 199, 0.3)',
                              color: '#0284c7',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="1. Exames Laboratoriais (Hemograma, Lactato, Gasometrias, PCR, Bilirrubina, Renal, Hepático, Imagem...)"
                          >
                            <FlaskConical size={14} />
                            <span className="btn-responsive-text">Exames</span>
                            {c.organDysfunction?.lactateAbove2 && (
                              <span className="btn-indicator-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />
                            )}
                          </button>

                          {/* 2. Botão Culturas & TSA */}
                          <button
                            type="button"
                            onClick={() => onOpenCultures && onOpenCultures(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(124, 58, 237, 0.1)',
                              border: '1px solid rgba(124, 58, 237, 0.3)',
                              color: '#7c3aed',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="2. Culturas & Antibiograma (Hemoculturas, Urocultura, TSA e Sensibilidade)"
                          >
                            <Microscope size={14} />
                            <span className="btn-responsive-text">Culturas</span>
                            {c.telemetryAndExams?.isolatedPathogen && (
                              <span className="btn-indicator-badge" style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: 4, background: '#7c3aed', color: '#fff' }}>+</span>
                            )}
                          </button>

                          {/* 3. Botão Antibióticos Utilizados */}
                          <button
                            type="button"
                            onClick={() => onOpenAntibioticsUsage && onOpenAntibioticsUsage(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(5, 150, 105, 0.1)',
                              border: '1px solid rgba(5, 150, 105, 0.3)',
                              color: '#059669',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="3. Antibióticos Utilizados (Esquema Atual, Posologia, Dias de Uso e Modificações)"
                          >
                            <Pill size={14} />
                            <span className="btn-responsive-text">ATB</span>
                          </button>

                          {/* 4. Botão Sinais Vitais (Enfermagem) */}
                          <button
                            type="button"
                            onClick={() => onOpenVitalSigns && onOpenVitalSigns(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(220, 38, 38, 0.1)',
                              border: '1px solid rgba(220, 38, 38, 0.3)',
                              color: '#dc2626',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="4. Evolução de Sinais Vitais (Enfermagem, PAM, FC, FR, Temp, SpO2, Glasgow, Diurese)"
                          >
                            <HeartPulse size={14} />
                            <span className="btn-responsive-text">Sinais</span>
                          </button>

                          {/* 5. Botão Evolução Médica */}
                          <button
                            type="button"
                            onClick={() => onOpenMedicalEvolution && onOpenMedicalEvolution(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(2, 132, 199, 0.1)',
                              border: '1px solid rgba(2, 132, 199, 0.3)',
                              color: '#0284c7',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="5. Evolução Médica (Impressões Clínicas, Condutas e SOFA)"
                          >
                            <Stethoscope size={14} />
                            <span className="btn-responsive-text">Evol. Médica</span>
                          </button>

                          {/* 6. Botão Tendência de Exames / Estatísticas */}
                          <button
                            type="button"
                            onClick={() => onOpenLabTrends && onOpenLabTrends(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(217, 119, 6, 0.1)',
                              border: '1px solid rgba(217, 119, 6, 0.3)',
                              color: '#d97706',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="6. Estatísticas & Tendência de Exames Laboratoriais (Curvas Cinéticas)"
                          >
                            <TrendingUp size={14} />
                            <span className="btn-responsive-text">Tendência</span>
                          </button>

                          {/* 7. Botão Tabela CCIH */}
                          <button
                            type="button"
                            onClick={() => onOpenCcihEvolution && onOpenCcihEvolution(c)}
                            className="btn btn-sm btn-responsive-compact"
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              background: 'rgba(124, 58, 237, 0.1)',
                              border: '1px solid rgba(124, 58, 237, 0.3)',
                              color: '#7c3aed',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="7. Tabela de Evolução da CCIH (Pareceres, Precauções e Stewardship)"
                          >
                            <ShieldCheck size={14} />
                            <span className="btn-responsive-text">CCIH</span>
                          </button>

                          {/* Botão de Pendências gerais da Golden Hour */}
                          {pendingCount > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenPendencies(c)}
                              className="btn btn-sm btn-responsive-compact"
                              style={{
                                padding: '5px 8px',
                                fontSize: '0.74rem',
                                background: 'rgba(217, 119, 6, 0.12)',
                                border: '1px solid rgba(217, 119, 6, 0.35)',
                                color: '#d97706',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontWeight: 700
                              }}
                              title={`Checklist das pendências da 1ª hora (${pendingCount} pendência${pendingCount > 1 ? 's' : ''})`}
                            >
                              <ClipboardList size={14} />
                              <span className="btn-responsive-text">Pendências ({pendingCount})</span>
                              <span className="btn-indicator-badge only-mobile-badge" style={{ fontSize: '0.62rem', padding: '1px 3px', borderRadius: 3, background: '#d97706', color: '#fff' }}>
                                {pendingCount}
                              </span>
                            </button>
                          )}
                        </div>

                        {/* ALERTA DE ANTIBIOGRAMA INCOMPATÍVEL */}
                        {mismatch?.hasMismatch && (
                          <div style={{ marginTop: 6 }}>
                            <button
                              type="button"
                              className="badge badge-danger btn-responsive-compact"
                              onClick={() => onOpenAntibioticGuide && onOpenAntibioticGuide(c.sciras?.specificFocus, c)}
                              style={{ 
                                cursor: 'pointer', 
                                border: '1px solid #ef4444', 
                                fontSize: '0.7rem', 
                                padding: '3px 8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title={`Aviso Crítico Antibiograma Incompatível: ${mismatch.mismatchDetails?.reason}`}
                            >
                              <AlertTriangle size={12} />
                              <span className="btn-responsive-text">Antibiograma Incompatível! ({mismatch.mismatchDetails?.pathogen?.split(' ')[0]})</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Botões de Ação */}
                      <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          
                          {/* Edição */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => onEditCase(c)}
                            title="Editar protocolo do paciente"
                            style={{ padding: '6px 10px' }}
                          >
                            <Edit3 size={15} />
                            <span className="hide-mobile">Editar</span>
                          </button>

                          {/* Impressão de Relatório Oficial */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => onPrintCase(c)}
                            title="Imprimir Ficha Oficial Clementino Fraga (PDF)"
                            style={{ padding: '6px 10px', color: 'var(--color-primary-light)' }}
                          >
                            <Printer size={15} />
                            <span className="hide-mobile">Ficha Oficial</span>
                          </button>

                          {/* Exclusão do Protocolo */}
                          {deleteConfirmId === c.id ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => { onDeleteCase(c.id); setDeleteConfirmId(null); }}
                                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                              >
                                Confirmar
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => setDeleteConfirmId(null)}
                                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => setDeleteConfirmId(c.id)}
                              title="Excluir protocolo"
                              style={{ padding: '6px 8px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
