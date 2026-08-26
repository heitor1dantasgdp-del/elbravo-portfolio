import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';

interface AdminRouterProps {
  onExitToSite: () => void;
  onPreviewCaseStudy: (slug: string) => void;
}

export const AdminRouter: React.FC<AdminRouterProps> = ({
  onExitToSite,
  onPreviewCaseStudy,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // 1. Check session storage flag
      const stored = sessionStorage.getItem('el_bravo_admin_auth');
      if (stored) {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        return;
      }

      // 2. Check Supabase auth session if configured
      const supabase = getSupabaseClient();
      if (supabase && isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setIsAuthenticated(true);
            sessionStorage.setItem('el_bravo_admin_auth', 'supabase_authenticated');
          }
        } catch (err) {
          console.warn('Auth check error:', err);
        }
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

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onViewPublicSite={onExitToSite}
      onPreviewCaseStudy={onPreviewCaseStudy}
    />
  );
};
