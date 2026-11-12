import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  FileCheck,
  FilePlus2,
  Scale,
  FileSpreadsheet,
  AlertTriangle,
  Shield,
  BookOpen,
  CheckSquare,
  Zap,
  AlertCircle,
  ClipboardList,
  Flame,
  Siren,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Eraser,
  Activity,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';
import { useSsoAuth } from '../lib/ssoAuthStore';

const NAV_GROUPS = [
  {
    label: 'Resumen Ejecutivo',
    items: [
      { to: '/dashboard', label: 'Dashboard SSO', icon: BarChart3 },
      { to: '/indicadores', label: 'Indicadores (IF / IG / TA)', icon: TrendingUp },
    ],
  },
  {
    label: 'Personas y Contratistas',
    items: [
      { to: '/trabajadores', label: 'Trabajadores', icon: Users },
      { to: '/contratistas', label: 'Empresas Contratistas (DS 76)', icon: Briefcase },
    ],
  },
  {
    label: 'Documentos y Normativa',
    items: [
      { to: '/documental', label: 'Control Documental & Archivo', icon: FileCheck },
      { to: '/creador-documentos', label: 'Creador de Documentos', icon: FilePlus2 },
      { to: '/normativo', label: 'Cumplimiento Normativo', icon: Scale },
      { to: '/reportes', label: 'Centro de Reportes', icon: FileSpreadsheet },
    ],
  },
  {
    label: 'Prevención en Terreno',
    items: [
      { to: '/riesgos', label: 'Gestión de Riesgos (IPER)', icon: AlertTriangle },
      { to: '/epp', label: 'EPP Certificados', icon: Shield },
      { to: '/charlas', label: 'Charlas & Capacitaciones', icon: BookOpen },
      { to: '/inspecciones', label: 'Inspecciones & Auditorías', icon: CheckSquare },
    ],
  },
  {
    label: 'Incidentes y Emergencias',
    items: [
      { to: '/reporte-flash', label: 'Reporte Flash / DIAT', icon: Zap },
      { to: '/incidentes', label: 'Incidentes / Accidentes', icon: AlertCircle },
      { to: '/hallazgos', label: 'Hallazgos & Acciones', icon: ClipboardList },
      { to: '/extintores', label: 'Extintores & Equipos', icon: Flame },
      { to: '/emergencias', label: 'Emergencias & Simulacros', icon: Siren },
    ],
  },
];

export default function SsoLayout() {
  const { state, kpis, resetDemo, startBlankWorkspace } = useSso();
  const { currentUser, isSuperAdmin, companies, activeCompany, setActiveCompanyId, logout, logActivity } = useSsoAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    logActivity(location.pathname, 'Visita de Módulo');
  }, [location.pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleResetDemo = () => {
    Swal.fire({
      title: '¿Cargar / Restablecer Datos Demo?',
      text: 'Se cargarán los registros ficticios de demostración en tu entorno actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cargar Demo',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        resetDemo();
        Swal.fire({ icon: 'success', title: 'Datos Demo cargados', timer: 1300, showConfirmButton: false });
      }
    });
  };

  const handleStartBlank = () => {
    Swal.fire({
      title: '¿Empezar en Blanco (Desde Cero)?',
      text: 'Se limpiarán los datos demostrativos para que puedas ingresar tus propios trabajadores, documentos y empresas desde cero.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dejar en blanco',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        startBlankWorkspace();
        Swal.fire({ icon: 'success', title: 'Entorno en blanco listo', timer: 1300, showConfirmButton: false });
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 w-72 border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white">GAVAL SSO</h1>
            <p className="text-[11px] font-bold text-emerald-400">Prevención &amp; Normativa</p>
          </div>
        </div>
        <button className="lg:hidden text-slate-400" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 space-y-1.5">
        {isSuperAdmin ? (
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SUPER ADMIN MODE
            </span>
            <select
              value={activeCompany.id}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="mt-1.5 w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-white outline-none"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentUser?.rolNombre}
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-1 truncate">{state.empresaNombre}</p>
          </div>
        )}
        <p className="text-[11px] text-slate-400">
          {currentUser?.nombre} · Score SSO: <strong className="text-emerald-400">{kpis.ssoScore}%</strong>
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {isSuperAdmin && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400">
              Super Administrador
            </p>
            <div className="space-y-1">
              <NavLink
                to="/super-admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-200 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Empresas, Usuarios &amp; Invitar</span>
              </NavLink>
              <NavLink
                to="/super-admin/actividad"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-200 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Log de Actividad</span>
              </NavLink>
            </div>
          </div>
        )}

        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden xl:block">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Normativa Chilena Vigente · Ley 16.744 · DS 44 · DS 594 · DS 76 · Ley 21.643
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/creador-documentos')}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Crear Documento</span>
            </button>
            <button
              type="button"
              onClick={handleStartBlank}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Limpiar datos demo y empezar desde cero"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Empezar en Blanco</span>
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Cargar datos demo de ejemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cargar Demo</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              title="Cambiar tema"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
