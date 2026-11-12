import React, { useMemo, useState } from 'react';
import { Upload, Search, FileCheck, AlertCircle, Clock, CheckCircle2, Trash2, Download, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { DocumentoSSO, getDocumentStatus, useSso } from '../lib/ssoStore';

export default function ControlDocumentalPage() {
  const { state, addDocumento, deleteDocumento } = useSso();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'Trabajador' | 'Contratista' | 'Empresa' | 'alertas'>('todos');
  const [showModal, setShowModal] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<DocumentoSSO['categoria']>('ODI');
  const [norma, setNorma] = useState('DS N° 44 Art. 15');
  const [entidadTipo, setEntidadTipo] = useState<DocumentoSSO['entidadTipo']>('Trabajador');
  const [entidadNombre, setEntidadNombre] = useState('');
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [responsable, setResponsable] = useState('Depto. SSO');
  const [archivoNombre, setArchivoNombre] = useState('');

  const filtered = useMemo(() => {
    return state.documentos.filter((d) => {
      const status = getDocumentStatus(d.fechaVencimiento);
      if (activeTab === 'alertas' && status === 'Vigente') return false;
      if (activeTab !== 'todos' && activeTab !== 'alertas' && d.entidadTipo !== activeTab) return false;
      const q = searchTerm.toLowerCase();
      return (
        !q ||
        d.titulo.toLowerCase().includes(q) ||
        d.codigo.toLowerCase().includes(q) ||
        d.entidadNombre.toLowerCase().includes(q) ||
        d.norma.toLowerCase().includes(q)
      );
    });
  }, [state.documentos, activeTab, searchTerm]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !entidadNombre.trim() || !fechaVencimiento) {
      Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Completa título, entidad y fecha de vencimiento.' });
      return;
    }
    const codigo = `DOC-${categoria.slice(0, 3).toUpperCase()}-${String(state.documentos.length + 1).padStart(3, '0')}`;
    addDocumento({
      codigo,
      titulo: titulo.trim(),
      categoria,
      norma,
      entidadTipo,
      entidadNombre: entidadNombre.trim(),
      fechaEmision,
      fechaVencimiento,
      responsable,
      archivoNombre: archivoNombre || `${codigo}.pdf`,
    });
    setShowModal(false);
    setTitulo('');
    setEntidadNombre('');
    setArchivoNombre('');
    Swal.fire({ icon: 'success', title: 'Documento Archivado', text: `Código ${codigo} guardado en el repositorio.`, timer: 1600, showConfirmButton: false });
  };

  const handleDownloadResumen = (d: DocumentoSSO) => {
    const content = `GAVAL SSO — COMPROBANTE DE ARCHIVO DOCUMENTAL\nCódigo: ${d.codigo}\nTítulo: ${d.titulo}\nCategoría: ${d.categoria}\nNormativa: ${d.norma}\nEntidad: ${d.entidadNombre} (${d.entidadTipo})\nEmisión: ${d.fechaEmision}\nVencimiento: ${d.fechaVencimiento}\nResponsable: ${d.responsable}\nArchivo adjunto: ${d.archivoNombre || 'Generado digitalmente'}\n${d.contenidoResumen ? `\nDetalle:\n${d.contenidoResumen}` : ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${d.codigo}_expediente.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Control Documental &amp; Archivo</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Repositorio centralizado de ODI, RIOHS, Matriz IPER, exámenes ocupacionales y certificados F30-1.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Subir / Archivar Documento
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'todos', label: `Todos (${state.documentos.length})` },
          { id: 'Trabajador', label: 'Trabajadores' },
          { id: 'Contratista', label: 'Contratistas (DS 76)' },
          { id: 'Empresa', label: 'Empresa' },
          { id: 'alertas', label: 'Vencidos / Por Vencer' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Buscador + Tabla */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, título, trabajador, contratista o normativa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Entidad</th>
                <th className="py-3 px-4">Normativa</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc) => {
                const status = getDocumentStatus(doc.fechaVencimiento);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-xs font-bold">{doc.codigo}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{doc.titulo}</p>
                      <p className="text-[11px] text-slate-400">{doc.categoria} · {doc.archivoNombre}</p>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-semibold">{doc.entidadNombre}</span>
                      <span className="block text-slate-400">{doc.entidadTipo}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-indigo-600 dark:text-indigo-400">{doc.norma}</td>
                    <td className="py-3 px-4 text-xs">{doc.fechaVencimiento}</td>
                    <td className="py-3 px-4">
                      {status === 'Vigente' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Vigente
                        </span>
                      ) : status === 'Próximo a Vencer' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          <Clock className="w-3 h-3" /> Por Vencer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                          <AlertCircle className="w-3 h-3" /> Vencido
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadResumen(doc)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Descargar respaldo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDocumento(doc.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    No se encontraron documentos con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Subir / Archivar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" /> Archivar Documento SSO
              </h3>
              <button type="button" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold block mb-1">Título del Documento *</label>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. ODI Operador Grúa Horquilla" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
                  <option value="ODI">ODI (DS 44)</option>
                  <option value="AST/ART">AST / ART</option>
                  <option value="RIOHS">RIOHS</option>
                  <option value="Matriz IPER">Matriz IPER</option>
                  <option value="Examen Ocupacional">Examen Ocupacional</option>
                  <option value="Certificado F30-1">Certificado F30-1</option>
                  <option value="Acta EPP">Acta EPP</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Norma Aplicable</label>
                <input value={norma} onChange={(e) => setNorma(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Tipo Entidad</label>
                <select value={entidadTipo} onChange={(e) => setEntidadTipo(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
                  <option value="Trabajador">Trabajador</option>
                  <option value="Contratista">Contratista</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Nombre Entidad / Trabajador *</label>
                <input value={entidadNombre} onChange={(e) => setEntidadNombre(e.target.value)} placeholder="Ej. Carlos Mendoza" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Fecha Emisión</label>
                <input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Fecha Vencimiento *</label>
                <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold block mb-1">Adjuntar Archivo (PDF / Word / Imagen)</label>
                <input
                  type="file"
                  onChange={(e) => setArchivoNombre(e.target.files?.[0]?.name || '')}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Guardar en Archivo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
