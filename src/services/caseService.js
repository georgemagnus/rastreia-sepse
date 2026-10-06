import { INITIAL_CASES } from '../data/mockCases';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { checkAntibiogramMismatch } from '../data/antibioticsGuide';

const LOCAL_CASES_KEY = 'rastreia_sepse_cases_data';

// Helper to calculate evolution days and hours
export function calculateEvolution(caseData) {
  try {
    let startDate;
    if (caseData.protocolOpening?.date && caseData.protocolOpening?.time) {
      startDate = new Date(`${caseData.protocolOpening.date}T${caseData.protocolOpening.time}:00`);
    } else if (caseData.createdAt) {
      startDate = new Date(caseData.createdAt);
    } else {
      return { days: 0, text: "D0 (recente)", hours: 0 };
    }

    const now = new Date();
    const diffMs = Math.max(0, now - startDate);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;

    let text = `D${days}`;
    if (days === 0) {
      text = `D0 (${totalHours}h)`;
    } else if (days < 3) {
      text = `D${days} (${remHours}h)`;
    }

    return { days, hours: totalHours, text };
  } catch (e) {
    return { days: 0, text: "D0", hours: 0 };
  }
}

// Calculate pending clinical items for quick-view modal and dashboard icons
export function checkCasePendencies(caseData) {
  const mismatch = checkAntibiogramMismatch(
    caseData.telemetryAndExams?.antibioticPrescribed,
    caseData.telemetryAndExams?.isolatedPathogen,
    caseData.telemetryAndExams?.antibiogramResistance || []
  );

  const flags = {
    lactate: {
      status: caseData.telemetryAndExams?.lactateCollected ? 'ok' : 'pending',
      value: caseData.telemetryAndExams?.lactateVal || '',
      label: caseData.telemetryAndExams?.lactateCollected ? `Lactato: ${caseData.telemetryAndExams.lactateVal} µmol/dl` : 'Lactato não coletado'
    },
    cultures: {
      status: caseData.telemetryAndExams?.bloodCulture ? 'ok' : 'pending',
      label: caseData.telemetryAndExams?.bloodCulture ? 'Hemoculturas coletadas' : 'Hemoculturas pendentes (coletar antes do ATB)'
    },
    antibiotic: {
      status: caseData.telemetryAndExams?.antibioticPrescribed ? 'ok' : 'pending',
      value: caseData.telemetryAndExams?.antibioticPrescribed || '',
      label: caseData.telemetryAndExams?.antibioticPrescribed ? `ATB: ${caseData.telemetryAndExams.antibioticPrescribed}` : 'Antibiótico NÃO iniciado (Atenção Golden Hour!)'
    },
    antibiogram: {
      status: mismatch.hasMismatch ? 'mismatch' : 'ok',
      hasMismatch: mismatch.hasMismatch,
      details: mismatch.mismatchDetails,
      label: mismatch.hasMismatch ? 'Incompatibilidade de Antibiograma!' : 'Antibiograma compatível'
    },
    medicalEvaluation: {
      status: (caseData.medicalAssessment?.date && caseData.clinicalPresentation) ? 'ok' : 'pending',
      label: caseData.clinicalPresentation ? `Classificação: ${caseData.clinicalPresentation.toUpperCase()}` : 'Avaliação Médica / TRR pendente'
    },
    sciras: {
      status: caseData.sciras?.scirasStatus ? 'ok' : 'pending',
      label: caseData.sciras?.scirasStatus ? `SCIRAS: ${caseData.sciras.scirasStatus}` : 'Auditoria SCIRAS/CCIH pendente'
    }
  };

  const pendingCount = Object.values(flags).filter(f => f.status === 'pending').length;
  return { flags, pendingCount, mismatch };
}

// Check count of SIRS criteria
export function countSirsCriteria(sirs = {}) {
  let count = 0;
  if (sirs.fever) count++;
  if (sirs.hypothermia) count++;
  if (sirs.leukocytosis) count++;
  if (sirs.tachypnea) count++;
  if (sirs.tachycardia) count++;
  return count;
}

// Check count of organ dysfunction
export function countOrganDysfunctions(od = {}) {
  let count = 0;
  if (od.hypotension) count++;
  if (od.bpDrop) count++;
  if (od.bilirubin) count++;
  if (od.platelets) count++;
  if (od.creatinineDiuresis) count++;
  if (od.lactateAbove2) count++;
  if (od.coagulopathy) count++;
  if (od.hypoxemia) count++;
  if (od.o2Need) count++;
  if (od.alteredConsciousness) count++;
  return count;
}

// Calculate 30ml/kg resuscitation volume
export function calculateVolume(weightKg) {
  const w = parseFloat(weightKg);
  if (isNaN(w) || w <= 0) return 0;
  return Math.round(w * 30);
}

export const caseService = {
  getInitialCases: () => {
    try {
      const stored = localStorage.getItem(LOCAL_CASES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored cases', e);
    }
    // Seed default
    localStorage.setItem(LOCAL_CASES_KEY, JSON.stringify(INITIAL_CASES));
    return INITIAL_CASES;
  },

  saveCasesLocally: (cases) => {
    try {
      localStorage.setItem(LOCAL_CASES_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Error saving cases locally', e);
    }
  },

  syncWithFirestore: async (cases) => {
    if (!db) return false;
    try {
      const colRef = collection(db, 'casos_sepse');
      for (const c of cases) {
        await setDoc(doc(colRef, c.id), c, { merge: true });
      }
      return true;
    } catch (err) {
      console.warn('Firestore sync failed, local copy active:', err);
      return false;
    }
  }
};
