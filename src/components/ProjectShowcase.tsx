import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Project, Language } from '../types';
import { i18n } from '../data/i18n';
import { ProjectBrowserMockup } from './ProjectBrowserMockup';

interface ShowcaseProps {
  projects: Project[];
  lang: Language;
  onOpenCaseStudy: (slug: string) => void;
}

export const ProjectShowcase: React.FC<ShowcaseProps> = ({
  projects,
  lang,
  onOpenCaseStudy
}) => {
  const t = i18n[lang].showcase;
  const statusLabels = i18n[lang].statusTag;

  return (
    <section id="projects" className="py-20 sm:py-28 relative bg-[#050505] border-t border-white/10">
      {/* Ambient background decoration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-16 sm:mb-20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold">
              {t.tag}
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            {t.heading}
          </h2>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {/* Product Cards Showcase List */}
        <div className="space-y-16 sm:space-y-24">
          {projects.map((project, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={project.slug}
                id={`project-card-${project.slug}`}
                className="group relative bg-[#0A0A0A] border border-white/10 hover:border-white/25 p-5 sm:p-8 lg:p-10 transition-all duration-300 shadow-2xl"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Left (or Right) Content Info */}
                  <div className={`lg:col-span-5 space-y-5 text-left ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    {/* Technical Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
                      <span className="px-2 py-0.5 bg-white/10 text-white font-bold tracking-wider">
                        {project.orderNumber}
                      </span>
                      <span className="text-gray-600">/</span>
                      <span className="text-gray-400 uppercase tracking-widest text-[11px]">
                        {project.category[lang]}
                      </span>
                      <span className="text-gray-600">/</span>
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        ● {statusLabels[project.status]}
                      </span>
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                        {project.name}
                      </h3>
                      <p className="font-mono-tech text-xs sm:text-sm text-indigo-400 mt-1 uppercase tracking-wide">
                        {project.tagline[lang]}
                      </p>
                    </div>

                    {/* Project Description */}
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {project.description[lang]}
                    </p>

                    {/* Demo Environment Notice for testing/building projects */}
                    {project.status !== 'released' && (
                      <div className="p-3 bg-[#111111] border border-amber-500/20 text-left space-y-1">
                        <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{t.demoBadge}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-normal">
                          {t.demoNotice}
                        </p>
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono-tech text-gray-500 uppercase tracking-widest">
                        {t.techLabel}
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-[#141414] border border-white/10 text-xs text-gray-300 font-mono-tech hover:border-white/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        id={`case-study-btn-${project.slug}`}
                        onClick={() => onOpenCaseStudy(project.slug)}
                        className="px-5 py-3 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t.viewCase}</span>
                      </button>

                      {project.demoUrl && (
                        <a
                          id={`live-demo-link-${project.slug}`}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5"
                        >
                          <span>{t.launchDemo}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Right (or Left) Product Browser Mockup */}
                  <div 
                    className={`lg:col-span-7 cursor-pointer ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                    onClick={() => onOpenCaseStudy(project.slug)}
                    title={lang === 'pt' ? 'Clique para abrir o Case Study' : 'Click to open Case Study'}
                  >
                    <ProjectBrowserMockup project={project} lang={lang} interactive />
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
