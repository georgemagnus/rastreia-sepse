import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Activity, 
  FileText,
  HelpCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

// Valores de Referência Clínicos para Sepse
export const LAB_REFERENCE_RANGES = {
  hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL', label: 'Hemoglobina', alertBelow: 10.0, msgLow: 'Anemia / Hipoxemia tecidual' },
  hematocrit: { min: 36, max: 52, unit: '%', label: 'Hematócrito', alertBelow: 30, msgLow: 'Hematócrito reduzido' },
  leukocytes: { min: 4000, max: 10000, unit: '/mm³', label: 'Leucócitos Totais', alertAbove: 12000, alertBelow: 4000, msgHigh: 'Leucocitose (Critério SIRS)', msgLow: 'Leucopenia grave (Critério SIRS)' },
  rods: { min: 0, max: 5, unit: '%', label: 'Bastões', alertAbove: 10, msgHigh: 'Desvio à esquerda > 10% (SIRS)' },
  platelets: { min: 150000, max: 450000, unit: '/mm³', label: 'Plaquetas', alertBelow: 100000, msgLow: 'Plaquetopenia < 100.000 (Disfunção Orgânica SOFA)' },
  pcr: { min: 0, max: 5, unit: 'mg/L', label: 'Proteína C Reativa (PCR)', alertAbove: 10, msgHigh: 'Inflamação ativa acentuada' },
  bilirubinTotal: { min: 0.2, max: 1.2, unit: 'mg/dL', label: 'Bilirrubina Total', alertAbove: 2.0, msgHigh: 'Bilirrubina > 2.0 mg/dL (Disfunção Hepática SOFA)' },
  lactate: { min: 0.5, max: 2.0, unit: 'mmol/L', label: 'Lactato Sérico', alertAbove: 2.0, criticalAbove: 4.0, msgHigh: 'Hiperlactatemia > 2.0 (Hipoperfusão celular)', msgCrit: 'Lactato Crítico >= 4.0 mmol/L (Choque Grave / Ressuscitação Requerida)' },
  urea: { min: 15, max: 45, unit: 'mg/dL', label: 'Ureia', alertAbove: 60, msgHigh: 'Escórias nitrogenadas elevadas' },
  creatinine: { min: 0.6, max: 1.2, unit: 'mg/dL', label: 'Creatinina', alertAbove: 1.5, criticalAbove: 2.0, msgHigh: 'Creatinina > 1.5 mg/dL', msgCrit: 'Creatinina > 2.0 mg/dL (Disfunção Renal SOFA / KDIGO)' },
  ast: { min: 10, max: 40, unit: 'U/L', label: 'AST (TGO)', alertAbove: 40, msgHigh: 'Enzima hepática alterada' },
  alt: { min: 10, max: 40, unit: 'U/L', label: 'ALT (TGP)', alertAbove: 40, msgHigh: 'Enzima hepática alterada' },
  tapInr: { min: 0.8, max: 1.2, unit: 'INR', label: 'TAP (INR)', alertAbove: 1.5, msgHigh: 'Coagulopatia INR > 1.5 (Critério de Disfunção)' },
  ttpa: { min: 24, max: 38, unit: 's', label: 'TTPA', alertAbove: 45, msgHigh: 'Tempo de tromboplastina prolongado' },
  glucose: { min: 70, max: 99, unit: 'mg/dL', label: 'Glicemia', alertAbove: 180, alertBelow: 70, msgHigh: 'Hiperglicemia induzida por estresse/sepse (> 180)', msgLow: 'Hipoglicemia (< 70)' },
  procalcitonin: { min: 0, max: 0.5, unit: 'ng/mL', label: 'Procalcitonina (PCT)', alertAbove: 0.5, criticalAbove: 2.0, msgHigh: 'Infecção bacteriana provável (> 0.5)', msgCrit: 'Sepse grave/risco elevado de choque (> 2.0)' },
  artPh: { min: 7.35, max: 7.45, unit: '', label: 'pH Arterial', alertBelow: 7.30, alertAbove: 7.50, msgLow: 'Acidose metabólica/respiratória grave', msgHigh: 'Alcalose severa' },
  artPo2: { min: 80, max: 100, unit: 'mmHg', label: 'pO2 Arterial', alertBelow: 60, msgLow: 'Hipoxemia grave (pO2 < 60)' },
  artPco2: { min: 35, max: 45, unit: 'mmHg', label: 'pCO2 Arterial', alertBelow: 32, msgLow: 'Hiperventilação / compensação de acidose' },
  artHco3: { min: 22, max: 26, unit: 'mEq/L', label: 'Bicarbonato (HCO3)', alertBelow: 18, msgLow: 'Acidose metabólica grave (HCO3 < 18)' },
  pao2Fio2: { min: 300, max: 500, unit: '', label: 'Relação PaO2/FiO2', alertBelow: 300, criticalBelow: 200, msgHigh: '', msgLow: 'Insuficiência Respiratória Aguda SOFA (PaO2/FiO2 < 300)', msgCrit: 'SDRA Moderada/Grave (PaO2/FiO2 < 200)' },
  venSvco2: { min: 70, max: 100, unit: '%', label: 'SvcO2 (Gasom. Venosa Central)', alertBelow: 70, msgLow: 'SvcO2 < 70% (Meta de ressuscitação hemodinâmica não atingida)' }
};

export function checkLabAlert(fieldKey, value) {
  if (value === undefined || value === null || value === '') return null;
  const num = parseFloat(String(value).replace(',', '.'));
  if (isNaN(num)) return null;

  const ref = LAB_REFERENCE_RANGES[fieldKey];
  if (!ref) return null;

  if (ref.criticalAbove && num >= ref.criticalAbove) {
    return { type: 'critical', message: ref.msgCrit || 'Valor Crítico!', value: num };
  }
  if (ref.criticalBelow && num <= ref.criticalBelow) {
    return { type: 'critical', message: ref.msgCrit || 'Valor Crítico!', value: num };
  }
  if (ref.alertAbove && num > ref.alertAbove) {
    return { type: 'alert', message: ref.msgHigh || 'Acima da referência', value: num };
  }
  if (ref.alertBelow && num < ref.alertBelow) {
    return { type: 'alert', message: ref.msgLow || 'Abaixo da referência', value: num };
  }
  return null;
}

export default function LabExamsModal({ isOpen, onClose, caseData, onSaveCase }) {
  if (!isOpen || !caseData) return null;

  // Global batch date/time for exams done together
  const nowDefault = new Date().toISOString().slice(0, 10);
  const [batchDate, setBatchDate] = useState(nowDefault);
  const [batchTime, setBatchTime] = useState('08:00');
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for lab record
  const initialLab = caseData.labExamsRecord || {
    // Dates
    commonDate: nowDefault,
    // Hemograma
    erythrocytes: '',
    hemoglobin: caseData.telemetryAndExams?.hemoglobin || '',
    hematocrit: '',
    leukocytes: caseData.telemetryAndExams?.leukogramVal ? parseInt(caseData.telemetryAndExams.leukogramVal) || '' : '',
    rods: '8',
    segmented: '72',
    lymphocytes: '14',
    platelets: caseData.organDysfunction?.plateletsValue || '140000',
    hemogramDate: nowDefault,

    // Inflamação & Hepático
    pcr: '145',
    pcrDate: nowDefault,
    procalcitonin: '3.4',
    procalcitoninDate: nowDefault,
    bilirubinTotal: caseData.organDysfunction?.bilirubinValue || '1.8',
    bilirubinDirect: '1.2',
    bilirubinIndirect: '0.6',
    bilirubinDate: nowDefault,

    // Perfusão & Renal
    lactate: caseData.telemetryAndExams?.lactateVal || '3.2',
    lactateDate: nowDefault,
    urea: '68',
    ureaDate: nowDefault,
    creatinine: caseData.organDysfunction?.creatinineValue || '2.1',
    creatinineDate: nowDefault,

    // Hepático & Coagulação
    ast: '54',
    alt: '48',
    enzymesDate: nowDefault,
    tapInr: '1.6',
    ttpa: '42',
    coagDate: nowDefault,

    // Metabólico
    glucose: '168',
    glucoseDate: nowDefault,

    // Gasometria Arterial
    arterialActive: true,
    artPh: '7.28',
    artPo2: '74',
    artPco2: '29',
    artHco3: '16',
    artBe: '-7',
    artSatO2: '92',
    pao2Fio2: '240',
    artDate: nowDefault,

    // Gasometria Venosa
    venousActive: false,
    venPh: '7.24',
    venPco2: '38',
    venHco3: '15',
    venSvco2: '62',
    venDate: nowDefault,

    // Outros Exames & Imagem
    otherExams: [
      { id: '1', name: 'Troponina I', result: '0.04 ng/mL', date: nowDefault, status: 'Normal' },
      { id: '2', name: 'EAS / Sedimento Urinário', result: 'Leucocitúria maciça, nitrito positivo', date: nowDefault, status: 'Alterado' }
    ],
    imagingExams: [
      { id: 'img-1', type: 'Raio-X de Tórax (Leito)', date: nowDefault, report: 'Infiltrado alveolar bilateral em bases, consolidação em terço inferior direito, sem pneumotórax.' }
    ]
  };

  const [form, setForm] = useState(initialLab);
  const [showAddVenous, setShowAddVenous] = useState(form.venousActive || false);
  const [newOtherName, setNewOtherName] = useState('');
  const [newOtherResult, setNewOtherResult] = useState('');
  const [newImgType, setNewImgType] = useState('Tomografia de Tórax');
  const [newImgReport, setNewImgReport] = useState('');

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  // Botão para replicar a mesma data para todos os exames em conjunto
  const handleApplyBatchDateToAll = () => {
    setForm(prev => ({
      ...prev,
      commonDate: batchDate,
      hemogramDate: batchDate,
      pcrDate: batchDate,
      procalcitoninDate: batchDate,
      bilirubinDate: batchDate,
      lactateDate: batchDate,
      ureaDate: batchDate,
      creatinineDate: batchDate,
      enzymesDate: batchDate,
      coagDate: batchDate,
      glucoseDate: batchDate,
      artDate: batchDate,
      venDate: batchDate,
      otherExams: (prev.otherExams || []).map(o => ({ ...o, date: batchDate })),
      imagingExams: (prev.imagingExams || []).map(i => ({ ...i, date: batchDate }))
    }));
    setSuccessMsg(`Data ${batchDate.split('-').reverse().join('/')} aplicada a todos os exames com sucesso!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddOtherExam = () => {
    if (!newOtherName) return;
    const item = {
      id: Date.now().toString(),
      name: newOtherName,
      result: newOtherResult || 'Concluído',
      date: batchDate,
      status: 'Registrado'
    };
    setForm(prev => ({
      ...prev,
      otherExams: [...(prev.otherExams || []), item]
    }));
    setNewOtherName('');
    setNewOtherResult('');
  };

  const handleRemoveOtherExam = (id) => {
    setForm(prev => ({
      ...prev,
      otherExams: (prev.otherExams || []).filter(o => o.id !== id)
    }));
  };

  const handleAddImaging = () => {
    if (!newImgReport) return;
    const item = {
      id: Date.now().toString(),
      type: newImgType,
      date: batchDate,
      report: newImgReport
    };
    setForm(prev => ({
      ...prev,
      imagingExams: [...(prev.imagingExams || []), item]
    }));
    setNewImgReport('');
  };

  const handleRemoveImaging = (id) => {
    setForm(prev => ({
      ...prev,
      imagingExams: (prev.imagingExams || []).filter(i => i.id !== id)
    }));
  };

  const handleSave = () => {
    const updatedCase = {
      ...caseData,
      labExamsRecord: {
        ...form,
        venousActive: showAddVenous,
        updatedAt: new Date().toISOString()
      },
      // Sincroniza campos essenciais no telemetryAndExams e organDysfunction
      telemetryAndExams: {
        ...caseData.telemetryAndExams,
        lactateCollected: !!form.lactate,
        lactateVal: form.lactate || caseData.telemetryAndExams?.lactateVal,
        leukogramCollected: !!form.leukocytes,
        leukogramVal: form.leukocytes ? `${form.leukocytes} (${form.rods || 0}% bastões)` : caseData.telemetryAndExams?.leukogramVal
      },
      organDysfunction: {
        ...caseData.organDysfunction,
        bilirubin: parseFloat(form.bilirubinTotal) > 2.0,
        bilirubinValue: form.bilirubinTotal,
        platelets: parseFloat(form.platelets) < 100000,
        plateletsValue: form.platelets,
        creatinineDiuresis: parseFloat(form.creatinine) > 2.0,
        creatinineValue: form.creatinine,
        lactateAbove2: parseFloat(form.lactate) > 2.0,
        lactateValue: form.lactate,
        coagulopathy: parseFloat(form.tapInr) > 1.5,
        hypoxemia: parseFloat(form.pao2Fio2) < 300
      }
    };

    onSaveCase(updatedCase);
    setSuccessMsg('Exames laboratoriais salvos com sucesso!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  // Helper para renderizar campo com alerta em tempo real
  const renderLabField = (key, label, value, dateField, placeholder, unit, step = "any") => {
    const alert = checkLabAlert(key, value);
    return (
      <div style={{
        background: alert ? (alert.type === 'critical' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.1)') : 'var(--color-surface)',
        border: `1px solid ${alert ? (alert.type === 'critical' ? '#ef4444' : '#f59e0b') : 'var(--color-surface-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {label} {unit && <span style={{ color: 'var(--color-text-dim)', fontWeight: 400 }}>({unit})</span>}
          </label>
          {alert && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: alert.type === 'critical' ? '#ef4444' : '#f59e0b',
              color: '#ffffff'
            }}>
              <AlertTriangle size={11} />
              {alert.type === 'critical' ? 'CRÍTICO' : 'ALTERADO'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            step={step}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            className="input-control"
            style={{ 
              fontWeight: 700,
              color: alert ? (alert.type === 'critical' ? '#f87171' : '#fbbf24') : 'var(--color-text-main)' 
            }}
          />
          {dateField && (
            <input 
              type="date"
              value={form[dateField] || batchDate}
              onChange={(e) => handleChange(dateField, e.target.value)}
              className="input-control"
              style={{ width: 135, fontSize: '0.78rem' }}
              title="Data da coleta deste exame"
            />
          )}
        </div>

        {alert && (
          <div style={{ 
            fontSize: '0.72rem', 
            color: alert.type === 'critical' ? '#f87171' : '#fbbf24', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <AlertTriangle size={12} />
            <span>{alert.message}</span>
          </div>
        )}
      </div>
    );
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
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
            }}>
              <FlaskConical size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Exames Laboratoriais & Imagem</h3>
                <span className="badge badge-info">{caseData.medicalRecord}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                Paciente: <strong>{caseData.patientName}</strong> • {caseData.bed}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 6, borderRadius: 'var(--radius-sm)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Global Batch Date Bar (Replicar mesma data para todos) */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(2, 132, 199, 0.08)',
          borderBottom: '1px solid rgba(2, 132, 199, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color="var(--color-primary-light)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Data Coleta em Lote:</span>
            <input 
              type="date"
              value={batchDate}
              onChange={(e) => setBatchDate(e.target.value)}
              className="input-control"
              style={{ width: 140, padding: '4px 8px', fontSize: '0.82rem' }}
            />
            <button 
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApplyBatchDateToAll}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              title="Aplica esta data a todos os exames laboratoriais preenchidos juntos"
            >
              <Copy size={14} />
              <span>Aplicar Mesma Data para Todos</span>
            </button>
          </div>

          {successMsg && (
            <div style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Form Body - Scrollable */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Seção 1: Hemograma & Inflamatórios */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-light)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>1. Hemograma, Leucograma & Marcadores Inflamatórios</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {renderLabField('leukocytes', 'Leucócitos Totais', form.leukocytes, 'hemogramDate', 'Ex: 18400', '/mm³', '100')}
              {renderLabField('rods', 'Bastões / Mielócitos', form.rods, 'hemogramDate', 'Ex: 12', '%', '1')}
              {renderLabField('platelets', 'Plaquetas', form.platelets, 'hemogramDate', 'Ex: 95000', '/mm³', '1000')}
              {renderLabField('hemoglobin', 'Hemoglobina', form.hemoglobin, 'hemogramDate', 'Ex: 9.8', 'g/dL', '0.1')}
              {renderLabField('pcr', 'Proteína C Reativa (PCR)', form.pcr, 'pcrDate', 'Ex: 120', 'mg/L', '0.1')}
              {renderLabField('procalcitonin', 'Procalcitonina (PCT)', form.procalcitonin, 'procalcitoninDate', 'Ex: 2.8', 'ng/mL', '0.01')}
            </div>
          </div>

          {/* Seção 2: Perfusão Tecidual, Renal & Hepático */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>2. Perfusão (Lactato), Função Renal & Hepática</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {renderLabField('lactate', 'Lactato Sérico / Gasométrico', form.lactate, 'lactateDate', 'Ex: 3.4', 'mmol/L', '0.1')}
              {renderLabField('creatinine', 'Creatinina', form.creatinine, 'creatinineDate', 'Ex: 2.2', 'mg/dL', '0.1')}
              {renderLabField('urea', 'Ureia', form.urea, 'ureaDate', 'Ex: 75', 'mg/dL', '1')}
              {renderLabField('bilirubinTotal', 'Bilirrubina Total', form.bilirubinTotal, 'bilirubinDate', 'Ex: 2.4', 'mg/dL', '0.1')}
              {renderLabField('ast', 'AST (TGO)', form.ast, 'enzymesDate', 'Ex: 58', 'U/L', '1')}
              {renderLabField('alt', 'ALT (TGP)', form.alt, 'enzymesDate', 'Ex: 46', 'U/L', '1')}
              {renderLabField('tapInr', 'TAP (INR)', form.tapInr, 'coagDate', 'Ex: 1.7', 'INR', '0.1')}
              {renderLabField('ttpa', 'TTPA', form.ttpa, 'coagDate', 'Ex: 44', 'segundos', '1')}
              {renderLabField('glucose', 'Glicemia', form.glucose, 'glucoseDate', 'Ex: 195', 'mg/dL', '1')}
            </div>
          </div>

          {/* Seção 3: Gasometria Arterial */}
          <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>3. Gasometria Arterial</span>
              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>Equilíbrio Ácido-Básico & Troca Gasosa</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {renderLabField('artPh', 'pH Arterial', form.artPh, 'artDate', 'Ex: 7.28', '', '0.01')}
              {renderLabField('artPo2', 'pO2', form.artPo2, 'artDate', 'Ex: 68', 'mmHg', '1')}
              {renderLabField('artPco2', 'pCO2', form.artPco2, 'artDate', 'Ex: 30', 'mmHg', '1')}
              {renderLabField('artHco3', 'Bicarbonato (HCO3)', form.artHco3, 'artDate', 'Ex: 16', 'mEq/L', '1')}
              {renderLabField('pao2Fio2', 'Relação PaO2/FiO2', form.pao2Fio2, 'artDate', 'Ex: 220', '', '1')}
            </div>
          </div>

          {/* Seção 4: Gasometria Venosa (Botão de Adicionar/Expandir) */}
          <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showAddVenous ? 12 : 0 }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>4. Gasometria Venosa / Central</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Avaliação de SvcO2 para ressuscitação guiada por metas hemodinâmicas</p>
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddVenous(!showAddVenous)}
              >
                {showAddVenous ? 'Ocultar Gasometria Venosa' : '+ Adicionar Gasometria Venosa'}
              </button>
            </div>

            {showAddVenous && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
                {renderLabField('venSvco2', 'SvcO2 Central', form.venSvco2, 'venDate', 'Ex: 65', '%', '1')}
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px'
                }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>pH Venoso</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.venPh}
                    onChange={(e) => handleChange('venPh', e.target.value)}
                    placeholder="Ex: 7.25"
                    className="input-control"
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px'
                }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>pCO2 Venoso</label>
                  <input
                    type="number"
                    value={form.venPco2}
                    onChange={(e) => handleChange('venPco2', e.target.value)}
                    placeholder="Ex: 42"
                    className="input-control"
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Seção 5: Outros Exames Laboratoriais */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text-main)' }}>
              5. Outros Exames Complementares
            </h4>

            {form.otherExams && form.otherExams.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {form.otherExams.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-surface-border)',
                    fontSize: '0.84rem'
                  }}>
                    <div>
                      <strong>{item.name}:</strong> <span style={{ color: 'var(--color-primary-light)' }}>{item.result}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginLeft: 8 }}>({item.date})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOtherExam(item.id)}
                      style={{ color: '#f87171', padding: 4 }}
                      title="Excluir exame"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Nome do exame (Ex: Troponina, D-Dímero, Sódio, Potássio...)"
                value={newOtherName}
                onChange={(e) => setNewOtherName(e.target.value)}
                className="input-control"
                style={{ flex: 1, minWidth: 200 }}
              />
              <input 
                type="text" 
                placeholder="Resultado / Laudo (Ex: 0.05 ng/mL)"
                value={newOtherResult}
                onChange={(e) => setNewOtherResult(e.target.value)}
                className="input-control"
                style={{ flex: 1, minWidth: 160 }}
              />
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddOtherExam}
              >
                <Plus size={16} />
                <span>Adicionar Exame</span>
              </button>
            </div>
          </div>

          {/* Seção 6: Exames de Imagem & Laudos */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text-main)' }}>
              6. Exames de Imagem & Laudos
            </h4>

            {form.imagingExams && form.imagingExams.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {form.imagingExams.map((img) => (
                  <div key={img.id} style={{
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--color-primary-light)' }}>{img.type}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Data: {img.date}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImaging(img.id)}
                          style={{ color: '#f87171', padding: 4 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {img.report}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select 
                  className="input-control" 
                  value={newImgType} 
                  onChange={(e) => setNewImgType(e.target.value)}
                  style={{ width: 240 }}
                >
                  <option value="Raio-X de Tórax (Leito)">Raio-X de Tórax (Leito)</option>
                  <option value="Tomografia de Tórax">Tomografia Computadorizada de Tórax</option>
                  <option value="Tomografia de Abdome com Contraste">TC de Abdome e Pelve</option>
                  <option value="Ultrassonografia de Abdome Total">USG de Abdome Total</option>
                  <option value="Ultrassonografia Point-of-Care (POCUS)">POCUS / Pulmonar / Vena Cava</option>
                  <option value="Ecocardiograma Transtorácico (ECO)">Ecocardiograma Transtorácico</option>
                  <option value="Tomografia de Crânio">Tomografia de Crânio</option>
                  <option value="Outro Método de Imagem">Outro Método de Imagem</option>
                </select>
              </div>

              <textarea 
                rows="2"
                placeholder="Digite a conclusão ou laudo do exame de imagem..."
                value={newImgReport}
                onChange={(e) => setNewImgReport(e.target.value)}
                className="input-control"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddImaging}
                >
                  <Plus size={16} />
                  <span>Adicionar Laudo de Imagem</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
            Cancelar
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}
          >
            <Save size={18} />
            <span>Salvar Exames Laboratoriais</span>
          </button>
        </div>
      </div>
    </div>
  );
}
