import React, { useState } from 'react';
import { Scale, Download, FileText, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { NormaLegalSSO, useSso } from '../lib/ssoStore';
import { exportLegalMatrixExcel, exportLegalMatrixPDF } from '../lib/ssoDocumentExport';

export default function CumplimientoNormativoPage() {
  const { state, updateNormaEstado } = useSso();
  const [search, setSearch] = useState('');

  const filtered = state.normas.filter((n) => {
    const q = search.toLowerCase();
    return !q || n.cuerpoLegal.toLowerCase().includes(q) || n.obligacion.toLowerCase().includes(q) || n.articulo.toLowerCase().includes(q);
  });

  const cumpleCount = state.normas.filter((n) => n.estado === 'Cumple').length;
  const obsCount = state.normas.filter((n) => n.estado === 'Observación').length;
  const noCumpleCount = state.normas.filter((n) => n.estado === 'No Cumple').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-500" />
            Matriz Legal &amp; Cumplimiento Normativo (Chile)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Seguimiento vigente de Ley 16.744, DS N° 44 (ex DS 40), DS N° 594, DS N° 76, Ley 21.643 (Ley Karin) y DS N° 132.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exportLegalMatrixExcel(state.normas, state.empresaNombre)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
          <button
            type="button"
            onClick={() => exportLegalMatrixPDF(state.normas, state.empresaNombre)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500">TOTAL OBLIGACIONES</p>
          <p className="text-2xl font-black mt-1">{state.normas.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-600">CUMPLE</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{cumpleCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-500">EN OBSERVACIÓN</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{obsCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-rose-600">BRECHAS (NO CUMPLE)</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{noCumpleCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cuerpo legal (DS 44, Ley Karin, 16.744) u obligación..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Cuerpo Legal</th>
                <th className="py-3 px-4">Obligación Reglamentaria</th>
                <th className="py-3 px-4">Evidencia</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Estado (Editable)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((n) => (
                <tr key={n.id}>
                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900 dark:text-white block">{n.cuerpoLegal}</span>
                    <span className="text-xs text-slate-400">{n.articulo}</span>
                  </td>
                  <td className="py-3 px-4 text-xs max-w-md">{n.obligacion}</td>
                  <td className="py-3 px-4 text-xs text-slate-500">{n.evidencia}</td>
                  <td className="py-3 px-4 text-xs font-semibold">{n.responsable}</td>
                  <td className="py-3 px-4">
                    <select
                      value={n.estado}
                      onChange={(e) => updateNormaEstado(n.id, e.target.value as NormaLegalSSO['estado'])}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black border outline-none ${
                        n.estado === 'Cumple'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : n.estado === 'Observación'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      <option value="Cumple">Cumple</option>
                      <option value="Observación">Observación</option>
                      <option value="No Cumple">No Cumple</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
