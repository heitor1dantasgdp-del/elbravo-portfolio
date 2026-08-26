import React from 'react';
import { GitCommit, Lightbulb, Compass, Code2, CheckCircle2, CloudUpload, Repeat, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { buildProcessSteps } from '../data/process';
import { i18n } from '../data/i18n';

interface HowIBuildProps {
  lang: Language;
}

export const HowIBuildSection: React.FC<HowIBuildProps> = ({ lang }) => {
  const steps = buildProcessSteps;
  const t = i18n[lang].process;

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'IDEA':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'PLAN':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'BUILD':
        return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'TEST':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'SHIP':
        return <CloudUpload className="w-4 h-4 text-violet-400" />;
      case 'IMPROVE':
        return <Repeat className="w-4 h-4 text-rose-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <section id="process" className="py-20 sm:py-28 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t.tag}
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            {t.subheading}
          </p>
        </div>

        {/* Desktop Process Timeline (Horizontal Grid) */}
        <div className="hidden lg:grid grid-cols-6 gap-4 relative">
          
          {/* Connector Line across cards */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-12 -z-0" />

          {steps.map((item) => (
            <div
              key={item.step}
              id={`process-step-${item.step.toLowerCase()}`}
              className="p-5 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between text-left space-y-4 group relative z-10 hover:-translate-y-1 shadow-2xl"
            >
              {/* Header Step Number & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                  {getStepIcon(item.step)}
                </div>
                <span className="font-mono-tech text-xs text-gray-400 font-bold">
                  {item.number}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="font-display font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                  {item.title[lang]}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc[lang]}
                </p>
              </div>

              {/* Details tag */}
              <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400 font-mono-tech">
                {item.details[lang]}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Process Timeline (Vertical) */}
        <div className="lg:hidden space-y-4 relative pl-4 border-l-2 border-white/15 ml-2">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-4 bg-[#0A0A0A] border border-white/10 text-left space-y-2 relative shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/5 border border-white/10 flex items-center justify-center">
                    {getStepIcon(item.step)}
                  </div>
                  <span className="font-display font-bold text-sm text-white">
                    {item.number}. {item.title[lang]}
                  </span>
                </div>
                <span className="font-mono-tech text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {item.step}
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc[lang]}
              </p>

              <div className="text-[11px] text-gray-400 pt-1 font-mono-tech">
                {item.details[lang]}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
