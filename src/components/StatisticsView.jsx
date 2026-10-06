import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Activity, 
  HeartPulse, 
  ShieldAlert, 
  Award, 
  Clock, 
  Users, 
  AlertCircle 
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function StatisticsView({ cases }) {
  // Aggregate Stats
  const total = cases.length;
  const sepseCount = cases.filter(c => c.status === 'sepse').length;
  const choqueCount = cases.filter(c => c.status === 'choque_septico').length;
  const afastadoCount = cases.filter(c => c.status === 'afastado').length;
  const investigandoCount = cases.filter(c => c.status === 'em_investigacao').length;

  // Focos de Infecção
  const focusCounts = {
    'Pulmonar': 0,
    'Urinário': 0,
    'Abdominal': 0,
    'Corrente Sanguínea': 0,
    'Pele / Partes Moles': 0,
    'Meningite/SNC': 0,
    'Outros / Não Definido': 0
  };

  cases.forEach(c => {
    const f = c.sciras?.specificFocus || (c.infectionHistory?.pneumonia ? 'Pulmonar' : c.infectionHistory?.uti ? 'Urinário' : c.infectionHistory?.intraAbdominal ? 'Abdominal' : 'Outros / Não Definido');
    if (focusCounts[f] !== undefined) {
      focusCounts[f]++;
    } else {
      focusCounts['Outros / Não Definido']++;
    }
  });

  // Bundle 1 Hora
  const lactateDone = cases.filter(c => c.telemetryAndExams?.lactateCollected).length;
  const culturesDone = cases.filter(c => c.telemetryAndExams?.bloodCulture).length;
  const atbDone = cases.filter(c => c.telemetryAndExams?.antibioticPrescribed).length;
  const volDone = cases.filter(c => c.hemodynamicOptimization?.volumeResponsive || c.hemodynamicOptimization?.volumeMlCalculated).length;

  // Origem Foco
  const comunitarioCount = cases.filter(c => c.sciras?.focusOrigin === 'comunitario').length;
  const hospitalarCount = cases.filter(c => c.sciras?.focusOrigin === 'hospitalar').length;

  // Desfechos
  const altas = cases.filter(c => c.sciras?.outcome === 'alta').length;
  const obitos = cases.filter(c => c.sciras?.outcome === 'obito').length;
  const transferencias = cases.filter(c => c.sciras?.outcome === 'transferencia').length;
  const continuaInterno = cases.filter(c => !c.sciras?.outcome || c.sciras?.outcome === 'continua_interno').length;

  // Chart 1: Apresentação Clínica (Doughnut)
  const presentationChartData = {
    labels: ['Sepse Confirmada', 'Choque Séptico', 'Afastado / Excluído', 'Em Investigação'],
    datasets: [
      {
        data: [sepseCount, choqueCount, afastadoCount, investigandoCount],
        backgroundColor: ['#0284c7', '#ef4444', '#64748b', '#f59e0b'],
        borderColor: '#131d31',
        borderWidth: 2
      }
    ]
  };

  // Chart 2: Focos Infecciosos (Bar)
  const focusChartData = {
    labels: Object.keys(focusCounts),
    datasets: [
      {
        label: 'Número de Pacientes',
        data: Object.values(focusCounts),
        backgroundColor: '#38bdf8',
        borderRadius: 6
      }
    ]
  };

  // Chart 3: Adesão ao Pacote da 1ª Hora (Bundle)
  const bundleChartData = {
    labels: ['Lactato Sérico', 'Hemoculturas pré-ATB', 'Antimicrobiano < 1h', 'Ressuscitação Volêmica'],
    datasets: [
      {
        label: '% de Adesão Institucional',
        data: total > 0 ? [
          Math.round((lactateDone / total) * 100),
          Math.round((culturesDone / total) * 100),
          Math.round((atbDone / total) * 100),
          Math.round((volDone / total) * 100)
        ] : [0, 0, 0, 0],
        backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'],
        borderRadius: 6
      }
    ]
  };

  // Chart 4: Origem do Foco
  const originChartData = {
    labels: ['Comunitário', 'Hospitalar (IRAS)'],
    datasets: [
      {
        data: [comunitarioCount, hospitalarCount],
        backgroundColor: ['#0ea5e9', '#f97316'],
        borderColor: '#131d31',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 16
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
          Estatísticas & Indicadores Institucionais
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Painel analítico e epidemiológico do Protocolo de Sepse • Complexo Dr. Clementino Fraga
        </p>
      </div>

      {/* Top Metric Indicators */}
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
          padding: 18
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>TAXA DE DESCARTE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4 }}>
            {total > 0 ? Math.round((afastadoCount / total) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Pacientes triados sem sepse confirmada
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 18
        }}>
          <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700 }}>PROPORÇÃO CHOQUE SÉPTICO</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginTop: 4 }}>
            {total > 0 ? Math.round((choqueCount / total) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Casos com necessidade de DVA / hipotensão grave
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 18
        }}>
          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>COLETA DE HEMOCULTURAS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: 4 }}>
            {total > 0 ? Math.round((culturesDone / total) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Amostras coletadas antes da primeira dose de ATB
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 18
        }}>
          <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>PACIENTES EM ACOMPANHAMENTO</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: 4 }}>
            {continuaInterno}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
            Casos ativos sob evolução diária
          </div>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
        
        {/* Gráfico 1: Apresentação Clínica */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            Apresentação Clínica dos Protocolos
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: 16 }}>
            Classificação diagnóstica após avaliação médica
          </p>
          <div style={{ height: 260 }}>
            <Doughnut data={presentationChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Gráfico 2: Adesão ao Pacote da 1ª Hora */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            Adesão ao Bundle de 1 Hora (Golden Hour)
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: 16 }}>
            Porcentagem de cumprimento dos 4 passos essenciais
          </p>
          <div style={{ height: 260 }}>
            <Bar data={bundleChartData} options={chartOptions} />
          </div>
        </div>

        {/* Gráfico 3: Focos Infecciosos */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            Principais Focos de Infecção
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: 16 }}>
            Topologia do sítio infeccioso primário
          </p>
          <div style={{ height: 260 }}>
            <Bar data={focusChartData} options={chartOptions} />
          </div>
        </div>

        {/* Gráfico 4: Origem do Foco Infeccioso */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
            Origem do Foco (Comunitário vs Hospitalar)
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: 16 }}>
            Vigilância SCIRAS / Controle de Infecção Hospitalar
          </p>
          <div style={{ height: 260 }}>
            <Pie data={originChartData} options={doughnutOptions} />
          </div>
        </div>

      </div>

    </div>
  );
}
