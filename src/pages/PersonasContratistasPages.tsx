import React, { useState } from 'react';
import { Users, Briefcase, Plus, Search, CheckCircle2, XCircle, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';

export function TrabajadoresPage() {
  const { state, addTrabajador, toggleTrabajadorEstado } = useSso();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [cargo, setCargo] = useState('');
  const [faena, setFaena] = useState('Faena Cordillera');

  const filtered = state.trabajadores.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.nombre.toLowerCase().includes(q) || t.rut.toLowerCase().includes(q) || t.cargo.toLowerCase().includes(q);
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rut.trim()) return;
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const vDate = nextYear.toISOString().split('T')[0];
    addTrabajador({
      nombre: nombre.trim(),
      rut: rut.trim(),
      cargo: cargo.trim() || 'Operador',
      faena,
      empresa: 'Propia',
      estado: 'Habilitado',
      odiVigente: true,
      examenAlturaVencimiento: vDate,
      licenciaVencimiento: vDate,
    });
    setOpen(false);
    setNombre('');
    setRut('');
    setCargo('');
    Swal.fire({ icon: 'success', title: 'Trabajador registrado', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Trabajadores y Habilitación Faena
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control de pase operativo, inducción ODI (DS 44), examen de altura y licencia.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nuevo Trabajador
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, RUT o cargo..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Trabajador</th>
                <th className="py-3 px-4">Cargo / Faena</th>
                <th className="py-3 px-4">ODI (DS 44)</th>
                <th className="py-3 px-4">Examen Altura</th>
                <th className="py-3 px-4">Estado (Clic para alternar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 px-4">
                    <p className="font-bold">{t.nombre}</p>
                    <p className="text-xs text-slate-400 font-mono">{t.rut}</p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <p className="font-semibold">{t.cargo}</p>
                    <p className="text-slate-400">{t.faena} · {t.empresa}</p>
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-emerald-600">{t.odiVigente ? 'Vigente' : 'Pendiente'}</td>
                  <td className="py-3 px-4 text-xs">{t.examenAlturaVencimiento}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleTrabajadorEstado(t.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                        t.estado === 'Habilitado'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {t.estado === 'Habilitado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {t.estado}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Trabajador</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required value={rut} onChange={(e) => setRut(e.target.value)} placeholder="RUT (ej. 16.450.123-4) *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={faena} onChange={(e) => setFaena(e.target.value)} placeholder="Faena" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Trabajador</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function ContratistasPage() {
  const { state, addContratista } = useSso();
  const [open, setOpen] = useState(false);
  const [razonSocial, setRazonSocial] = useState('');
  const [rut, setRut] = useState('');
  const [servicio, setServicio] = useState('');
  const [dotacion, setDotacion] = useState(10);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial.trim() || !rut.trim()) return;
    addContratista({
      razonSocial: razonSocial.trim(),
      rut: rut.trim(),
      servicio: servicio.trim() || 'Servicios Faena',
      dotacion: Number(dotacion) || 1,
      cumplimientoPct: 95,
      f30AlDia: true,
      ressoVigente: true,
      estado: 'Aprobada',
    });
    setOpen(false);
    setRazonSocial('');
    setRut('');
    setServicio('');
    Swal.fire({ icon: 'success', title: 'Contratista agregada', timer: 1400, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-500" /> Empresas Contratistas (DS N° 76)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control de Art. 66 bis Ley 16.744, RESSO, F30-1 y cumplimiento documental de subcontratistas.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nueva Contratista
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.contratistas.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-base">{c.razonSocial}</h3>
                <p className="text-xs text-slate-400 font-mono">{c.rut} · {c.servicio}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  c.estado === 'Aprobada'
                    ? 'bg-emerald-100 text-emerald-700'
                    : c.estado === 'Condicional'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {c.estado}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Dotación: <strong>{c.dotacion}</strong></span>
              <span>F30-1: <strong>{c.f30AlDia ? 'Al día' : 'Pendiente'}</strong></span>
              <span>RESSO: <strong>{c.ressoVigente ? 'Vigente' : 'Vencido'}</strong></span>
              <span>Cumplimiento: <strong className="text-emerald-600">{c.cumplimientoPct}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Registrar Contratista (DS 76)</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Razón Social *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required value={rut} onChange={(e) => setRut(e.target.value)} placeholder="RUT *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={servicio} onChange={(e) => setServicio(e.target.value)} placeholder="Servicio prestado" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input type="number" value={dotacion} onChange={(e) => setDotacion(Number(e.target.value))} placeholder="Dotación" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Guardar Contratista</button>
          </form>
        </div>
      )}
    </div>
  );
}
