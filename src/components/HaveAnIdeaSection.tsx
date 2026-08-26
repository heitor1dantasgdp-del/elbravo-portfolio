import React from 'react';
import { Lightbulb, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { i18n } from '../data/i18n';

interface HaveAnIdeaProps {
  lang: Language;
  onContactClick: () => void;
}

export const HaveAnIdeaSection: React.FC<HaveAnIdeaProps> = ({ lang, onContactClick }) => {
  const t = i18n[lang].haveAnIdea;

  return (
    <section id="have-an-idea" className="py-16 sm:py-24 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative p-8 sm:p-12 lg:p-14 bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden text-left">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] pointer-events-none -z-0" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Tag */}
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                {t.tag}
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {t.heading}
            </h2>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              {t.subheading}
            </p>

            {/* Disclaimer & Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <button
                id="have-an-idea-cta-btn"
                onClick={onContactClick}
                className="px-7 py-4 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl self-start"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.cta}</span>
              </button>

              <p className="text-xs font-mono-tech text-gray-500 max-w-sm">
                {t.disclaimer}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
