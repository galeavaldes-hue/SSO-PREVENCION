import React, { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  Activity,
  Plus,
  Send,
  Download,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { SsoRoleName, SsoUserRecord, useSsoAuth } from '../lib/ssoAuthStore';

export default function SuperAdminSsoPage({ defaultTab = 'empresas' }: { defaultTab?: 'empresas' | 'usuarios' | 'actividad' }) {
  const {
    companies,
    activeCompany,
    setActiveCompanyId,
    users,
    logs,
    addCompany,
    toggleCompanyStatus,
    addUser,
    toggleUserStatus,
  } = useSsoAuth();

  const [tab, setTab] = useState<'empresas' | 'usuarios' | 'actividad'>(defaultTab);
  const [showNewComp, setShowNewComp] = useState(false);
  const [compNombre, setCompNombre] = useState('');
  const [compRut, setCompRut] = useState('');
  const [compModo, setCompModo] = useState<'blanco' | 'demo'>('blanco');

  const [showNewUser, setShowNewUser] = useState(false);
  const [uNombre, setUNombre] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRut, setURut] = useState('');
  const [uTelefono, setUTelefono] = useState('');
  const [uEmpresaId, setUEmpresaId] = useState(activeCompany.id);
  const [uRol, setURol] = useState<SsoRoleName>('Administrador');
  const [uPassword, setUPassword] = useState('');
  const [uCambioObligatorio, setUCambioObligatorio] = useState(true);

  const [logSearch, setLogSearch] = useState('');
  const [logEmpresaFilter, setLogEmpresaFilter] = useState('TODAS');

  const openInvitationModal = (userObj: SsoUserRecord, customTitle = 'Invitación de Acceso a GAVAL SSO') => {
    const portalUrl = window.location.origin;
    const compName = companies.find((c) => c.id === userObj.empresaId)?.nombre || 'Gaval SSO';
    const inviteText =
      `Hola ${userObj.nombre}, tus accesos a *GAVAL SSO* (${compName}) son:\n\n` +
      `🌐 *Enlace de Acceso:* ${portalUrl}\n` +
      `🏢 *Empresa:* ${compName}\n` +
      `👤 *Usuario:* ${userObj.email}` + (userObj.rut ? ` (o RUT ${userObj.rut}, con o sin puntos)` : '') + `\n` +
      `🔑 *Contraseña Temporal:* ${userObj.password}\n` +
      `🛡️ *Rol:* ${userObj.rolNombre}\n` +
      (userObj.cambioClavePendiente
        ? `🔐 *Nota:* En tu primer ingreso el sistema te pedirá crear tu contraseña definitiva.\n`
        : '') +
      `\n📋 *Pasos para ingresar:*\n` +
      `1. Entra a ${portalUrl}.\n` +
      `2. Ingresa tu correo (${userObj.email}) o tu RUT.\n` +
      `3. Ingresa la contraseña indicada arriba.\n` +
      (userObj.cambioClavePendiente
        ? `4. Crea y confirma tu nueva contraseña personal para acceder a tu panel.`
        : `4. Presiona Iniciar Sesión para entrar a tu panel.`);

    const cleanPhone = (userObj.telefono || '').replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteText)}`
      : `https://wa.me/?text=${encodeURIComponent(inviteText)}`;

    Swal.fire({
      icon: 'success',
      title: customTitle,
      html: `
        <div class="text-left text-xs bg-slate-100 p-3.5 rounded-xl border mt-2 space-y-1.5 font-mono text-slate-800">
          <div><b>Nombre:</b> ${userObj.nombre}</div>
          <div><b>Empresa:</b> ${compName}</div>
          <div><b>Rol:</b> ${userObj.rolNombre}</div>
          <div><b>Enlace de Acceso:</b> <span class="text-blue-700 font-bold select-all">${portalUrl}</span></div>
          <div><b>Usuario (Email / RUT):</b> ${userObj.email}${userObj.rut ? ` / ${userObj.rut}` : ''}</div>
          <div><b>Contraseña:</b> ${userObj.password} ${userObj.cambioClavePendiente ? '<span class="text-amber-700">(Cambio obligatorio 1er ingreso)</span>' : ''}</div>
        </div>
        <div class="mt-3 flex justify-center">
          <button id="btn-sso-download-invite" type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer">
            ⬇️ Descargar Invitación (.txt)
          </button>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Copiar Invitación',
      denyButtonText: 'Enviar por WhatsApp',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#2563eb',
      denyButtonColor: '#16a34a',
      didOpen: () => {
        const btn = document.getElementById('btn-sso-download-invite');
        if (btn) {
          btn.addEventListener('click', () => {
            const blob = new Blob([inviteText.replace(/\*/g, '')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safe = userObj.nombre.toLowerCase().replace(/[^a-z0-9]+/gi, '_');
            a.href = url;
            a.download = `Invitacion_SSO_${safe || 'usuario'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(inviteText);
        Swal.fire({ icon: 'success', title: '¡Invitación Copiada!', timer: 1400, showConfirmButton: false });
      } else if (result.isDenied) {
        navigator.clipboard.writeText(inviteText);
        window.open(waUrl, '_blank');
      }
    });
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compNombre.trim()) return;
    const created = addCompany({ nombre: compNombre, rut: compRut || '76.000.000-0', modoInicial: compModo });
    setUEmpresaId(created.id);
    setShowNewComp(false);
    setCompNombre('');
    setCompRut('');
    Swal.fire({
      icon: 'success',
      title: 'Empresa / Prospecto Creado',
      text: `Se creó ${created.nombre} (${created.modoInicial === 'blanco' ? 'Desde Cero' : 'Con Datos Demo'}).`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uNombre.trim() || !uEmail.trim()) return;
    const tempPass = uPassword.trim() || uRut.trim() || 'Sso2026!';
    const created = addUser({
      nombre: uNombre.trim(),
      email: uEmail.trim(),
      rut: uRut.trim(),
      telefono: uTelefono.trim(),
      empresaId: uEmpresaId,
      rolNombre: uRol,
      password: tempPass,
      cambioClavePendiente: uCambioObligatorio,
    });
    setShowNewUser(false);
    setUNombre('');
    setUEmail('');
    setURut('');
    setUTelefono('');
    setUPassword('');
    openInvitationModal(created, 'Usuario creado — Enviar Invitación');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (logEmpresaFilter !== 'TODAS' && l.empresaNombre !== logEmpresaFilter) return false;
      const q = logSearch.toLowerCase();
      return (
        !q ||
        l.usuarioNombre.toLowerCase().includes(q) ||
        l.modulo.toLowerCase().includes(q) ||
        l.accion.toLowerCase().includes(q) ||
        l.detalle.toLowerCase().includes(q)
      );
    });
  }, [logs, logSearch, logEmpresaFilter]);

  const exportLogsExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filteredLogs), 'Log Actividad SSO');
    XLSX.writeFile(wb, `Log_Actividad_SSO_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" /> Súper Administrador GAVAL SSO
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control multi-empresa de prospectos/clientes, invitaciones de acceso y monitoreo en tiempo real.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'empresas', label: `Empresas / Prospectos (${companies.length})`, icon: Building2 },
          { id: 'usuarios', label: `Usuarios & Invitaciones (${users.length})`, icon: Users },
          { id: 'actividad', label: `Log de Actividad (${logs.length})`, icon: Activity },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                tab === t.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EMPRESAS */}
      {tab === 'empresas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowNewComp(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Nueva Empresa / Prospecto
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-black text-base">{c.nombre}</h3>
                    <p className="text-xs text-slate-400 font-mono">{c.rut} · Creada {c.creadoEn}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                      Inicio: {c.modoInicial === 'blanco' ? 'Desde Cero (En Blanco)' : 'Con Datos Demo'}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      c.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {c.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCompanyId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      activeCompany.id === c.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {activeCompany.id === c.id ? 'Activa en Pantalla' : 'Supervisar Empresa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompanyStatus(c.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {c.estado === 'Activo' ? 'Suspender' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USUARIOS & INVITACIONES */}
      {tab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowNewUser(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Crear Usuario e Invitar
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Empresa</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const compName = companies.find((c) => c.id === u.empresaId)?.nombre || '-';
                  return (
                    <tr key={u.id}>
                      <td className="py-3 px-4">
                        <p className="font-bold">{u.nombre}</p>
                        <p className="text-xs text-slate-400">{u.email} · RUT {u.rut || '-'}</p>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">{compName}</td>
                      <td className="py-3 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">{u.rolNombre}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                            u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {u.estado === 'Activo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {u.estado}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openInvitationModal(u)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-black inline-flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Invitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOG DE ACTIVIDAD */}
      {tab === 'actividad' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Buscar por usuario, módulo o acción..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
            <select
              value={logEmpresaFilter}
              onChange={(e) => setLogEmpresaFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              <option value="TODAS">Todas las Empresas</option>
              {companies.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={exportLogsExcel}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Exportar Excel
            </button>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Fecha / Hora</th>
                  <th className="py-2.5 px-4">Usuario</th>
                  <th className="py-2.5 px-4">Empresa</th>
                  <th className="py-2.5 px-4">Módulo</th>
                  <th className="py-2.5 px-4">Acción / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-4 text-xs font-mono">{new Date(l.fechaHora).toLocaleString('es-CL')}</td>
                    <td className="py-2.5 px-4 text-xs font-bold">{l.usuarioNombre}</td>
                    <td className="py-2.5 px-4 text-xs">{l.empresaNombre}</td>
                    <td className="py-2.5 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">{l.modulo}</td>
                    <td className="py-2.5 px-4 text-xs">{l.accion}{l.detalle ? ` — ${l.detalle}` : ''}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                      Sin actividad registrada aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nueva Empresa */}
      {showNewComp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCompany} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Nueva Empresa o Prospecto</h3>
              <button type="button" onClick={() => setShowNewComp(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={compNombre} onChange={(e) => setCompNombre(e.target.value)} placeholder="Razón Social / Nombre Prospecto *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input value={compRut} onChange={(e) => setCompRut(e.target.value)} placeholder="RUT Empresa" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <div>
              <label className="text-xs font-bold block mb-1">Modo de Inicio del Entorno</label>
              <select value={compModo} onChange={(e) => setCompModo(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
                <option value="blanco">Desde Cero (En Blanco — para ingresar datos propios)</option>
                <option value="demo">Con Datos Demo Precargados (para explorar)</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Crear Empresa</button>
          </form>
        </div>
      )}

      {/* Modal Nuevo Usuario */}
      {showNewUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Crear Usuario e Invitar</h3>
              <button type="button" onClick={() => setShowNewUser(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <input required value={uNombre} onChange={(e) => setUNombre(e.target.value)} placeholder="Nombre completo *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <input required type="email" value={uEmail} onChange={(e) => setUEmail(e.target.value)} placeholder="Correo electrónico *" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input value={uRut} onChange={(e) => setURut(e.target.value)} placeholder="RUT (opcional)" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
              <input value={uTelefono} onChange={(e) => setUTelefono(e.target.value)} placeholder="WhatsApp (+569...)" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            </div>
            <select value={uEmpresaId} onChange={(e) => setUEmpresaId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <select value={uRol} onChange={(e) => setURol(e.target.value as SsoRoleName)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm">
              <option value="Administrador">Administrador</option>
              <option value="Prevencionista">Prevencionista</option>
              <option value="Solo Lectura">Solo Lectura</option>
              <option value="Súper Administrador">Súper Administrador</option>
            </select>
            <input value={uPassword} onChange={(e) => setUPassword(e.target.value)} placeholder="Contraseña temporal (por defecto RUT o Sso2026!)" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" />
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={uCambioObligatorio} onChange={(e) => setUCambioObligatorio(e.target.checked)} />
              Exigir cambio de contraseña en el 1er ingreso
            </label>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Crear y Generar Invitación</button>
          </form>
        </div>
      )}
    </div>
  );
}
