import React from 'react';
import { Code, Terminal, Layers, Cloud, Sparkles, Cpu, Wrench } from 'lucide-react';
import { Language } from '../types';
import { skillsData } from '../data/skills';
import { i18n } from '../data/i18n';

interface SkillsProps {
  lang: Language;
}

export const SkillsSection: React.FC<SkillsProps> = ({ lang }) => {
  const t = i18n[lang].skills;

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 1:
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 3:
        return <Cloud className="w-4 h-4 text-violet-400" />;
      case 4:
        return <Cpu className="w-4 h-4 text-sky-400" />;
      default:
        return <Terminal className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 sm:py-28 bg-[#050505] border-t border-white/10 relative">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((category, index) => (
            <div
              key={index}
              className="p-6 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-5 text-left shadow-2xl"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                    {getCategoryIcon(index)}
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white">
                    {category.title[lang]}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {category.description[lang]}
                </p>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-white/10">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#141414] border border-white/10 text-xs text-gray-300 font-mono-tech hover:text-white hover:border-white/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
