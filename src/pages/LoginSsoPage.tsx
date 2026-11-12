import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Zap, AlertCircle, KeyRound, HardHat, Play, ArrowLeft } from 'lucide-react';
import { useSsoAuth } from '../lib/ssoAuthStore';

export default function LoginSsoPage({ onBackToLanding }: { onBackToLanding?: () => void }) {
  const {
    currentUser,
    login,
    loginSuperAdminDirect,
    loginExpertaDirect,
    loginDemoDirect,
    completeFirstPasswordChange,
    logout,
  } = useSsoAuth();
  const [identifier, setIdentifier] = useState(() => localStorage.getItem('gaval_sso_remember_id') || '10799367-3');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  if (currentUser && currentUser.cambioClavePendiente) {
    const handlePassSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPass.trim().length < 6) {
        setPassError('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPass !== confirmPass) {
        setPassError('Las contraseñas no coinciden.');
        return;
      }
      completeFirstPasswordChange(newPass.trim());
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <form
          onSubmit={handlePassSave}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-8 space-y-5 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Cambio de Contraseña Obligatorio</h2>
              <p className="text-xs text-slate-500">Hola {currentUser.nombre}, define tu clave definitiva para continuar.</p>
            </div>
          </div>

          {passError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {passError}
            </div>
          )}

          <div>
            <label className="text-xs font-bold block mb-1">Nueva Contraseña *</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Confirmar Contraseña *</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              Volver
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black"
            >
              Guardar y Entrar
            </button>
          </div>
        </form>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(identifier, password);
    if (!res.ok) {
      setError(res.error || 'No se pudo iniciar sesión.');
      return;
    }
    if (remember) localStorage.setItem('gaval_sso_remember_id', identifier);
    else localStorage.removeItem('gaval_sso_remember_id');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 relative">
      {onBackToLanding && (
        <button
          type="button"
          onClick={onBackToLanding}
          className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Portal de Ventas</span>
        </button>
      )}

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 my-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">GAVAL SSO</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Plataforma de Prevención de Riesgos &amp; Cumplimiento Normativo Chile
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Correo Corporativo o RUT
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ej: 10799367-3 o correo@empresa.cl"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contraseña <span className="text-slate-400 font-normal">(si ingresas con RUT, puedes dejarla vacía)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded text-emerald-600"
            />
            Recordar mis credenciales
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* ACCESOS RÁPIDOS 1-CLIC */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">
            Accesos Rápidos de Demostración y Prueba
          </p>

          <button
            type="button"
            onClick={loginExpertaDirect}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <HardHat className="w-4 h-4 text-indigo-400" />
            <span>Acceso Experta SSO (Entorno Limpio)</span>
          </button>

          <button
            type="button"
            onClick={loginDemoDirect}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Acceso Demo Comercial (Con Datos)</span>
          </button>

          <button
            type="button"
            onClick={loginSuperAdminDirect}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-400 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Ingreso Directo Gabriel Avalos (Súper Admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

