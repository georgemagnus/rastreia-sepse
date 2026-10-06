import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { getStoredFirebaseConfig, saveStoredFirebaseConfig, initFirebase } from '../firebase/firebaseConfig';

export default function FirebaseConfigModal({ isOpen, onClose, onConfigSaved, isConnected }) {
  const [config, setConfig] = useState(() => getStoredFirebaseConfig());
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredFirebaseConfig(config);
    const result = initFirebase(config);
    if (result.isConnected) {
      setIsSuccess(true);
      setStatusMsg('Conexão com Firebase Firestore estabelecida com sucesso!');
      if (onConfigSaved) onConfigSaved(true);
    } else {
      setIsSuccess(false);
      setStatusMsg('Configurações salvas. Operando em modo seguro local/offline com cache PWA.');
      if (onConfigSaved) onConfigSaved(false);
    }
  };

  const handleResetToDemo = () => {
    const emptyConfig = {
      apiKey: "",
      authDomain: "rastreia-sepse.firebaseapp.com",
      projectId: "rastreia-sepse",
      storageBucket: "rastreia-sepse.appspot.com",
      messagingSenderId: "",
      appId: ""
    };
    setConfig(emptyConfig);
    saveStoredFirebaseConfig(emptyConfig);
    initFirebase(emptyConfig);
    setIsSuccess(true);
    setStatusMsg('Restaurado para modo de Armazenamento Local.');
    if (onConfigSaved) onConfigSaved(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 580 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-surface-border)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={20} color="var(--color-primary-light)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Conexão com Banco de Dados Firebase
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                Projeto: rastreia-sepse (Firestore & Autenticação)
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-dim)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20, overflowY: 'auto' }}>
          
          {/* Status Badge */}
          <div style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: isConnected ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            border: `1px solid ${isConnected ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16
          }}>
            {isConnected ? <CheckCircle2 color="#10b981" /> : <AlertCircle color="#f59e0b" />}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isConnected ? '#34d399' : '#fbbf24' }}>
                {isConnected ? 'Firebase Firestore Conectado e Sincronizado' : 'Modo Offline / Armazenamento Local Ativo'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                {isConnected 
                  ? 'Os casos são salvos na nuvem do Google Firebase e sincronizados entre dispositivos.' 
                  : 'Os casos estão sendo gravados instantaneamente no cache local do seu dispositivo/PWA.'}
              </div>
            </div>
          </div>

          {statusMsg && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: 14,
              background: isSuccess ? 'var(--color-success-bg)' : 'var(--color-surface-hover)',
              color: isSuccess ? '#34d399' : 'var(--color-text-main)'
            }}>
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="form-label">Project ID</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="rastreia-sepse"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">API Key (Web API Key do Firebase Console)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="AIzaSy..."
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="form-label">Auth Domain</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.authDomain}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Storage Bucket</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.storageBucket}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="form-label">App ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="1:123456789:web:abcdef"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Messaging Sender ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="123456789"
                  value={config.messagingSenderId}
                  onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <span>Salvar & Conectar ao Firebase</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetToDemo}
                title="Limpar e usar modo local"
              >
                <RefreshCw size={15} />
                <span>Restaurar Padrão Local</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
