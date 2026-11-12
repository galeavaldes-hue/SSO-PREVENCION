import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { NormaLegalSSO, SsoStoreState } from './ssoStore';

export type LegalTemplateType = 'ODI' | 'AST' | 'DIAT_FLASH' | 'ACTA_EPP' | 'ASISTENCIA_CHARLA';

export interface LegalDocPayload {
  tipo: LegalTemplateType;
  empresaNombre: string;
  empresaRut: string;
  codigo: string;
  fecha: string;
  entidadNombre: string;
  entidadRut?: string;
  cargoOFaena: string;
  riesgosDetectados: string;
  medidasControl: string;
  eppRequerido: string;
  responsable: string;
}

const TEMPLATE_META: Record<LegalTemplateType, { titulo: string; norma: string }> = {
  ODI: {
    titulo: 'REGISTRO DE OBLIGACIÓN DE INFORMAR LOS RIESGOS LABORALES (ODI)',
    norma: 'Decreto Supremo N° 44 (Art. 15) / Ley N° 16.744',
  },
  AST: {
    titulo: 'ANÁLISIS SEGURO DE TRABAJO (AST / ART)',
    norma: 'DS N° 44 / DS N° 132 Reglamento de Seguridad Minera',
  },
  DIAT_FLASH: {
    titulo: 'REPORTE FLASH / DENUNCIA PRELIMINAR DE INCIDENTE (DIAT)',
    norma: 'Ley N° 16.744 Art. 76 / Circular SUSESO',
  },
  ACTA_EPP: {
    titulo: 'ACTA DE ENTREGA Y RECEPCIÓN DE ELEMENTOS DE PROTECCIÓN PERSONAL',
    norma: 'DS N° 594 Art. 53 / Ley N° 16.744 Art. 68',
  },
  ASISTENCIA_CHARLA: {
    titulo: 'REGISTRO DE ASISTENCIA CHARLA / CAPACITACIÓN PREVENTIVA',
    norma: 'DS N° 44 / Ley N° 21.643 (Ley Karin) / Programa Anual SSO',
  },
};

export function exportLegalDocumentPDF(payload: LegalDocPayload) {
  const meta = TEMPLATE_META[payload.tipo];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 192, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(meta.titulo, 16, 21);
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Normativa Aplicable: ${meta.norma}   |   Código: ${payload.codigo}`, 16, 28);

  doc.setTextColor(20, 20, 20);
  autoTable(doc, {
    startY: 38,
    head: [['Antecedentes Generales', 'Detalle']],
    body: [
      ['Empresa Mandante / Empleador', `${payload.empresaNombre} (RUT ${payload.empresaRut})`],
      ['Fecha de Emisión', payload.fecha],
      ['Trabajador / Entidad', `${payload.entidadNombre}${payload.entidadRut ? ` (${payload.entidadRut})` : ''}`],
      ['Cargo / Faena / Área', payload.cargoOFaena],
      ['Responsable SSO / Relator', payload.responsable],
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
  });

  const y1 = (doc as any).lastAutoTable.finalY + 6;
  autoTable(doc, {
    startY: y1,
    head: [['Sección Normativa', 'Contenido Técnico Declarado']],
    body: [
      ['Peligros / Riesgos Identificados', payload.riesgosDetectados || 'No especificado'],
      ['Medidas Preventivas y Controles Obligatorios', payload.medidasControl || 'No especificado'],
      ['EPP Certificado Requerido / Entregado', payload.eppRequerido || 'Casco, lentes UV, calzado seguridad, chaleco reflectante'],
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  const y2 = (doc as any).lastAutoTable.finalY + 14;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Declaro haber sido instruido(a) formalmente respecto a los riesgos inherentes, métodos correctos de trabajo y medidas preventivas.',
    14,
    y2,
    { maxWidth: 188 }
  );

  doc.line(20, y2 + 24, 88, y2 + 24);
  doc.line(124, y2 + 24, 192, y2 + 24);
  doc.text('Firma Trabajador / Receptor', 32, y2 + 29);
  doc.text('Firma Prevencionista / Supervisor', 132, y2 + 29);

  doc.save(`${payload.codigo}_${payload.tipo}.pdf`);
}

export function exportLegalDocumentWord(payload: LegalDocPayload) {
  const meta = TEMPLATE_META[payload.tipo];
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head><meta charset='utf-8'><title>${meta.titulo}</title></head>
    <body style="font-family: Calibri, Arial, sans-serif; color: #0f172a; padding: 20px;">
      <h2 style="background:#0f172a;color:#fff;padding:12px;">${meta.titulo}</h2>
      <p><strong>Normativa:</strong> ${meta.norma} &nbsp;|&nbsp; <strong>Código:</strong> ${payload.codigo}</p>
      <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse;">
        <tr><td><strong>Empresa</strong></td><td>${payload.empresaNombre} (${payload.empresaRut})</td></tr>
        <tr><td><strong>Fecha</strong></td><td>${payload.fecha}</td></tr>
        <tr><td><strong>Trabajador / Entidad</strong></td><td>${payload.entidadNombre} ${payload.entidadRut || ''}</td></tr>
        <tr><td><strong>Cargo / Faena</strong></td><td>${payload.cargoOFaena}</td></tr>
        <tr><td><strong>Responsable SSO</strong></td><td>${payload.responsable}</td></tr>
        <tr><td><strong>Peligros / Riesgos</strong></td><td>${payload.riesgosDetectados}</td></tr>
        <tr><td><strong>Medidas Preventivas</strong></td><td>${payload.medidasControl}</td></tr>
        <tr><td><strong>EPP Requerido / Entregado</strong></td><td>${payload.eppRequerido}</td></tr>
      </table>
      <br/><br/>
      <p>______________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ______________________________</p>
      <p>Firma Trabajador / Receptor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma Prevencionista / Supervisor</p>
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payload.codigo}_${payload.tipo}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLegalMatrixExcel(normas: NormaLegalSSO[], empresaNombre: string) {
  const rows = normas.map((n) => ({
    'Cuerpo Legal': n.cuerpoLegal,
    Artículo: n.articulo,
    Obligación: n.obligacion,
    'Aplica A': n.aplicaA,
    Evidencia: n.evidencia,
    Responsable: n.responsable,
    Estado: n.estado,
    'Última Revisión': n.ultimaRevision,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Matriz Legal SSO');
  XLSX.writeFile(wb, `Matriz_Legal_SSO_${empresaNombre.slice(0, 18).replace(/\s+/g, '_')}.xlsx`);
}

export function exportLegalMatrixPDF(normas: NormaLegalSSO[], empresaNombre: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
  doc.setFontSize(14);
  doc.text(`Matriz Legal de Cumplimiento Normativo SSO — ${empresaNombre}`, 14, 15);
  doc.setFontSize(8.5);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toISOString().split('T')[0]} | Normativa Chilena Vigente (Ley 16.744, DS 44, DS 594, DS 76, Ley 21.643, DS 132)`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [['Cuerpo Legal', 'Art.', 'Obligación', 'Evidencia', 'Responsable', 'Estado']],
    body: normas.map((n) => [n.cuerpoLegal, n.articulo, n.obligacion, n.evidencia, n.responsable, n.estado]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [15, 23, 42] },
  });
  doc.save(`Matriz_Legal_SSO_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportSsoOfficialReport(params: {
  tipo: string;
  formato: 'PDF' | 'Excel';
  state: SsoStoreState;
  kpis: {
    ssoScore: number;
    trabajadoresHabilitados: number;
    trabajadoresBloqueados: number;
    cumplimientoDocumentalPct: number;
    cumplimientoLegalPct: number;
    indiceFrecuencia: number;
    indiceGravedad: number;
    tasaAccidentabilidad: number;
    hallazgosAbiertos: number;
  };
}) {
  const { tipo, formato, state, kpis } = params;
  const today = new Date().toISOString().split('T')[0];

  if (formato === 'Excel') {
    const wb = XLSX.utils.book_new();
    const resumen = [
      { Indicador: 'Empresa', Valor: state.empresaNombre },
      { Indicador: 'RUT', Valor: state.empresaRut },
      { Indicador: 'Tipo de Reporte', Valor: tipo },
      { Indicador: 'SSO Score Global', Valor: `${kpis.ssoScore}%` },
      { Indicador: 'Trabajadores Habilitados / Bloqueados', Valor: `${kpis.trabajadoresHabilitados} / ${kpis.trabajadoresBloqueados}` },
      { Indicador: 'Cumplimiento Documental', Valor: `${kpis.cumplimientoDocumentalPct}%` },
      { Indicador: 'Cumplimiento Normativo Legal', Valor: `${kpis.cumplimientoLegalPct}%` },
      { Indicador: 'Índice de Frecuencia (IF)', Valor: kpis.indiceFrecuencia },
      { Indicador: 'Índice de Gravedad (IG)', Valor: kpis.indiceGravedad },
      { Indicador: 'Tasa de Accidentabilidad (%)', Valor: `${kpis.tasaAccidentabilidad}%` },
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), 'Resumen Ejecutivo');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.contratistas), 'Contratistas DS 76');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.hallazgos), 'Hallazgos y Acciones');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.riesgos), 'Matriz IPER');
    XLSX.writeFile(wb, `Informe_SSO_${today}.xlsx`);
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 192, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(tipo, 16, 21);
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`${state.empresaNombre} (${state.empresaRut}) | Emitido: ${today}`, 16, 28);

  autoTable(doc, {
    startY: 36,
    head: [['Indicador Normativo / Gestión SSO', 'Resultado']],
    body: [
      ['SSO Score Consolidado', `${kpis.ssoScore}%`],
      ['Dotación Habilitada vs Bloqueada', `${kpis.trabajadoresHabilitados} habilitados / ${kpis.trabajadoresBloqueados} bloqueados`],
      ['Cumplimiento Documental', `${kpis.cumplimientoDocumentalPct}%`],
      ['Cumplimiento Matriz Legal (Ley 16.744 / DS 44 / DS 594 / DS 76)', `${kpis.cumplimientoLegalPct}%`],
      ['Índice de Frecuencia (IF = Acc. x 10^6 / HHT)', String(kpis.indiceFrecuencia)],
      ['Índice de Gravedad (IG = Días Perd. x 10^6 / HHT)', String(kpis.indiceGravedad)],
      ['Tasa de Accidentabilidad (TA)', `${kpis.tasaAccidentabilidad}%`],
      ['Hallazgos Abiertos / En Proceso', String(kpis.hallazgosAbiertos)],
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
  });

  const afterY = (doc as any).lastAutoTable.finalY + 6;
  autoTable(doc, {
    startY: afterY,
    head: [['Contratista (DS 76)', 'Dotación', 'Cumplimiento', 'F30-1', 'Estado']],
    body: state.contratistas.map((c) => [
      c.razonSocial,
      String(c.dotacion),
      `${c.cumplimientoPct}%`,
      c.f30AlDia ? 'Al día' : 'Pendiente',
      c.estado,
    ]),
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  doc.save(`Informe_SSO_${today}.pdf`);
}
