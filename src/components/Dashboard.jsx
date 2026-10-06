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
  HeartPulse
} from 'lucide-react';
import { calculateEvolution, checkCasePendencies } from '../services/caseService';

export default function Dashboard({ 
  cases, 
  onNewCase, 
  onEditCase, 
  onPrintCase, 
  onDeleteCase,
  onOpenPendencies
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
      
      {/* Institutional Banner & Quick Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
            Monitoramento de Sepse Beira-Leito
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Protocolo Institucional de Triagem Rápida, Bundles de Sobrevivência e Auditoria SCIRAS
          </p>
        </div>

        <button 
          className="btn"
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: '#fff',
            padding: '12px 20px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' 
          }}
          onClick={onNewCase}
        >
          <PlusCircle size={20} />
          <span>Abrir Novo Protocolo de Sepse</span>
        </button>
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
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Classificação</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Pendências & Bundle 1h</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => {
                  const evolution = calculateEvolution(c);
                  const { flags, pendingCount } = checkCasePendencies(c);

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
                      {/* Paciente e Leito */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.92rem' }}>
                          {c.patientName}
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

                      {/* Classificação Clínica */}
                      <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                        {c.status === 'choque_septico' ? (
                          <span className="badge badge-danger">CHOQUE SÉPTICO</span>
                        ) : c.status === 'sepse' ? (
                          <span className="badge badge-info">SEPSE CONFIRMADA</span>
                        ) : c.status === 'afastado' ? (
                          <span className="badge badge-neutral">QUADRO AFASTADO</span>
                        ) : (
                          <span className="badge badge-warning">EM INVESTIGAÇÃO</span>
                        )}

                        {c.sciras?.specificFocus && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                            Foco: {c.sciras.specificFocus}
                          </div>
                        )}
                      </td>

                      {/* Pendências e Informações Importantes (Ícones Interativos) */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          
                          {/* Ícone 1: Lactato */}
                          <button
                            type="button"
                            onClick={() => onOpenPendencies(c)}
                            title={flags.lactate.label}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 'var(--radius-sm)',
                              background: flags.lactate.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              border: `1px solid ${flags.lactate.status === 'ok' ? '#10b981' : '#ef4444'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <Droplet size={16} color={flags.lactate.status === 'ok' ? '#10b981' : '#ef4444'} />
                          </button>

                          {/* Ícone 2: Hemoculturas antes do ATB */}
                          <button
                            type="button"
                            onClick={() => onOpenPendencies(c)}
                            title={flags.cultures.label}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 'var(--radius-sm)',
                              background: flags.cultures.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              border: `1px solid ${flags.cultures.status === 'ok' ? '#10b981' : '#f59e0b'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <FlaskConical size={16} color={flags.cultures.status === 'ok' ? '#10b981' : '#f59e0b'} />
                          </button>

                          {/* Ícone 3: Antibiótico 1ª Hora */}
                          <button
                            type="button"
                            onClick={() => onOpenPendencies(c)}
                            title={flags.antibiotic.label}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 'var(--radius-sm)',
                              background: flags.antibiotic.status === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              border: `1px solid ${flags.antibiotic.status === 'ok' ? '#10b981' : '#ef4444'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <Syringe size={16} color={flags.antibiotic.status === 'ok' ? '#10b981' : '#ef4444'} />
                          </button>

                          {/* Ícone 4: Avaliação Médica */}
                          <button
                            type="button"
                            onClick={() => onOpenPendencies(c)}
                            title={flags.medicalEvaluation.label}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 'var(--radius-sm)',
                              background: flags.medicalEvaluation.status === 'ok' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              border: `1px solid ${flags.medicalEvaluation.status === 'ok' ? '#38bdf8' : '#f59e0b'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <Stethoscope size={16} color={flags.medicalEvaluation.status === 'ok' ? '#38bdf8' : '#f59e0b'} />
                          </button>

                          {/* Ícone 5: SCIRAS */}
                          <button
                            type="button"
                            onClick={() => onOpenPendencies(c)}
                            title={flags.sciras.label}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 'var(--radius-sm)',
                              background: flags.sciras.status === 'ok' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                              border: `1px solid ${flags.sciras.status === 'ok' ? '#a855f7' : '#64748b'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <ShieldCheck size={16} color={flags.sciras.status === 'ok' ? '#a855f7' : '#94a3b8'} />
                          </button>

                          {pendingCount > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenPendencies(c)}
                              style={{
                                fontSize: '0.72rem',
                                color: '#fbbf24',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                marginLeft: 4
                              }}
                            >
                              {pendingCount} pendência(s)
                            </button>
                          )}
                        </div>
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
