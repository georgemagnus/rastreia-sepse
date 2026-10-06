import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: "usr-01",
    name: "Dr. Alexandre Nóbrega",
    email: "alexandre.med@clementinofraga.gov.br",
    role: "medico",
    councilType: "CRM",
    councilNumber: "11450",
    councilUf: "PB",
    sector: "Time de Resposta Rápida (TRR) / Emergência",
    roleLabel: "Médico Assistente / TRR"
  },
  {
    id: "usr-02",
    name: "Enf. Rodrigo Lima",
    email: "rodrigo.enf@clementinofraga.gov.br",
    role: "enfermeiro",
    councilType: "COREN",
    councilNumber: "452189",
    councilUf: "PB",
    sector: "Triagem e Emergência Adulto",
    roleLabel: "Enfermeiro de Triagem / Beira-Leito"
  },
  {
    id: "usr-03",
    name: "Dra. Patrícia Albuquerque",
    email: "patricia.sciras@clementinofraga.gov.br",
    role: "medico",
    councilType: "CRM",
    councilNumber: "9870",
    councilUf: "PB",
    sector: "SCIRAS / CCIH",
    roleLabel: "Médica Infectologista (SCIRAS/CCIH)"
  }
];

const LOCAL_AUTH_KEY = "rastreia_sepse_current_user";
const REGISTERED_USERS_KEY = "rastreia_sepse_registered_users";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user session', e);
    }
    // Default to initial logged-in user so the system is immediately testable
    return DEMO_USERS[0];
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read registered users', e);
    }
    return DEMO_USERS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    // Generic fallback if demo password
    return { success: false, message: "Usuário não encontrado. Cadastre-se ou use os perfis de demonstração." };
  };

  const loginAsDemo = (index) => {
    if (DEMO_USERS[index]) {
      setCurrentUser(DEMO_USERS[index]);
    }
  };

  const register = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role, // 'medico' | 'enfermeiro' | 'outro'
      councilType: userData.role === 'medico' ? 'CRM' : userData.role === 'enfermeiro' ? 'COREN' : 'OUTRO',
      councilNumber: userData.councilNumber,
      councilUf: userData.councilUf || 'PB',
      sector: userData.sector || 'Geral',
      roleLabel: userData.role === 'medico' ? `Médico (CRM-${userData.councilUf} ${userData.councilNumber})` : `Enfermeiro (COREN-${userData.councilUf} ${userData.councilNumber})`
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAsDemo, register, logout, demoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
