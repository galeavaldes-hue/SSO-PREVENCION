import React, { useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Send,
  Copy,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  Mail,
  KeyRound,
  ShieldCheck,
  Building2,
  Sparkles,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { SsoRoleName, SsoUserRecord, useSsoAuth } from '../lib/ssoAuthStore';

export default function UsuariosInvitacionesPage() {
  const {
    companies,
    activeCompany,
    setActiveCompanyId,
    users,
    currentUser,
    isSuperAdmin,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    loginAsUser,
    generateInvitationText,
  } = useSsoAuth();

  const [search, setSearch] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('TODAS');
  const [filterRol, setFilterRol] = useState('TODOS');

  // Modal crear usuario
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresaId, setEmpresaId] = useState(activeCompany.id);
  const [rol, setRol] = useState<SsoRoleName>('Experto SSO');
  const [password, setPassword] = useState('Sso2026!');
  const [cambioObligatorio, setCambioObligatorio] = useState(false);

  // Modal editar clave / usuario
  const [editingUser, setEditingUser] = useState<SsoUserRecord | null>(null);
  const [editPass, setEditPass] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editRol, setEditRol] = useState<SsoRoleName>('Prevencionista');

  // Encontrar usuario de la experta
  const expertaUser = useMemo(() => {
    return (
      users.find((u) => u.email === 'experta.sso@gaval.cl') ||
      users.find((u) => u.empresaId === 'comp-experta-limpio') ||
      null
    );
  }, [users]);

  const handleOpenInviteModal = (u: SsoUserRecord) => {
    const inviteText = generateInvitationText(u);
    const portalUrl = window.location.origin;
    const compName = companies.find((c) => c.id === u.empresaId)?.nombre || 'Gaval SSO';
    const cleanPhone = (u.telefono || '').replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteText)}`
      : `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
    const mailSubject = encodeURIComponent(`Acceso a GAVAL SSO — Plataforma de Prevención & Normativa`);
    const mailBody = encodeURIComponent(inviteText);
    const mailUrl = `mailto:${u.email}?subject=${mailSubject}&body=${mailBody}`;

    Swal.fire({
      icon: 'success',
      title: `Invitación de Acceso: ${u.nombre}`,
      html: `
        <div class="text-left text-xs bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 space-y-1.5 font-mono text-slate-800 dark:text-slate-200 mt-2">
          <div><b>Nombre:</b> ${u.nombre}</div>
          <div><b>Empresa:</b> ${compName}</div>
          <div><b>Rol:</b> <span class="text-emerald-700 font-bold">${u.rolNombre}</span></div>
          <div><b>Enlace:</b> <a href="${portalUrl}" target="_blank" class="text-blue-600 underline font-bold select-all">${portalUrl}</a></div>
          <div><b>Usuario:</b> ${u.email} ${u.rut ? `(o RUT: ${u.rut})` : ''}</div>
          <div><b>Contraseña:</b> <span class="text-indigo-700 font-bold">${u.password}</span></div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 justify-center">
          <a href="${mailUrl}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer">
            ✉️ Enviar por Correo
          </a>
          <button id="btn-copy-txt" type="button" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer">
            ⬇️ Descargar .TXT
          </button>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '📋 Copiar Mensaje Completo',
      denyButtonText: '💬 Enviar por WhatsApp',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#2563eb',
      denyButtonColor: '#16a34a',
      didOpen: () => {
        const btn = document.getElementById('btn-copy-txt');
        if (btn) {
          btn.addEventListener('click', () => {
            const blob = new Blob([inviteText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safe = u.nombre.toLowerCase().replace(/[^a-z0-9]+/gi, '_');
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
        Swal.fire({
          icon: 'success',
          title: '¡Invitación Copiada al Portapapeles!',
          text: 'Puedes pegarla directamente en WhatsApp, Slack, Teams o Correo.',
          timer: 1600,
          showConfirmButton: false,
        });
      } else if (result.isDenied) {
        navigator.clipboard.writeText(inviteText);
        window.open(waUrl, '_blank');
      }
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      Swal.fire({ icon: 'warning', title: 'Faltan datos obligatorios', text: 'Ingresa nombre y correo.' });
      return;
    }

    const created = addUser({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      rut: rut.trim(),
      telefono: telefono.trim(),
      empresaId,
      rolNombre: rol,
      password: password.trim() || 'Sso2026!',
      cambioClavePendiente: cambioObligatorio,
    });

    setShowModal(false);
    setNombre('');
    setEmail('');
    setRut('');
    setTelefono('');
    setPassword('Sso2026!');
    handleOpenInviteModal(created);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      nombre: editNombre.trim() || editingUser.nombre,
      telefono: editTelefono.trim(),
      rolNombre: editRol,
      password: editPass.trim() ? editPass.trim() : editingUser.password,
    });
    setEditingUser(null);
    Swal.fire({ icon: 'success', title: 'Usuario actualizado correctamente', timer: 1400, showConfirmButton: false });
  };

  const handleDeleteUserConfirm = (u: SsoUserRecord) => {
    if (u.email === 'gavalos@gaval.cl') {
      Swal.fire({ icon: 'error', title: 'Acción bloqueada', text: 'No se puede eliminar la cuenta del titular Súper Administrador.' });
      return;
    }
    Swal.fire({
      title: `¿Eliminar a ${u.nombre}?`,
      text: 'Se removerá el acceso de este usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e11d48',
    }).then((res) => {
      if (res.isConfirmed) {
        deleteUser(u.id);
        Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1200, showConfirmButton: false });
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterEmpresa !== 'TODAS' && u.empresaId !== filterEmpresa) return false;
      if (filterRol !== 'TODOS' && u.rolNombre !== filterRol) return false;
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.rut && u.rut.toLowerCase().includes(q))
      );
    });
  }, [users, filterEmpresa, filterRol, search]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Gestión de Usuarios &amp; Enviar Invitaciones
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crea accesos personalizados para tu equipo, prevencionistas y consultores externos. Genera invitaciones directas por WhatsApp y Correo.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Usuario e Invitar</span>
        </button>
      </div>

      {/* TARJETA VIP: INVITACIÓN DIRECTA A LA EXPERTA SSO */}
      {expertaUser && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 text-white border border-emerald-500/30 shadow-xl">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Acceso Preparado para tu Experta en SSO (Entorno Limpio)
              </div>
              <h2 className="text-xl font-black">
                {expertaUser.nombre} · <span className="text-emerald-400 font-semibold">{expertaUser.email}</span>
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Este acceso está asignado a la <strong className="text-white">Empresa Demo Evaluación SSO (Entorno Limpio)</strong>, listo sin datos previos para que ella pueda auditar el flujo completo desde cero (ingresar un trabajador, subir documentos, realizar inspecciones y proponer correcciones).
              </p>
              <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-300 font-mono">
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  Usuario: <strong className="text-emerald-400">{expertaUser.email}</strong>
                </span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  Clave: <strong className="text-emerald-400">{expertaUser.password}</strong>
                </span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  Rol: <strong className="text-indigo-300">{expertaUser.rolNombre}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInviteModal(expertaUser)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Invitación a Experta</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsUser(expertaUser.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                title="Probar exactamente lo que ella verá en el entorno limpio"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Ver lo que Ella Verá</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o RUT..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterEmpresa}
            onChange={(e) => setFilterEmpresa(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="TODAS">Todas las Empresas ({companies.length})</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="TODOS">Todos los Roles</option>
            <option value="Súper Administrador">Súper Administrador</option>
            <option value="Administrador">Administrador</option>
            <option value="Prevencionista">Prevencionista</option>
            <option value="Experto SSO">Experto SSO</option>
            <option value="Solo Lectura">Solo Lectura</option>
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Usuario / Colaborador</th>
                <th className="py-3.5 px-4">Empresa / Entorno</th>
                <th className="py-3.5 px-4">Rol en Sistema</th>
                <th className="py-3.5 px-4">Contraseña</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No se encontraron usuarios con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const comp = companies.find((c) => c.id === u.empresaId);
                  const isClean = comp?.modoInicial === 'blanco' || comp?.id === 'comp-experta-limpio';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 text-xs">
                            {u.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {u.nombre}
                              {u.email === currentUser?.email && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                  Tú
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {u.email} {u.rut ? `· RUT ${u.rut}` : ''}
                            </p>
                            {u.telefono && (
                              <p className="text-[11px] text-emerald-600 font-semibold">
                                Fono/WA: {u.telefono}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {comp?.nombre || 'Gaval SSO'}
                        </p>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isClean
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isClean ? 'Entorno Limpio (Desde Cero)' : 'Con Datos Demo'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {u.rolNombre}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {u.password}
                        </span>
                        {u.cambioClavePendiente && (
                          <span className="block text-[10px] text-amber-600 font-bold mt-1">
                            Cambio obligatorio 1er ingreso
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                            u.estado === 'Activo'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          {u.estado === 'Activo' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{u.estado}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenInviteModal(u)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            title="Enviar invitación por WhatsApp o Email"
                          >
                            <Send className="w-3 h-3" />
                            <span>Invitar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => loginAsUser(u.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            title="Iniciar sesión como este usuario para probar su pantalla"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(u);
                              setEditNombre(u.nombre);
                              setEditTelefono(u.telefono || '');
                              setEditRol(u.rolNombre);
                              setEditPass(u.password);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            title="Editar usuario o restablecer contraseña"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {u.email !== 'gavalos@gaval.cl' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUserConfirm(u)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 transition-all cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR USUARIO E INVITAR */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Crear Nuevo Usuario e Invitar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Se generará su acceso y podrás enviarle el enlace directo al instante.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carolina Morales Valdés"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.cl"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">RUT Chileno (opcional)</label>
                  <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-9"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+56 9 9123 4567"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Rol en Sistema</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as SsoRoleName)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="Experto SSO">Experto SSO (Auditor / Revisor)</option>
                    <option value="Prevencionista">Prevencionista (Gestión en Terreno)</option>
                    <option value="Administrador">Administrador de Empresa</option>
                    <option value="Solo Lectura">Solo Lectura (Visor)</option>
                    {isSuperAdmin && <option value="Súper Administrador">Súper Administrador</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Empresa / Entorno Asignado *</label>
                <select
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-emerald-700 dark:text-emerald-400"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.modoInicial === 'blanco' ? 'Entorno Limpio / Desde Cero' : 'Con Datos Demo'})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Tip: Selecciona <strong>Empresa Demo Evaluación SSO (Entorno Limpio)</strong> para que la persona comience desde cero.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-xs font-bold block mb-1">Contraseña Temporal</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sso2026!"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={cambioObligatorio}
                      onChange={(e) => setCambioObligatorio(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Cambio obligatorio en 1er ingreso</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Guardar y Generar Invitación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO / CLAVE */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Editar Usuario &amp; Contraseña
                  </h3>
                  <p className="text-xs text-slate-400">{editingUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  placeholder="+56 9 ..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Rol</label>
                <select
                  value={editRol}
                  onChange={(e) => setEditRol(e.target.value as SsoRoleName)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  <option value="Experto SSO">Experto SSO</option>
                  <option value="Prevencionista">Prevencionista</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Solo Lectura">Solo Lectura</option>
                  {isSuperAdmin && <option value="Súper Administrador">Súper Administrador</option>}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Nueva Contraseña</label>
                <input
                  type="text"
                  value={editPass}
                  onChange={(e) => setEditPass(e.target.value)}
                  placeholder="Dejar vacía para mantener la actual"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
