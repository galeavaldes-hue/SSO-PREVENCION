import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  FileCheck,
  Scale,
  Sparkles,
  Play,
  Lock,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Clock,
  Eye,
  Building2,
  HardHat,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSsoAuth } from '../lib/ssoAuthStore';

export default function LandingPortalPage({ onGoToLogin }: { onGoToLogin?: () => void }) {
  const { currentUser, loginDemoDirect, loginExpertaDirect, loginSuperAdminDirect } = useSsoAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'operacion' | 'documental' | 'contratistas' | 'normativa'>('operacion');

  const handleStartDemoData = () => {
    loginDemoDirect();
    navigate('/dashboard');
  };

  const handleStartCleanWorkspace = () => {
    loginExpertaDirect();
    navigate('/dashboard');
  };

  const handleGoLogin = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      navigate('/login');
    }
  };

  const openWhatsAppSales = () => {
    const text = encodeURIComponent(
      'Hola Gabriel, me interesa conocer más sobre la plataforma GAVAL SSO y solicitar una demostración para mi empresa.'
    );
    window.open(`https://wa.me/56987654321?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">GAVAL SSO</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  Chile 2026
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">Prevención de Riesgos &amp; Cumplimiento Normativo</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#beneficios" className="hover:text-emerald-400 transition-colors">Beneficios</a>
            <a href="#modulos" className="hover:text-emerald-400 transition-colors">Módulos</a>
            <a href="#normativa" className="hover:text-emerald-400 transition-colors">Normativa Legal</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">Entornos Demo</a>
            <a href="#contacto" className="hover:text-emerald-400 transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>Volver a mi Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleGoLogin}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartDemoData}
                  className="hidden sm:flex px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Probar Demo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION DE ALTO IMPACTO */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glows de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ESTÁNDAR NORMATIVO 2025/2026 · DS 44, LEY KARIN &amp; MINERÍA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            El Software de Prevención de Riesgos y Cumplimiento Normativo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Líder para la Industria &amp; Minería de Chile
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Centraliza la gestión SSO de tu empresa y contratistas en una plataforma 100% cloud. Reduce a cero las observaciones en fiscalizaciones de la <strong className="text-white">Dirección del Trabajo</strong> y <strong className="text-white">SERNAGEOMIN</strong>, digitaliza carpetas de arranque y automatiza la generación de documentos legales en segundos.
          </p>

          {/* BOTONES PRINCIPALES DE ACCIÓN */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartDemoData}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Explorar Demo con Datos de Muestra</span>
            </button>

            <button
              type="button"
              onClick={handleStartCleanWorkspace}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-emerald-500/40 text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <HardHat className="w-4 h-4 text-emerald-400" />
              <span>Probar Entorno Limpio (Auditoría Experta SSO)</span>
            </button>

            <button
              type="button"
              onClick={openWhatsAppSales}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Cotizar / WhatsApp</span>
            </button>
          </div>

          {/* INDICADORES CLAVE */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Cumplimiento Legal DS 44 &amp; DS 594</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-teal-300">0 Papeles</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Carpetas Físicas Digitalizadas</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-cyan-300">&lt; 24h</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Reportes Flash &amp; DIAT Inmediata</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">30 Días</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Avisos Preventivos de Vencimiento</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN NORMATIVA CHILENA */}
      <section id="normativa" className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase">
              <Scale className="w-3.5 h-3.5" /> Marco Regulatorio Chileno
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Blindaje Total ante Fiscalizaciones y Multas Laborales
            </h2>
            <p className="text-sm text-slate-400">
              Diseñado y calibrado específicamente para responder ante la Dirección del Trabajo, SEREMI de Salud, Mutualidades y SERNAGEOMIN.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                code: 'DS N° 44 (2024-2025)',
                title: 'Nuevo Reglamento de Gestión SST',
                desc: 'Obligatoriedad de Sistema de Gestión, Matriz IPER dinámica, protocolos de riesgos y Registro ODI formalizado.',
                badge: 'Obligatorio',
              },
              {
                code: 'Ley N° 21.643 (Ley Karin)',
                title: 'Prevención Acoso Laboral y Violencia',
                desc: 'Protocolos de prevención, difusión e investigación de denuncias integrados formalmente al RIOHS de la empresa.',
                badge: 'Vigente',
              },
              {
                code: 'DS N° 594',
                title: 'Condiciones Sanitarias y Ambientales',
                desc: 'Control estricto de extintores vigentes, agua potable, señalética y entrega de EPP certificados ISP.',
                badge: 'Fiscalizado DT',
              },
              {
                code: 'DS N° 76 / Art. 66 bis',
                title: 'Gestión de Subcontratación',
                desc: 'Registro digital de empresas contratistas, RESSO, control de certificados F30/F30-1 y prevención coordinada.',
                badge: 'Responsabilidad Solidaria',
              },
              {
                code: 'Ley N° 16.744',
                title: 'Seguro de Accidentes y DIAT',
                desc: 'Investigación de incidentes con tiempo perdido, actas CPHS y generación de Denuncia Individual (DIAT) en 24h.',
                badge: 'Mutualidades',
              },
              {
                code: 'DS N° 132 (Minería)',
                title: 'Reglamento de Seguridad Minera',
                desc: 'Licencias internas de conducción en faena, exámenes de gran altura geográfica y análisis de trabajo seguro (AST).',
                badge: 'SERNAGEOMIN',
              },
            ].map((n, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 space-y-3 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {n.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {n.badge}
                  </span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTES VS DESPUÉS (EL PROBLEMA VS GAVAL SSO) */}
      <section id="beneficios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase">
            <TrendingUp className="w-3.5 h-3.5" /> Rentabilidad &amp; Seguridad Operativa
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            ¿Por qué migrar las carpetas de papel a GAVAL SSO?
          </h2>
          <p className="text-sm text-slate-400">
            Comparativa real de operaciones entre la gestión manual tradicional y la automatización con nuestra plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Antes */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-900/50 text-rose-400 flex items-center justify-center font-black">
                ✕
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Gestión Tradicional en Papel &amp; Excel</h3>
                <p className="text-xs text-rose-300">Riesgos latentes y descontrol operativo</p>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Exámenes de altura o licencias vencidas sin aviso previo, generando multas y paralización en garita.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>F30-1 de contratistas no revisados que traspasan la responsabilidad laboral y multas a tu empresa mandante.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Pérdida de horas de trabajo buscando documentos en archivadores físicos durante una fiscalización.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Extintores vencidos o EPP sin acta de entrega firmada, provocando observaciones graves del SEREMI.</span>
              </li>
            </ul>
          </div>

          {/* Card Con Gaval SSO */}
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-emerald-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-600/30">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Con GAVAL SSO Prevención</h3>
                <p className="text-xs text-emerald-400">Control preventivo automatizado y tranquilidad total</p>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Semáforo de Habilitación Inmediata:</strong> Alertas automáticas 30 días antes del vencimiento de licencias, exámenes y ODIs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Auditoría Contratistas DS 76:</strong> Validación en 1 clic de F30-1, dotación y estado de cumplimiento previsional.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Creador Digital de Documentos:</strong> Emisión de ODIs, ASTs y Actas de EPP en PDF formal listo para firma en 30 segundos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Reporte Flash y DIAT Inmediata:</strong> Trazabilidad completa de incidentes con cálculo automático de IF, IG y TA.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SHOWCASE INTERACTIVO DE MÓDULOS */}
      <section id="modulos" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase">
              <Layers className="w-3.5 h-3.5" /> Plataforma Integral
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Los Módulos que Transforman la Seguridad en tu Empresa
            </h2>
            <p className="text-sm text-slate-400">
              Explora las capacidades operativas diseñadas para prevencionistas, jefes de operaciones y gerencia general.
            </p>
          </div>

          {/* Selector de pestañas */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
            {[
              { id: 'operacion', label: 'Operación en Terreno & IPER', icon: HardHat },
              { id: 'documental', label: 'Control Documental & Creador', icon: FileCheck },
              { id: 'contratistas', label: 'Contratistas DS 76 & F30-1', icon: Briefcase },
              { id: 'normativa', label: 'Incidentes, DIAT & Reportes', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contenido de la pestaña */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10">
            {activeTab === 'operacion' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Módulo Terreno &amp; Matriz IPER
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Matriz IPER Viva, Inspecciones Preoperacionales y Control de EPP
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evalúa la probabilidad y consecuencia de cada peligro mediante el cálculo automático del VEP (Valor Esperado de Pérdida). Genera inspecciones con check-list digital, controla fechas de recarga de extintores y registra la entrega de EPP certificados bajo norma NCh y estándares ISP.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <p className="font-bold text-white">Matriz IPER Dinámica</p>
                      <p className="text-[11px] text-slate-400 mt-1">Crítico / Alto / Moderado / Bajo</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <p className="font-bold text-white">Inspecciones con Hallazgos</p>
                      <p className="text-[11px] text-slate-400 mt-1">Plazos y seguimiento de acciones</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                    <span>IPER: Transporte Carga Sobredimensionada</span>
                    <span className="text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded">VEP: 12 (Alto)</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong className="text-white">Peligro:</strong> Carga suspendida / cadenas en tensión</p>
                    <p><strong className="text-white">Riesgo:</strong> Aplastamiento o golpeado por elemento</p>
                    <p><strong className="text-white">Control:</strong> Zona segregada 5m, rigger certificado y check-list de eslingas.</p>
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={handleStartDemoData}
                      className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Ver módulo completo en el Demo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documental' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
                    Gestión Documental
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Semáforos de Vencimiento y Generador Automático de Documentos
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Almacena y clasifica los expedientes de toda tu dotación. El Creador de Documentos te permite redactar y descargar en PDF formal ODIs bajo DS 44 Art. 15, Análisis de Seguridad de la Tarea (AST), y Actas de Entrega de EPP sin tener que tipear plantillas a mano.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">🟢 Vigente</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">🟠 Por Vencer (30d)</span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">🔴 Vencido</span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">ODI Conductor Alta Montaña (DS 44)</p>
                      <p className="text-[11px] text-slate-400">Carlos Mendoza Tapia · Vigente hasta 2027</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">PDF Listo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Examen Preocupacional Altura Geográfica</p>
                      <p className="text-[11px] text-slate-400">Luis Contreras Díaz · Vencido hace 5 días</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">Bloqueo Faena</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contratistas' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                    Subcontratación DS N° 76
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Auditoría Rigurosa de Contratistas y Certificados F30-1
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evita la responsabilidad laboral y previsional solidaria. Monitorea en una sola pantalla la dotación asignada de cada empresa contratista, porcentaje de cumplimiento de estándares de faena y vigencia de su Reglamento Especial para Empresas Contratistas (RESSO).
                  </p>
                  <button
                    type="button"
                    onClick={handleStartDemoData}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <span>Ver Módulo Contratistas en Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Servicios Norte Ltda.</p>
                      <p className="text-[11px] text-slate-400">18 trabajadores · Mantenimiento Mecánico</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-black">96% Cumple</span>
                      <p className="text-[10px] text-emerald-500 font-bold">F30-1 al Día</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Aseo Industrial Pacífico</p>
                      <p className="text-[11px] text-slate-400">7 trabajadores · Manejo Residuos</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-black">62% Falla</span>
                      <p className="text-[10px] text-rose-500 font-bold">F30-1 Vencido</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'normativa' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                    Incidentes &amp; Business Intelligence
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Reporte Flash Inmediato, DIAT y Métricas Oficiales (IF / IG / TA)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ante un evento en terreno, el prevencionista o supervisor emite el Reporte Flash en 60 segundos con foto y medidas preliminares. El sistema calcula automáticamente los índices de frecuencia (IF), gravedad (IG) y tasa de accidentabilidad (TA) según las HHT de tu faena.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 font-bold">Índice de Frecuencia (IF)</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">0.00</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Accidentes CTP por millón HHT</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400 font-bold">Índice de Gravedad (IG)</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">0.00</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Días perdidos por millón HHT</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN ENTORNOS DEMO DE PRUEBA */}
      <section id="demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase">
            <Eye className="w-3.5 h-3.5" /> Acceso Directo de Evaluación
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Elige cómo deseas probar GAVAL SSO hoy mismo
          </h2>
          <p className="text-sm text-slate-400">
            Sin tarjetas de crédito ni demoras. Accede con 1 solo clic al entorno que mejor se adapte a tu necesidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opción 1: Demo con Datos */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-8 space-y-6 flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <Play className="w-6 h-6 fill-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Ideal para Gerentes &amp; Prospectos
                </span>
                <h3 className="text-xl font-black text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  Demo Comercial con Datos de Muestra
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Contiene una empresa ficticia de minería y transporte con 6 trabajadores, 4 empresas contratistas, matriz IPER, expedientes, extintores y gráficos listos para ver el sistema en su máxima capacidad.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Visualiza KPIs, gráficos y semáforos llenos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Descarga reportes de prueba en PDF y Excel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prueba la emisión de un ODI o Reporte Flash</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleStartDemoData}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Entrar al Demo con Datos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Opción 2: Demo Limpio para Experta SSO */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 hover:border-indigo-500/60 rounded-3xl p-8 space-y-6 flex flex-col justify-between transition-all group shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-500/30">
                  Para Expertos SSO &amp; Auditoría
                </span>
                <h3 className="text-xl font-black text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  Entorno Limpio (Evaluación Técnica Desde Cero)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Espacio completamente vacío y sin registros previos, preparado para que una experta en SSO o auditor técnico evalúe la facilidad de parametrización, creación de dotación, carga documental y retroalimente mejoras.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Sin datos ficticios preexistentes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Prueba registrar un trabajador y subir su ODI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Diseñado para sugerir correcciones y mejoras</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleStartCleanWorkspace}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Entrar al Entorno Limpio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER & CONTACTO COMERCIAL */}
      <footer id="contacto" className="border-t border-slate-800 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">GAVAL SSO</h4>
                  <p className="text-[11px] text-emerald-400 font-bold">GAVAL Consultora &amp; Soluciones SpA</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plataforma tecnológica especializada en prevención de riesgos, gestión documental y cumplimiento normativo para transporte, logística y minería en Chile.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">Normativa &amp; Cobertura</h5>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Decreto Supremo N° 44 (Nuevo Reglamento SST)</li>
                <li>• Ley N° 21.643 (Ley Karin y Protocolos)</li>
                <li>• Decreto Supremo N° 594 (Condiciones Sanitarias)</li>
                <li>• Decreto Supremo N° 76 (Subcontratación y F30-1)</li>
                <li>• Decreto Supremo N° 132 (Seguridad Minera)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">Contacto Directo Titular</h5>
              <p className="text-xs text-slate-400">
                <strong>Gabriel Avalos</strong> — Director Estratégico
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>gavalos@gaval.cl</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+56 9 8765 4321</span>
                </p>
              </div>
              <button
                type="button"
                onClick={openWhatsAppSales}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hablar por WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 GAVAL SSO · Todos los derechos reservados · Gabriel Avalos.</p>
            <div className="flex gap-4">
              <button type="button" onClick={handleGoLogin} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Acceso Plataforma
              </button>
              <button type="button" onClick={handleStartDemoData} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Demo Comercial
              </button>
              <button type="button" onClick={handleStartCleanWorkspace} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Entorno Limpio
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
