import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SsoAuthProvider, useSsoAuth } from './lib/ssoAuthStore';
import { SsoProvider } from './lib/ssoStore';
import SsoLayout from './components/SsoLayout';
import LoginSsoPage from './pages/LoginSsoPage';
import SuperAdminSsoPage from './pages/SuperAdminSsoPage';
import DashboardSSO from './pages/DashboardSSO';
import ControlDocumentalPage from './pages/ControlDocumentalPage';
import CreadorDocumentosPage from './pages/CreadorDocumentosPage';
import CumplimientoNormativoPage from './pages/CumplimientoNormativoPage';
import { IndicadoresPage, ReportesPage } from './pages/IndicadoresReportesPage';
import { ContratistasPage, TrabajadoresPage } from './pages/PersonasContratistasPages';
import {
  CharlasCapacitacionesPage,
  EmergenciasPage,
  EppPage,
  ExtintoresEquiposPage,
  HallazgosAccionesPage,
  IncidentesFlashPage,
  InspeccionesAuditoriasPage,
  RiesgosIperPage,
} from './pages/OperacionPreventivaPages';

function SsoRoutesGate() {
  const { currentUser, isSuperAdmin } = useSsoAuth();

  if (!currentUser || currentUser.cambioClavePendiente) {
    return <LoginSsoPage />;
  }

  return (
    <SsoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SsoLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardSSO />} />
            <Route path="/indicadores" element={<IndicadoresPage />} />
            <Route path="/trabajadores" element={<TrabajadoresPage />} />
            <Route path="/contratistas" element={<ContratistasPage />} />
            <Route path="/documental" element={<ControlDocumentalPage />} />
            <Route path="/creador-documentos" element={<CreadorDocumentosPage />} />
            <Route path="/normativo" element={<CumplimientoNormativoPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/riesgos" element={<RiesgosIperPage />} />
            <Route path="/epp" element={<EppPage />} />
            <Route path="/charlas" element={<CharlasCapacitacionesPage />} />
            <Route path="/inspecciones" element={<InspeccionesAuditoriasPage />} />
            <Route path="/reporte-flash" element={<IncidentesFlashPage flashOnly />} />
            <Route path="/incidentes" element={<IncidentesFlashPage />} />
            <Route path="/hallazgos" element={<HallazgosAccionesPage />} />
            <Route path="/extintores" element={<ExtintoresEquiposPage />} />
            <Route path="/emergencias" element={<EmergenciasPage />} />
            {isSuperAdmin && (
              <>
                <Route path="/super-admin" element={<SuperAdminSsoPage defaultTab="empresas" />} />
                <Route path="/super-admin/actividad" element={<SuperAdminSsoPage defaultTab="actividad" />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SsoProvider>
  );
}

export default function App() {
  return (
    <SsoAuthProvider>
      <SsoRoutesGate />
    </SsoAuthProvider>
  );
}
