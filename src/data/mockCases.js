export const INITIAL_CASES = [
  {
    id: "caso-sep-001",
    patientName: "Maria das Graças da Silva",
    birthDate: "1958-04-12",
    age: "68",
    motherName: "Francisca Maria da Silva",
    medicalRecord: "PR-849201",
    bed: "Enfermaria Clínica - Leito 12",
    admissionDate: "2026-10-04",
    initialDiagnosis: "Pneumonia Adquirida na Comunidade (PAC) grave",
    status: "sepse", // 'sepse' | 'choque_septico' | 'afastado' | 'em_investigacao'
    evolutionDays: 2,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    
    // Tempos de acionamento
    telephony5050: {
      called: true,
      date: "2026-10-04",
      time: "10:15",
      operatorName: "Carla Santos - Ramal 5050"
    },
    medicalAssessment: {
      date: "2026-10-04",
      time: "10:30"
    },
    protocolOpening: {
      date: "2026-10-04",
      time: "10:35",
      ward: "Pronto Atendimento / Triagem"
    },
    protocolExclusion: {
      date: "",
      time: "",
      ward: "",
      reason: ""
    },

    // Enfermagem
    sirsCriteria: {
      fever: true, // > 37.8
      hypothermia: false,
      leukocytosis: true, // > 12.000
      tachypnea: true, // > 20 irpm
      tachycardia: true, // > 90 bpm
      date: "2026-10-04",
      time: "10:10",
      ward: "PA Triagem"
    },
    organDysfunction: {
      hypotension: true,
      hypotensionValue: "85/50",
      bpDrop: false,
      bilirubin: false,
      platelets: false,
      creatinineDiuresis: true,
      lactateAbove2: true,
      lactateValue: "3.2",
      coagulopathy: false,
      hypoxemia: true,
      o2Need: true,
      alteredConsciousness: true,
      date: "2026-10-04",
      time: "10:15"
    },
    telemetryAndExams: {
      lactateCollected: true,
      lactateVal: "3.2",
      lactateDateTime: "2026-10-04T10:25",
      bloodGasAttached: true,
      leukogramCollected: true,
      leukogramVal: "18.400 (12% bastões)",
      leukogramDateTime: "2026-10-04T10:25",
      bloodCulture: true,
      bloodCultureDateTime: "2026-10-04T10:30",
      trachealAspirate: false,
      trachealAspirateDateTime: "",
      urineCulture: true,
      urineCultureDateTime: "2026-10-04T10:45",
      otherCultures: "",
      otherCulturesDateTime: "",
      antibioticPrescribed: "Ceftriaxona 2g EV + Claritromicina 500mg EV",
      antibioticDateTime: "2026-10-04T11:05", // Iniciado em 50 min (dentro de 1h)
      nursingNotes: "Protocolo aberto prontamente após identificação de dispneia intensa e sonolência. Coletado par de hemoculturas antes do início da primeira dose do antimicrobiano.",
      nurseSignature: "Enf. Rodrigo Lima - COREN-PB 452.189"
    },

    // Médico Assistente / TRR
    infectionHistory: {
      pneumonia: true,
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
      arterialHypotension: true,
      volumeResponsive: true,
      patientWeightKg: "70",
      volumeMlCalculated: "2100", // 30ml/kg
      persistentHypotension: false,
      vasoactiveDrugsStarted: false,
      corticoidStarted: false,
      centralVenousAccess: false,
      svo2Optimized: true,
      dobutamineStarted: false,
      transfusionNeeded: false,
      mechanicalVentilation24h: false
    },
    clinicalPresentation: "sepse",
    medicalNotes: "Paciente respondeu satisfatoriamente à expansão volêmica com Cristalóide (30 ml/kg em 45 minutos). PAM recuperada para 74 mmHg. Mantém cateter nasal de O2 a 2L/min.",
    doctorSignature: "Dr. Alexandre Nóbrega - CRM-PB 11.450 (TRR)",

    // SCIRAS / CCIH
    sciras: {
      assessmentDate: "2026-10-05",
      comorbididades: "Hipertensão Arterial Sistêmica, Diabetes Mellitus tipo 2",
      focusOrigin: "comunitario",
      specificFocus: "Pulmonar",
      antibioticConforming: true,
      hospitalizationLast3Months: false,
      scirasImpression: "sepse",
      scirasStatus: "em_acompanhamento",
      discardReason: "",
      outcome: "continua_interno",
      scirasEvolution: "Caso confirmado de Sepse de foco Pulmonar comunitário. Conduta alinhada com diretriz institucional. Hemoculturas parciais negativas em 48h. Segue em melhora clínica com desmame de oxigênio.",
      scirasDoctorSignature: "Dra. Patrícia Albuquerque - CRM-PB 9.870 (CCIH)"
    }
  },
  {
    id: "caso-sep-002",
    patientName: "João Batista de Oliveira",
    birthDate: "1964-11-20",
    age: "61",
    motherName: "Alzira de Oliveira",
    medicalRecord: "PR-771403",
    bed: "UTI Geral - Leito 04",
    admissionDate: "2026-10-05",
    initialDiagnosis: "Abdome Agudo Perfurativo / Peritonite",
    status: "choque_septico",
    evolutionDays: 1,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),

    telephony5050: {
      called: true,
      date: "2026-10-05",
      time: "14:00",
      operatorName: "Marcos Vinicius - Ramal 5050"
    },
    medicalAssessment: {
      date: "2026-10-05",
      time: "14:10"
    },
    protocolOpening: {
      date: "2026-10-05",
      time: "14:15",
      ward: "Centro Cirúrgico / RPA"
    },
    protocolExclusion: {
      date: "",
      time: "",
      ward: "",
      reason: ""
    },

    sirsCriteria: {
      fever: false,
      hypothermia: true, // < 35°C
      leukocytosis: true,
      tachypnea: true,
      tachycardia: true,
      date: "2026-10-05",
      time: "14:00",
      ward: "RPA"
    },
    organDysfunction: {
      hypotension: true,
      hypotensionValue: "70/40",
      bpDrop: true,
      bilirubin: true,
      platelets: true,
      creatinineDiuresis: true,
      lactateAbove2: true,
      lactateValue: "4.8",
      coagulopathy: true,
      hypoxemia: true,
      o2Need: true,
      alteredConsciousness: true,
      date: "2026-10-05",
      time: "14:05"
    },
    telemetryAndExams: {
      lactateCollected: true,
      lactateVal: "4.8",
      lactateDateTime: "2026-10-05T14:15",
      bloodGasAttached: true,
      leukogramCollected: true,
      leukogramVal: "24.500 (20% bastões)",
      leukogramDateTime: "2026-10-05T14:15",
      bloodCulture: true,
      bloodCultureDateTime: "2026-10-05T14:20",
      trachealAspirate: false,
      trachealAspirateDateTime: "",
      urineCulture: true,
      urineCultureDateTime: "2026-10-05T14:20",
      otherCultures: "Swab de secreção peritoneal na cirurgia",
      otherCulturesDateTime: "2026-10-05T13:30",
      antibioticPrescribed: "Meropenem 1g EV + Vancomicina 1g EV",
      antibioticDateTime: "2026-10-05T14:40",
      nursingNotes: "Instabilidade hemodinâmica grave após laparotomia exploradora. Iniciada infusão de noradrenalina em bomba de infusão contínua.",
      nurseSignature: "Enf. Camila Vasconcelos - COREN-PB 398.201"
    },

    infectionHistory: {
      pneumonia: false,
      uti: false,
      intraAbdominal: true,
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
      arterialHypotension: true,
      volumeResponsive: false,
      patientWeightKg: "80",
      volumeMlCalculated: "2400",
      persistentHypotension: true,
      vasoactiveDrugsStarted: true, // Noradrenalina
      corticoidStarted: true,
      centralVenousAccess: true,
      svo2Optimized: false,
      dobutamineStarted: false,
      transfusionNeeded: false,
      mechanicalVentilation24h: true
    },
    clinicalPresentation: "choque_septico",
    medicalNotes: "Choque séptico refratário à volume. PAM < 65 mantida sob Noradrenalina 0.4 mcg/kg/min. Gasometria arterial com acidose lática grave. Paciente entubado em ventilação protetora.",
    doctorSignature: "Dr. Eduardo Meireles - CRM-PB 14.210 (Médico Intensivista)",

    sciras: {
      assessmentDate: "2026-10-06",
      comorbididades: "Tabagismo, Doença Ulcerosa Péptica",
      focusOrigin: "hospitalar",
      specificFocus: "Abdominal",
      antibioticConforming: true,
      hospitalizationLast3Months: true,
      scirasImpression: "choque_septico",
      scirasStatus: "em_acompanhamento",
      discardReason: "",
      outcome: "continua_interno",
      scirasEvolution: "Paciente com Choque Séptico secundário à peritonite fecal. Escalonamento antibiótico conforme perfil microbiológico institucional da UTI.",
      scirasDoctorSignature: "Dra. Patrícia Albuquerque - CRM-PB 9.870 (CCIH)"
    }
  },
  {
    id: "caso-sep-003",
    patientName: "Antônio Ferreira Ramos",
    birthDate: "1975-08-30",
    age: "51",
    motherName: "Tereza Ferreira Ramos",
    medicalRecord: "PR-650119",
    bed: "Clínica Médica - Leito 08",
    admissionDate: "2026-10-06",
    initialDiagnosis: "Febre a esclarecer / ITU suspeita",
    status: "afastado",
    evolutionDays: 0,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),

    telephony5050: {
      called: true,
      date: "2026-10-06",
      time: "09:00",
      operatorName: "Carla Santos - Ramal 5050"
    },
    medicalAssessment: {
      date: "2026-10-06",
      time: "09:20"
    },
    protocolOpening: {
      date: "2026-10-06",
      time: "09:25",
      ward: "Clínica Médica"
    },
    protocolExclusion: {
      date: "2026-10-06",
      time: "12:00",
      ward: "Clínica Médica",
      reason: "Infecção sem disfunção orgânica (ITU baixa com parâmetros vitais e lactato normais)"
    },

    sirsCriteria: {
      fever: true,
      hypothermia: false,
      leukocytosis: false,
      tachypnea: false,
      tachycardia: true,
      date: "2026-10-06",
      time: "08:50",
      ward: "Clínica Médica"
    },
    organDysfunction: {
      hypotension: false,
      hypotensionValue: "120/80",
      bpDrop: false,
      bilirubin: false,
      platelets: false,
      creatinineDiuresis: false,
      lactateAbove2: false,
      lactateValue: "1.1",
      coagulopathy: false,
      hypoxemia: false,
      o2Need: false,
      alteredConsciousness: false,
      date: "2026-10-06",
      time: "09:00"
    },
    telemetryAndExams: {
      lactateCollected: true,
      lactateVal: "1.1",
      lactateDateTime: "2026-10-06T09:15",
      bloodGasAttached: false,
      leukogramCollected: true,
      leukogramVal: "9.800 (sem desvio)",
      leukogramDateTime: "2026-10-06T09:15",
      bloodCulture: true,
      bloodCultureDateTime: "2026-10-06T09:30",
      trachealAspirate: false,
      trachealAspirateDateTime: "",
      urineCulture: true,
      urineCultureDateTime: "2026-10-06T09:30",
      otherCultures: "",
      otherCulturesDateTime: "",
      antibioticPrescribed: "Ciprofloxacino 500mg VO",
      antibioticDateTime: "2026-10-06T10:15",
      nursingNotes: "Paciente lúcido, orientado, afebril após antitérmico. Pressão arterial mantida e diurese clara preservada.",
      nurseSignature: "Enf. Rodrigo Lima - COREN-PB 452.189"
    },

    infectionHistory: {
      pneumonia: false,
      uti: true,
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
      patientWeightKg: "75",
      volumeMlCalculated: "2250",
      persistentHypotension: false,
      vasoactiveDrugsStarted: false,
      corticoidStarted: false,
      centralVenousAccess: false,
      svo2Optimized: true,
      dobutamineStarted: false,
      transfusionNeeded: false,
      mechanicalVentilation24h: false
    },
    clinicalPresentation: "afastado",
    medicalNotes: "Afastado diagnóstico de sepse. Paciente apresenta infecção do trato urinário sem evidência de disfunções orgânicas ou repercussão sistêmica. Protocolo excluído.",
    doctorSignature: "Dr. Alexandre Nóbrega - CRM-PB 11.450 (TRR)",

    sciras: {
      assessmentDate: "2026-10-06",
      comorbididades: "Nenhuma prévia",
      focusOrigin: "comunitario",
      specificFocus: "Urinário",
      antibioticConforming: true,
      hospitalizationLast3Months: false,
      scirasImpression: "afastado",
      scirasStatus: "descartado",
      discardReason: "Infecção sem disfunção orgânica",
      outcome: "continua_interno",
      scirasEvolution: "Caso revisado. Preenche critérios para ITU simples sem sepse. Protocolo encerrado com segurança.",
      scirasDoctorSignature: "Dra. Patrícia Albuquerque - CRM-PB 9.870 (CCIH)"
    }
  }
];
