import React from 'react';
import { 
  X, 
  Pill, 
  AlertTriangle, 
  Droplet, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Info,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { DRUG_TECHNICAL_SHEETS } from '../data/antibioticsGuide';

export default function AntibioticDetailModal({ isOpen, onClose, drugKey }) {
  if (!isOpen || !drugKey) return null;

  const drug = DRUG_TECHNICAL_SHEETS[drugKey.toLowerCase()] || Object.values(DRUG_TECHNICAL_SHEETS).find(d => 
    d.name.toLowerCase().includes(drugKey.toLowerCase()) || d.id === drugKey.toLowerCase()
  );

  if (!drug) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 780, maxHeight: '92vh' }}
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
          gap: 12
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
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <Pill size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-info">{drug.category}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {drug.name}
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Monografia Técnica Hospitalar • Bula & Farmacocinética em Terapia Intensiva
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Indicação na Sepse */}
          <div style={{
            padding: 14,
            background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-surface-border)'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', display: 'block', marginBottom: 4 }}>
              🎯 Indicação no Protocolo de Sepse (CHCF):
            </strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
              {drug.indicationSepsis}
            </p>
          </div>

          {/* Posologia Padronizada */}
          <div style={{
            padding: 14,
            background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-surface-border)'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', display: 'block', marginBottom: 8 }}>
              💊 Posologia Padronizada (Adulto):
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              <div style={{ padding: 10, background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-border)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Dose de Ataque:</span>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: 2 }}>
                  {drug.dosingStandard.attack}
                </div>
              </div>
              <div style={{ padding: 10, background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-border)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Dose de Manutenção:</span>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: 2 }}>
                  {drug.dosingStandard.maintenance}
                </div>
              </div>
            </div>
          </div>

          {/* Ajuste para Insuficiência Renal (ClCr / Diálise) */}
          <div style={{
            padding: 14,
            background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-surface-border)'
          }}>
            <strong style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Droplet size={16} /> Ajuste de Dose para Insuficiência Renal (ClCr / Hemodiálise):
            </strong>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-dim)' }}>
                    <th style={{ padding: '6px 8px' }}>Faixa de Clearance</th>
                    <th style={{ padding: '6px 8px' }}>Dose Recomendada</th>
                  </tr>
                </thead>
                <tbody>
                  {drug.renalAdjustment.map((adj, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                      <td style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--color-text-main)' }}>{adj.clcr}</td>
                      <td style={{ padding: '6px 8px', color: 'var(--color-text-muted)' }}>{adj.dose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mecanismo de Ação e Monitoramento */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Mecanismo de Ação:
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {drug.mechanism}
              </p>
            </div>

            <div style={{ padding: 12, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Monitoramento Terapêutico & Metas:
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {drug.therapeuticMonitoring}
              </p>
            </div>
          </div>

          {/* Efeitos Adversos & Dicas de Infusão */}
          <div style={{
            padding: 14,
            background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-surface-border)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              <div>
                <strong style={{ fontSize: '0.8rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertTriangle size={15} /> Principais Efeitos Adversos:
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {drug.adverseEffects}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={15} /> Cuidados Práticos de Infusão / Beira-Leito:
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {drug.infusionTips}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Fechar Monografia
          </button>
        </div>
      </div>
    </div>
  );
}
