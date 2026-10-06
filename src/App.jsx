import React, { useState, useEffect } from 'react';
import { AuthProvider } from './services/authContext';
import { caseService } from './services/caseService';
import { firebaseState } from './firebase/firebaseConfig';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StatisticsView from './components/StatisticsView';
import SepsisFormModal from './components/SepsisFormModal';
import PrintFichaModal from './components/PrintFichaModal';
import PendingDetailModal from './components/PendingDetailModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import LoginModal from './components/LoginModal';
import ProtocolDocumentModal from './components/ProtocolDocumentModal';
import CrisisProtocolsModal from './components/CrisisProtocolsModal';
import AntibioticGuideModal from './components/AntibioticGuideModal';
import AntibioticDetailModal from './components/AntibioticDetailModal';
import LabExamsModal from './components/LabExamsModal';
import CulturesModal from './components/CulturesModal';
import AntibioticsUsageModal from './components/AntibioticsUsageModal';
import VitalSignsModal from './components/VitalSignsModal';
import MedicalEvolutionModal from './components/MedicalEvolutionModal';
import LabTrendsModal from './components/LabTrendsModal';
import CcihEvolutionModal from './components/CcihEvolutionModal';
import ClinicalAlertModal from './components/ClinicalAlertModal';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [cases, setCases] = useState(() => caseService.getInitialCases());
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(firebaseState.isConnected);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState(null);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedCaseForPrint, setSelectedCaseForPrint] = useState(null);

  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [selectedCaseForPending, setSelectedCaseForPending] = useState(null);

  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Novos Modais Institucionais
  const [protocolDocModalOpen, setProtocolDocModalOpen] = useState(false);
  
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [crisisInitialTab, setCrisisInitialTab] = useState('hemodynamic');
  const [crisisPatient, setCrisisPatient] = useState(null);

  const [antibioticGuideModalOpen, setAntibioticGuideModalOpen] = useState(false);
  const [antibioticInitialFocus, setAntibioticInitialFocus] = useState(null);
  const [antibioticPatient, setAntibioticPatient] = useState(null);

  const [drugDetailModalOpen, setDrugDetailModalOpen] = useState(false);
  const [selectedDrugKey, setSelectedDrugKey] = useState('vancomicina');

  // Novos Modais da Coluna de Pendências & Gestão Clínica
  const [labExamsModalOpen, setLabExamsModalOpen] = useState(false);
  const [selectedCaseForLabExams, setSelectedCaseForLabExams] = useState(null);

  const [culturesModalOpen, setCulturesModalOpen] = useState(false);
  const [selectedCaseForCultures, setSelectedCaseForCultures] = useState(null);

  const [antibioticsUsageModalOpen, setAntibioticsUsageModalOpen] = useState(false);
  const [selectedCaseForAntibioticsUsage, setSelectedCaseForAntibioticsUsage] = useState(null);

  const [vitalSignsModalOpen, setVitalSignsModalOpen] = useState(false);
  const [selectedCaseForVitalSigns, setSelectedCaseForVitalSigns] = useState(null);

  const [medicalEvolutionModalOpen, setMedicalEvolutionModalOpen] = useState(false);
  const [selectedCaseForMedicalEvolution, setSelectedCaseForMedicalEvolution] = useState(null);

  const [labTrendsModalOpen, setLabTrendsModalOpen] = useState(false);
  const [selectedCaseForLabTrends, setSelectedCaseForLabTrends] = useState(null);

  const [ccihEvolutionModalOpen, setCcihEvolutionModalOpen] = useState(false);
  const [selectedCaseForCcihEvolution, setSelectedCaseForCcihEvolution] = useState(null);

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedCaseForAlert, setSelectedCaseForAlert] = useState(null);

  // PWA Install prompt handling
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // CRUD Handlers
  const handleOpenNewCase = () => {
    setSelectedCaseForEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEditCase = (caseData) => {
    setSelectedCaseForEdit(caseData);
    setFormModalOpen(true);
  };

  const handleSaveCase = async (caseData) => {
    let updatedCases;
    const exists = cases.some(c => c.id === caseData.id);

    if (exists) {
      updatedCases = cases.map(c => c.id === caseData.id ? caseData : c);
    } else {
      updatedCases = [caseData, ...cases];
    }

    setCases(updatedCases);
    caseService.saveCasesLocally(updatedCases);

    if (isFirebaseConnected) {
      await caseService.syncWithFirestore(updatedCases);
    }
  };

  const handleDeleteCase = async (caseId) => {
    const updatedCases = cases.filter(c => c.id !== caseId);
    setCases(updatedCases);
    caseService.saveCasesLocally(updatedCases);

    if (isFirebaseConnected) {
      await caseService.syncWithFirestore(updatedCases);
    }
  };

  const handleOpenPrint = (caseData) => {
    setSelectedCaseForPrint(caseData);
    setPrintModalOpen(true);
  };

  const handleOpenPendencies = (caseData) => {
    setSelectedCaseForPending(caseData);
    setPendingModalOpen(true);
  };

  // Handlers para os novos recursos
  const handleOpenCrisisProtocols = (tab = 'hemodynamic', patient = null) => {
    setCrisisInitialTab(tab);
    setCrisisPatient(patient);
    setCrisisModalOpen(true);
  };

  const handleOpenAntibioticGuide = (focus = null, patient = null) => {
    setAntibioticInitialFocus(focus);
    setAntibioticPatient(patient);
    setAntibioticGuideModalOpen(true);
  };

  const handleOpenDrugDetail = (drugKey = 'vancomicina') => {
    setSelectedDrugKey(drugKey);
    setDrugDetailModalOpen(true);
  };

  // Handlers para os modais da coluna de pendências e gestão clínica
  const handleOpenLabExams = (caseData) => {
    setSelectedCaseForLabExams(caseData);
    setLabExamsModalOpen(true);
  };

  const handleOpenCultures = (caseData) => {
    setSelectedCaseForCultures(caseData);
    setCulturesModalOpen(true);
  };

  const handleOpenAntibioticsUsage = (caseData) => {
    setSelectedCaseForAntibioticsUsage(caseData);
    setAntibioticsUsageModalOpen(true);
  };

  const handleOpenVitalSigns = (caseData) => {
    setSelectedCaseForVitalSigns(caseData);
    setVitalSignsModalOpen(true);
  };

  const handleOpenMedicalEvolution = (caseData) => {
    setSelectedCaseForMedicalEvolution(caseData);
    setMedicalEvolutionModalOpen(true);
  };

  const handleOpenLabTrends = (caseData) => {
    setSelectedCaseForLabTrends(caseData);
    setLabTrendsModalOpen(true);
  };

  const handleOpenCcihEvolution = (caseData) => {
    setSelectedCaseForCcihEvolution(caseData);
    setCcihEvolutionModalOpen(true);
  };

  const handleOpenAlertDetails = (caseData) => {
    setSelectedCaseForAlert(caseData);
    setAlertModalOpen(true);
  };

  const handleApplySchemeToActiveForm = (schemeText) => {
    if (selectedCaseForEdit) {
      const updated = {
        ...selectedCaseForEdit,
        telemetryAndExams: {
          ...selectedCaseForEdit.telemetryAndExams,
          antibioticPrescribed: schemeText
        }
      };
      setSelectedCaseForEdit(updated);
      handleSaveCase(updated);
    }
    setAntibioticGuideModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <div className="no-print">
        <Navbar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onNewCase={handleOpenNewCase}
          onOpenFirebaseConfig={() => setFirebaseModalOpen(true)}
          onOpenLogin={() => setLoginModalOpen(true)}
          isFirebaseConnected={isFirebaseConnected}
          deferredPrompt={deferredPrompt}
          onInstallPwa={handleInstallPwa}
          onOpenProtocolDoc={() => setProtocolDocModalOpen(true)}
          onOpenCrisisProtocols={handleOpenCrisisProtocols}
          onOpenAntibioticGuide={handleOpenAntibioticGuide}
        />
      </div>

      {/* Main Tab Views */}
      <main style={{ flex: 1 }}>
        {currentTab === 'dashboard' ? (
          <Dashboard 
            cases={cases}
            onNewCase={handleOpenNewCase}
            onEditCase={handleOpenEditCase}
            onPrintCase={handleOpenPrint}
            onDeleteCase={handleDeleteCase}
            onOpenPendencies={handleOpenPendencies}
            onOpenProtocolDoc={() => setProtocolDocModalOpen(true)}
            onOpenCrisisProtocols={handleOpenCrisisProtocols}
            onOpenAntibioticGuide={handleOpenAntibioticGuide}
            onOpenDrugDetail={handleOpenDrugDetail}
            onOpenLabExams={handleOpenLabExams}
            onOpenCultures={handleOpenCultures}
            onOpenAntibioticsUsage={handleOpenAntibioticsUsage}
            onOpenVitalSigns={handleOpenVitalSigns}
            onOpenMedicalEvolution={handleOpenMedicalEvolution}
            onOpenLabTrends={handleOpenLabTrends}
            onOpenCcihEvolution={handleOpenCcihEvolution}
            onOpenAlertDetails={handleOpenAlertDetails}
          />
        ) : (
          <StatisticsView cases={cases} />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-surface-border)',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--color-text-dim)',
        marginTop: 40
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <strong>Rastreia Sepse</strong> • Protocolo de Gerenciamento de Sepse (PTI.001.00 - Rev. 01)
          </div>
          <div>
            Complexo de Doenças Infectocontagiosas Dr. Clementino Fraga • Governo da Paraíba
          </div>
        </div>
      </footer>

      {/* Clinical Form Modal (Ficha de Triagem Adulto) */}
      <SepsisFormModal 
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={selectedCaseForEdit}
        onSave={handleSaveCase}
        onOpenCrisisProtocols={handleOpenCrisisProtocols}
        onOpenAntibioticGuide={handleOpenAntibioticGuide}
        onOpenDrugDetail={handleOpenDrugDetail}
      />

      {/* Official Print/PDF Modal */}
      <PrintFichaModal 
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        caseData={selectedCaseForPrint}
      />

      {/* Pendencies & 1-Hour Bundle Modal */}
      <PendingDetailModal 
        isOpen={pendingModalOpen}
        onClose={() => setPendingModalOpen(false)}
        caseData={selectedCaseForPending}
        onEditCase={handleOpenEditCase}
      />

      {/* Firebase Database Configuration Modal */}
      <FirebaseConfigModal 
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        isConnected={isFirebaseConnected}
        onConfigSaved={(connected) => setIsFirebaseConnected(connected)}
      />

      {/* Login & Healthcare Professional Registration Modal */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Modal 1: Leitor do Documento Oficial PTI.001.00 */}
      <ProtocolDocumentModal 
        isOpen={protocolDocModalOpen}
        onClose={() => setProtocolDocModalOpen(false)}
      />

      {/* Modal 2: Condutas em Situações de Crise & KDIGO */}
      <CrisisProtocolsModal 
        isOpen={crisisModalOpen}
        onClose={() => setCrisisModalOpen(false)}
        initialTab={crisisInitialTab}
        currentPatient={crisisPatient}
      />

      {/* Modal 3: Guia de Antibióticos & Antibiograma */}
      <AntibioticGuideModal 
        isOpen={antibioticGuideModalOpen}
        onClose={() => setAntibioticGuideModalOpen(false)}
        onSelectDrugForDetail={handleOpenDrugDetail}
        onApplySchemeToPatient={handleApplySchemeToActiveForm}
        initialFocus={antibioticInitialFocus}
        currentPatient={antibioticPatient}
      />

      {/* Modal 4: Bula Técnica Detalhada do Fármaco */}
      <AntibioticDetailModal 
        isOpen={drugDetailModalOpen}
        onClose={() => setDrugDetailModalOpen(false)}
        drugKey={selectedDrugKey}
      />

      {/* 1. Modal de Exames Laboratoriais & Imagem */}
      <LabExamsModal 
        isOpen={labExamsModalOpen}
        onClose={() => setLabExamsModalOpen(false)}
        caseData={selectedCaseForLabExams}
        onSaveCase={handleSaveCase}
      />

      {/* 2. Modal de Culturas & Antibiograma (TSA) */}
      <CulturesModal 
        isOpen={culturesModalOpen}
        onClose={() => setCulturesModalOpen(false)}
        caseData={selectedCaseForCultures}
        onSaveCase={handleSaveCase}
      />

      {/* 3. Modal de Antibióticos Utilizados & Modificações */}
      <AntibioticsUsageModal 
        isOpen={antibioticsUsageModalOpen}
        onClose={() => setAntibioticsUsageModalOpen(false)}
        caseData={selectedCaseForAntibioticsUsage}
        onSaveCase={handleSaveCase}
      />

      {/* 4. Modal de Evolução de Sinais Vitais (Enfermagem) */}
      <VitalSignsModal 
        isOpen={vitalSignsModalOpen}
        onClose={() => setVitalSignsModalOpen(false)}
        caseData={selectedCaseForVitalSigns}
        onSaveCase={handleSaveCase}
      />

      {/* 5. Modal de Evolução Médica */}
      <MedicalEvolutionModal 
        isOpen={medicalEvolutionModalOpen}
        onClose={() => setMedicalEvolutionModalOpen(false)}
        caseData={selectedCaseForMedicalEvolution}
        onSaveCase={handleSaveCase}
      />

      {/* 6. Modal de Estatísticas & Tendência de Exames */}
      <LabTrendsModal 
        isOpen={labTrendsModalOpen}
        onClose={() => setLabTrendsModalOpen(false)}
        caseData={selectedCaseForLabTrends}
      />

      {/* 7. Modal de Tabela de Evolução da CCIH */}
      <CcihEvolutionModal 
        isOpen={ccihEvolutionModalOpen}
        onClose={() => setCcihEvolutionModalOpen(false)}
        caseData={selectedCaseForCcihEvolution}
        onSaveCase={handleSaveCase}
      />

      {/* 8. Modal de Sinais de Alerta Críticos (Blink na Dashboard) */}
      <ClinicalAlertModal 
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        caseData={selectedCaseForAlert}
        onOpenCrisisProtocols={handleOpenCrisisProtocols}
        onOpenAntibioticGuide={handleOpenAntibioticGuide}
        onOpenLabExams={handleOpenLabExams}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
