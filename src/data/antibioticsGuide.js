export const ANTIBIOTIC_SCHEMES = [
  {
    foco: "Foco Não Identificado",
    observacoes: "Paciente grave sem sítio infeccioso primário esclarecido",
    drugs: "Vancomicina + Meropenem",
    regimeText: "Vancomicina 25-30mg/Kg ataque (máx 2g) e manutenção 15-20mg/Kg 12/12h + Meropenem 2g ataque e manutenção 1 ou 2g 8/8h",
    recommendedMeds: ["vancomicina", "meropenem"],
    spectrum: "Amplo espectro (Gram-positivos incluindo MRSA + Gram-negativos multirresistentes e anaeróbios)"
  },
  {
    foco: "Pulmonar (Sem FR para IRAS)",
    observacoes: "Pneumonia Adquirida na Comunidade (PAC) grave sem internação recente",
    drugs: "Ceftriaxona + Azitromicina",
    regimeText: "Ceftriaxona 2g EV ataque e manutenção 1g 12/12h + Azitromicina 500mg EV/VO 1x/dia",
    recommendedMeds: ["ceftriaxona", "azitromicina"],
    spectrum: "S. pneumoniae, H. influenzae, germes atípicos (Legionella, Mycoplasma, Chlamydia)"
  },
  {
    foco: "Pulmonar (Com FR para IRAS)",
    observacoes: "Pneumonia hospitalar ou associada à ventilação mecânica",
    drugs: "Cefepime OU Tazocin (Piperacilina/Tazobactam)",
    regimeText: "Cefepime 2g EV ataque e manutenção 2g 8/8h ou 12/12h OU Tazocin 4,5g EV 6/6h (infusão estendida)",
    recommendedMeds: ["cefepime", "tazocin"],
    spectrum: "Pseudomonas aeruginosa, Enterobactérias, S. aureus oxacilina-sensível"
  },
  {
    foco: "Pulmonar (Com FR para Microrganismos MDR)",
    observacoes: "Alto risco de bactérias produtoras de carbapenemases (KPC, metallo) ou MRSA",
    drugs: "Meropenem +/- Polimixina B +/- Vancomicina",
    regimeText: "Meropenem 2g ataque e 1-2g 8/8h +/- Polimixina B (ataque 25.000 UI/Kg, manutenção 15.000-25.000 UI/Kg/dia 12/12h) +/- Vancomicina",
    recommendedMeds: ["meropenem", "polimixina", "vancomicina"],
    spectrum: "Bactérias Gram-negativas ultrarresistentes (CRKP, Acinetobacter) e MRSA"
  },
  {
    foco: "Urinário (Sem FR para Pseudomonas)",
    observacoes: "Sepse de foco urinário comunitário",
    drugs: "Ceftriaxona",
    regimeText: "Ceftriaxona 2g EV ataque e manutenção 1g 12/12h EV",
    recommendedMeds: ["ceftriaxona"],
    spectrum: "E. coli, Klebsiella pneumoniae sensível, Proteus mirabilis"
  },
  {
    foco: "Urinário (Com FR para Pseudomonas)",
    observacoes: "Uso prévio de cateter vesical, manipulação urológica recente ou imunossupressão",
    drugs: "Cefepime OU Tazocin",
    regimeText: "Cefepime 2g EV ataque e manutenção 2g 8/8h ou 12/12h OU Tazocin 4,5g EV 6/6h",
    recommendedMeds: ["cefepime", "tazocin"],
    spectrum: "Pseudomonas aeruginosa, bacilos Gram-negativos produtores de AmpC"
  },
  {
    foco: "Abdominal",
    observacoes: "Peritonite, apendicite complicada, colecistite aguda, perfuração de víscera oca",
    drugs: "Ceftriaxona + Metronidazol",
    regimeText: "Ceftriaxona 2g EV ataque e manutenção 1g 12/12h + Metronidazol 500mg EV 8/8h",
    recommendedMeds: ["ceftriaxona", "metronidazol"],
    spectrum: "Enterobactérias + Anaeróbios entéricos (Bacteroides fragilis)"
  },
  {
    foco: "Pele e Partes Moles",
    observacoes: "Fasciite necrosante, celulite grave, infecção de ferida cirúrgica extensa",
    drugs: "Vancomicina OU Linezolida OU Teicoplanina",
    regimeText: "Vancomicina 25-30mg/Kg ataque (máx 2g) e manutenção 15-20mg/Kg 12/12h OU Linezolida 600mg EV 12/12h OU Teicoplanina 6mg/Kg 12/12h (3 doses, depois 24/24h)",
    recommendedMeds: ["vancomicina", "linezolida", "teicoplanina"],
    spectrum: "Staphylococcus aureus (incluindo MRSA) e Streptococcus pyogenes"
  },
  {
    foco: "Neutropenia Febril",
    observacoes: "Neutrófilos < 500/mm³ com febre > 38,3°C",
    drugs: "Cefepime OU Meropenem (+ Vancomicina se instabilidade)",
    regimeText: "Cefepime 2g ataque e manutenção 2g 8/8h OU Meropenem 2g 8/8h. Se hipotensão/instabilidade hemodinâmica associar Vancomicina.",
    recommendedMeds: ["cefepime", "meropenem", "vancomicina"],
    spectrum: "Antipseudomonas de ampla cobertura empírica imediata"
  }
];

// Fichas técnicas / Bulas detalhadas
export const DRUG_TECHNICAL_SHEETS = {
  vancomicina: {
    id: "vancomicina",
    name: "Vancomicina (Cloridrato)",
    category: "Glicopeptídeo",
    indicationSepsis: "Cobertura de Gram-positivos multirresistentes (MRSA, Enterococcus sensíveis, estafilococos coagulase-negativa em cateter).",
    mechanism: "Inibe a síntese da parede celular bacteriana por ligação de alta afinidade ao término D-alanil-D-alanina dos precursores de peptideoglicano.",
    dosingStandard: {
      attack: "25 a 30 mg/kg de peso corporal (dose máxima inicial de 2.000 mg em infusão lenta de 2 horas).",
      maintenance: "15 a 20 mg/kg/dose por via intravenosa a cada 8 a 12 horas (iniciar 12h após dose de ataque)."
    },
    renalAdjustment: [
      { clcr: "> 50 mL/min", dose: "15-20 mg/kg a cada 12 horas" },
      { clcr: "20 a 49 mL/min", dose: "15-20 mg/kg a cada 24 horas" },
      { clcr: "< 20 mL/min", dose: "15-20 mg/kg a cada 48 horas ou guiado por nível sérico" },
      { clcr: "Hemodiálise", dose: "Dose de ataque 20-25 mg/kg; redosar após sessão ou quando nível < 15-20 mcg/mL" }
    ],
    therapeuticMonitoring: "Monitorar Vancocinemia de vale (imediatamente antes da 4ª dose). Alvo terapêutico na sepse grave: 15 a 20 mcg/mL (ou AUC/MIC entre 400 e 600).",
    adverseEffects: "Nefrotoxicidade (especialmente se combinada com piperacilina/tazobactam ou aminoglicosídeos), Síndrome do Homem Vermelho (reação anafilactoide se infundida muito rápido), flebite, ototoxicidade rara.",
    infusionTips: "Diluir em SF 0,9% ou SG 5% (concentração máx. 5 mg/mL). Tempo de infusão mínimo: 60 minutos para cada 1.000 mg (120 minutos para 2.000 mg) para evitar flushing histamínico."
  },
  meropenem: {
    id: "meropenem",
    name: "Meropenem",
    category: "Carbapenêmico",
    indicationSepsis: "Infecções graves por enterobactérias produtoras de ESBL, Pseudomonas aeruginosa e foco intra-abdominal/pulmonar grave.",
    mechanism: "Bactericida por inibição das proteínas ligadoras de penicilina (PBPs 2 e 3), impedindo a síntese da parede celular bacteriana. Estável contra a maioria das beta-lactamases, exceto carbapenemases (KPC, MBL, OXA-48).",
    dosingStandard: {
      attack: "2g IV em bolus ou infusão estendida de 3 horas.",
      maintenance: "1g a 2g IV a cada 8 horas (preferencialmente em infusão estendida de 3 horas para otimizar tempo acima da MIC: T > MIC)."
    },
    renalAdjustment: [
      { clcr: "> 50 mL/min", dose: "1g a 2g a cada 8 horas (100% da dose)" },
      { clcr: "26 a 50 mL/min", dose: "1g a cada 12 horas" },
      { clcr: "10 a 25 mL/min", dose: "500mg a cada 12 horas" },
      { clcr: "< 10 mL/min ou Hemodiálise", dose: "500mg a cada 24 horas (administrar após diálise)" }
    ],
    therapeuticMonitoring: "Avaliar função renal e contagem de plaquetas. Menor potencial epileptogênico em comparação ao Imipenem.",
    adverseEffects: "Diarreia, náuseas, cefaleia, rash cutâneo, risco de convulsões em pacientes com lesão neurológica prévia e insuficiência renal grave não corrigida.",
    infusionTips: "Reconstituir com água para injeção e diluir em 100 mL de SF 0,9%. Em sepse e choque séptico, recomenda-se fortemente a infusão estendida de 3 horas para maximizar o alvo farmacodinâmico."
  },
  ceftriaxona: {
    id: "ceftriaxona",
    name: "Ceftriaxona",
    category: "Cefalosporina de 3ª Geração",
    indicationSepsis: "Sepse comunitária de foco pulmonar (associada a macrolídeo), urinário ou abdominal (associada a metronidazol).",
    mechanism: "Bactericida inibidor da síntese de peptideoglicano na parede celular bacteriana através da inativação de PBPs.",
    dosingStandard: {
      attack: "2g IV dose de ataque imediata.",
      maintenance: "1g a 2g IV a cada 12 a 24 horas (dose diária padrão: 2g/dia)."
    },
    renalAdjustment: [
      { clcr: "Qualquer faixa", dose: "NÃO requer ajuste na insuficiência renal isolada (eliminação biliar compensatória). Apenas se houver insuficiência renal e hepática graves concomitantes, limitar a 2g/dia." }
    ],
    therapeuticMonitoring: "Excelente comodidade posológica e perfil de segurança. Não cobre Pseudomonas aeruginosa, Enterococcus nem anaeróbios.",
    adverseEffects: "Pseudolitíase biliar (lama biliar reversível), eosinofilia, trombocitose, diarreia associada ao C. difficile.",
    infusionTips: "Infundir em 30 minutos em SF 0,9% ou SG 5%. NUNCA misturar com soluções contendo Cálcio (como Ringer Lactato) pelo risco fatal de precipitação de ceftriaxona-cálcio."
  },
  cefepime: {
    id: "cefepime",
    name: "Cefepime",
    category: "Cefalosporina de 4ª Geração",
    indicationSepsis: "Infecções nosocomiais, suspeita de Pseudomonas aeruginosa, sepse urinária complicada e neutropenia febril.",
    mechanism: "Ação bactericida contra Gram-negativos e Gram-positivos com rápida penetração na membrana externa e resistência a hidrólise por beta-lactamases cromossômicas AmpC.",
    dosingStandard: {
      attack: "2g IV dose de ataque imediata.",
      maintenance: "2g IV a cada 8 horas (ou 12 horas) em infusão estendida."
    },
    renalAdjustment: [
      { clcr: "> 50 mL/min", dose: "2g a cada 8 horas" },
      { clcr: "30 a 50 mL/min", dose: "2g a cada 12 horas" },
      { clcr: "11 a 29 mL/min", dose: "2g a cada 24 horas" },
      { clcr: "< 11 mL/min ou Hemodiálise", dose: "1g a cada 24 horas (dose após hemodiálise)" }
    ],
    therapeuticMonitoring: "Neurotoxicidade em idosos e renais crônicos sem ajuste (encefalopatia, mioclonias, confusão mental, status epilepticus não convulsivo). Monitorar função renal.",
    adverseEffects: "Neurotoxicidade por antagonismo GABA, teste de Coombs positivo, neutropenia transitória em uso prolongado.",
    infusionTips: "Infundir em SF 0,9% em 30 a 60 minutos ou infusão estendida de 3 horas em UTI."
  },
  tazocin: {
    id: "tazocin",
    name: "Piperacilina + Tazobactam (Tazocin)",
    category: "Ureidopenicilina + Inibidor de Beta-lactamase",
    indicationSepsis: "Pneumonia hospitalar, sepse abdominal mista e infecção do trato urinário por germes sensíveis ou Pseudomonas.",
    mechanism: "Piperacilina inibe a síntese de parede celular bacteriana enquanto o Tazobactam protege contra a degradação por beta-lactamases de classe A (incluindo penicilinases estafilocócicas e certas ESBLs).",
    dosingStandard: {
      attack: "4,5g IV imediato.",
      maintenance: "4,5g IV a cada 6 horas (ou 3,375g a 4,5g a cada 8 horas em infusão estendida de 4 horas)."
    },
    renalAdjustment: [
      { clcr: "> 50 mL/min", dose: "4,5g a cada 6 horas" },
      { clcr: "20 a 50 mL/min", dose: "3,375g a cada 6 horas ou 4,5g a cada 8 horas" },
      { clcr: "< 20 mL/min", dose: "2,25g a cada 6 horas ou 3,375g a cada 8 horas" },
      { clcr: "Hemodiálise", dose: "2,25g a cada 8 horas + dose suplementar de 0,75g após cada sessão de diálise" }
    ],
    therapeuticMonitoring: "Atenção ao risco aumentado de lesão renal aguda (IRA) sinérgica quando administrado concomitantemente com Vancomicina.",
    adverseEffects: "Nefrotoxicidade potencial com glicopeptídeos, hipocalemia (carga sódica), diarreia, reações alérgicas.",
    infusionTips: "Infusão estendida de 4 horas melhora desfechos clínicos em sepse grave por Pseudomonas."
  },
  polimixina: {
    id: "polimixina",
    name: "Polimixina B",
    category: "Lipopeptídeo Cíclico",
    indicationSepsis: "Bactérias Gram-negativas multirresistentes e ultrarresistentes produtoras de carbapenemase (KPC, NDM, Pseudomonas e Acinetobacter resistentes a carbapenêmicos).",
    mechanism: "Atua como detergente catiônico que rompe e desestabiliza a membrana externa e citoplasmática bacteriana através da interação com o lipopolissacarídeo (LPS).",
    dosingStandard: {
      attack: "25.000 UI/kg de peso corporal ideal (dose máxima 2.000.000 UI) diluída em 300-500 mL em 1 a 2 horas.",
      maintenance: "15.000 a 25.000 UI/kg/dia divididos em 2 doses (a cada 12 horas)."
    },
    renalAdjustment: [
      { clcr: "Qualquer valor", dose: "NÃO se ajusta dose de Polimixina B para função renal (eliminação predominantemente não renal). O ajuste para função renal induz subdose e falha terapêutica fatal!" }
    ],
    therapeuticMonitoring: "Monitorar creatinina e débito urinário diariamente. Evitar outros nefrotóxicos concomitantes.",
    adverseEffects: "Nefrotoxicidade dose-dependente (necrose tubular aguda), neurotoxicidade (parestesias periorais, fraqueza muscular, bloqueio neuromuscular raro).",
    infusionTips: "Infundir lentamente em 60 a 120 minutos. Diluição em SF 0,9% ou SG 5%."
  },
  metronidazol: {
    id: "metronidazol",
    name: "Metronidazol",
    category: "Nitroimidazol",
    indicationSepsis: "Sepse de foco intra-abdominal, pélvico e infecções anaeróbias necrotizantes (associado a Ceftriaxona ou Ciprofloxacino).",
    mechanism: "O grupo nitro é reduzido por proteínas transportadoras de elétrons dos anaeróbios formando intermediários citotóxicos que quebram o DNA bacteriano.",
    dosingStandard: {
      attack: "500mg IV dose de ataque.",
      maintenance: "500mg IV a cada 8 horas (ou 400mg VO/IV 8/8h)."
    },
    renalAdjustment: [
      { clcr: "< 10 mL/min", dose: "Reduzir dose para 500mg a cada 12 horas" },
      { clcr: "Hemodiálise", dose: "Administrar dose pós-hemodiálise pelo clearance do fármaco na membrana" }
    ],
    therapeuticMonitoring: "Eficácia excepcional contra Bacteroides fragilis e Clostridium. Inativo contra aeróbios.",
    adverseEffects: "Gosto metálico, náuseas, neuropatia periférica em uso prolongado, efeito dissulfiram com álcool.",
    infusionTips: "Infundir bolsa pronta em 30 a 60 minutos por via endovenosa contínua/intermitente."
  },
  linezolida: {
    id: "linezolida",
    name: "Linezolida",
    category: "Oxazolidinona",
    indicationSepsis: "Pele e partes moles grave, pneumonia por MRSA e infecções por Enterococcus resistente à vancomicina (VRE).",
    mechanism: "Inibe a síntese proteica bacteriana na fase inicial através da ligação à subunidade 50S ribossômica no sítio de ligação 23S, impedindo a formação do complexo 70S.",
    dosingStandard: {
      attack: "600mg IV dose inicial.",
      maintenance: "600mg IV ou VO a cada 12 horas."
    },
    renalAdjustment: [
      { clcr: "Qualquer valor", dose: "NÃO requer ajuste para insuficiência renal ou hemodiálise (administrar após diálise)." }
    ],
    therapeuticMonitoring: "Excelente penetração no tecido pulmonar e cutâneo. Hemograma semanal (risco de mielossupressão após 10-14 dias).",
    adverseEffects: "Trombocitopenia reversível, anemia, neuropatia óptica/periférica em tratamentos prolongados (> 28 dias), síndrome serotoninérgica com ISRS.",
    infusionTips: "Bolsa de infusão pronta de 300 mL (600 mg). Infundir em 30 a 120 minutos. Proteger da luz."
  },
  azitromicina: {
    id: "azitromicina",
    name: "Azitromicina",
    category: "Macrolídeo",
    indicationSepsis: "Pneumonia Adquirida na Comunidade grave (em associação a Ceftriaxona), com efeito imunomodulador anti-inflamatório.",
    mechanism: "Liga-se reversivelmente à subunidade ribossômica 50S, inibindo a transpeptidação e translocação na síntese de proteínas bacterianas.",
    dosingStandard: {
      attack: "500mg IV em infusão de 1 hora.",
      maintenance: "500mg IV ou VO 1 vez ao dia por 5 a 7 dias."
    },
    renalAdjustment: [
      { clcr: "Qualquer valor", dose: "NÃO requer ajuste para insuficiência renal (eliminação biliar/fecal predominante)." }
    ],
    therapeuticMonitoring: "Eletrocardiograma basal se histórico de arritmias ou uso de outras drogas que prolongam intervalo QTc.",
    adverseEffects: "Prolongamento de intervalo QT, náuseas, desconforto abdominal, hepatotoxicidade rara.",
    infusionTips: "Concentração máxima de infusão 2 mg/mL. Não administrar em bolus EV."
  },
  teicoplanina: {
    id: "teicoplanina",
    name: "Teicoplanina",
    category: "Glicopeptídeo",
    indicationSepsis: "Alternativa à Vancomicina em infecções por Gram-positivos e MRSA, com menor nefrotoxicidade e maior comodidade posológica.",
    mechanism: "Inibe a biossíntese da parede celular bacteriana no nível da polimerização de peptideoglicanos, de modo similar à vancomicina.",
    dosingStandard: {
      attack: "6 mg/kg (ou até 10-12 mg/kg em sepse grave) IV a cada 12 horas por 3 doses consecutivas.",
      maintenance: "6 a 12 mg/kg IV uma vez ao dia (a cada 24 horas)."
    },
    renalAdjustment: [
      { clcr: "> 50 mL/min", dose: "Dose plena diária" },
      { clcr: "10 a 50 mL/min", dose: "Manutenção a cada 48 horas ou 50% da dose diária" },
      { clcr: "< 10 mL/min ou Hemodiálise", dose: "Manutenção a cada 72 horas ou dose semanal de manutenção" }
    ],
    therapeuticMonitoring: "Permite administração em bolus IV de 3 a 5 minutos, sem a Síndrome do Homem Vermelho típica da vancomicina.",
    adverseEffects: "Menor taxa de nefrotoxicidade comparada à Vancomicina; eritema cutâneo leve, broncoespasmo raro.",
    infusionTips: "Pode ser administrado em injeção IV direta de 3 a 5 minutos ou em infusão de 30 minutos em SF 0,9%."
  }
};

// Verificador de compatibilidade empírica vs Antibiograma
export function checkAntibiogramMismatch(currentAntibioticText = "", isolatedPathogen = "", antibiogramResistance = []) {
  if (!isolatedPathogen || !currentAntibioticText) {
    return { hasMismatch: false, warning: null };
  }

  const atbLower = currentAntibioticText.toLowerCase();
  const pathLower = isolatedPathogen.toLowerCase();

  const mismatches = [];

  // Exemplo 1: MRSA isolado com Ceftriaxona ou Cefepime isolados sem vancomicina/linezolida
  if (pathLower.includes("mrsa") || (pathLower.includes("staphylococcus aureus") && antibiogramResistance.includes("Oxacilina"))) {
    if (!atbLower.includes("vanco") && !atbLower.includes("linezol") && !atbLower.includes("teico") && !atbLower.includes("dapto")) {
      mismatches.push({
        pathogen: "Staphylococcus aureus Resistente à Meticilina (MRSA)",
        current: currentAntibioticText,
        reason: "O paciente está recebendo antimicrobiano ineficaz contra MRSA. Beta-lactâmicos comuns (Ceftriaxona, Cefepime) não cobrem esta cepa.",
        recommendation: "Substituir ou associar Vancomicina (dose de ataque 25-30 mg/kg) ou Linezolida 600mg 12/12h conforme o protocolo."
      });
    }
  }

  // Exemplo 2: Pseudomonas aeruginosa isolada com Ceftriaxona
  if (pathLower.includes("pseudomonas")) {
    if (atbLower.includes("ceftriaxona") && !atbLower.includes("cefepime") && !atbLower.includes("tazocin") && !atbLower.includes("meropenem") && !atbLower.includes("polimixina")) {
      mismatches.push({
        pathogen: "Pseudomonas aeruginosa",
        current: currentAntibioticText,
        reason: "Ceftriaxona NÃO tem atividade antipseudomonas! Risco grave de falha terapêutica.",
        recommendation: "Trocar imediatamente para Cefepime 2g 8/8h, Tazocin 4,5g 6/6h ou Meropenem conforme sensibilidade do antibiograma."
      });
    }
  }

  // Exemplo 3: Bactéria produtora de ESBL (Klebsiella / E. coli) com Ceftriaxona ou Cefepime
  if (antibiogramResistance.includes("Ceftriaxona") || antibiogramResistance.includes("ESBL")) {
    if (atbLower.includes("ceftriaxona") || atbLower.includes("cefepime")) {
      mismatches.push({
        pathogen: `${isolatedPathogen} (Produtora de ESBL)`,
        current: currentAntibioticText,
        reason: "Cefalosporinas são inativadas por beta-lactamases de espectro estendido (ESBL).",
        recommendation: "Escalonar para Meropenem (1g a 2g IV 8/8h) conforme a diretriz da CCIH/SCIRAS."
      });
    }
  }

  // Exemplo 4: Bactéria resistente a Carbapenêmicos (KPC / Metallo)
  if (antibiogramResistance.includes("Meropenem") || antibiogramResistance.includes("Carbapenêmicos") || antibiogramResistance.includes("KPC")) {
    if (atbLower.includes("meropenem") && !atbLower.includes("polimixina")) {
      mismatches.push({
        pathogen: `${isolatedPathogen} (Resistente a Carbapenêmicos / KPC)`,
        current: currentAntibioticText,
        reason: "Isolado bacteriano resistente ao Meropenem em uso.",
        recommendation: "Adicionar Polimixina B (ataque 25.000 UI/kg) e discutir terapia combinada ou novas drogas com a CCIH."
      });
    }
  }

  if (mismatches.length > 0) {
    return {
      hasMismatch: true,
      mismatchDetails: mismatches[0]
    };
  }

  return { hasMismatch: false, warning: null };
}
