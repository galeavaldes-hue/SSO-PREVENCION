import React, { useState } from 'react';
import { TrendingUp, FileSpreadsheet, FileText, Download, PieChart, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';
import { exportSsoOfficialReport } from '../lib/ssoDocumentExport';

export function IndicadoresPage() {
  const { state, kpis } = useSso();

  const tendenciaMensual = [
    { mes: 'Jun', if: 18.2, ig: 120 },
    { mes: 'Jul', if: 15.0, ig: 95 },
    { mes: 'Ago', if: 12.4, ig: 60 },
    { mes: 'Sep', if: 10.1, ig: 40 },
    { mes: 'Oct', if: 8.5, ig: 25 },
    { mes: 'Nov', if: kpis.indiceFrecuencia, ig: kpis.indiceGravedad },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          Indicadores Estadísticos SSO (Ley 16.744 / SUSESO)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Cálculo automático sobre {state.hhtMensual.toLocaleString('es-CL')} Horas Hombre Trabajadas (HHT) del período.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500">ÍNDICE FRECUENCIA (IF)</p>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{kpis.indiceFrecuencia}</p>
          <p className="text-[11px] text-slate-400 mt-1">(Accidentes × 10⁶) / HHT</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500">ÍNDICE GRAVEDAD (IG)</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{kpis.indiceGravedad}</p>
          <p className="text-[11px] text-slate-400 mt-1">(Días Perdidos × 10⁶) / HHT</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500">TASA ACCIDENTABILIDAD</p>
          <p className="text-3xl font-black text-amber-600 mt-2">{kpis.tasaAccidentabilidad}%</p>
          <p className="text-[11px] text-slate-400 mt-1">(Accidentes / Dotación) × 100</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500">EVENTOS REGISTRADOS</p>
          <p className="text-3xl font-black mt-2">{state.incidentes.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Accidentes + Cuasi accidentes</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h2 className="text-base font-black mb-4">Evolución Índice de Frecuencia (IF) vs Gravedad (IG)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tendenciaMensual}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="if" name="Índice Frecuencia" stroke="#4f46e5" strokeWidth={3} />
              <Line type="monotone" dataKey="ig" name="Índice Gravedad" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function ReportesPage() {
  const { state, kpis, logReporte } = useSso();
  const [tipo, setTipo] = useState('Reporte Mensual de Gestión SSO (DS 44)');
  const [formato, setFormato] = useState<'PDF' | 'Excel'>('PDF');

  const handleGenerate = () => {
    exportSsoOfficialReport({ tipo, formato, state, kpis });
    logReporte(tipo, tipo, formato);
    Swal.fire({
      icon: 'success',
      title: `Informe ${formato} generado`,
      text: 'El archivo se descargó y quedó registrado en el historial de informes.',
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
          Centro de Reportes Oficiales SSO
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generación y descarga en PDF o Excel de informes ejecutivos alineados a DS 44, DS 76 y Ley 16.744.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-black text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" /> Generar Nuevo Informe
          </h2>
          <div>
            <label className="text-xs font-bold block mb-1">Tipo de Informe</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            >
              <option>Reporte Mensual de Gestión SSO (DS 44)</option>
              <option>Estadísticas de Accidentabilidad (SUSESO / Ley 16.744)</option>
              <option>Cumplimiento de Empresas Contratistas (DS 76)</option>
              <option>Estado de Hallazgos y Acciones Correctivas</option>
              <option>Consolidado Matriz IPER &amp; Riesgos Críticos</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Formato de Salida</label>
            <div className="flex gap-3">
              {(['PDF', 'Excel'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormato(fmt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black border ${
                    formato === fmt
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generar y Descargar Informe
          </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-black text-base">Informes Emitidos Recientemente ({state.reportes.length})</h2>
          <div className="space-y-2.5">
            {state.reportes.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold">{r.titulo}</p>
                    <p className="text-xs text-slate-400">
                      {r.fecha} · Por {r.generadoPor} · Formato {r.formato}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Emitido
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
