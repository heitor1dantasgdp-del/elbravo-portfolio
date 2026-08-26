import React, { useState } from 'react';
import { X, Copy, Check, Database, Shield, Server, ExternalLink, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseSetupModalProps {
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ onClose }) => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  const envSample = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const sqlSample = `-- 1. Tabela de Projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  order_number TEXT NOT NULL DEFAULT '01',
  display_order INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  category JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('building', 'testing', 'beta', 'released', 'paused')),
  status_note JSONB,
  tagline JSONB NOT NULL,
  description JSONB NOT NULL,
  demo_url TEXT NOT NULL DEFAULT '',
  repository_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  cover_image TEXT,
  stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  case_study JSONB NOT NULL,
  demo_credentials JSONB,
  last_updated TEXT DEFAULT '2026',
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.portfolio_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.portfolio_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read own membership"
  ON public.portfolio_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow public read access to published projects"
  ON public.projects FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY "Allow full access to authenticated admins"
  ON public.projects FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()));

-- 3. Storage Bucket para Imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', false)
ON CONFLICT (id) DO NOTHING;
UPDATE storage.buckets SET public = false WHERE id = 'project-media';

CREATE POLICY "Allow published project media read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-media' AND EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.slug = split_part(storage.objects.name, '/', 2)
      AND projects.published = true
  ));

CREATE POLICY "Allow authenticated users to manage project media"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()))
  WITH CHECK (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.portfolio_admins WHERE user_id = auth.uid()));`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-white/20 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Guia de Conexão com Supabase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-left text-xs leading-relaxed">
          
          {/* Status Indicator */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            supabaseConfigured
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}>
            <Server className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider font-mono-tech text-sm">
                Status Atual: {supabaseConfigured ? 'Supabase Conectado na Nuvem' : 'Modo de Persistência Local Ativo'}
              </div>
              <p className="mt-1 text-xs opacity-90">
                {supabaseConfigured
                  ? 'O CMS está conectado e gravando diretamente na tabela PostgreSQL e no bucket de mídia do seu Supabase.'
                  : 'O CMS está funcionando com persistência local no navegador. Para persistência global na nuvem em produção, siga os 3 passos abaixo:'}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            
            {/* Step 1 */}
            <div className="p-4 bg-[#111111] border border-white/10 rounded-lg space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="font-mono-tech text-indigo-400">PASSO 1. Criar Projeto no Supabase</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-mono-tech"
                >
                  Abrir Supabase Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-gray-400">
                Crie um novo projeto gratuito no Supabase e acesse as configurações de API (Project Settings → API).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-[#111111] border border-white/10 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono-tech text-indigo-400">
                  PASSO 2. Variáveis de Ambiente (.env)
                </span>
                <button
                  onClick={handleCopyEnv}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono-tech flex items-center gap-1 cursor-pointer"
                >
                  {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEnv ? 'Copiado!' : 'Copiar Exemplo'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black border border-white/10 rounded font-mono-tech text-[11px] text-gray-300 overflow-x-auto">
                {envSample}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-[#111111] border border-white/10 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono-tech text-indigo-400">
                  PASSO 3. Executar o Script SQL no SQL Editor
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono-tech flex items-center gap-1 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copiado!' : 'Copiar SQL Completo'}</span>
                </button>
              </div>
              <p className="text-gray-400">
                No painel do Supabase, clique em <strong>SQL Editor</strong>, cole o script abaixo e clique em <strong>Run</strong>:
              </p>
              <pre className="p-3 bg-black border border-white/10 rounded font-mono-tech text-[10px] text-gray-400 max-h-48 overflow-y-auto">
                {sqlSample}
              </pre>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#111111] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-indigo-500 hover:text-white text-black font-bold text-xs uppercase tracking-widest rounded transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
