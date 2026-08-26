import React from 'react';
import { ArrowLeft, SearchX, Home, Layers } from 'lucide-react';
import { Language } from '../types';

interface NotFoundViewProps {
  slug?: string;
  lang: Language;
  onReturnHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  slug,
  lang,
  onReturnHome,
}) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex flex-col items-center justify-center p-4 sm:p-6 text-center selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="w-14 h-14 bg-indigo-950/40 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto text-indigo-400">
          <SearchX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 font-bold block">
            404 • {lang === 'pt' ? 'PROJETO NÃO ENCONTRADO' : 'PROJECT NOT FOUND'}
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            {lang === 'pt' ? 'Estudo de Caso Indisponível' : 'Case Study Unavailable'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {lang === 'pt'
              ? `O projeto com identificador "${slug || 'desconhecido'}" não foi encontrado ou ainda não foi publicado no portfólio.`
              : `The project with slug "${slug || 'unknown'}" could not be found or has not been published yet.`}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onReturnHome}
            className="w-full py-3.5 px-6 bg-white hover:bg-indigo-500 hover:text-white text-black font-bold text-xs uppercase tracking-widest transition-all duration-200 rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg font-mono-tech"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'pt' ? 'Voltar aos Projetos' : 'Back to Projects'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
