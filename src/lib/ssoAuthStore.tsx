import React, { createContext, useContext, useEffect, useState } from 'react';

export type SsoRoleName = 'Súper Administrador' | 'Administrador' | 'Prevencionista' | 'Experto SSO' | 'Solo Lectura';

export interface SsoCompanyRecord {
  id: string;
  nombre: string;
  rut: string;
  estado: 'Activo' | 'Suspendido';
  modoInicial: 'demo' | 'blanco';
  creadoEn: string;
}

export interface SsoUserRecord {
  id: string;
  nombre: string;
  email: string;
  rut: string;
  telefono?: string;
  empresaId: string;
  rolNombre: SsoRoleName;
  password: string;
  estado: 'Activo' | 'Inactivo';
  cambioClavePendiente: boolean;
}

export interface SsoActivityLog {
  id: string;
  fechaHora: string;
  usuarioNombre: string;
  usuarioEmail: string;
  empresaNombre: string;
  modulo: string;
  accion: string;
  detalle: string;
}

const AUTH_STORAGE_KEY = 'gaval_sso_auth_v2';

const normalizeRut = (val: string) =>
  val.replace(/\./g, '').replace(/-/g, '').trim().toLowerCase();

export const DEFAULT_COMPANIES: SsoCompanyRecord[] = [
  {
    id: 'comp-gaval-demo',
    nombre: 'Gaval Demo Minería & Logística SpA',
    rut: '76.458.920-4',
    estado: 'Activo',
    modoInicial: 'demo',
    creadoEn: '2026-11-01',
  },
  {
    id: 'comp-experta-limpio',
    nombre: 'Empresa Demo Evaluación SSO (Entorno Limpio)',
    rut: '77.889.340-1',
    estado: 'Activo',
    modoInicial: 'blanco',
    creadoEn: '2026-11-12',
  },
];

export const DEFAULT_USERS: SsoUserRecord[] = [
  {
    id: 'usr-gabriel',
    nombre: 'Gabriel Avalos',
    email: 'gavalos@gaval.cl',
    rut: '10799367-3',
    telefono: '+56 9 8765 4321',
    empresaId: 'comp-gaval-demo',
    rolNombre: 'Súper Administrador',
    password: '10799367-3',
    estado: 'Activo',
    cambioClavePendiente: false,
  },
  {
    id: 'usr-experta',
    nombre: 'Auditora Experta SSO',
    email: 'experta.sso@gaval.cl',
    rut: '15890123-4',
    telefono: '+56 9 9988 7766',
    empresaId: 'comp-experta-limpio',
    rolNombre: 'Experto SSO',
    password: 'Sso2026!',
    estado: 'Activo',
    cambioClavePendiente: false,
  },
  {
    id: 'usr-demo',
    nombre: 'Usuario Demo Prospecto',
    email: 'demo@gaval.cl',
    rut: '11111111-1',
    telefono: '',
    empresaId: 'comp-gaval-demo',
    rolNombre: 'Administrador',
    password: 'demo123',
    estado: 'Activo',
    cambioClavePendiente: false,
  },
];

interface PersistedAuth {
  companies: SsoCompanyRecord[];
  users: SsoUserRecord[];
  logs: SsoActivityLog[];
  sessionUserId: string | null;
  activeCompanyId: string;
}

interface SsoAuthContextValue {
  currentUser: SsoUserRecord | null;
  isSuperAdmin: boolean;
  companies: SsoCompanyRecord[];
  activeCompany: SsoCompanyRecord;
  setActiveCompanyId: (id: string) => void;
  users: SsoUserRecord[];
  logs: SsoActivityLog[];
  login: (identifier: string, password: string) => { ok: boolean; error?: string };
  loginSuperAdminDirect: () => void;
  loginExpertaDirect: () => void;
  loginDemoDirect: () => void;
  loginAsUser: (userId: string) => void;
  logout: () => void;
  completeFirstPasswordChange: (newPassword: string) => void;
  addCompany: (payload: { nombre: string; rut: string; modoInicial: 'demo' | 'blanco' }) => SsoCompanyRecord;
  toggleCompanyStatus: (id: string) => void;
  addUser: (payload: Omit<SsoUserRecord, 'id' | 'estado'>) => SsoUserRecord;
  updateUser: (id: string, updates: Partial<SsoUserRecord>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  logActivity: (modulo: string, accion: string, detalle?: string) => void;
  generateInvitationText: (userObj: SsoUserRecord) => string;
}

const SsoAuthContext = createContext<SsoAuthContextValue | null>(null);

export const SsoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<PersistedAuth>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem('gaval_sso_auth_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.companies && parsed.users) {
          let updatedCompanies: SsoCompanyRecord[] = [...parsed.companies];
          DEFAULT_COMPANIES.forEach((defC) => {
            if (!updatedCompanies.some((c) => c.id === defC.id)) {
              updatedCompanies.push(defC);
            }
          });
          let updatedUsers: SsoUserRecord[] = [...parsed.users];
          DEFAULT_USERS.forEach((defU) => {
            if (!updatedUsers.some((u) => u.email.toLowerCase() === defU.email.toLowerCase())) {
              updatedUsers.push(defU);
            }
          });
          return {
            ...parsed,
            companies: updatedCompanies,
            users: updatedUsers,
          };
        }
      }
    } catch {}
    return {
      companies: DEFAULT_COMPANIES,
      users: DEFAULT_USERS,
      logs: [],
      sessionUserId: null,
      activeCompanyId: DEFAULT_COMPANIES[0].id,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(store));
    } catch {}
  }, [store]);

  const currentUser = store.users.find((u) => u.id === store.sessionUserId) || null;
  const isSuperAdmin = Boolean(
    currentUser &&
      (currentUser.rolNombre === 'Súper Administrador' ||
        currentUser.email.toLowerCase() === 'gavalos@gaval.cl')
  );

  const activeCompany =
    store.companies.find((c) => c.id === store.activeCompanyId) ||
    store.companies[0] ||
    DEFAULT_COMPANIES[0];

  const appendLog = (
    prev: PersistedAuth,
    user: SsoUserRecord | null,
    modulo: string,
    accion: string,
    detalle = ''
  ): SsoActivityLog[] => {
    const comp = prev.companies.find((c) => c.id === (user?.empresaId || prev.activeCompanyId));
    const entry: SsoActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fechaHora: new Date().toISOString(),
      usuarioNombre: user?.nombre || 'Sistema',
      usuarioEmail: user?.email || '-',
      empresaNombre: comp?.nombre || 'Gaval SSO',
      modulo,
      accion,
      detalle,
    };
    return [entry, ...prev.logs].slice(0, 500);
  };

  const login = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const normRut = normalizeRut(identifier);
    const found = store.users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.rut && normalizeRut(u.rut) === normRut)
    );

    if (!found) {
      return { ok: false, error: 'Usuario o RUT no encontrado.' };
    }
    if (found.estado !== 'Activo') {
      return { ok: false, error: 'Tu usuario está desactivado. Contacta al administrador.' };
    }

    const company = store.companies.find((c) => c.id === found.empresaId);
    if (company && company.estado !== 'Activo' && found.rolNombre !== 'Súper Administrador') {
      return { ok: false, error: 'La empresa asociada se encuentra suspendida.' };
    }

    const passTrim = password.trim();
    const isRutLogin = found.rut && normalizeRut(found.rut) === normRut;
    const validPass =
      found.password === passTrim ||
      normalizeRut(found.password) === normalizeRut(passTrim) ||
      (isRutLogin && passTrim === '' && normalizeRut(found.password) === normRut);

    if (!validPass) {
      return { ok: false, error: 'Contraseña incorrecta.' };
    }

    setStore((prev) => ({
      ...prev,
      sessionUserId: found.id,
      activeCompanyId: found.empresaId,
      logs: appendLog(prev, found, 'Acceso', 'Inicio de Sesión', `Ingreso como ${found.rolNombre}`),
    }));
    return { ok: true };
  };

  const loginSuperAdminDirect = () => {
    const gabriel = store.users.find((u) => u.email === 'gavalos@gaval.cl') || store.users[0];
    setStore((prev) => ({
      ...prev,
      sessionUserId: gabriel.id,
      activeCompanyId: gabriel.empresaId,
      logs: appendLog(prev, gabriel, 'Acceso', 'Ingreso Directo Súper Admin', 'Acceso rápido 1-clic Gabriel Avalos'),
    }));
  };

  const loginExpertaDirect = () => {
    const experta =
      store.users.find((u) => u.email === 'experta.sso@gaval.cl') ||
      store.users.find((u) => u.empresaId === 'comp-experta-limpio') ||
      store.users[0];
    setStore((prev) => ({
      ...prev,
      sessionUserId: experta.id,
      activeCompanyId: experta.empresaId,
      logs: appendLog(prev, experta, 'Acceso', 'Ingreso Directo Experta SSO', 'Evaluación en Entorno Limpio'),
    }));
  };

  const loginDemoDirect = () => {
    const demoUsr =
      store.users.find((u) => u.email === 'demo@gaval.cl') ||
      store.users.find((u) => u.empresaId === 'comp-gaval-demo') ||
      store.users[0];
    setStore((prev) => ({
      ...prev,
      sessionUserId: demoUsr.id,
      activeCompanyId: demoUsr.empresaId,
      logs: appendLog(prev, demoUsr, 'Acceso', 'Ingreso Directo Demo Comercial', 'Exploración con Datos de Ejemplo'),
    }));
  };

  const loginAsUser = (userId: string) => {
    const target = store.users.find((u) => u.id === userId);
    if (!target) return;
    setStore((prev) => ({
      ...prev,
      sessionUserId: target.id,
      activeCompanyId: target.empresaId,
      logs: appendLog(prev, target, 'Acceso', 'Acceso como Usuario', `Impersonación / Prueba como ${target.nombre}`),
    }));
  };

  const logout = () => {
    setStore((prev) => {
      const usr = prev.users.find((u) => u.id === prev.sessionUserId) || null;
      return {
        ...prev,
        sessionUserId: null,
        logs: appendLog(prev, usr, 'Acceso', 'Cierre de Sesión', ''),
      };
    });
  };

  const completeFirstPasswordChange = (newPassword: string) => {
    setStore((prev) => {
      const updatedUsers = prev.users.map((u) =>
        u.id === prev.sessionUserId
          ? { ...u, password: newPassword, cambioClavePendiente: false }
          : u
      );
      const usr = updatedUsers.find((u) => u.id === prev.sessionUserId) || null;
      return {
        ...prev,
        users: updatedUsers,
        logs: appendLog(prev, usr, 'Seguridad', 'Cambio de Clave Inicial', 'Usuario definió su contraseña personal'),
      };
    });
  };

  const addCompany = (payload: { nombre: string; rut: string; modoInicial: 'demo' | 'blanco' }) => {
    const created: SsoCompanyRecord = {
      id: `comp-${Date.now()}`,
      nombre: payload.nombre.trim(),
      rut: payload.rut.trim(),
      estado: 'Activo',
      modoInicial: payload.modoInicial,
      creadoEn: new Date().toISOString().split('T')[0],
    };
    setStore((prev) => {
      const usr = prev.users.find((u) => u.id === prev.sessionUserId) || null;
      return {
        ...prev,
        companies: [created, ...prev.companies],
        logs: appendLog(
          prev,
          usr,
          'Super Administrador',
          'Creación de Empresa/Prospecto',
          `${created.nombre} (Modo: ${created.modoInicial === 'blanco' ? 'Desde Cero' : 'Demo'})`
        ),
      };
    });
    return created;
  };

  const toggleCompanyStatus = (id: string) => {
    setStore((prev) => ({
      ...prev,
      companies: prev.companies.map((c) =>
        c.id === id ? { ...c, estado: c.estado === 'Activo' ? 'Suspendido' : 'Activo' } : c
      ),
    }));
  };

  const addUser = (payload: Omit<SsoUserRecord, 'id' | 'estado'>) => {
    const created: SsoUserRecord = {
      ...payload,
      id: `usr-${Date.now()}`,
      estado: 'Activo',
    };
    setStore((prev) => {
      const usr = prev.users.find((u) => u.id === prev.sessionUserId) || null;
      return {
        ...prev,
        users: [created, ...prev.users],
        logs: appendLog(prev, usr, 'Gestión de Usuarios', 'Creación e Invitación Usuario', `${created.nombre} (${created.email})`),
      };
    });
    return created;
  };

  const updateUser = (id: string, updates: Partial<SsoUserRecord>) => {
    setStore((prev) => {
      const updated = prev.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
      return {
        ...prev,
        users: updated,
      };
    });
  };

  const deleteUser = (id: string) => {
    setStore((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
    }));
  };

  const toggleUserStatus = (id: string) => {
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
      ),
    }));
  };

  const generateInvitationText = (userObj: SsoUserRecord): string => {
    const portalUrl = window.location.origin;
    const compName = store.companies.find((c) => c.id === userObj.empresaId)?.nombre || 'Gaval SSO';
    const isCleanEnv = compName.toLowerCase().includes('limpio') || userObj.empresaId === 'comp-experta-limpio';

    return (
      `Estimada(o) ${userObj.nombre},\n\n` +
      `Te invitamos cordialmente a acceder y evaluar la plataforma *GAVAL SSO — Prevención de Riesgos & Cumplimiento Normativo*.\n\n` +
      `🏢 *Empresa / Entorno:* ${compName}${isCleanEnv ? ' (Entorno Limpio preparado para auditoría desde cero)' : ''}\n` +
      `🌐 *Enlace directo de acceso:* ${portalUrl}\n` +
      `👤 *Usuario:* ${userObj.email}` + (userObj.rut ? ` (o RUT ${userObj.rut})` : '') + `\n` +
      `🔑 *Contraseña temporal:* ${userObj.password}\n` +
      `🛡️ *Rol asignado:* ${userObj.rolNombre}\n` +
      (userObj.cambioClavePendiente
        ? `🔐 *Nota:* En tu primer ingreso el sistema te solicitará definir tu clave personal.\n`
        : '') +
      `\n📋 *Instrucciones de ingreso:*\n` +
      `1. Ingresa a ${portalUrl}\n` +
      `2. Ingresa tu correo (${userObj.email}) o RUT (${userObj.rut || 'sin puntos'})\n` +
      `3. Digita tu contraseña temporal: ${userObj.password}\n` +
      `4. ¡Listo! Tendrás acceso completo a los módulos de Control Documental, IPER, Contratistas DS 76, Creador de Documentos, Reporte Flash y Dashboard.\n\n` +
      `Quedamos atentos a tus comentarios técnicos, sugerencias y observaciones de mejora.\n` +
      `Saludos cordiales,\n` +
      `*Gabriel Avalos — GAVAL Consultora*`
    );
  };

  const logActivity = (modulo: string, accion: string, detalle = '') => {
    setStore((prev) => {
      const usr = prev.users.find((u) => u.id === prev.sessionUserId) || null;
      if (!usr) return prev;
      return {
        ...prev,
        logs: appendLog(prev, usr, modulo, accion, detalle),
      };
    });
  };

  return (
    <SsoAuthContext.Provider
      value={{
        currentUser,
        isSuperAdmin,
        companies: store.companies,
        activeCompany,
        setActiveCompanyId: (id) => setStore((prev) => ({ ...prev, activeCompanyId: id })),
        users: store.users,
        logs: store.logs,
        login,
        loginSuperAdminDirect,
        loginExpertaDirect,
        loginDemoDirect,
        loginAsUser,
        logout,
        completeFirstPasswordChange,
        addCompany,
        toggleCompanyStatus,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        logActivity,
        generateInvitationText,
      }}
    >
      {children}
    </SsoAuthContext.Provider>
  );
};

export const useSsoAuth = () => {
  const ctx = useContext(SsoAuthContext);
  if (!ctx) throw new Error('useSsoAuth debe usarse dentro de SsoAuthProvider');
  return ctx;
};
