import React from 'react';
import { UserCheck, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { profileData } from '../data/profile';
import { i18n } from '../data/i18n';

interface AboutProps {
  lang: Language;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutProps> = ({ lang, onContactClick }) => {
  const profile = profileData;
  const t = i18n[lang].about;

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left">
          
          {/* Left Column: Heading & Core Highlight */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                {t.tag}
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {profile.about.title[lang]}
            </h2>

            {/* Quote Box */}
            <div className="p-6 bg-[#0A0A0A] border-l-4 border-indigo-500 border-y border-r border-white/10 shadow-2xl space-y-3">
              <p className="font-display font-bold text-lg sm:text-xl text-gray-200 italic leading-snug">
                {profile.about.quote[lang]}
              </p>
              <div className="font-mono-tech text-xs text-indigo-400 font-semibold uppercase tracking-widest">
                — EL BRAVO DANTAS
              </div>
            </div>

            {/* Highlights list */}
            <div className="space-y-3 pt-2">
              {profile.about.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#0A0A0A] border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="text-gray-400 font-mono-tech uppercase tracking-wide">
                    {h.label[lang]}
                  </span>
                  <span className="font-semibold text-white text-right">
                    {h.value[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative & Transparent Stance */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 space-y-5 text-sm sm:text-base text-gray-400 leading-relaxed shadow-2xl">
              {profile.about.paragraphs[lang].map((paragraph, index) => (
                <p key={index} className="text-gray-300">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono-tech text-gray-400">
                  {t.journeyNotice}
                </div>

                <button
                  id="about-contact-cta"
                  onClick={onContactClick}
                  className="px-5 py-2.5 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>{lang === 'pt' ? 'Vamos conversar' : "Let's connect"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Direct Values Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-4 bg-[#0A0A0A] border border-white/10 space-y-1">
                <div className="text-xs font-mono-tech text-indigo-400 font-bold uppercase tracking-wider">
                  {lang === 'pt' ? '01. PRÁTICA REAL' : '01. HANDS-ON CRAFT'}
                </div>
                <div className="text-xs text-gray-400">
                  {lang === 'pt' ? 'Software publicado, testado e funcional.' : 'Real software deployed, tested, and functional.'}
                </div>
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-white/10 space-y-1">
                <div className="text-xs font-mono-tech text-emerald-400 font-bold uppercase tracking-wider">
                  {lang === 'pt' ? '02. TRANSPARÊNCIA' : '02. TRANSPARENCY'}
                </div>
                <div className="text-xs text-gray-400">
                  {lang === 'pt' ? 'Registro sincero de limitações, aprendizados e status.' : 'Honest reporting of limitations, learnings, and status.'}
                </div>
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-white/10 space-y-1">
                <div className="text-xs font-mono-tech text-violet-400 font-bold uppercase tracking-wider">
                  {lang === 'pt' ? '03. EVOLUÇÃO' : '03. CONTINUOUS PROGRESS'}
                </div>
                <div className="text-xs text-gray-400">
                  {lang === 'pt' ? 'Refatoração contínua a cada novo projeto entregue.' : 'Continuous refactoring with every shipped project.'}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
