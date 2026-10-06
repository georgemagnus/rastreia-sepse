import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { 
  Activity, 
  PlusCircle, 
  BarChart3, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Download, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X,
  Stethoscope,
  BookOpen,
  Pill,
  ShieldAlert
} from 'lucide-react';
import SepsisRibbonLogo from './SepsisRibbonLogo';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onNewCase, 
  onOpenFirebaseConfig, 
  onOpenLogin,
  isFirebaseConnected,
  deferredPrompt,
  onInstallPwa,
  onOpenProtocolDoc,
  onOpenCrisisProtocols,
  onOpenAntibioticGuide
}) {
  const { currentUser, logout, demoUsers, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="navbar-header" style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-surface-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="navbar-container" style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(220, 38, 38, 0.15)',
            flexShrink: 0
          }} title="RastreiaSepse • Protocolo Adulto">
            <SepsisRibbonLogo size={32} />
          </div>
          <div className="nav-brand-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em', 
                color: 'var(--color-text-main)' 
              }}>
                Rastreia<span style={{ color: '#ef4444' }}>Sepse</span>
              </span>
              <span className="badge badge-danger" style={{ 
                fontSize: '0.62rem', 
                padding: '1px 5px'
              }}>PWA</span>
            </div>
            <div className="nav-brand-sub" style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>
              Protocolo PTI.001.00 • CHCF/PB
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            className={`btn btn-sm nav-icon-btn ${currentTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('dashboard')}
            title="Casos & Triagem"
          >
            <LayoutDashboard size={17} />
            <span className="nav-label-text">Casos & Triagem</span>
          </button>

          <button 
            className={`btn btn-sm nav-icon-btn ${currentTab === 'statistics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('statistics')}
            title="Estatísticas & Indicadores"
          >
            <BarChart3 size={17} />
            <span className="nav-label-text">Estatísticas</span>
          </button>

          <button 
            className="btn btn-sm btn-secondary nav-icon-btn"
            onClick={onOpenProtocolDoc}
            title="Documento Oficial do Protocolo Institucional PTI.001.00"
            style={{ color: 'var(--color-primary-light)' }}
          >
            <BookOpen size={16} />
            <span className="nav-label-text">Protocolo PTI.001.00</span>
          </button>

          <button 
            className="btn btn-sm btn-outline-danger nav-icon-btn"
            onClick={() => onOpenCrisisProtocols && onOpenCrisisProtocols('hemodynamic')}
            title="Condutas de Emergência: Choque, Falência Respiratória e Classificação KDIGO"
          >
            <ShieldAlert size={15} />
            <span className="nav-label-text">Crise & KDIGO</span>
          </button>

          <button 
            className="btn btn-sm btn-secondary nav-icon-btn"
            onClick={() => onOpenAntibioticGuide && onOpenAntibioticGuide()}
            title="Guia de Antimicrobianos e Checagem de Antibiograma"
            style={{ color: '#10b981' }}
          >
            <Pill size={15} />
            <span className="nav-label-text">Antibióticos</span>
          </button>

          <button 
            className="btn btn-sm nav-icon-btn" 
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: '#fff',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' 
            }}
            onClick={onNewCase}
            title="Abrir Novo Caso de Suspeita de Sepse"
          >
            <PlusCircle size={17} />
            <span className="nav-label-text">Abrir Protocolo</span>
          </button>
        </nav>

        {/* Right side controls (User, Firebase status, PWA install) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* PWA Install Button */}
          {deferredPrompt && (
            <button 
              className="btn btn-secondary btn-sm nav-icon-btn"
              onClick={onInstallPwa}
              title="Instalar no celular / desktop para uso rápido beira-leito"
              style={{ borderColor: 'var(--color-primary-light)', color: 'var(--color-primary-light)' }}
            >
              <Download size={15} />
              <span className="nav-label-text">Instalar PWA</span>
            </button>
          )}

          {/* Firebase Connection Status Button */}
          <button 
            className="btn btn-secondary btn-sm nav-icon-btn"
            onClick={onOpenFirebaseConfig}
            title={isFirebaseConnected ? "Firebase Conectado e Ativo" : "Armazenamento Local Offline"}
            style={{ gap: 6 }}
          >
            <Database size={15} color={isFirebaseConnected ? '#10b981' : '#f59e0b'} />
            <span style={{ fontSize: '0.75rem', color: isFirebaseConnected ? '#10b981' : 'var(--color-text-muted)' }} className="nav-label-text">
              {isFirebaseConnected ? 'Firebase' : 'Local'}
            </span>
          </button>

          {/* User profile / session */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-secondary"
                style={{ 
                  padding: '5px 12px', 
                  borderRadius: 'var(--radius-full)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  borderColor: currentUser.role === 'medico' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title={`${currentUser.name} (${currentUser.roleLabel || ''} • ${currentUser.councilType}-${currentUser.councilUf} ${currentUser.councilNumber})`}
              >
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: currentUser.role === 'medico' ? '#0284c7' : '#059669',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {currentUser.name.charAt(currentUser.name.startsWith('Dr') ? 4 : 5) || 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  {/* Nome do profissional exibido por inteiro */}
                  <div className="nav-user-fullname" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </div>
                  <div className="nav-user-council" style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap' }}>
                    {currentUser.councilType}-{currentUser.councilUf} {currentUser.councilNumber}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: 12,
                  minWidth: 260,
                  zIndex: 200
                }}>
                  <div style={{ borderBottom: '1px solid var(--color-surface-border)', paddingBottom: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)' }}>
                      {currentUser.roleLabel}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: 2 }}>
                      {currentUser.sector}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: 6, fontWeight: 600 }}>
                    Alternar Perfil Rápido:
                  </div>
                  {demoUsers.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => { loginAsDemo(i); setProfileDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: u.id === currentUser.id ? 'var(--color-primary-light)' : 'var(--color-text-main)',
                        background: u.id === currentUser.id ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                        marginBottom: 3
                      }}
                    >
                      <span>{u.name.split(' ')[0]} {u.name.split(' ')[1]} ({u.councilType})</span>
                      {u.id === currentUser.id && <ShieldCheck size={14} />}
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid var(--color-surface-border)', marginTop: 8, paddingTop: 6 }}>
                    <button 
                      onClick={() => { logout(); setProfileDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.82rem',
                        color: 'var(--color-danger)'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Encerrar Sessão</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm nav-icon-btn" onClick={onOpenLogin} title="Entrar / Cadastrar Profissional">
              <User size={16} />
              <span className="nav-label-text">Entrar / Cadastrar</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: 'var(--color-text-main)', padding: 6 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer / dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-surface-border)',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }} className="mobile-drawer">
          <button 
            className={`btn ${currentTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LayoutDashboard size={18} />
            <span>Casos & Triagem</span>
          </button>

          <button 
            className={`btn ${currentTab === 'statistics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setCurrentTab('statistics'); setMobileMenuOpen(false); }}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <BarChart3 size={18} />
            <span>Estatísticas & Indicadores</span>
          </button>

          <button 
            className="btn"
            style={{ 
              width: '100%', 
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: '#fff' 
            }}
            onClick={() => { onNewCase(); setMobileMenuOpen(false); }}
          >
            <PlusCircle size={18} />
            <span>Abrir Protocolo de Sepse</span>
          </button>
        </div>
      )}
    </header>
  );
}
