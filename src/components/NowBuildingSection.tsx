import React from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';
import { Project, Language } from '../types';
import { i18n } from '../data/i18n';

interface NowBuildingProps {
  projects: Project[];
  lang: Language;
  onOpenCaseStudy: (slug: string) => void;
}

export const NowBuildingSection: React.FC<NowBuildingProps> = ({
  projects,
  lang,
  onOpenCaseStudy
}) => {
  const activeProjects = projects.filter(
    (p) => p.status === 'building' || p.status === 'testing' || p.status === 'beta'
  );
  const t = i18n[lang].nowBuilding;
  const statusLabels = i18n[lang].statusTag;

  return (
    <section id="now-building" className="py-16 sm:py-20 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                {t.tag}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
              {t.subheading}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.liveIndicator}</span>
          </div>
        </div>

        {/* Dynamic Grid of Active Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeProjects.map((project) => (
            <div
              key={project.slug}
              id={`now-building-card-${project.slug}`}
              className="p-5 sm:p-6 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all duration-200 flex flex-col justify-between space-y-4 group text-left shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-white font-bold bg-white/10 px-2 py-0.5">
                    {project.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider">
                    ● {statusLabels[project.status]}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono-tech mt-0.5 uppercase tracking-wide">
                    {project.category[lang]}
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {project.statusNote ? project.statusNote[lang] : project.description[lang]}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech">
                <button
                  onClick={() => onOpenCaseStudy(project.slug)}
                  className="text-white hover:text-indigo-300 uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'pt' ? 'Detalhes' : 'Details'}</span>
                  <span>→</span>
                </button>

                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
