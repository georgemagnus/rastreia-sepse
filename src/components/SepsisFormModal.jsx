import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { 
  X, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  Stethoscope, 
  ShieldAlert, 
  FileText,
  User,
  FlaskConical,
  Activity,
  HeartPulse,
  Syringe,
  Info
} from 'lucide-react';
import { countSirsCriteria, countOrganDysfunctions, calculateVolume } from '../services/caseService';

export default function SepsisFormModal({ isOpen, onClose, initialData, onSave }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'nursing' | 'doctor' | 'sciras'

  // Form State initialized from initialData or defaults
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
    } else {
      // New case template
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().slice(0, 5);

      setFormData({
        id: `caso-sep-${Date.now()}`,
        patientName: "",
        birthDate: "",
        age: "",
        motherName: "",
        medicalRecord: "",
        bed: "",
        admissionDate: today,
        initialDiagnosis: "",
        status: "em_investigacao",
        createdAt: new Date().toISOString(),

        telephony5050: {
          called: false,
          date: today,
          time: nowTime,
          operatorName: ""
        },
        medicalAssessment: {
          date: today,
          time: nowTime
        },
        protocolOpening: {
          date: today,
          time: nowTime,
          ward: ""
        },
        protocolExclusion: {
          date: "",
          time: "",
          ward: "",
          reason: ""
        },

        sirsCriteria: {
          fever: false,
          hypothermia: false,
          leukocytosis: false,
          tachypnea: false,
          tachycardia: false,
          date: today,
          time: nowTime,
          ward: ""
        },
        organDysfunction: {
          hypotension: false,
          hypotensionValue: "",
          bpDrop: false,
          bilirubin: false,
          platelets: false,
          creatinineDiuresis: false,
          lactateAbove2: false,
          lactateValue: "",
          coagulopathy: false,
          hypoxemia: false,
          o2Need: false,
          alteredConsciousness: false,
          date: today,
          time: nowTime
        },
        telemetryAndExams: {
          lactateCollected: false,
          lactateVal: "",
          lactateDateTime: `${today}T${nowTime}`,
          bloodGasAttached: false,
          leukogramCollected: false,
          leukogramVal: "",
          leukogramDateTime: `${today}T${nowTime}`,
          bloodCulture: false,
          bloodCultureDateTime: `${today}T${nowTime}`,
          trachealAspirate: false,
          trachealAspirateDateTime: "",
          urineCulture: false,
          urineCultureDateTime: "",
          otherCultures: "",
          otherCulturesDateTime: "",
          antibioticPrescribed: "",
          antibioticDateTime: "",
          nursingNotes: "",
          nurseSignature: currentUser?.role === 'enfermeiro' ? `${currentUser.name} - ${currentUser.councilType}-${currentUser.councilUf} ${currentUser.councilNumber}` : ""
        },

        infectionHistory: {
          pneumonia: false,
          uti: false,
          intraAbdominal: false,
          meningitis: false,
          skinSoftTissue: false,
          boneJoint: false,
          surgicalSite: false,
          bloodstreamCatheter: false,
          endocardite: false,
          prosthesis: false,
          other: "",
          undefinedFocus: false
        },
        hemodynamicOptimization: {
          arterialHypotension: false,
          volumeResponsive: false,
          patientWeightKg: "",
          volumeMlCalculated: "",
          persistentHypotension: false,
          vasoactiveDrugsStarted: false,
          corticoidStarted: false,
          centralVenousAccess: false,
          svo2Optimized: false,
          dobutamineStarted: false,
          transfusionNeeded: false,
          mechanicalVentilation24h: false
        },
        clinicalPresentation: "sepse",
        medicalNotes: "",
        doctorSignature: currentUser?.role === 'medico' ? `${currentUser.name} - ${currentUser.councilType}-${currentUser.councilUf} ${currentUser.councilNumber}` : "",

        sciras: {
          assessmentDate: today,
          comorbididades: "",
          focusOrigin: "comunitario",
          specificFocus: "Pulmonar",
          antibioticConforming: true,
          hospitalizationLast3Months: false,
          scirasImpression: "sepse",
          scirasStatus: "em_acompanhamento",
          discardReason: "",
          outcome: "continua_interno",
          scirasEvolution: "",
          scirasDoctorSignature: ""
        }
      });
    }
  }, [isOpen, initialData, currentUser]);

  if (!isOpen || !formData) return null;

  // Real-time calculations
  const sirsCount = countSirsCriteria(formData.sirsCriteria);
  const odCount = countOrganDysfunctions(formData.organDysfunction);

  // Auto calculate volume when weight changes
  const handleWeightChange = (weight) => {
    const vol = calculateVolume(weight);
    setFormData(prev => ({
      ...prev,
      hemodynamicOptimization: {
        ...prev.hemodynamicOptimization,
        patientWeightKg: weight,
        volumeMlCalculated: vol ? `${vol}` : ""
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Determine derived clinical status
    let finalStatus = formData.status;
    if (formData.protocolExclusion?.date && formData.protocolExclusion?.reason) {
      finalStatus = 'afastado';
    } else if (formData.clinicalPresentation === 'choque_septico' || formData.hemodynamicOptimization?.vasoactiveDrugsStarted) {
      finalStatus = 'choque_septico';
    } else if (formData.clinicalPresentation === 'sepse' || odCount >= 1) {
      finalStatus = 'sepse';
    } else if (formData.clinicalPresentation === 'afastado') {
      finalStatus = 'afastado';
    } else {
      finalStatus = 'em_investigacao';
    }

    const updatedCase = {
      ...formData,
      status: finalStatus
    };

    onSave(updatedCase);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 960, height: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Hospital Clementino Fraga */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge badge-info" style={{ fontWeight: 800 }}>FCH.INS.001.01</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {initialData ? 'Edição de Protocolo de Sepse Adulto' : 'Abertura de Protocolo de Sepse Adulto'}
              </h3>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
              Complexo de Doenças Infectocontagiosas Dr. Clementino Fraga • Governo da Paraíba
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Salvar Protocolo</span>
            </button>
            <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Warning Alert Bar */}
        <div style={{
          padding: '8px 20px',
          background: odCount > 0 ? 'rgba(239, 68, 68, 0.15)' : sirsCount >= 2 ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-surface)',
          borderBottom: '1px solid var(--color-surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {odCount > 0 ? (
              <span className="badge badge-danger">
                <AlertTriangle size={13} /> {odCount} DISFUNÇÃO(ÕES) ORGÂNICA(S) DETECTADA(S) - RISCO CRÍTICO
              </span>
            ) : sirsCount >= 2 ? (
              <span className="badge badge-warning">
                <AlertTriangle size={13} /> {sirsCount} CRITÉRIOS DE SIRS - TRIAGEM POSITIVA
              </span>
            ) : (
              <span className="badge badge-neutral">
                <Info size={13} /> Triagem Inicial em Andamento
              </span>
            )}
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
            {formData.patientName ? `Paciente: ${formData.patientName}` : 'Paciente sem identificação'}
          </div>
        </div>

        {/* Tab Navigation (Touch-friendly and Desktop responsive) */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface)',
          overflowX: 'auto'
        }}>
          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('patient')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'patient' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'patient' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <User size={16} />
            <span>1. Paciente & Prazos</span>
          </button>

          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('nursing')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'nursing' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'nursing' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <Activity size={16} />
            <span>2. Enfermagem (Triagem & Exames)</span>
            {sirsCount >= 2 && <span className="badge badge-warning" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>{sirsCount}</span>}
          </button>

          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('doctor')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'doctor' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'doctor' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <Stethoscope size={16} />
            <span>3. Médico TRR (Foco & Hemodinâmica)</span>
          </button>

          <button 
            type="button"
            className="tab-btn"
            onClick={() => setActiveTab('sciras')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'sciras' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'sciras' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <ShieldAlert size={16} />
            <span>4. SCIRAS / CCIH</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          
          {/* TAB 1: PACIENTE E PRAZOS */}
          {activeTab === 'patient' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Identificação do Paciente */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--color-primary-light)' }}>
                  Identificação do Paciente
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Nome Completo do Paciente *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Nome completo do paciente"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Prontuário *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: PR-123456"
                      value={formData.medicalRecord}
                      onChange={(e) => setFormData({ ...formData, medicalRecord: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Leito / Setor *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: UTI Leito 05, Enfermaria 12"
                      value={formData.bed}
                      onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Data de Nascimento</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Idade (Anos)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Ex: 65"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Nome da Mãe</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Nome da mãe do paciente"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Data de Admissão Hospitalar</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Diagnóstico de Admissão</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Pneumonia, Colecistite..."
                      value={formData.initialDiagnosis}
                      onChange={(e) => setFormData({ ...formData, initialDiagnosis: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Tempos do Protocolo (Telefonia, Atendimento Médico, Abertura, Exclusão) */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, color: 'var(--color-primary-light)' }}>
                  Controle de Horários & Acionamentos
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  
                  {/* Acionamento da Telefonia 5050 */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: 10 }}>
                      📞 Acionamento da Telefonia 5050
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div>
                        <label className="form-label">Data</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.telephony5050.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            telephony5050: { ...formData.telephony5050, date: e.target.value, called: true }
                          })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Hora</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={formData.telephony5050.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            telephony5050: { ...formData.telephony5050, time: e.target.value, called: true }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Nome Telefonista</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Nome do telefonista"
                        value={formData.telephony5050.operatorName}
                        onChange={(e) => setFormData({
                          ...formData,
                          telephony5050: { ...formData.telephony5050, operatorName: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  {/* Atendimento Médico */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: 10 }}>
                      🩺 Atendimento Médico (Primeiro Contato)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label className="form-label">Data</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.medicalAssessment.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            medicalAssessment: { ...formData.medicalAssessment, date: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Hora</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={formData.medicalAssessment.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            medicalAssessment: { ...formData.medicalAssessment, time: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Abertura do Protocolo de Sepse */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-primary-bg)',
                    borderColor: 'var(--color-primary)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-light)', marginBottom: 10 }}>
                      🚨 Abertura do Protocolo de Sepse
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div>
                        <label className="form-label">Data</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.protocolOpening.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            protocolOpening: { ...formData.protocolOpening, date: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Hora</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={formData.protocolOpening.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            protocolOpening: { ...formData.protocolOpening, time: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Local</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Triagem, PA, Leito 4"
                        value={formData.protocolOpening.ward}
                        onChange={(e) => setFormData({
                          ...formData,
                          protocolOpening: { ...formData.protocolOpening, ward: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  {/* Exclusão do Protocolo */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: 10 }}>
                      ⏹️ Exclusão do Protocolo (Se Aplicável)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div>
                        <label className="form-label">Data</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.protocolExclusion.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            protocolExclusion: { ...formData.protocolExclusion, date: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Hora</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={formData.protocolExclusion.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            protocolExclusion: { ...formData.protocolExclusion, time: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Motivo da Exclusão</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Infecção sem disfunção orgânica"
                        value={formData.protocolExclusion.reason}
                        onChange={(e) => setFormData({
                          ...formData,
                          protocolExclusion: { ...formData.protocolExclusion, reason: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ENFERMAGEM (TRIAGEM & EXAMES) */}
          {activeTab === 'nursing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* 1. Critérios de Triagem SIRS */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                      1. Paciente apresenta 2 ou mais destes critérios abaixo?
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                      Critérios de Síndrome de Resposta Inflamatória Sistêmica (SIRS)
                    </span>
                  </div>
                  <span className={`badge ${sirsCount >= 2 ? 'badge-warning' : 'badge-neutral'}`}>
                    {sirsCount} selecionado(s) {sirsCount >= 2 ? '⚠️ Positivo' : ''}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, marginBottom: 14 }}>
                  <div 
                    className={`checkbox-card ${formData.sirsCriteria.fever ? 'checked' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      sirsCriteria: { ...formData.sirsCriteria, fever: !formData.sirsCriteria.fever }
                    })}
                  >
                    <input type="checkbox" checked={formData.sirsCriteria.fever} readOnly />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Hipertermia &gt; 37,8°C</div>
                    </div>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.sirsCriteria.hypothermia ? 'checked' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      sirsCriteria: { ...formData.sirsCriteria, hypothermia: !formData.sirsCriteria.hypothermia }
                    })}
                  >
                    <input type="checkbox" checked={formData.sirsCriteria.hypothermia} readOnly />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Hipotermia &lt; 35,0°C</div>
                    </div>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.sirsCriteria.leukocytosis ? 'checked' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      sirsCriteria: { ...formData.sirsCriteria, leukocytosis: !formData.sirsCriteria.leukocytosis }
                    })}
                  >
                    <input type="checkbox" checked={formData.sirsCriteria.leukocytosis} readOnly />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Leucocitose &gt; 12.000, leucopenia &lt; 4.000 ou desvio esquerdo &gt; 10%</div>
                    </div>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.sirsCriteria.tachypnea ? 'checked' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      sirsCriteria: { ...formData.sirsCriteria, tachypnea: !formData.sirsCriteria.tachypnea }
                    })}
                  >
                    <input type="checkbox" checked={formData.sirsCriteria.tachypnea} readOnly />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Taquipnéia &gt; 20 irpm ou PaCO2 &lt; 32 mmHg</div>
                    </div>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.sirsCriteria.tachycardia ? 'checked' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      sirsCriteria: { ...formData.sirsCriteria, tachycardia: !formData.sirsCriteria.tachycardia }
                    })}
                  >
                    <input type="checkbox" checked={formData.sirsCriteria.tachycardia} readOnly />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Taquicardia &gt; 90 bpm</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10 }}>
                  <div>
                    <label className="form-label">Data</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.sirsCriteria.date}
                      onChange={(e) => setFormData({
                        ...formData,
                        sirsCriteria: { ...formData.sirsCriteria, date: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Hora</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={formData.sirsCriteria.time}
                      onChange={(e) => setFormData({
                        ...formData,
                        sirsCriteria: { ...formData.sirsCriteria, time: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Local</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Local da aferição"
                      value={formData.sirsCriteria.ward}
                      onChange={(e) => setFormData({
                        ...formData,
                        sirsCriteria: { ...formData.sirsCriteria, ward: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Sinais de Disfunção Orgânica */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                      2. Há algum desses sinais de DISFUNÇÃO ORGÂNICA?
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                      Sinais que definem Sepse / Sepse Grave / Choque
                    </span>
                  </div>
                  <span className={`badge ${odCount > 0 ? 'badge-danger' : 'badge-neutral'}`}>
                    {odCount} disfunção(ões)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginBottom: 14 }}>
                  
                  {/* Hipotensão arterial */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.hypotension ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, hypotension: !formData.organDysfunction.hypotension }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.hypotension} readOnly />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>PAS ≤ 90 mmHg ou PAM ≤ 65 mmHg</div>
                      <input 
                        type="text" 
                        placeholder="Valor mmHg (ex: 80/50)"
                        className="form-input"
                        style={{ marginTop: 6, padding: '4px 8px', fontSize: '0.8rem' }}
                        value={formData.organDysfunction.hypotensionValue}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setFormData({
                          ...formData,
                          organDysfunction: { 
                            ...formData.organDysfunction, 
                            hypotension: true,
                            hypotensionValue: e.target.value 
                          }
                        })}
                      />
                    </div>
                  </div>

                  {/* Lactato > 2 */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.lactateAbove2 ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, lactateAbove2: !formData.organDysfunction.lactateAbove2 }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.lactateAbove2} readOnly />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Lactato &gt; 2 µmol/dl</div>
                      <input 
                        type="text" 
                        placeholder="Valor µmol/dl (ex: 3.4)"
                        className="form-input"
                        style={{ marginTop: 6, padding: '4px 8px', fontSize: '0.8rem' }}
                        value={formData.organDysfunction.lactateValue}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setFormData({
                          ...formData,
                          organDysfunction: { 
                            ...formData.organDysfunction, 
                            lactateAbove2: true,
                            lactateValue: e.target.value 
                          }
                        })}
                      />
                    </div>
                  </div>

                  {/* Queda de PA > 40 */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.bpDrop ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, bpDrop: !formData.organDysfunction.bpDrop }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.bpDrop} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Queda de PA &gt; 40 mmHg na PA basal</span></div>
                  </div>

                  {/* Coagulopatia */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.coagulopathy ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, coagulopathy: !formData.organDysfunction.coagulopathy }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.coagulopathy} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Coagulopatia (INR &gt; 1,5 ou TTPA &gt; 60 seg)</span></div>
                  </div>

                  {/* Bilirrubina */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.bilirubin ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, bilirubin: !formData.organDysfunction.bilirubin }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.bilirubin} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bilirrubina &gt; 2 mg/dl</span></div>
                  </div>

                  {/* PaO2/FiO2 */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.hypoxemia ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, hypoxemia: !formData.organDysfunction.hypoxemia }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.hypoxemia} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Relação PaO2/FiO2 &lt; 300</span></div>
                  </div>

                  {/* Plaquetas */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.platelets ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, platelets: !formData.organDysfunction.platelets }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.platelets} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Plaquetas &lt; 100.000</span></div>
                  </div>

                  {/* Necessidade de O2 */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.o2Need ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, o2Need: !formData.organDysfunction.o2Need }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.o2Need} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Necessidade de O2 para manter SpO2 &gt; 90</span></div>
                  </div>

                  {/* Creatinina / Diurese */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.creatinineDiuresis ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, creatinineDiuresis: !formData.organDysfunction.creatinineDiuresis }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.creatinineDiuresis} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Creatinina &gt; 2,0 mg/dl ou diurese &lt; 0,5 ml/Kg/h nas últimas 2 horas</span></div>
                  </div>

                  {/* Rebaixamento consciência */}
                  <div 
                    className={`checkbox-card ${formData.organDysfunction.alteredConsciousness ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      organDysfunction: { ...formData.organDysfunction, alteredConsciousness: !formData.organDysfunction.alteredConsciousness }
                    })}
                  >
                    <input type="checkbox" checked={formData.organDysfunction.alteredConsciousness} readOnly />
                    <div><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rebaixamento do nível de consciência, agitação ou delirium</span></div>
                  </div>

                </div>
              </div>

              {/* 3. Após acionamento da Telefonia: Exames Coletados & Início de ATB (Golden Hour) */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                      3. Após acionamento da Telefonia (Exames Coletados *Antes de iniciar ATB)
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                      Pacote da 1ª Hora (Bundle 1h): Coletar hemoculturas e dosar lactato antes de infundir antimicrobiano
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  
                  {/* Lactato */}
                  <div style={{
                    padding: 12,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>🩸 Lactato (Gasometria)</label>
                      <input 
                        type="checkbox"
                        checked={formData.telemetryAndExams.lactateCollected}
                        onChange={(e) => setFormData({
                          ...formData,
                          telemetryAndExams: { ...formData.telemetryAndExams, lactateCollected: e.target.checked }
                        })}
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Valor µmol/dl (ex: 2.8)"
                      className="form-input"
                      value={formData.telemetryAndExams.lactateVal}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { 
                          ...formData.telemetryAndExams, 
                          lactateVal: e.target.value,
                          lactateCollected: true
                        }
                      })}
                      style={{ marginBottom: 6 }}
                    />
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={formData.telemetryAndExams.lactateDateTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { ...formData.telemetryAndExams, lactateDateTime: e.target.value }
                      })}
                    />
                  </div>

                  {/* Leucograma */}
                  <div style={{
                    padding: 12,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>🧪 Ex. Laboratorial (Leucócitos)</label>
                      <input 
                        type="checkbox"
                        checked={formData.telemetryAndExams.leukogramCollected}
                        onChange={(e) => setFormData({
                          ...formData,
                          telemetryAndExams: { ...formData.telemetryAndExams, leukogramCollected: e.target.checked }
                        })}
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Valor Leuco (ex: 16.500)"
                      className="form-input"
                      value={formData.telemetryAndExams.leukogramVal}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { 
                          ...formData.telemetryAndExams, 
                          leukogramVal: e.target.value,
                          leukogramCollected: true
                        }
                      })}
                      style={{ marginBottom: 6 }}
                    />
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={formData.telemetryAndExams.leukogramDateTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { ...formData.telemetryAndExams, leukogramDateTime: e.target.value }
                      })}
                    />
                  </div>

                  {/* Culturas */}
                  <div style={{
                    padding: 12,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)',
                    gridColumn: 'span 2'
                  }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, display: 'block' }}>
                      🧫 Culturas Coletadas (*Antes do ATB):
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.telemetryAndExams.bloodCulture}
                          onChange={(e) => setFormData({
                            ...formData,
                            telemetryAndExams: { ...formData.telemetryAndExams, bloodCulture: e.target.checked }
                          })}
                        />
                        Hemocultura
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.telemetryAndExams.trachealAspirate}
                          onChange={(e) => setFormData({
                            ...formData,
                            telemetryAndExams: { ...formData.telemetryAndExams, trachealAspirate: e.target.checked }
                          })}
                        />
                        Aspirado Traqueal
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.telemetryAndExams.urineCulture}
                          onChange={(e) => setFormData({
                            ...formData,
                            telemetryAndExams: { ...formData.telemetryAndExams, urineCulture: e.target.checked }
                          })}
                        />
                        Urocultura
                      </label>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <input 
                        type="text" 
                        placeholder="Outras Culturas (Ex: LCR, Líquido Pleural, Swab)"
                        className="form-input"
                        value={formData.telemetryAndExams.otherCultures}
                        onChange={(e) => setFormData({
                          ...formData,
                          telemetryAndExams: { ...formData.telemetryAndExams, otherCultures: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  {/* ANTIBIÓTICO (Golden Hour) */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-warning-border)',
                    gridColumn: 'span 2'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Syringe size={18} color="#f59e0b" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24' }}>
                        ANTIBIÓTICO (Meta: Infusão na 1ª Hora)
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                      <div>
                        <label className="form-label">Qual antimicrobiano prescrito/administrado?</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Ceftriaxona 2g EV + Claritromicina 500mg EV"
                          className="form-input"
                          value={formData.telemetryAndExams.antibioticPrescribed}
                          onChange={(e) => setFormData({
                            ...formData,
                            telemetryAndExams: { ...formData.telemetryAndExams, antibioticPrescribed: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Data e Hora do Início</label>
                        <input 
                          type="datetime-local" 
                          className="form-input"
                          value={formData.telemetryAndExams.antibioticDateTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            telemetryAndExams: { ...formData.telemetryAndExams, antibioticDateTime: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* OBS e Assinatura Enfermagem */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">OBS Enfermagem (Relatar abertura tardia, exames de rotina):</label>
                    <textarea 
                      className="form-textarea" 
                      rows={2}
                      placeholder="Relatar intercorrências ou detalhes da triagem..."
                      value={formData.telemetryAndExams.nursingNotes}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { ...formData.telemetryAndExams, nursingNotes: e.target.value }
                      })}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Assinatura / Carimbo do Responsável (Enfermagem):</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Enf. Rodrigo Lima - COREN-PB 452.189"
                      value={formData.telemetryAndExams.nurseSignature}
                      onChange={(e) => setFormData({
                        ...formData,
                        telemetryAndExams: { ...formData.telemetryAndExams, nurseSignature: e.target.value }
                      })}
                    />
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: MÉDICO ASSISTENTE / TRR */}
          {activeTab === 'doctor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* 1. História Infecciosa */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-primary-light)' }}>
                  1. O paciente tem história sugestiva de um quadro infeccioso?
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  
                  {[
                    { key: 'pneumonia', label: 'Pneumonia / Empiema' },
                    { key: 'uti', label: 'Infecção Urinária' },
                    { key: 'intraAbdominal', label: 'Infecção Abdominal Aguda' },
                    { key: 'meningitis', label: 'Meningite' },
                    { key: 'skinSoftTissue', label: 'Pele e Partes Moles' },
                    { key: 'boneJoint', label: 'Infecção Óssea / Articular' },
                    { key: 'surgicalSite', label: 'Infecção de Ferida Operatória' },
                    { key: 'bloodstreamCatheter', label: 'Corrente Sang. assoc. Cateter' },
                    { key: 'endocardite', label: 'Endocardite' },
                    { key: 'prosthesis', label: 'Infecção de Prótese' },
                    { key: 'undefinedFocus', label: 'Sem Foco Definido' }
                  ].map(foco => (
                    <div 
                      key={foco.key}
                      className={`checkbox-card ${formData.infectionHistory[foco.key] ? 'checked' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        infectionHistory: {
                          ...formData.infectionHistory,
                          [foco.key]: !formData.infectionHistory[foco.key]
                        }
                      })}
                    >
                      <input type="checkbox" checked={formData.infectionHistory[foco.key] || false} readOnly />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{foco.label}</span>
                    </div>
                  ))}

                  <div style={{ gridColumn: 'span 2' }}>
                    <input 
                      type="text" 
                      placeholder="Outras infecções (especificar)"
                      className="form-input"
                      value={formData.infectionHistory.other || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        infectionHistory: { ...formData.infectionHistory, other: e.target.value }
                      })}
                    />
                  </div>

                </div>
              </div>

              {/* 2. Otimização Hemodinâmica */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-primary-light)' }}>
                  2. Otimização Hemodinâmica
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, marginBottom: 16 }}>
                  
                  {/* Calculadora de 30ml/kg */}
                  <div style={{
                    padding: 14,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-primary)',
                    gridColumn: 'span 2'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Calculator size={18} color="var(--color-primary-light)" />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-primary-light)' }}>
                        Ressuscitação Volêmica (30 ml/Kg em 30 a 60 min)
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, alignItems: 'center' }}>
                      <div>
                        <label className="form-label">Peso do Paciente (Kg)</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 70"
                          className="form-input"
                          value={formData.hemodynamicOptimization.patientWeightKg}
                          onChange={(e) => handleWeightChange(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label">Volume Calculado (30ml/kg)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={formData.hemodynamicOptimization.volumeMlCalculated ? `${formData.hemodynamicOptimization.volumeMlCalculated} ml de Cristalóide` : ''}
                          readOnly
                          style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--color-primary-light)', fontWeight: 700 }}
                        />
                      </div>
                      <div style={{ paddingTop: 20 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                          <input 
                            type="checkbox"
                            checked={formData.hemodynamicOptimization.volumeResponsive}
                            onChange={(e) => setFormData({
                              ...formData,
                              hemodynamicOptimization: { ...formData.hemodynamicOptimization, volumeResponsive: e.target.checked }
                            })}
                          />
                          Responsivo a volume
                        </label>
                      </div>
                    </div>
                  </div>

                  {[
                    { key: 'arterialHypotension', label: 'Hipotensão Arterial' },
                    { key: 'persistentHypotension', label: 'Hipotensão persistente ou ameaçadora à vida' },
                    { key: 'vasoactiveDrugsStarted', label: 'Iniciado Drogas Vasoativas (Noradrenalina)' },
                    { key: 'corticoidStarted', label: 'Corticoide (quando não responsivo a volume e droga)' },
                    { key: 'centralVenousAccess', label: 'Acesso Venoso Central' },
                    { key: 'svo2Optimized', label: 'Otimização SvO2 > 70%' },
                    { key: 'dobutamineStarted', label: 'Iniciado Dobutamina – 2,5mcg/Kg/Hora' },
                    { key: 'transfusionNeeded', label: 'Necessidade Transfusão Hb < 7g/dL - URGÊNCIA' },
                    { key: 'mechanicalVentilation24h', label: 'Necessidade de Ventilação Mecânica nas 24h após diagnóstico' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      className={`checkbox-card ${formData.hemodynamicOptimization[item.key] ? 'checked-danger' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        hemodynamicOptimization: {
                          ...formData.hemodynamicOptimization,
                          [item.key]: !formData.hemodynamicOptimization[item.key]
                        }
                      })}
                    >
                      <input type="checkbox" checked={formData.hemodynamicOptimization[item.key] || false} readOnly />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</span>
                    </div>
                  ))}

                </div>
              </div>

              {/* 3. Apresentação Clínica & Conduta */}
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-primary-light)' }}>
                  3. Apresentação Clínica (Diagnóstico Médico)
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  <div 
                    className={`checkbox-card ${formData.clinicalPresentation === 'sepse' ? 'checked' : ''}`}
                    onClick={() => setFormData({ ...formData, clinicalPresentation: 'sepse' })}
                    style={{ justifyContent: 'center', padding: 14 }}
                  >
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>Sepse</span>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.clinicalPresentation === 'choque_septico' ? 'checked-danger' : ''}`}
                    onClick={() => setFormData({ ...formData, clinicalPresentation: 'choque_septico' })}
                    style={{ justifyContent: 'center', padding: 14 }}
                  >
                    <span style={{ fontWeight: 700, color: '#ef4444' }}>Choque Séptico</span>
                  </div>

                  <div 
                    className={`checkbox-card ${formData.clinicalPresentation === 'afastado' ? 'checked' : ''}`}
                    onClick={() => setFormData({ ...formData, clinicalPresentation: 'afastado' })}
                    style={{ justifyContent: 'center', padding: 14 }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>Afastado Quadro Séptico</span>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">OBS Médicas / Plano Terapêutico:</label>
                  <textarea 
                    className="form-textarea" 
                    rows={2}
                    placeholder="Evolução médica, gasometria, metas de PAM..."
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Assinatura / Carimbo do Responsável (Médico Assistente / TRR):</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Dr. Alexandre Nóbrega - CRM-PB 11.450"
                    value={formData.doctorSignature}
                    onChange={(e) => setFormData({ ...formData, doctorSignature: e.target.value })}
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SCIRAS / CCIH */}
          {activeTab === 'sciras' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{
                background: 'var(--color-surface-subtle)',
                padding: 18,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-purple)' }}>
                    MÉDICO SCIRAS (CCIH) - Vigilância e Auditoria
                  </h4>
                  <div style={{ width: 180 }}>
                    <label className="form-label">Data da Avaliação</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.sciras?.assessmentDate || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, assessmentDate: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Comorbidades do Paciente</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: DM2, HAS, DPOC, IRC, Neoplasia..."
                      value={formData.sciras?.comorbididades || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, comorbididades: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Origem do Foco</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.focusOrigin || 'comunitario'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, focusOrigin: e.target.value }
                      })}
                    >
                      <option value="comunitario">Comunitário</option>
                      <option value="hospitalar">Hospitalar</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Foco da Infecção</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.specificFocus || 'Pulmonar'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, specificFocus: e.target.value }
                      })}
                    >
                      <option value="Pulmonar">Pulmonar</option>
                      <option value="Urinário">Urinário</option>
                      <option value="Corrente Sanguínea">Corrente Sanguínea</option>
                      <option value="Abdominal">Abdominal</option>
                      <option value="Pele/ Partes Moles">Pele / Partes Moles</option>
                      <option value="SNC">SNC</option>
                      <option value="Foco não definido">Foco não definido</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Antibiótico Conforme Protocolo?</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.antibioticConforming ? 'sim' : 'nao'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, antibioticConforming: e.target.value === 'sim' }
                      })}
                    >
                      <option value="sim">Sim (Conforme Diretriz)</option>
                      <option value="nao">Não (Inadequado/Discrepante)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Internação nos últimos 3 meses?</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.hospitalizationLast3Months ? 'sim' : 'nao'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, hospitalizationLast3Months: e.target.value === 'sim' }
                      })}
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim (Risco germe resistente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Impressão SCIRAS</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.scirasImpression || 'sepse'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, scirasImpression: e.target.value }
                      })}
                    >
                      <option value="sepse">Sepse</option>
                      <option value="choque_septico">Choque Séptico</option>
                      <option value="afastado">Afastado Quadro Séptico</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Situação do Caso</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.scirasStatus || 'em_acompanhamento'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, scirasStatus: e.target.value }
                      })}
                    >
                      <option value="em_acompanhamento">Em acompanhamento</option>
                      <option value="revertido">Revertido</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Motivo do Descarte (se aplicável)</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.discardReason || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, discardReason: e.target.value }
                      })}
                    >
                      <option value="">Nenhum / Não descartado</option>
                      <option value="Infecção sem disfunção orgânica">Infecção sem disfunção orgânica</option>
                      <option value="Disfunção orgânica sem infecção">Disfunção orgânica sem infecção</option>
                      <option value="Cuidados Paliativos">Cuidados Paliativos</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Desfecho do Paciente</label>
                    <select 
                      className="form-select"
                      value={formData.sciras?.outcome || 'continua_interno'}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, outcome: e.target.value }
                      })}
                    >
                      <option value="continua_interno">Continua Interno</option>
                      <option value="alta">Alta Hospitalar</option>
                      <option value="transferencia">Transferência</option>
                      <option value="obito">Óbito</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Evolução SCIRAS / Parecer Institucional:</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3}
                      placeholder="Parecer da CCIH, ajuste guiado por culturas, encerramento..."
                      value={formData.sciras?.scirasEvolution || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, scirasEvolution: e.target.value }
                      })}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Assinatura / Carimbo Médico SCIRAS:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Dra. Patrícia Albuquerque - CRM-PB 9.870"
                      value={formData.sciras?.scirasDoctorSignature || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sciras: { ...formData.sciras, scirasDoctorSignature: e.target.value }
                      })}
                    />
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer com botões de ação e navegação */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            Campos com * são de preenchimento prioritário para o protocolo institucional.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {activeTab !== 'patient' && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const tabs = ['patient', 'nursing', 'doctor', 'sciras'];
                  const currIdx = tabs.indexOf(activeTab);
                  if (currIdx > 0) setActiveTab(tabs[currIdx - 1]);
                }}
              >
                Voltar
              </button>
            )}

            {activeTab !== 'sciras' ? (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const tabs = ['patient', 'nursing', 'doctor', 'sciras'];
                  const currIdx = tabs.indexOf(activeTab);
                  if (currIdx < tabs.length - 1) setActiveTab(tabs[currIdx + 1]);
                }}
              >
                Avançar Aba
              </button>
            ) : null}

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Salvar Protocolo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
