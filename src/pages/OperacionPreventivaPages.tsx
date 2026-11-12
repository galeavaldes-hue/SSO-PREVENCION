import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  BookOpen,
  CheckSquare,
  Zap,
  AlertCircle,
  ClipboardList,
  Flame,
  Siren,
  Plus,
  Download,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';
import { exportLegalDocumentPDF } from '../lib/ssoDocumentExport';

export function RiesgosIperPage() {
  const { state, addRiesgo } = useSso();
  const [open, setOpen] = useState(false);
  const [proceso, setProceso] = useState('');
  const [tarea, setTarea] = useState('');
  const [peligro, setPeligro] = useState('');
  const [riesgo, setRiesgo] = useState('');
  const [probabilidad, setProbabilidad] = useState(3);
  const [consecuencia, setConsecuencia] = useState(4);
  const [controlActual, setControlActual] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proceso.trim() || !peligro.trim()) return;
    addRiesgo({
      proceso: proceso.trim(),
      tarea: tarea.trim() || 'Operación estándar',
      peligro: peligro.trim(),
      riesgo: riesgo.trim() || 'Daño a la salud / seguridad',
      probabilidad: Number(probabilidad),
      consecuencia: Number(consecuencia),
      controlActual: controlActual.trim() || 'Procedimiento seguro y uso de EPP',
      responsable: 'Supervisor Faena',
    });
    setOpen(false);
    setProceso('');
    setPeligro('');
    Swal.fire({ icon: 'success', title: 'Peligro agregado a Matriz IPER', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Gestión de Riesgos — Matriz IPER (DS N° 44)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Identificación de Peligros y Evaluación de Riesgos con cálculo automático de VEP (Probabilidad × Consecuencia).
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Evaluar Nuevo Peligro
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
            <tr>
              <th className="py-3 px-4">Proceso / Tarea</th>
              <th className="py-3 px-4">Peligro y Riesgo</th>
              <th className="py-3 px-4">P × C = VEP</th>
              <th className="py-3 px-4">Nivel</th>
              <th className="py-3 px-4">Control Existente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {state.riesgos.map((r) => (
              <tr key={r.id}>
                <td className="py-3 px-4">
                  <p className="font-bold">{r.proceso}</p>
                  <p className="text-xs text-slate-400">{r.tarea}</p>
                </td>
                <td className="py-3 px-4 text-xs">
                  <p className="font-semibold">{r.peligro}</p>
                  <p className="text-slate-400">{r.riesgo}</p>
                </td>
                <td className="py-3 px-4 font-mono text-xs font-bold">{r.probabilidad} × {r.consecuencia} = {r.vep}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    r.nivel === 'Crítico' ? 'bg-rose-100 text-rose-700' :
                    r.nivel === 'Alto' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {r.nivel}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs">{r.controlActual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Nueva Evaluación IPER</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={proceso} onChange={(e) => setProceso(e.target.value)} placeholder="Proceso *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={tarea} onChange={(e) => setTarea(e.target.value)} placeholder="Tarea específica" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required value={peligro} onChange={(e) => setPeligro(e.target.value)} placeholder="Peligro identificado *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={riesgo} onChange={(e) => setRiesgo(e.target.value)} placeholder="Riesgo asociado" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1">Probabilidad (1-5)</label>
                <input type="number" min={1} max={5} value={probabilidad} onChange={(e) => setProbabilidad(Number(e.target.value))} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Consecuencia (1-5)</label>
                <input type="number" min={1} max={5} value={consecuencia} onChange={(e) => setConsecuencia(Number(e.target.value))} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
            </div>
            <textarea value={controlActual} onChange={(e) => setControlActual(e.target.value)} placeholder="Medidas de control" rows={2} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar en Matriz IPER</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function EppPage() {
  const { state, addEpp } = useSso();
  const [open, setOpen] = useState(false);
  const [trabajador, setTrabajador] = useState(state.trabajadores[0]?.nombre || '');
  const [elemento, setElemento] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trabajador.trim() || !elemento.trim()) return;
    const tr = state.trabajadores.find((t) => t.nombre === trabajador);
    const nextY = new Date();
    nextY.setFullYear(nextY.getFullYear() + 1);
    addEpp({
      fecha: new Date().toISOString().split('T')[0],
      trabajador,
      rut: tr?.rut || '15.000.000-0',
      elemento: elemento.trim(),
      certificacion: 'NCh / ISP Vigente',
      cantidad: 1,
      proximaRenovacion: nextY.toISOString().split('T')[0],
      firmado: true,
    });
    setOpen(false);
    setElemento('');
    Swal.fire({ icon: 'success', title: 'Entrega EPP registrada', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" /> Elementos de Protección Personal (DS N° 594)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Registro de entrega certificada (NCh/ISP) y emisión inmediata de Acta de Recepción PDF.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Registrar Entrega EPP
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
            <tr>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Trabajador</th>
              <th className="py-3 px-4">EPP Entregado</th>
              <th className="py-3 px-4">Certificación</th>
              <th className="py-3 px-4 text-right">Acta PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {state.epps.map((ep) => (
              <tr key={ep.id}>
                <td className="py-3 px-4 text-xs">{ep.fecha}</td>
                <td className="py-3 px-4">
                  <p className="font-bold">{ep.trabajador}</p>
                  <p className="text-xs text-slate-400 font-mono">{ep.rut}</p>
                </td>
                <td className="py-3 px-4 font-semibold text-xs">{ep.elemento}</td>
                <td className="py-3 px-4 text-xs text-emerald-600 font-bold">{ep.certificacion}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      exportLegalDocumentPDF({
                        tipo: 'ACTA_EPP',
                        empresaNombre: state.empresaNombre,
                        empresaRut: state.empresaRut,
                        codigo: `EPP-${ep.id.slice(-4).toUpperCase()}`,
                        fecha: ep.fecha,
                        entidadNombre: ep.trabajador,
                        entidadRut: ep.rut,
                        cargoOFaena: 'Faena Operativa',
                        riesgosDetectados: 'Exposición ocupacional inherente al cargo.',
                        medidasControl: 'Uso obligatorio, mantención y reposición ante deterioro.',
                        eppRequerido: `${ep.elemento} (${ep.certificacion})`,
                        responsable: 'Bodega / Prevención SSO',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Acta PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Entrega de EPP</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input value={trabajador} onChange={(e) => setTrabajador(e.target.value)} placeholder="Trabajador *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required value={elemento} onChange={(e) => setElemento(e.target.value)} placeholder="EPP entregado (ej. Casco + Lentes UV) *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Entrega</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function CharlasCapacitacionesPage() {
  const { state, addCharla } = useSso();
  const [open, setOpen] = useState(false);
  const [modalidad, setModalidad] = useState<'Charla 5 Minutos' | 'Capacitación Formal'>('Charla 5 Minutos');
  const [tema, setTema] = useState('');
  const [relator, setRelator] = useState('Prevencionista SSO');
  const [asistentes, setAsistentes] = useState(12);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim()) return;
    addCharla({
      modalidad,
      tema: tema.trim(),
      relator,
      fecha: new Date().toISOString().split('T')[0],
      faena: 'Faena Cordillera',
      asistentes: Number(asistentes) || 1,
      duracionMin: modalidad === 'Charla 5 Minutos' ? 10 : 90,
      estado: 'Realizada',
    });
    setOpen(false);
    setTema('');
    Swal.fire({ icon: 'success', title: 'Registro guardado', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" /> Charlas 5 Min &amp; Capacitaciones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Programa anual de formación preventiva, Ley Karin y conducción segura.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Registrar Charla / Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.charlas.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{c.modalidad}</span>
              <span className="text-xs font-bold text-emerald-600">{c.estado}</span>
            </div>
            <h3 className="font-black text-base">{c.tema}</h3>
            <p className="text-xs text-slate-500">Relator: {c.relator} · {c.fecha} · {c.faena}</p>
            <p className="text-xs font-bold pt-1">{c.asistentes} asistentes · {c.duracionMin} min</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Charla o Capacitación</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
              <option value="Charla 5 Minutos">Charla 5 Minutos</option>
              <option value="Capacitación Formal">Capacitación Formal</option>
            </select>
            <input required value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Tema tratado *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={relator} onChange={(e) => setRelator(e.target.value)} placeholder="Relator" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input type="number" value={asistentes} onChange={(e) => setAsistentes(Number(e.target.value))} placeholder="N° Asistentes" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Registro</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function InspeccionesAuditoriasPage() {
  const { state, addInspeccion } = useSso();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [cumplimientoPct, setCumplimientoPct] = useState(95);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    addInspeccion({
      modalidad: 'Inspección Terreno',
      codigo: `INSP-${Math.floor(100 + Math.random() * 900)}`,
      titulo: titulo.trim(),
      normaReferencia: 'DS N° 44 / DS N° 594',
      faena: 'Faena Cordillera',
      fecha: new Date().toISOString().split('T')[0],
      cumplimientoPct: Number(cumplimientoPct),
      inspector: 'Prevencionista Terreno',
      estado: Number(cumplimientoPct) >= 95 ? 'Aprobada' : 'Con Hallazgos',
    });
    setOpen(false);
    setTitulo('');
    Swal.fire({ icon: 'success', title: 'Inspección registrada', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-500" /> Inspecciones &amp; Auditorías SSO
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Listas de verificación en terreno y auditorías DS 44 / DS 76.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nueva Inspección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.inspecciones.map((ins) => (
          <div key={ins.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-indigo-600">{ins.codigo} · {ins.modalidad}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${ins.estado === 'Aprobada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{ins.estado}</span>
            </div>
            <h3 className="font-black text-base">{ins.titulo}</h3>
            <p className="text-xs text-slate-500">{ins.normaReferencia} · {ins.faena} · {ins.fecha}</p>
            <p className="text-sm font-black text-emerald-600">Cumplimiento: {ins.cumplimientoPct}%</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Nueva Inspección / Auditoría</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título de la inspección *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input type="number" min={0} max={100} value={cumplimientoPct} onChange={(e) => setCumplimientoPct(Number(e.target.value))} placeholder="% Cumplimiento" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Inspección</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function IncidentesFlashPage({ flashOnly = false }: { flashOnly?: boolean }) {
  const { state, addIncidente } = useSso();
  const [open, setOpen] = useState(false);
  const [trabajador, setTrabajador] = useState(state.trabajadores[0]?.nombre || '');
  const [tipo, setTipo] = useState<'Incidente / Cuasi Accidente' | 'Accidente sin Tiempo Perdido' | 'Accidente con Tiempo Perdido'>('Incidente / Cuasi Accidente');
  const [descripcion, setDescripcion] = useState('');
  const [diasPerdidos, setDiasPerdidos] = useState(0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    addIncidente({
      folio: `${flashOnly ? 'FLS' : 'INC'}-2026-${String(state.incidentes.length + 15).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo,
      gravedad: diasPerdidos > 0 ? 'Grave' : 'Leve',
      trabajador,
      faena: 'Faena Cordillera',
      descripcion: descripcion.trim(),
      diasPerdidos: Number(diasPerdidos) || 0,
      diatEmitida: tipo !== 'Incidente / Cuasi Accidente',
      estado: 'Investigación',
    });
    setOpen(false);
    setDescripcion('');
    Swal.fire({ icon: 'success', title: 'Evento registrado (Ley 16.744)', timer: 1500, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            {flashOnly ? <Zap className="w-6 h-6 text-amber-500" /> : <AlertCircle className="w-6 h-6 text-rose-500" />}
            {flashOnly ? 'Reporte Flash / DIAT Preliminar (24h)' : 'Incidentes y Accidentes (Ley 16.744)'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Registro de eventos laborales, días perdidos para IF/IG y descarga inmediata de DIAT preliminar PDF.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {flashOnly ? 'Emitir Reporte Flash' : 'Registrar Incidente'}
        </button>
      </div>

      <div className="space-y-3">
        {state.incidentes.map((inc) => (
          <div key={inc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{inc.folio}</span>
                <span className="text-xs font-bold text-rose-600">{inc.tipo}</span>
                <span className="text-xs text-slate-400">· {inc.fecha}</span>
              </div>
              <p className="font-bold text-sm">{inc.descripcion}</p>
              <p className="text-xs text-slate-500">Trabajador: {inc.trabajador} · Faena: {inc.faena} · Días perdidos: {inc.diasPerdidos}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                exportLegalDocumentPDF({
                  tipo: 'DIAT_FLASH',
                  empresaNombre: state.empresaNombre,
                  empresaRut: state.empresaRut,
                  codigo: inc.folio,
                  fecha: inc.fecha,
                  entidadNombre: inc.trabajador,
                  cargoOFaena: inc.faena,
                  riesgosDetectados: `${inc.tipo} (${inc.gravedad}): ${inc.descripcion}`,
                  medidasControl: 'Atención primaria, resguardo del área e investigación causal (Árbol de Causas).',
                  eppRequerido: 'Verificación de EPP en sitio del suceso.',
                  responsable: 'Jefe SSO / CPHS',
                })
              }
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-black inline-flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" /> Descargar Flash / DIAT PDF
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Evento / Flash</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
              <option value="Incidente / Cuasi Accidente">Incidente / Cuasi Accidente</option>
              <option value="Accidente sin Tiempo Perdido">Accidente sin Tiempo Perdido</option>
              <option value="Accidente con Tiempo Perdido">Accidente con Tiempo Perdido</option>
            </select>
            <input value={trabajador} onChange={(e) => setTrabajador(e.target.value)} placeholder="Trabajador involucrado" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <textarea required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del suceso *" rows={3} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input type="number" min={0} value={diasPerdidos} onChange={(e) => setDiasPerdidos(Number(e.target.value))} placeholder="Días perdidos" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black">Guardar Evento</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function HallazgosAccionesPage() {
  const { state, addHallazgo, updateHallazgoEstado } = useSso();
  const [open, setOpen] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [accionCorrectiva, setAccionCorrectiva] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    addHallazgo({
      codigo: `HAL-0${state.hallazgos.length + 43}`,
      fecha: new Date().toISOString().split('T')[0],
      origen: 'Observación',
      descripcion: descripcion.trim(),
      faena: 'Faena Cordillera',
      criticidad: 'Alta',
      accionCorrectiva: accionCorrectiva.trim() || 'Corrección inmediata en terreno',
      responsable: 'Supervisor Operaciones',
      plazo: new Date().toISOString().split('T')[0],
      estado: 'Abierto',
    });
    setOpen(false);
    setDescripcion('');
    setAccionCorrectiva('');
    Swal.fire({ icon: 'success', title: 'Hallazgo registrado', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-500" /> Hallazgos, Observaciones &amp; Acciones Correctivas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Seguimiento de cierre de brechas preventivas con responsable y plazo.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nuevo Hallazgo
        </button>
      </div>

      <div className="space-y-3">
        {state.hallazgos.map((h) => (
          <div key={h.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black">{h.codigo}</span>
                <span className="text-xs font-bold text-indigo-600">{h.origen}</span>
                <span className="text-xs font-bold text-rose-600">· Criticidad {h.criticidad}</span>
              </div>
              <p className="font-bold text-sm mt-1">{h.descripcion}</p>
              <p className="text-xs text-slate-500 mt-1">Acción: {h.accionCorrectiva} · Resp: {h.responsable} (Plazo {h.plazo})</p>
            </div>
            <select
              value={h.estado}
              onChange={(e) => updateHallazgoEstado(h.id, e.target.value as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-black border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
            >
              <option value="Abierto">Abierto</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Hallazgo</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <textarea required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del hallazgo *" rows={2} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={accionCorrectiva} onChange={(e) => setAccionCorrectiva(e.target.value)} placeholder="Acción correctiva propuesta" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Hallazgo</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function ExtintoresEquiposPage() {
  const { state, addExtintor } = useSso();
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !ubicacion.trim()) return;
    const nextY = new Date();
    nextY.setFullYear(nextY.getFullYear() + 1);
    addExtintor({
      codigo: codigo.trim(),
      ubicacion: ubicacion.trim(),
      tipoAgente: 'PQS ABC 10 kg',
      ultimaMantencion: new Date().toISOString().split('T')[0],
      proximaRecarga: nextY.toISOString().split('T')[0],
      presionOk: true,
      estado: 'Operativo',
    });
    setOpen(false);
    setCodigo('');
    setUbicacion('');
    Swal.fire({ icon: 'success', title: 'Extintor registrado', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" /> Control de Extintores &amp; Equipos de Emergencia (DS 594)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Vencimientos de recarga anual (NCh 1433) y estado de botiquines, kits MATPEL y lavaojos.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nuevo Extintor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="font-black text-base">Extintores ({state.extintores.length})</h2>
          {state.extintores.map((ex) => (
            <div key={ex.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{ex.codigo} · {ex.tipoAgente}</p>
                <p className="text-xs text-slate-400">{ex.ubicacion} · Recarga: {ex.proximaRecarga}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${ex.estado === 'Operativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{ex.estado}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="font-black text-base">Equipos de Emergencia ({state.equiposEmergencia.length})</h2>
          {state.equiposEmergencia.map((eq) => (
            <div key={eq.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{eq.codigo} · {eq.tipo}</p>
                <p className="text-xs text-slate-400">{eq.ubicacion} · Inspección: {eq.ultimaInspeccion}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${eq.estado === 'Operativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{eq.estado}</span>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Extintor</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código (ej. EXT-004) *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ubicación / Patente *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Extintor</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function EmergenciasPage() {
  const { state, addEmergencia } = useSso();
  const [escenario, setEscenario] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escenario.trim()) return;
    addEmergencia({
      fecha: new Date().toISOString().split('T')[0],
      escenario: escenario.trim(),
      faena: 'Faena Cordillera',
      tiempoRespuestaMin: 5.0,
      participantes: 15,
      evaluacion: 'Satisfactorio',
    });
    setEscenario('');
    Swal.fire({ icon: 'success', title: 'Simulacro registrado', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Siren className="w-6 h-6 text-rose-500" /> Emergencias &amp; Simulacros (Plan Respuesta)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Registro de simulacros, tiempos de evacuación y brigadas de emergencia.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-3">
        <input value={escenario} onChange={(e) => setEscenario(e.target.value)} placeholder="Registrar nuevo simulacro (ej. Evacuación sismo taller)..." className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Registrar</button>
      </form>

      <div className="space-y-3">
        {state.emergencias.map((em) => (
          <div key={em.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base">{em.escenario}</h3>
              <p className="text-xs text-slate-400">{em.fecha} · {em.faena} · Respuesta: {em.tiempoRespuestaMin} min · {em.participantes} participantes</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700">{em.evaluacion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
