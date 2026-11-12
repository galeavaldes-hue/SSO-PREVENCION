import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  FileCheck,
  Scale,
  AlertTriangle,
  FilePlus2,
  FileSpreadsheet,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getDocumentStatus, useSso } from '../lib/ssoStore';

export default function DashboardSSO() {
  const { state, kpis } = useSso();
  const navigate = useNavigate();

  const contratistasChart = state.contratistas.map((c) => ({
    nombre: c.razonSocial.split(' ').slice(0, 2).join(' '),
    cumplimiento: c.cumplimientoPct,
  }));

  const alertasCriticas = [
    ...state.documentos
      .filter((d) => getDocumentStatus(d.fechaVencimiento) !== 'Vigente')
      .map((d) => ({
        id: d.id,
        titulo: `${d.titulo} (${d.entidadNombre})`,
        detalle: `Estado: ${getDocumentStatus(d.fechaVencimiento)} · Vence: ${d.fechaVencimiento}`,
        to: '/documental',
        severidad: getDocumentStatus(d.fechaVencimiento) === 'Vencido' ? 'alta' : 'media',
      })),
    ...state.trabajadores
      .filter((t) => t.estado === 'Bloqueado')
      .map((t) => ({
        id: t.id,
        titulo: `Trabajador Bloqueado: ${t.nombre}`,
        detalle: `Cargo: ${t.cargo} · Examen altura vence ${t.examenAlturaVencimiento}`,
        to: '/trabajadores',
        severidad: 'alta',
      })),
    ...state.extintores
      .filter((ex) => ex.estado !== 'Operativo')
      .map((ex) => ({
        id: ex.id,
        titulo: `Extintor ${ex.codigo} (${ex.ubicacion})`,
        detalle: `${ex.estado} · Recarga: ${ex.proximaRecarga}`,
        to: '/extintores',
        severidad: 'media',
      })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Ejecutivo SSO / Prevención
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Control en tiempo real de dotación habilitada, vencimientos documentales, contratistas DS 76 y matriz legal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            SSO Score: {kpis.ssoScore}%
          </div>
        </div>
      </div>

      {/* KPIs en Vivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Dotación Total</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-black mt-2">{state.trabajadores.length}</p>
          <p className="text-xs mt-2">
            <span className="text-emerald-600 font-bold">{kpis.trabajadoresHabilitados} habilitados</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-rose-600 font-bold">{kpis.trabajadoresBloqueados} bloqueados</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Cumplimiento Documental</span>
            <FileCheck className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black mt-2">{kpis.cumplimientoDocumentalPct}%</p>
          <p className="text-xs mt-2 text-slate-500">
            {kpis.documentosVencidos} vencidos · {kpis.documentosPorVencer} por vencer
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Matriz Legal (DS 44 / 594)</span>
            <Scale className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black mt-2">{kpis.cumplimientoLegalPct}%</p>
          <p className="text-xs mt-2 text-slate-500">
            {state.normas.filter((n) => n.estado === 'Cumple').length} de {state.normas.length} cuerpos legales al día
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Índice Frecuencia (IF)</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black mt-2">{kpis.indiceFrecuencia}</p>
          <p className="text-xs mt-2 text-slate-500">
            IG: {kpis.indiceGravedad} · {kpis.hallazgosAbiertos} hallazgos abiertos
          </p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => navigate('/creador-documentos')}
          className="text-left p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase opacity-80">Generador Normativo</p>
            <p className="text-base font-black mt-0.5">Crear ODI / AST / DIAT / Acta EPP</p>
          </div>
          <FilePlus2 className="w-6 h-6 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/documental')}
          className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Repositorio Digital</p>
            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              Archivo Documental ({state.documentos.length} docs)
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-500" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/reportes')}
          className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Descarga Directa</p>
            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              Informes Oficiales PDF y Excel
            </p>
          </div>
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
        </button>
      </div>

      {/* Gráfico + Alertas Críticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-4">
            Cumplimiento de Empresas Contratistas (DS N° 76)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contratistasChart}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cumplimiento" name="% Cumplimiento" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            Alertas Preventivas y Vencimientos ({alertasCriticas.length})
          </h2>
          {alertasCriticas.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Sin vencimientos ni bloqueos críticos activos.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {alertasCriticas.map((al) => (
                <button
                  key={al.id}
                  type="button"
                  onClick={() => navigate(al.to)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{al.titulo}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{al.detalle}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      al.severidad === 'alta'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}
                  >
                    {al.severidad === 'alta' ? 'Crítica' : 'Atención'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
