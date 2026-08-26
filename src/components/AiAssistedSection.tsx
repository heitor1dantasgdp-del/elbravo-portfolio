import React from 'react';
import { Cpu, CheckCircle2, Sparkles, Terminal, FileCode } from 'lucide-react';
import { Language } from '../types';
import { profileData } from '../data/profile';
import { i18n } from '../data/i18n';

interface AiProps {
  lang: Language;
}

export const AiAssistedSection: React.FC<AiProps> = ({ lang }) => {
  const aiInfo = profileData.aiPhilosophy;
  const t = i18n[lang].ai;

  return (
    <section id="ai-workflow" className="py-16 sm:py-20 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-6 sm:p-10 bg-[#0A0A0A] border border-white/10 relative overflow-hidden shadow-2xl text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Col */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  {aiInfo.badge[lang]}
                </span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {aiInfo.title[lang]}
              </h3>

              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {aiInfo.description[lang]}
              </p>
            </div>

            {/* Right Col: Verified Practical Points */}
            <div className="lg:col-span-6 space-y-2.5">
              {aiInfo.points.map((point, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#141414] border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point[lang]}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
