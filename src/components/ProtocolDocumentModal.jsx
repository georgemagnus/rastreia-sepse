import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Search, 
  Printer, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Award, 
  BookOpen,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { INSTITUTIONAL_PROTOCOL } from '../data/protocolText';

export default function ProtocolDocumentModal({ isOpen, onClose }) {
  const [selectedSectionId, setSelectedSectionId] = useState('sec-1');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentSection = INSTITUTIONAL_PROTOCOL.sections.find(s => s.id === selectedSectionId) || INSTITUTIONAL_PROTOCOL.sections[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 1100, height: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{
          padding: '16px 24px',
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
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <BookOpen size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-info">{INSTITUTIONAL_PROTOCOL.code} • Rev {INSTITUTIONAL_PROTOCOL.version}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {INSTITUTIONAL_PROTOCOL.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                {INSTITUTIONAL_PROTOCOL.institution} • {INSTITUTIONAL_PROTOCOL.stateGov}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => window.print()}
              title="Imprimir documento do protocolo"
            >
              <Printer size={16} />
              <span className="hide-mobile">Imprimir</span>
            </button>
            <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Layout with Sidebar & Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Sidebar Navigation */}
          <aside style={{
            width: 290,
            borderRight: '1px solid var(--color-surface-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-surface-border)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px'
              }}>
                <Search size={15} color="var(--color-text-dim)" />
                <input 
                  type="text"
                  placeholder="Pesquisar seções..."
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-main)',
                    fontSize: '0.8rem',
                    width: '100%'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <nav style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {INSTITUTIONAL_PROTOCOL.sections
                .filter(sec => sec.title.toLowerCase().includes(searchTerm.toLowerCase()) || sec.content.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: selectedSectionId === sec.id ? 'var(--color-primary-bg)' : 'transparent',
                      color: selectedSectionId === sec.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                      border: selectedSectionId === sec.id ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span>{sec.number}. {sec.title}</span>
                    <ChevronRight size={14} opacity={selectedSectionId === sec.id ? 1 : 0.4} />
                  </button>
              ))}

              <div style={{ marginTop: 16, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-subtle)', border: '1px solid var(--color-surface-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Controle de Emissão
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-main)', marginTop: 4, fontWeight: 600 }}>
                  Emissão: {INSTITUTIONAL_PROTOCOL.issueDate}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Próxima Revisão: {INSTITUTIONAL_PROTOCOL.nextRevision}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Reading View */}
          <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', background: 'var(--color-bg)' }}>
            
            {/* Section Banner */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="badge badge-info" style={{ fontWeight: 800 }}>SEÇÃO {currentSection.number}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>PTI.001.00 / CHCF</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {currentSection.title}
              </h2>
            </div>

            {/* Document Text Body formatted for high readability */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 28px',
              lineHeight: 1.8,
              fontSize: '0.94rem',
              color: 'var(--color-text-main)',
              whiteSpace: 'pre-wrap',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {currentSection.content}
            </div>

            {/* Authors & Signatures Box at the bottom */}
            {selectedSectionId === 'sec-8' && (
              <div style={{
                marginTop: 24,
                padding: '20px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-primary-light)' }}>
                  Corpo Técnico Responsável pela Elaboração e Homologação
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Elaboração / Revisores:</div>
                    {INSTITUTIONAL_PROTOCOL.authors.map((a, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        • <strong>{a.name}</strong> - {a.role}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Verificação da Qualidade:</div>
                    {INSTITUTIONAL_PROTOCOL.verifiers.map((v, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        • <strong>{v.name}</strong> - {v.role}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Aprovação e Direção:</div>
                    {INSTITUTIONAL_PROTOCOL.approvers.map((ap, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                        • <strong>{ap.name}</strong> - {ap.role}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
