import React, { useState } from 'react';
import { Lock, Database, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabaseClient, isLocalFallbackAllowed, isPortfolioOwner, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onExitToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onExitToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (supabase && supabaseConfigured) {
        // Authenticate with Supabase
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message || 'Credenciais inválidas.');
          setLoading(false);
          return;
        }

        if (data.session && await isPortfolioOwner()) {
          sessionStorage.setItem('el_bravo_admin_auth', 'supabase_authenticated');
          onSuccess();
        } else {
          await supabase.auth.signOut();
          setError('Esta conta não está autorizada como proprietária do portfólio.');
        }
      } else {
        if (!isLocalFallbackAllowed()) {
          setError('Supabase must be configured before the production CMS can be used.');
          return;
        }
        // Local / Offline fallback mode authentication
        // Allows the developer to authenticate locally during staging/testing
        if (password === 'admin123' || password === 'admin' || password.length >= 6) {
          sessionStorage.setItem('el_bravo_admin_auth', 'local_authenticated');
          onSuccess();
        } else {
          setError('Em modo local/desenvolvimento, use qualquer senha com pelo menos 6 caracteres (ex: admin123).');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 sm:px-6 relative selection:bg-indigo-500 selection:text-white font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono-tech uppercase tracking-widest text-gray-400">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>PORTFOLIO CMS / ADMIN PORTAL</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Painel de Administração
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Gerenciamento dinâmico de projetos, publicações e estudos de caso.
          </p>
        </div>

        {/* Status Mode Banner */}
        <div className="mb-6 p-3.5 bg-[#0A0A0A] border border-white/10 rounded-lg text-xs flex items-start gap-2.5">
          {supabaseConfigured ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-emerald-400 font-bold font-mono-tech">SUPABASE CONECTADO</span>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Autenticação e banco de dados PostgreSQL ativos.
                </p>
              </div>
            </>
          ) : (
            <>
              <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-400 font-bold font-mono-tech">MODO LOCAL & PERSISTENTE</span>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Projetos salvos com persistência local no navegador. Adicione <code className="text-white font-mono-tech">VITE_SUPABASE_URL</code> no ambiente para conectar com a nuvem.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 bg-[#0A0A0A] border border-white/15 rounded-xl shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1.5 font-bold">
                E-mail do Administrador
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elbravodantas.com.br"
                className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm transition-colors font-mono-tech placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1.5 font-bold">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm transition-colors font-mono-tech placeholder:text-gray-600"
              />
              {!supabaseConfigured && (
                <p className="text-[10px] text-gray-500 mt-1 font-mono-tech">
                  💡 Modo desenvolvimento: digite qualquer senha (ex: admin123)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-indigo-500 hover:text-white text-black font-bold text-xs uppercase tracking-widest transition-all duration-200 rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono-tech">Autenticando...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Entrar no CMS</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono-tech">
            <button
              onClick={onExitToSite}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              ← Voltar ao Portfólio Público
            </button>
            <span className="text-[10px] text-gray-600">v2.0 CMS</span>
          </div>

        </div>

      </div>
    </div>
  );
};
