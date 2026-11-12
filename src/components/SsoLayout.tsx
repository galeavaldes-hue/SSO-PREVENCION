import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';

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
  const { state, kpis, resetDemo } = useSso();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleResetDemo = () => {
    Swal.fire({
      title: '¿Restablecer Maqueta Demo?',
      text: 'Se restaurarán los datos iniciales de demostración.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        resetDemo();
        Swal.fire({ icon: 'success', title: 'Demo restablecida', timer: 1400, showConfirmButton: false });
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

      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Maqueta Comercial Chile
        </span>
        <p className="text-xs font-semibold text-slate-200 mt-1 truncate">{state.empresaNombre}</p>
        <p className="text-[11px] text-slate-400">Score SSO: <strong className="text-emerald-400">{kpis.ssoScore}%</strong></p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
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
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Normativa Chilena Vigente · Ley 16.744 · DS 44 · DS 594 · DS 76 · Ley 21.643
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/creador-documentos')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Crear Documento Legal</span>
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Restablecer datos demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Restablecer Demo</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              title="Cambiar tema"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
