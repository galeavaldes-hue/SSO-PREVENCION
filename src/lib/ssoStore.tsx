import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface TrabajadorSSO {
  id: string;
  nombre: string;
  rut: string;
  cargo: string;
  faena: string;
  empresa: string;
  estado: 'Habilitado' | 'Bloqueado';
  odiVigente: boolean;
  examenAlturaVencimiento: string;
  licenciaVencimiento: string;
}

export interface ContratistaSSO {
  id: string;
  razonSocial: string;
  rut: string;
  servicio: string;
  dotacion: number;
  cumplimientoPct: number;
  f30AlDia: boolean;
  ressoVigente: boolean;
  estado: 'Aprobada' | 'Condicional' | 'Suspendida';
}

export interface DocumentoSSO {
  id: string;
  codigo: string;
  titulo: string;
  categoria: 'ODI' | 'AST/ART' | 'RIOHS' | 'Matriz IPER' | 'Examen Ocupacional' | 'Certificado F30-1' | 'Acta EPP' | 'DIAT / Flash' | 'Charla / Capacitación';
  norma: string;
  entidadTipo: 'Empresa' | 'Trabajador' | 'Contratista';
  entidadNombre: string;
  fechaEmision: string;
  fechaVencimiento: string;
  responsable: string;
  archivoNombre?: string;
  contenidoResumen?: string;
}

export interface NormaLegalSSO {
  id: string;
  cuerpoLegal: string;
  articulo: string;
  obligacion: string;
  aplicaA: string;
  evidencia: string;
  responsable: string;
  estado: 'Cumple' | 'Observación' | 'No Cumple';
  ultimaRevision: string;
}

export interface RiesgoIPER {
  id: string;
  proceso: string;
  tarea: string;
  peligro: string;
  riesgo: string;
  probabilidad: number;
  consecuencia: number;
  vep: number;
  nivel: 'Crítico' | 'Alto' | 'Moderado' | 'Bajo';
  controlActual: string;
  responsable: string;
}

export interface IncidenteSSO {
  id: string;
  folio: string;
  fecha: string;
  tipo: 'Accidente con Tiempo Perdido' | 'Accidente sin Tiempo Perdido' | 'Incidente / Cuasi Accidente' | 'Enfermedad Profesional';
  gravedad: 'Leve' | 'Grave' | 'Fatal' | 'Alto Potencial';
  trabajador: string;
  faena: string;
  descripcion: string;
  diasPerdidos: number;
  diatEmitida: boolean;
  estado: 'Investigación' | 'Cerrado';
}

export interface HallazgoAccionSSO {
  id: string;
  codigo: string;
  fecha: string;
  origen: 'Inspección' | 'Observación' | 'Auditoría' | 'Incidente';
  descripcion: string;
  faena: string;
  criticidad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  accionCorrectiva: string;
  responsable: string;
  plazo: string;
  estado: 'Abierto' | 'En Proceso' | 'Cerrado';
}

export interface EppEntregaSSO {
  id: string;
  fecha: string;
  trabajador: string;
  rut: string;
  elemento: string;
  certificacion: string;
  cantidad: number;
  proximaRenovacion: string;
  firmado: boolean;
}

export interface ExtintorSSO {
  id: string;
  codigo: string;
  ubicacion: string;
  tipoAgente: 'PQS ABC 6 kg' | 'PQS ABC 10 kg' | 'CO2 5 kg' | 'Espuma AFFF';
  ultimaMantencion: string;
  proximaRecarga: string;
  presionOk: boolean;
  estado: 'Operativo' | 'Próximo a Recarga' | 'Fuera de Servicio';
}

export interface EquipoEmergenciaSSO {
  id: string;
  codigo: string;
  tipo: 'Botiquín Trauma Faena' | 'Ducha / Lavaojos' | 'DEA Desfibrilador' | 'Camilla Rescate' | 'Kit Derrame MATPEL';
  ubicacion: string;
  ultimaInspeccion: string;
  estado: 'Operativo' | 'Reposición Requerida';
}

export interface CharlaCapacitacionSSO {
  id: string;
  modalidad: 'Charla 5 Minutos' | 'Capacitación Formal';
  tema: string;
  relator: string;
  fecha: string;
  faena: string;
  asistentes: number;
  duracionMin: number;
  estado: 'Realizada' | 'Programada';
}

export interface InspeccionAuditoriaSSO {
  id: string;
  modalidad: 'Inspección Terreno' | 'Auditoría Sistema';
  codigo: string;
  titulo: string;
  normaReferencia: string;
  faena: string;
  fecha: string;
  cumplimientoPct: number;
  inspector: string;
  estado: 'Aprobada' | 'Con Hallazgos';
}

export interface EmergenciaSimulacroSSO {
  id: string;
  fecha: string;
  escenario: string;
  faena: string;
  tiempoRespuestaMin: number;
  participantes: number;
  evaluacion: 'Satisfactorio' | 'Mejoras Requeridas';
}

export interface ReporteGeneradoSSO {
  id: string;
  titulo: string;
  tipo: string;
  formato: 'PDF' | 'Excel' | 'Word';
  fecha: string;
  generadoPor: string;
}

export interface SsoStoreState {
  empresaNombre: string;
  empresaRut: string;
  hhtMensual: number;
  trabajadores: TrabajadorSSO[];
  contratistas: ContratistaSSO[];
  documentos: DocumentoSSO[];
  normas: NormaLegalSSO[];
  riesgos: RiesgoIPER[];
  incidentes: IncidenteSSO[];
  hallazgos: HallazgoAccionSSO[];
  epps: EppEntregaSSO[];
  extintores: ExtintorSSO[];
  equiposEmergencia: EquipoEmergenciaSSO[];
  charlas: CharlaCapacitacionSSO[];
  inspecciones: InspeccionAuditoriaSSO[];
  emergencias: EmergenciaSimulacroSSO[];
  reportes: ReporteGeneradoSSO[];
}

const STORAGE_KEY = 'gaval_sso_prevencion_demo_v1';

const addDaysStr = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const INITIAL_STATE: SsoStoreState = {
  empresaNombre: 'Gaval Demo Minería & Logística SpA',
  empresaRut: '76.458.920-4',
  hhtMensual: 28800,
  trabajadores: [
    { id: 't1', nombre: 'Carlos Mendoza Tapia', rut: '15.432.198-3', cargo: 'Conductor Tracto Camión', faena: 'Faena Cordillera', empresa: 'Propia', estado: 'Habilitado', odiVigente: true, examenAlturaVencimiento: addDaysStr(140), licenciaVencimiento: addDaysStr(210) },
    { id: 't2', nombre: 'Rodrigo Paredes Rojas', rut: '16.904.512-K', cargo: 'Operador Maquinaria Pesada', faena: 'Planta Concentradora', empresa: 'Propia', estado: 'Habilitado', odiVigente: true, examenAlturaVencimiento: addDaysStr(18), licenciaVencimiento: addDaysStr(95) },
    { id: 't3', nombre: 'Luis Contreras Díaz', rut: '14.210.887-5', cargo: 'Conductor Bus Personal', faena: 'Faena Cordillera', empresa: 'Propia', estado: 'Bloqueado', odiVigente: true, examenAlturaVencimiento: addDaysStr(-5), licenciaVencimiento: addDaysStr(120) },
    { id: 't4', nombre: 'Matías Valenzuela Soto', rut: '18.321.445-1', cargo: 'Rigger / Señalero', faena: 'Patio Cama Baja', empresa: 'Propia', estado: 'Habilitado', odiVigente: true, examenAlturaVencimiento: addDaysStr(88), licenciaVencimiento: addDaysStr(300) },
    { id: 't5', nombre: 'Jorge Araya Núñez', rut: '13.789.201-7', cargo: 'Supervisor Terreno', faena: 'Faena Cordillera', empresa: 'Propia', estado: 'Habilitado', odiVigente: true, examenAlturaVencimiento: addDaysStr(190), licenciaVencimiento: addDaysStr(180) },
    { id: 't6', nombre: 'Sebastián Fuenzalida', rut: '17.654.332-8', cargo: 'Mecánico Mantenimiento', faena: 'Taller Central', empresa: 'Servicios Norte Ltda.', estado: 'Habilitado', odiVigente: true, examenAlturaVencimiento: addDaysStr(12), licenciaVencimiento: addDaysStr(60) },
  ],
  contratistas: [
    { id: 'c1', razonSocial: 'Servicios Norte Ltda.', rut: '77.120.450-2', servicio: 'Mantenimiento Mecánico Terreno', dotacion: 18, cumplimientoPct: 96, f30AlDia: true, ressoVigente: true, estado: 'Aprobada' },
    { id: 'c2', razonSocial: 'Ingeniería Eléctrica Atacama SpA', rut: '76.890.112-9', servicio: 'Montaje Eléctrico y Tableros', dotacion: 12, cumplimientoPct: 84, f30AlDia: true, ressoVigente: true, estado: 'Condicional' },
    { id: 'c3', razonSocial: 'Escolta & Logística Vial S.A.', rut: '78.234.901-5', servicio: 'Escolta Sobredimensión MOP', dotacion: 9, cumplimientoPct: 100, f30AlDia: true, ressoVigente: true, estado: 'Aprobada' },
    { id: 'c4', razonSocial: 'Aseo Industrial Pacífico', rut: '76.331.778-0', servicio: 'Manejo Residuos Peligrosos', dotacion: 7, cumplimientoPct: 62, f30AlDia: false, ressoVigente: false, estado: 'Suspendida' },
  ],
  documentos: [
    { id: 'd1', codigo: 'DOC-ODI-001', titulo: 'ODI Conductor Alta Montaña (DS 44)', categoria: 'ODI', norma: 'DS N° 44 Art. 15', entidadTipo: 'Trabajador', entidadNombre: 'Carlos Mendoza Tapia', fechaEmision: addDaysStr(-90), fechaVencimiento: addDaysStr(275), responsable: 'Prevencionista Jefe', archivoNombre: 'ODI_Carlos_Mendoza.pdf' },
    { id: 'd2', codigo: 'DOC-IPER-01', titulo: 'Matriz IPER Transporte Carga Pesada 2026', categoria: 'Matriz IPER', norma: 'DS N° 44 / Ley 16.744', entidadTipo: 'Empresa', entidadNombre: 'Gaval Demo Minería & Logística SpA', fechaEmision: addDaysStr(-60), fechaVencimiento: addDaysStr(305), responsable: 'Depto. SSO', archivoNombre: 'Matriz_IPER_2026.xlsx' },
    { id: 'd3', codigo: 'DOC-RIOHS-01', titulo: 'Reglamento Interno Orden, Higiene y Seguridad (Ley Karin)', categoria: 'RIOHS', norma: 'Código del Trabajo / Ley 21.643', entidadTipo: 'Empresa', entidadNombre: 'Gaval Demo Minería & Logística SpA', fechaEmision: addDaysStr(-120), fechaVencimiento: addDaysStr(245), responsable: 'RRHH & SSO', archivoNombre: 'RIOHS_2026_LeyKarin.pdf' },
    { id: 'd4', codigo: 'DOC-EXA-003', titulo: 'Examen Preocupacional Altura Geográfica', categoria: 'Examen Ocupacional', norma: 'DS N° 594', entidadTipo: 'Trabajador', entidadNombre: 'Luis Contreras Díaz', fechaEmision: addDaysStr(-370), fechaVencimiento: addDaysStr(-5), responsable: 'Mutualidad', archivoNombre: 'Examen_Altura_LContreras.pdf' },
    { id: 'd5', codigo: 'DOC-F30-012', titulo: 'Certificado F30-1 Cumplimiento Laboral y Previsional', categoria: 'Certificado F30-1', norma: 'DS N° 76 / Art. 66 bis', entidadTipo: 'Contratista', entidadNombre: 'Servicios Norte Ltda.', fechaEmision: addDaysStr(-20), fechaVencimiento: addDaysStr(10), responsable: 'Admin. Contratistas', archivoNombre: 'F30_ServiciosNorte.pdf' },
  ],
  normas: [
    { id: 'n1', cuerpoLegal: 'DS N° 44 (2024/2025)', articulo: 'Art. 7 - 15', obligacion: 'Sistema de Gestión de Seguridad y Salud en el Trabajo, Matriz IPER y Obligación de Informar (ODI).', aplicaA: 'Toda la organización', evidencia: 'Matriz IPER 2026 + Registros ODI firmados', responsable: 'Jefe SSO', estado: 'Cumple', ultimaRevision: addDaysStr(-7) },
    { id: 'n2', cuerpoLegal: 'Ley N° 16.744', articulo: 'Art. 66 / 76', obligacion: 'Denuncia Individual de Accidente del Trabajo (DIAT) dentro de 24h y funcionamiento de Comité Paritario.', aplicaA: 'Faenas > 25 trabajadores', evidencia: 'Actas CPHS mensuales y portal Mutual', responsable: 'Jefe SSO', estado: 'Cumple', ultimaRevision: addDaysStr(-10) },
    { id: 'n3', cuerpoLegal: 'DS N° 594', articulo: 'Art. 45 - 53', obligacion: 'Mantención vigente de extintores, agua potable, servicios higiénicos y entrega de EPP certificados.', aplicaA: 'Instalaciones y vehículos', evidencia: 'Planilla extintores y Actas EPP', responsable: 'Prevencionista Terreno', estado: 'Observación', ultimaRevision: addDaysStr(-3) },
    { id: 'n4', cuerpoLegal: 'DS N° 76', articulo: 'Art. 66 bis Ley 16.744', obligacion: 'Registro actualizado de empresas contratistas, RESSO, F30/F30-1 y coordinación preventiva.', aplicaA: 'Empresas Contratistas', evidencia: 'Carpetas digitales en Control Documental', responsable: 'Admin. Contratos', estado: 'Observación', ultimaRevision: addDaysStr(-2) },
    { id: 'n5', cuerpoLegal: 'Ley N° 21.643 (Ley Karin)', articulo: 'Art. 211-A CT', obligacion: 'Protocolo de prevención del acoso laboral, sexual y violencia en el trabajo integrado al RIOHS y difundido.', aplicaA: 'Toda la organización', evidencia: 'RIOHS actualizado + Toma de conocimiento', responsable: 'RRHH / SSO', estado: 'Cumple', ultimaRevision: addDaysStr(-15) },
    { id: 'n6', cuerpoLegal: 'DS N° 132 (Minería)', articulo: 'Art. 28 - 42', obligacion: 'Reglamento de Seguridad Minera: licencias internas de conducción, fatiga/somnolencia y AST.', aplicaA: 'Operaciones en Faena Minera', evidencia: 'Licencias internas y AST diarios', responsable: 'Supervisor Operaciones', estado: 'No Cumple', ultimaRevision: addDaysStr(-1) },
  ],
  riesgos: [
    { id: 'r1', proceso: 'Transporte Carga Sobredimensionada', tarea: 'Estiba y trincaje en Cama Baja', peligro: 'Carga suspendida / cadenas en tensión', riesgo: 'Aplastamiento o golpeado por elemento', probabilidad: 3, consecuencia: 4, vep: 12, nivel: 'Alto', controlActual: 'Inspección de eslingas, zona segregada 5m, uso de Rigger certificado.', responsable: 'Jorge Araya' },
    { id: 'r2', proceso: 'Conducción Alta Montaña', tarea: 'Traslado de personal en ruta cordillerana', peligro: 'Hielo en calzada, neblina y fatiga', riesgo: 'Colisión, volcamiento o desbarrancamiento', probabilidad: 2, consecuencia: 5, vep: 10, nivel: 'Alto', controlActual: 'Control GPS de velocidad, check-list preoperacional, test fatiga/somnolencia.', responsable: 'Carlos Mendoza' },
    { id: 'r3', proceso: 'Mantenimiento Taller', tarea: 'Cambio de neumáticos alto tonelaje', peligro: 'Liberación súbita de aire comprimido', riesgo: 'Proyección de partículas / trauma acústico', probabilidad: 2, consecuencia: 4, vep: 8, nivel: 'Moderado', controlActual: 'Jaula de inflado certificada, careta facial, protector auditivo.', responsable: 'Sebastián Fuenzalida' },
  ],
  incidentes: [
    { id: 'i1', folio: 'INC-2026-014', fecha: addDaysStr(-18), tipo: 'Incidente / Cuasi Accidente', gravedad: 'Alto Potencial', trabajador: 'Matías Valenzuela Soto', faena: 'Patio Cama Baja', descripcion: 'Desprendimiento menor de cuña de bloqueo durante posicionamiento de rampa sin lesionados.', diasPerdidos: 0, diatEmitida: false, estado: 'Cerrado' },
    { id: 'i2', folio: 'ACC-2026-003', fecha: addDaysStr(-9), tipo: 'Accidente sin Tiempo Perdido', gravedad: 'Leve', trabajador: 'Sebastián Fuenzalida', faena: 'Taller Central', descripcion: 'Contusión leve en mano derecha al soltar perno agarrotado con llave de impacto.', diasPerdidos: 0, diatEmitida: true, estado: 'Investigación' },
  ],
  hallazgos: [
    { id: 'h1', codigo: 'HAL-041', fecha: addDaysStr(-6), origen: 'Inspección', descripcion: 'Extintor de unidad tracto patente LK-99-44 con manómetro próximo a zona roja.', faena: 'Patio Cama Baja', criticidad: 'Alta', accionCorrectiva: 'Reemplazo inmediato y envío a recarga certificada.', responsable: 'Jorge Araya', plazo: addDaysStr(2), estado: 'En Proceso' },
    { id: 'h2', codigo: 'HAL-042', fecha: addDaysStr(-3), origen: 'Auditoría', descripcion: 'Contratista Aseo Industrial Pacífico sin F30-1 del mes vigente cargado.', faena: 'Planta Concentradora', criticidad: 'Crítica', accionCorrectiva: 'Suspensión preventiva de ingreso hasta regularizar F30-1.', responsable: 'Admin. Contratistas', plazo: addDaysStr(1), estado: 'Abierto' },
    { id: 'h3', codigo: 'HAL-039', fecha: addDaysStr(-14), origen: 'Observación', descripcion: 'Falta delimitación con conos en zona de descarga de agua.', faena: 'Faena Cordillera', criticidad: 'Media', accionCorrectiva: 'Instalación de barreras New Jersey y señalética reflectante.', responsable: 'Rodrigo Paredes', plazo: addDaysStr(-2), estado: 'Cerrado' },
  ],
  epps: [
    { id: 'e1', fecha: addDaysStr(-25), trabajador: 'Carlos Mendoza Tapia', rut: '15.432.198-3', elemento: 'Casco MSA + Lentes UV + Chaleco Geólogo', certificacion: 'NCh 461 / ANSI Z87.1', cantidad: 1, proximaRenovacion: addDaysStr(340), firmado: true },
    { id: 'e2', fecha: addDaysStr(-12), trabajador: 'Matías Valenzuela Soto', rut: '18.321.445-1', elemento: 'Guantes Cabritilla Reforzados + Botín Seguridad', certificacion: 'NCh 772 / ISP', cantidad: 1, proximaRenovacion: addDaysStr(168), firmado: true },
  ],
  extintores: [
    { id: 'ex1', codigo: 'EXT-001', ubicacion: 'Taller Central — Nave A', tipoAgente: 'PQS ABC 10 kg', ultimaMantencion: addDaysStr(-180), proximaRecarga: addDaysStr(185), presionOk: true, estado: 'Operativo' },
    { id: 'ex2', codigo: 'EXT-002', ubicacion: 'Tracto Camión LK-99-44', tipoAgente: 'PQS ABC 6 kg', ultimaMantencion: addDaysStr(-350), proximaRecarga: addDaysStr(15), presionOk: true, estado: 'Próximo a Recarga' },
    { id: 'ex3', codigo: 'EXT-003', ubicacion: 'Oficina Faena Cordillera', tipoAgente: 'CO2 5 kg', ultimaMantencion: addDaysStr(-100), proximaRecarga: addDaysStr(265), presionOk: true, estado: 'Operativo' },
  ],
  equiposEmergencia: [
    { id: 'eq1', codigo: 'EM-01', tipo: 'Botiquín Trauma Faena', ubicacion: 'Garita Control Acceso', ultimaInspeccion: addDaysStr(-5), estado: 'Operativo' },
    { id: 'eq2', codigo: 'EM-02', tipo: 'Kit Derrame MATPEL', ubicacion: 'Patio Carga Peligrosa', ultimaInspeccion: addDaysStr(-8), estado: 'Operativo' },
    { id: 'eq3', codigo: 'EM-03', tipo: 'Ducha / Lavaojos', ubicacion: 'Taller Central Zona Baterías', ultimaInspeccion: addDaysStr(-32), estado: 'Reposición Requerida' },
  ],
  charlas: [
    { id: 'ch1', modalidad: 'Charla 5 Minutos', tema: 'Uso correcto de cuñas y bloqueo en pendiente', relator: 'Jorge Araya', fecha: addDaysStr(-1), faena: 'Faena Cordillera', asistentes: 14, duracionMin: 10, estado: 'Realizada' },
    { id: 'ch2', modalidad: 'Capacitación Formal', tema: 'Conducción Defensiva en Alta Montaña y Uso de Cadenas', relator: 'Mutualidad / OTEC', fecha: addDaysStr(-11), faena: 'Sede Central', asistentes: 22, duracionMin: 240, estado: 'Realizada' },
    { id: 'ch3', modalidad: 'Capacitación Formal', tema: 'Protocolo Ley Karin (Ley 21.643) y Prevención de Riesgos Psicosociales', relator: 'Asesoría Legal & SSO', fecha: addDaysStr(5), faena: 'Online / Presencial', asistentes: 35, duracionMin: 90, estado: 'Programada' },
  ],
  inspecciones: [
    { id: 'in1', modalidad: 'Inspección Terreno', codigo: 'INSP-2026-19', titulo: 'Inspección Pre-Uso Cama Baja y Elementos de Izaje', normaReferencia: 'DS 132 / NCh 2437', faena: 'Patio Cama Baja', fecha: addDaysStr(-4), cumplimientoPct: 92, inspector: 'Jorge Araya', estado: 'Con Hallazgos' },
    { id: 'in2', modalidad: 'Auditoría Sistema', codigo: 'AUD-2026-04', titulo: 'Auditoría Interna DS 44 y DS 76 Contratistas', normaReferencia: 'DS N° 44 / DS N° 76', faena: 'Todas las Faenas', fecha: addDaysStr(-15), cumplimientoPct: 88, inspector: 'Consultora Externa SSO', estado: 'Con Hallazgos' },
  ],
  emergencias: [
    { id: 'emg1', fecha: addDaysStr(-20), escenario: 'Simulacro Derrame Menor de Combustible y Evacuación Taller', faena: 'Taller Central', tiempoRespuestaMin: 4.5, participantes: 19, evaluacion: 'Satisfactorio' },
  ],
  reportes: [
    { id: 'rep1', titulo: 'Reporte Mensual de Gestión SSO — Octubre 2026', tipo: 'Gestión Mensual SSO', formato: 'PDF', fecha: addDaysStr(-5), generadoPor: 'Jefe SSO' },
  ],
};

export const getDocumentStatus = (fechaVencimiento: string): 'Vigente' | 'Próximo a Vencer' | 'Vencido' => {
  if (!fechaVencimiento) return 'Vigente';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(fechaVencimiento + 'T00:00:00');
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Vencido';
  if (diffDays <= 30) return 'Próximo a Vencer';
  return 'Vigente';
};

interface SsoContextValue {
  state: SsoStoreState;
  kpis: {
    ssoScore: number;
    trabajadoresHabilitados: number;
    trabajadoresBloqueados: number;
    cumplimientoDocumentalPct: number;
    documentosVencidos: number;
    documentosPorVencer: number;
    cumplimientoLegalPct: number;
    indiceFrecuencia: number;
    indiceGravedad: number;
    tasaAccidentabilidad: number;
    hallazgosAbiertos: number;
  };
  addTrabajador: (item: Omit<TrabajadorSSO, 'id'>) => void;
  toggleTrabajadorEstado: (id: string) => void;
  addContratista: (item: Omit<ContratistaSSO, 'id'>) => void;
  addDocumento: (item: Omit<DocumentoSSO, 'id'>) => DocumentoSSO;
  deleteDocumento: (id: string) => void;
  updateNormaEstado: (id: string, estado: NormaLegalSSO['estado']) => void;
  addRiesgo: (item: Omit<RiesgoIPER, 'id' | 'vep' | 'nivel'>) => void;
  addIncidente: (item: Omit<IncidenteSSO, 'id'>) => void;
  addHallazgo: (item: Omit<HallazgoAccionSSO, 'id'>) => void;
  updateHallazgoEstado: (id: string, estado: HallazgoAccionSSO['estado']) => void;
  addEpp: (item: Omit<EppEntregaSSO, 'id'>) => void;
  addExtintor: (item: Omit<ExtintorSSO, 'id'>) => void;
  addEquipoEmergencia: (item: Omit<EquipoEmergenciaSSO, 'id'>) => void;
  addCharla: (item: Omit<CharlaCapacitacionSSO, 'id'>) => void;
  addInspeccion: (item: Omit<InspeccionAuditoriaSSO, 'id'>) => void;
  addEmergencia: (item: Omit<EmergenciaSimulacroSSO, 'id'>) => void;
  logReporte: (titulo: string, tipo: string, formato: 'PDF' | 'Excel' | 'Word') => void;
  resetDemo: () => void;
}

const SsoContext = createContext<SsoContextValue | null>(null);

export const SsoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SsoStoreState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const kpis = useMemo(() => {
    const trabajadoresHabilitados = state.trabajadores.filter((t) => t.estado === 'Habilitado').length;
    const trabajadoresBloqueados = state.trabajadores.length - trabajadoresHabilitados;

    const docStatuses = state.documentos.map((d) => getDocumentStatus(d.fechaVencimiento));
    const documentosVencidos = docStatuses.filter((s) => s === 'Vencido').length;
    const documentosPorVencer = docStatuses.filter((s) => s === 'Próximo a Vencer').length;
    const vigentes = state.documentos.length - documentosVencidos;
    const cumplimientoDocumentalPct = state.documentos.length
      ? Math.round((vigentes / state.documentos.length) * 100)
      : 100;

    const normasCumple = state.normas.filter((n) => n.estado === 'Cumple').length;
    const cumplimientoLegalPct = state.normas.length
      ? Math.round((normasCumple / state.normas.length) * 100)
      : 100;

    const accidentes = state.incidentes.filter(
      (i) => i.tipo === 'Accidente con Tiempo Perdido' || i.tipo === 'Accidente sin Tiempo Perdido'
    ).length;
    const diasPerdidos = state.incidentes.reduce((acc, i) => acc + (i.diasPerdidos || 0), 0);
    const hht = state.hhtMensual || 1;
    const indiceFrecuencia = Number(((accidentes * 1_000_000) / hht).toFixed(2));
    const indiceGravedad = Number(((diasPerdidos * 1_000_000) / hht).toFixed(2));
    const tasaAccidentabilidad = state.trabajadores.length
      ? Number(((accidentes / state.trabajadores.length) * 100).toFixed(2))
      : 0;

    const hallazgosAbiertos = state.hallazgos.filter((h) => h.estado !== 'Cerrado').length;
    const ssoScore = Math.round(cumplimientoDocumentalPct * 0.4 + cumplimientoLegalPct * 0.4 + (trabajadoresHabilitados / Math.max(1, state.trabajadores.length)) * 100 * 0.2);

    return {
      ssoScore,
      trabajadoresHabilitados,
      trabajadoresBloqueados,
      cumplimientoDocumentalPct,
      documentosVencidos,
      documentosPorVencer,
      cumplimientoLegalPct,
      indiceFrecuencia,
      indiceGravedad,
      tasaAccidentabilidad,
      hallazgosAbiertos,
    };
  }, [state]);

  const value: SsoContextValue = {
    state,
    kpis,
    addTrabajador: (item) => setState((prev) => ({ ...prev, trabajadores: [{ ...item, id: uid('trab') }, ...prev.trabajadores] })),
    toggleTrabajadorEstado: (id) =>
      setState((prev) => ({
        ...prev,
        trabajadores: prev.trabajadores.map((t) =>
          t.id === id ? { ...t, estado: t.estado === 'Habilitado' ? 'Bloqueado' : 'Habilitado' } : t
        ),
      })),
    addContratista: (item) => setState((prev) => ({ ...prev, contratistas: [{ ...item, id: uid('cont') }, ...prev.contratistas] })),
    addDocumento: (item) => {
      const created: DocumentoSSO = { ...item, id: uid('doc') };
      setState((prev) => ({ ...prev, documentos: [created, ...prev.documentos] }));
      return created;
    },
    deleteDocumento: (id) => setState((prev) => ({ ...prev, documentos: prev.documentos.filter((d) => d.id !== id) })),
    updateNormaEstado: (id, estado) =>
      setState((prev) => ({
        ...prev,
        normas: prev.normas.map((n) => (n.id === id ? { ...n, estado, ultimaRevision: new Date().toISOString().split('T')[0] } : n)),
      })),
    addRiesgo: (item) => {
      const vep = item.probabilidad * item.consecuencia;
      const nivel: RiesgoIPER['nivel'] = vep >= 15 ? 'Crítico' : vep >= 9 ? 'Alto' : vep >= 5 ? 'Moderado' : 'Bajo';
      setState((prev) => ({ ...prev, riesgos: [{ ...item, id: uid('ipr'), vep, nivel }, ...prev.riesgos] }));
    },
    addIncidente: (item) => setState((prev) => ({ ...prev, incidentes: [{ ...item, id: uid('inc') }, ...prev.incidentes] })),
    addHallazgo: (item) => setState((prev) => ({ ...prev, hallazgos: [{ ...item, id: uid('hal') }, ...prev.hallazgos] })),
    updateHallazgoEstado: (id, estado) =>
      setState((prev) => ({
        ...prev,
        hallazgos: prev.hallazgos.map((h) => (h.id === id ? { ...h, estado } : h)),
      })),
    addEpp: (item) => setState((prev) => ({ ...prev, epps: [{ ...item, id: uid('epp') }, ...prev.epps] })),
    addExtintor: (item) => setState((prev) => ({ ...prev, extintores: [{ ...item, id: uid('ext') }, ...prev.extintores] })),
    addEquipoEmergencia: (item) => setState((prev) => ({ ...prev, equiposEmergencia: [{ ...item, id: uid('eqm') }, ...prev.equiposEmergencia] })),
    addCharla: (item) => setState((prev) => ({ ...prev, charlas: [{ ...item, id: uid('chr') }, ...prev.charlas] })),
    addInspeccion: (item) => setState((prev) => ({ ...prev, inspecciones: [{ ...item, id: uid('ins') }, ...prev.inspecciones] })),
    addEmergencia: (item) => setState((prev) => ({ ...prev, emergencias: [{ ...item, id: uid('emg') }, ...prev.emergencias] })),
    logReporte: (titulo, tipo, formato) =>
      setState((prev) => ({
        ...prev,
        reportes: [
          { id: uid('rep'), titulo, tipo, formato, fecha: new Date().toISOString().split('T')[0], generadoPor: 'Asesor SSO' },
          ...prev.reportes,
        ],
      })),
    resetDemo: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(INITIAL_STATE);
    },
  };

  return <SsoContext.Provider value={value}>{children}</SsoContext.Provider>;
};

export const useSso = () => {
  const ctx = useContext(SsoContext);
  if (!ctx) throw new Error('useSso debe usarse dentro de SsoProvider');
  return ctx;
};
