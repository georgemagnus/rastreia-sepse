import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export default function PrintFichaModal({ isOpen, onClose, caseData }) {
  if (!isOpen || !caseData) return null;

  const handlePrint = () => {
    window.print();
  };

  const c = caseData;
  const sirs = c.sirsCriteria || {};
  const od = c.organDysfunction || {};
  const te = c.telemetryAndExams || {};
  const ih = c.infectionHistory || {};
  const ho = c.hemodynamicOptimization || {};
  const sc = c.sciras || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 860, maxHeight: '96vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (No print) */}
        <div className="no-print" style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-info">FCH.INS.001.01</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Visualização de Impressão da Ficha Oficial de Sepse
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div style={{ padding: 24, overflowY: 'auto', background: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header Institucional */}
          <div style={{ border: '2px solid #000', padding: 8, marginBottom: 8, fontSize: '11px', lineHeight: 1.3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: 6, marginBottom: 6 }}>
              <div>
                <strong style={{ fontSize: '13px' }}>COMPLEXO DE DOENÇAS INFECTOCONTAGIOSAS DR. CLEMENTINO FRAGA</strong><br />
                Rua: Ester Borges Bastos, s/n - Jaguaribe - João Pessoa – CEP: 58015-270. CNPJ – 08.778.268/0005-94<br />
                Telefone: (83) 3612-5056
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                SECRETARIA DE ESTADO DA SAÚDE<br />
                <span style={{ fontSize: '13px' }}>GOVERNO DA PARAÍBA</span><br />
                <span style={{ fontSize: '10px' }}>FCH.INS.001.01</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', padding: '3px 0' }}>
              FICHA DE TRIAGEM - PROTOCOLO DE SEPSE ADULTO
            </div>
          </div>

          {/* Dados do Paciente */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: 8, border: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4, width: '65%' }}>
                  <strong>NOME DO PACIENTE:</strong> {c.patientName}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, width: '35%' }}>
                  <strong>DATA NASCIMENTO:</strong> {c.birthDate ? c.birthDate.split('-').reverse().join('/') : '__/__/____'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  <strong>NOME DA MÃE:</strong> {c.motherName || 'Não informado'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  <strong>PRONTUÁRIO:</strong> {c.medicalRecord} &nbsp;&nbsp;&nbsp;&nbsp; <strong>IDADE:</strong> {c.age || '--'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  <strong>DATA DE ADMISSÃO:</strong> {c.admissionDate ? c.admissionDate.split('-').reverse().join('/') : '__/__/____'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  <strong>LEITO:</strong> {c.bed || 'N/D'} &nbsp;|&nbsp; <strong>DIAGNÓSTICO:</strong> {c.initialDiagnosis}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tabela de Acionamentos */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: 8, border: '1px solid #000' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #000', padding: 4, textAlign: 'left', width: '25%' }}>Acionamento da Telefonia 5050</th>
                <th style={{ border: '1px solid #000', padding: 4, textAlign: 'left', width: '25%' }}>Atendimento Médico</th>
                <th style={{ border: '1px solid #000', padding: 4, textAlign: 'left', width: '25%' }}>Abertura do Protocolo de Sepse</th>
                <th style={{ border: '1px solid #000', padding: 4, textAlign: 'left', width: '25%' }}>Exclusão do Protocolo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  Data: {c.telephony5050?.date ? c.telephony5050.date.split('-').reverse().join('/') : '__/__/____'}<br />
                  Hora: {c.telephony5050?.time || '__:__'}<br />
                  Nome telefonista: {c.telephony5050?.operatorName || '______'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  Data: {c.medicalAssessment?.date ? c.medicalAssessment.date.split('-').reverse().join('/') : '__/__/____'}<br />
                  Hora: {c.medicalAssessment?.time || '__:__'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  Data: {c.protocolOpening?.date ? c.protocolOpening.date.split('-').reverse().join('/') : '__/__/____'}<br />
                  Hora: {c.protocolOpening?.time || '__:__'}<br />
                  Local: {c.protocolOpening?.ward || '______'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  Data: {c.protocolExclusion?.date ? c.protocolExclusion.date.split('-').reverse().join('/') : '__/__/____'}<br />
                  Hora: {c.protocolExclusion?.time || '__:__'}<br />
                  Motivo: {c.protocolExclusion?.reason || '______'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* SEÇÃO ENFERMAGEM */}
          <div style={{ background: '#e2e8f0', padding: '3px 6px', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', border: '1px solid #000', marginBottom: 4 }}>
            ENFERMAGEM
          </div>

          <div style={{ border: '1px solid #000', padding: 6, fontSize: '10px', marginBottom: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              1. Paciente apresenta 2 ou mais destes critérios abaixo? 
              <span style={{ fontWeight: 'normal', marginLeft: 16 }}>
                Data: {sirs.date ? sirs.date.split('-').reverse().join('/') : '__/__/____'} &nbsp; Hora: {sirs.time || '__:__'} &nbsp; Local: {sirs.ward || '______'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <div>{sirs.fever ? '[X]' : '[ ]'} Hipertermia &gt; 37,8°C</div>
              <div>{sirs.tachypnea ? '[X]' : '[ ]'} Taquipnéia &gt; 20 irpm ou PaCO2 &lt; 32 mmHg</div>
              <div>{sirs.hypothermia ? '[X]' : '[ ]'} Hipotermia &lt; 35,0°C</div>
              <div>{sirs.tachycardia ? '[X]' : '[ ]'} Taquicardia &gt; 90 bpm</div>
              <div style={{ gridColumn: 'span 2' }}>{sirs.leukocytosis ? '[X]' : '[ ]'} Leucocitose &gt; 12.000, leucopenia &lt; 4.000 ou desvio esquerdo &gt; 10%</div>
            </div>
          </div>

          <div style={{ border: '1px solid #000', padding: 6, fontSize: '10px', marginBottom: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              2. Há algum desses sinais de DISFUNÇÃO ORGÂNICA? 
              <span style={{ fontWeight: 'normal', marginLeft: 16 }}>
                Data: {od.date ? od.date.split('-').reverse().join('/') : '__/__/____'} &nbsp; Hora: {od.time || '__:__'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <div>{od.hypotension ? '[X]' : '[ ]'} PAS ≤ 90 mmHg ou PAM ≤ 65 mmHg <strong>VALOR:</strong> {od.hypotensionValue || '___'} mmHg</div>
              <div>{od.lactateAbove2 ? '[X]' : '[ ]'} Lactato &gt; 2 µmol/dl (Valor: {od.lactateValue || '___'})</div>
              <div>{od.bpDrop ? '[X]' : '[ ]'} Queda de PA &gt; 40 mmHg na PA basal</div>
              <div>{od.coagulopathy ? '[X]' : '[ ]'} Coagulopatia (INR &gt; 1,5 ou TTPA &gt; 60 seg)</div>
              <div>{od.bilirubin ? '[X]' : '[ ]'} Bilirrubina &gt; 2mg/dl</div>
              <div>{od.hypoxemia ? '[X]' : '[ ]'} Relação PaO2/FiO2 &lt; 300</div>
              <div>{od.platelets ? '[X]' : '[ ]'} Plaquetas &lt; 100.000</div>
              <div>{od.o2Need ? '[X]' : '[ ]'} Necessidade de O2 para manter SpO2&gt; 90</div>
              <div>{od.creatinineDiuresis ? '[X]' : '[ ]'} Creatinina &gt; 2,0 mg/dl ou diurese &lt; 0,5 ml/Kg/h nas últimas 2h</div>
              <div>{od.alteredConsciousness ? '[X]' : '[ ]'} Rebaixamento do nível de consciência, agitação ou delirium</div>
            </div>
          </div>

          {/* Exames Coletados & ATB */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: 6, border: '1px solid #000' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4, width: '25%', fontWeight: 'bold' }}>
                  3. Após acionamento Telefonia<br />
                  Exames coletados (*Antes de iniciar ATB)
                </td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  <div>{te.lactateCollected ? '[X]' : '[ ]'} Lactato: Valor: <strong>{te.lactateVal || '___'} µmol/dl</strong> | Data/Hora: {te.lactateDateTime || '___'}</div>
                  <div>{te.leukogramCollected ? '[X]' : '[ ]'} Ex. Laboratorial: Leuco: <strong>{te.leukogramVal || '___'}</strong> | Data/Hora: {te.leukogramDateTime || '___'}</div>
                  <div>Culturas: 
                    {te.bloodCulture ? ' [X] Hemocultura' : ' [ ] Hemocultura'} | 
                    {te.trachealAspirate ? ' [X] Aspirado Traqueal' : ' [ ] Aspirado'} | 
                    {te.urineCulture ? ' [X] Urocultura' : ' [ ] Urocultura'}
                  </div>
                  {te.otherCultures && <div>Outros: {te.otherCultures}</div>}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 4, fontWeight: 'bold' }}>ANTIBIÓTICO</td>
                <td style={{ border: '1px solid #000', padding: 4 }}>
                  Qual? <strong>{te.antibioticPrescribed || '_______________________'}</strong> &nbsp;&nbsp;&nbsp; 
                  Data/Hora Início: <strong>{te.antibioticDateTime || '____/____/________ __:__'}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 4 }}>
                  OBS.: {te.nursingNotes || 'Sem observações adicionais.'}<br />
                  <div style={{ textAlign: 'right', marginTop: 4 }}>
                    <strong>Assinatura/Carimbo Enfermagem:</strong> {te.nurseSignature || '_____________________________________'}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* SEÇÃO MÉDICO ASSISTENTE / TRR */}
          <div style={{ background: '#e2e8f0', padding: '3px 6px', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', border: '1px solid #000', marginBottom: 4 }}>
            MÉDICO ASSISTENTE / TRR
          </div>

          <div style={{ border: '1px solid #000', padding: 6, fontSize: '10px', marginBottom: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>1. O paciente tem história sugestiva de um quadro infeccioso?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
              <div>{ih.pneumonia ? '[X]' : '[ ]'} Pneumonia / Empiema</div>
              <div>{ih.skinSoftTissue ? '[X]' : '[ ]'} Pele e partes moles</div>
              <div>{ih.endocardite ? '[X]' : '[ ]'} Endocardite</div>
              <div>{ih.uti ? '[X]' : '[ ]'} Infecção urinária</div>
              <div>{ih.boneJoint ? '[X]' : '[ ]'} Infecção óssea/articular</div>
              <div>{ih.prosthesis ? '[X]' : '[ ]'} Infecção de prótese</div>
              <div>{ih.intraAbdominal ? '[X]' : '[ ]'} Infecção abdominal aguda</div>
              <div>{ih.surgicalSite ? '[X]' : '[ ]'} Infecção de ferida operatória</div>
              <div>{ih.other ? `[X] Outras: ${ih.other}` : '[ ] Outras infecções'}</div>
              <div>{ih.meningitis ? '[X]' : '[ ]'} Meningite</div>
              <div>{ih.bloodstreamCatheter ? '[X]' : '[ ]'} Corrente sang. cateter</div>
              <div>{ih.undefinedFocus ? '[X]' : '[ ]'} Sem foco definido</div>
            </div>
          </div>

          <div style={{ border: '1px solid #000', padding: 6, fontSize: '10px', marginBottom: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>2. Otimização Hemodinâmica</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <div>{ho.arterialHypotension ? '[X]' : '[ ]'} Hipotensão Arterial</div>
              <div>{ho.persistentHypotension ? '[X]' : '[ ]'} Hipotensão persistente / ameaçadora à vida</div>
              <div>{ho.volumeResponsive ? '[X]' : '[ ]'} Responsiva a volume (30ml/kg) - Valor: {ho.volumeMlCalculated ? `${ho.volumeMlCalculated} ml` : '___ ml'} (Peso: {ho.patientWeightKg || '___'} kg)</div>
              <div>{ho.vasoactiveDrugsStarted ? '[X]' : '[ ]'} Iniciado Drogas Vasoativas (Noradrenalina)</div>
              <div>{ho.corticoidStarted ? '[X]' : '[ ]'} Corticoide (não responsivo a volume e droga)</div>
              <div>{ho.centralVenousAccess ? '[X]' : '[ ]'} Acesso Venoso Central</div>
              <div>{ho.svo2Optimized ? '[X]' : '[ ]'} Otimização SvO2 &gt; 70%</div>
              <div>{ho.dobutamineStarted ? '[X]' : '[ ]'} Iniciado Dobutamina – 2,5mcg/Kg/Hora</div>
              <div>{ho.transfusionNeeded ? '[X]' : '[ ]'} Transfusão Hb &lt; 7g/dL - URGÊNCIA</div>
              <div>{ho.mechanicalVentilation24h ? '[X]' : '[ ]'} Ventilação Mecânica nas 24h</div>
            </div>
          </div>

          <div style={{ border: '1px solid #000', padding: 6, fontSize: '10px', marginBottom: 6 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>3. Apresentação Clínica</div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
              <span>{c.clinicalPresentation === 'sepse' ? '[X]' : '[ ]'} <strong>Sepse</strong></span>
              <span>{c.clinicalPresentation === 'choque_septico' ? '[X]' : '[ ]'} <strong>Choque Séptico</strong></span>
              <span>{c.clinicalPresentation === 'afastado' ? '[X]' : '[ ]'} <strong>Afastado quadro Séptico</strong></span>
            </div>
            <div>OBS: {c.medicalNotes || 'Condutas conforme diretriz.'}</div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <strong>Assinatura/Carimbo Médico TRR:</strong> {c.doctorSignature || '_____________________________________'}
            </div>
          </div>

          {/* SEÇÃO MÉDICO SCIRAS (CCIH) */}
          <div style={{ background: '#e2e8f0', padding: '3px 6px', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', border: '1px solid #000', marginBottom: 4 }}>
            MÉDICO SCIRAS (CCIH) - Data: {sc.assessmentDate ? sc.assessmentDate.split('-').reverse().join('/') : '__/__/____'}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', border: '1px solid #000' }}>
            <tbody>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Comorbidades:</strong> {sc.comorbididades || 'Nenhuma informada'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Origem do foco:</strong> {sc.focusOrigin === 'comunitario' ? '[X] Comunitário' : '[ ] Comunitário'} &nbsp;&nbsp; {sc.focusOrigin === 'hospitalar' ? '[X] Hospitalar' : '[ ] Hospitalar'}
                </td>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Foco da Infecção:</strong> {sc.specificFocus || 'Não definido'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Antibiótico Conforme:</strong> {sc.antibioticConforming ? 'Sim [X]  Não [ ]' : 'Sim [ ]  Não [X]'}
                </td>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Internação nos últimos 3 meses:</strong> {sc.hospitalizationLast3Months ? 'Sim [X]  Não [ ]' : 'Sim [ ]  Não [X]'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Impressão:</strong> {sc.scirasImpression || 'Em avaliação'}
                </td>
                <td style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Situação:</strong> {sc.scirasStatus || 'Em acompanhamento'}
                </td>
              </tr>
              {sc.discardReason && (
                <tr>
                  <td colSpan={2} style={{ border: '1px solid #000', padding: 3 }}>
                    <strong>Motivo do descarte:</strong> {sc.discardReason}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Desfecho:</strong> {sc.outcome === 'alta' ? '[X] Alta' : '[ ] Alta'} &nbsp; {sc.outcome === 'transferencia' ? '[X] Transferência' : '[ ] Transferência'} &nbsp; {sc.outcome === 'obito' ? '[X] Óbito' : '[ ] Óbito'} &nbsp; {sc.outcome === 'continua_interno' ? '[X] Continua Interno' : '[ ] Continua Interno'}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 3 }}>
                  <strong>Evolução SCIRAS:</strong> {sc.scirasEvolution || 'Auditoria clínica em acompanhamento.'}<br />
                  <div style={{ textAlign: 'right', marginTop: 4 }}>
                    <strong>Assinatura SCIRAS / CCIH:</strong> {sc.scirasDoctorSignature || '_____________________________________'}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
