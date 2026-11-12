import React, { useState } from 'react';
import { FilePlus2, FileText, Download, Archive, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSso } from '../lib/ssoStore';
import {
  exportLegalDocumentPDF,
  exportLegalDocumentWord,
  LegalTemplateType,
} from '../lib/ssoDocumentExport';

const TEMPLATES: { id: LegalTemplateType; label: string; norma: string; defaultRisks: string; defaultControls: string }[] = [
  {
    id: 'ODI',
    label: 'ODI — Obligación de Informar (DS N° 44 Art. 15)',
    norma: 'DS N° 44 / Ley 16.744',
    defaultRisks: 'Conducción en ruta minera/alta montaña, exposición a radiación UV, manejo manual de cargas, interacción hombre-máquina.',
    defaultControls: 'Uso obligatorio de cinturón de seguridad, respetar velocidades GPS, check-list preoperacional diario, bloqueador solar FPS 50+ y pausas activas.',
  },
  {
    id: 'AST',
    label: 'AST / ART — Análisis Seguro de Trabajo',
    norma: 'DS N° 44 / DS N° 132',
    defaultRisks: 'Carga suspendida, atrapamiento de extremidades, superficie irregular o con hielo.',
    defaultControls: 'Segregar área con conos, verificar certificación de eslingas y cadenas, designar Rigger autorizado, mantener distancia de línea de fuego.',
  },
  {
    id: 'DIAT_FLASH',
    label: 'Reporte Flash / DIAT Preliminar (Ley 16.744)',
    norma: 'Ley N° 16.744 Art. 76 / SUSESO',
    defaultRisks: 'Evento laboral reportado dentro de las primeras 24 horas para denuncia a organismo administrador (Mutualidad).',
    defaultControls: 'Atención primaria inmediata, resguardo del sitio del suceso, toma de declaraciones y notificación a jefatura y CPHS.',
  },
  {
    id: 'ACTA_EPP',
    label: 'Acta de Entrega de EPP Certificados (DS N° 594)',
    norma: 'DS N° 594 Art. 53',
    defaultRisks: 'Exposición a impactos, ruido ocupacional, proyección de partículas y radiación solar.',
    defaultControls: 'Entrega gratuita de EPP certificados por ISP/NCh vigentes con instrucción de uso, limpieza y reposición.',
  },
  {
    id: 'ASISTENCIA_CHARLA',
    label: 'Registro de Asistencia Charla / Capacitación',
    norma: 'DS N° 44 / Ley 21.643 (Ley Karin)',
    defaultRisks: 'Refuerzo conductual preventivo, protocolo Ley Karin y procedimientos operacionales seguros.',
    defaultControls: 'Difusión participativa de 10-60 minutos con verificación de entendimiento y firma de asistentes.',
  },
];

export default function CreadorDocumentosPage() {
  const { state, addDocumento } = useSso();
  const [tipo, setTipo] = useState<LegalTemplateType>('ODI');
  const [codigo, setCodigo] = useState(`FMT-SSO-${Math.floor(100 + Math.random() * 900)}`);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [entidadNombre, setEntidadNombre] = useState(state.trabajadores[0]?.nombre || '');
  const [entidadRut, setEntidadRut] = useState(state.trabajadores[0]?.rut || '');
  const [cargoOFaena, setCargoOFaena] = useState('Conductor Tracto Camión — Faena Cordillera');
  const [riesgosDetectados, setRiesgosDetectados] = useState(TEMPLATES[0].defaultRisks);
  const [medidasControl, setMedidasControl] = useState(TEMPLATES[0].defaultControls);
  const [eppRequerido, setEppRequerido] = useState('Casco MSA, Lentes UV ANSI Z87.1, Calzado Seguridad NCh 772, Chaleco Reflectante Geólogo');
  const [responsable, setResponsable] = useState('Prevencionista de Riesgos SSO');

  const handleTemplateChange = (next: LegalTemplateType) => {
    setTipo(next);
    const tpl = TEMPLATES.find((t) => t.id === next)!;
    setRiesgosDetectados(tpl.defaultRisks);
    setMedidasControl(tpl.defaultControls);
  };

  const buildPayload = () => ({
    tipo,
    empresaNombre: state.empresaNombre,
    empresaRut: state.empresaRut,
    codigo,
    fecha,
    entidadNombre: entidadNombre || 'Sin especificar',
    entidadRut,
    cargoOFaena,
    riesgosDetectados,
    medidasControl,
    eppRequerido,
    responsable,
  });

  const handleArchiveAndDownload = (format: 'PDF' | 'WORD') => {
    const payload = buildPayload();
    const tpl = TEMPLATES.find((t) => t.id === tipo)!;
    if (format === 'PDF') exportLegalDocumentPDF(payload);
    else exportLegalDocumentWord(payload);

    const catMap: Record<LegalTemplateType, any> = {
      ODI: 'ODI',
      AST: 'AST/ART',
      DIAT_FLASH: 'DIAT / Flash',
      ACTA_EPP: 'Acta EPP',
      ASISTENCIA_CHARLA: 'Charla / Capacitación',
    };
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    addDocumento({
      codigo,
      titulo: `${tpl.label.split('—')[0].trim()} — ${payload.entidadNombre}`,
      categoria: catMap[tipo],
      norma: tpl.norma,
      entidadTipo: 'Trabajador',
      entidadNombre: payload.entidadNombre,
      fechaEmision: fecha,
      fechaVencimiento: nextYear.toISOString().split('T')[0],
      responsable,
      archivoNombre: `${codigo}_${tipo}.${format === 'PDF' ? 'pdf' : 'doc'}`,
      contenidoResumen: `Riesgos: ${riesgosDetectados}\nControles: ${medidasControl}`,
    });

    Swal.fire({
      icon: 'success',
      title: `Documento emitido en ${format} y archivado`,
      text: `Quedó respaldado en Control Documental bajo código ${codigo}.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FilePlus2 className="w-6 h-6 text-emerald-500" />
          Creador &amp; Archivo de Documentos Legales SSO
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Genera formatos normativos chilenos listos para firma en PDF o Word y archívalos automáticamente en Control Documental.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector de plantilla */}
        <div className="space-y-2.5">
          <p className="text-xs font-black uppercase text-slate-500">1. Selecciona Formato Normativo</p>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleTemplateChange(tpl.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                tipo === tpl.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <p className="text-xs font-black text-slate-900 dark:text-white">{tpl.label}</p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{tpl.norma}</p>
            </button>
          ))}
        </div>

        {/* Formulario + Emisión */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <p className="text-xs font-black uppercase text-slate-500">2. Completa los Datos del Documento</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1">Código Folio</label>
              <input value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Fecha Emisión</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Responsable SSO</label>
              <input value={responsable} onChange={(e) => setResponsable(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1">Trabajador / Entidad</label>
              <input
                list="sso-trabajadores-list"
                value={entidadNombre}
                onChange={(e) => {
                  setEntidadNombre(e.target.value);
                  const found = state.trabajadores.find((t) => t.nombre === e.target.value);
                  if (found) {
                    setEntidadRut(found.rut);
                    setCargoOFaena(`${found.cargo} — ${found.faena}`);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <datalist id="sso-trabajadores-list">
                {state.trabajadores.map((t) => (
                  <option key={t.id} value={t.nombre} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">RUT</label>
              <input value={entidadRut} onChange={(e) => setEntidadRut(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Cargo / Faena</label>
              <input value={cargoOFaena} onChange={(e) => setCargoOFaena(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Peligros y Riesgos Identificados</label>
            <textarea rows={2} value={riesgosDetectados} onChange={(e) => setRiesgosDetectados(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Medidas Preventivas y Controles Obligatorios</label>
            <textarea rows={2} value={medidasControl} onChange={(e) => setMedidasControl(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">EPP Certificado Requerido / Entregado</label>
            <input value={eppRequerido} onChange={(e) => setEppRequerido(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Al descargar se archiva automáticamente en Control Documental
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleArchiveAndDownload('WORD')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                Descargar Word + Archivar
              </button>
              <button
                type="button"
                onClick={() => handleArchiveAndDownload('PDF')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Descargar PDF + Archivar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
