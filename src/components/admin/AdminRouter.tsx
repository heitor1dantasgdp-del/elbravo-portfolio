import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { getSupabaseClient, isLocalFallbackAllowed, isPortfolioOwner, isSupabaseConfigured } from '../../lib/supabase';
import { CaseStudyView } from '../CaseStudyView';
import { useProjects } from '../../hooks/useProjects';

interface AdminRouterProps {
  onExitToSite: () => void;
}

export const AdminRouter: React.FC<AdminRouterProps> = ({
  onExitToSite,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const { allProjects } = useProjects();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = getSupabaseClient();
      if (supabase && isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session && await isPortfolioOwner()) {
            setIsAuthenticated(true);
            sessionStorage.setItem('el_bravo_admin_auth', 'supabase_authenticated');
          }
        } catch (err) {
          console.warn('Auth check error:', err);
        }
      } else if (isLocalFallbackAllowed()) {
        // Development-only session marker. Never trust this marker in production.
        const stored = sessionStorage.getItem('el_bravo_admin_auth');
        if (stored === 'local_authenticated') setIsAuthenticated(true);
      }

      setCheckingAuth(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem('el_bravo_admin_auth');
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout error:', err);
      }
    }
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono-tech text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Verificando credenciais de acesso...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => setIsAuthenticated(true)}
        onExitToSite={onExitToSite}
      />
    );
  }

  if (previewSlug) {
    const previewProject = allProjects.find((project) => project.slug === previewSlug);
    if (previewProject) {
      return (
        <div className="min-h-screen bg-[#050505] text-white">
          <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A] px-4 py-3">
            <button
              type="button"
              onClick={() => setPreviewSlug(null)}
              className="text-xs font-mono-tech text-gray-300 hover:text-white"
            >
              ← Voltar ao CMS
            </button>
            <span className="ml-4 text-[10px] uppercase tracking-widest text-amber-400">Preview autenticado · rascunho</span>
          </div>
          <CaseStudyView
            project={previewProject}
            allProjects={allProjects}
            lang="pt"
            onBack={() => setPreviewSlug(null)}
            onSelectProject={setPreviewSlug}
          />
        </div>
      );
    }
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onViewPublicSite={onExitToSite}
      onPreviewCaseStudy={setPreviewSlug}
    />
  );
};
