import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Language, Project } from '../types';
import { profileData } from '../data/profile';
import { i18n } from '../data/i18n';
import { ProjectBrowserMockup } from './ProjectBrowserMockup';

interface HeroProps {
  lang: Language;
  featuredProject: Project;
  secondaryProject?: Project;
  onExploreProjects: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onOpenCaseStudy: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  featuredProject,
  secondaryProject,
  onExploreProjects,
  onAboutClick,
  onContactClick,
  onOpenCaseStudy
}) => {
  const profile = profileData;
  const t = i18n[lang].hero;

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden bg-radial-ambient"
    >
      {/* Top Ambient Glow (Deep Indigo) */}
      <div className="absolute top-[-5%] right-[-5%] w-[550px] sm:w-[700px] h-[450px] bg-indigo-900/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Typography & Story */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Status / Identity Tag */}
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold">
                {lang === 'pt' ? 'A MISSÃO' : 'THE MISSION'}
              </span>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-mono-tech tracking-widest uppercase text-emerald-400">
                  {profile.badge[lang]}
                </span>
              </div>
            </div>

            {/* Main Headline with Sophisticated Stroked Word */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[76px] tracking-tighter text-white leading-[0.92]">
                <span>{profile.headline.line1[lang]}</span>
                <br />
                <span>{profile.headline.line2[lang]}</span>
                <br />
                <span className="text-transparent text-stroke-white">
                  {profile.headline.line3[lang]}
                </span>
              </h1>
            </div>

            {/* Core Motto */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl font-normal">
              <span className="font-mono-tech text-white font-semibold">{profile.motto[lang]}</span> — {profile.subheadline[lang]}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-explore-btn"
                onClick={onExploreProjects}
                className="bg-white text-black px-7 sm:px-8 py-3.5 sm:py-4 font-bold uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>{t.ctaProjects}</span>
                <span>&rarr;</span>
              </button>

              <button
                id="hero-about-btn"
                onClick={onAboutClick}
                className="border border-white/20 bg-white/5 px-7 sm:px-8 py-3.5 sm:py-4 font-bold uppercase text-xs tracking-widest text-[#E5E5E5] hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
              >
                <span>{t.ctaAbout}</span>
              </button>

              <button
                id="hero-contact-btn"
                onClick={onContactClick}
                className="px-4 py-3.5 text-xs font-mono-tech uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.ctaContact}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust Markers / Highlights */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-8 sm:gap-12">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">05</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono-tech">
                  {lang === 'pt' ? 'PROJETOS REAIS' : 'REAL PROJECTS'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">DEMO</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono-tech">
                  {lang === 'pt' ? 'DEMOS ONLINE' : 'LIVE DEMOS'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">VERCEL</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono-tech">
                  {lang === 'pt' ? 'TEST DEPLOY' : 'TEST DEPLOY'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-indigo-400 font-display">PT / EN</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono-tech">
                  {lang === 'pt' ? 'BILINGUE' : 'BILINGUAL'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Future Product Lab Live Composition */}
          <div className="lg:col-span-6 relative">
            {/* Ambient Background Box Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 border border-indigo-500/10 rounded-full animate-pulse pointer-events-none -z-10" />

            {/* Main Stage Presentation Container */}
            <div className="relative group">
              {/* Primary Featured Browser Mockup (Nexus CRM) */}
              <div 
                className="cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                onClick={() => onOpenCaseStudy(featuredProject.slug)}
                title={lang === 'pt' ? 'Clique para ver o Case Study completo' : 'Click to view full Case Study'}
              >
                <div className="flex items-center justify-between pb-2.5 px-1">
                  <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-indigo-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>{lang === 'pt' ? 'LATEST PROJECT' : 'LATEST PROJECT'}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono-tech group-hover:text-white transition-colors">
                    01 / {featuredProject.name.toUpperCase()} &rarr;
                  </span>
                </div>
                
                <ProjectBrowserMockup project={featuredProject} lang={lang} />
              </div>

              {/* Status Floating Pill */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="bg-indigo-600 px-3.5 py-1.5 text-[10px] font-mono-tech font-bold tracking-widest uppercase text-white shadow-lg">
                  {lang === 'pt' ? 'Status: Em Testes & Produção' : 'Status: In Testing & Live'}
                </div>

                {/* Overlapping Secondary Card (AgendaPro teaser) */}
                {secondaryProject && (
                  <div
                    className="p-2.5 px-4 bg-[#111111] border border-white/10 hover:border-white/30 transition-all cursor-pointer shadow-xl flex items-center gap-3 group/sub"
                    onClick={() => onOpenCaseStudy(secondaryProject.slug)}
                  >
                    <div className="text-left">
                      <span className="text-[10px] font-mono-tech text-gray-500 uppercase tracking-widest">NEXT</span>
                      <div className="text-xs font-semibold text-white group-hover/sub:text-indigo-300 transition-colors">
                        {secondaryProject.name}
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="pt-8 sm:pt-10 flex flex-col items-center justify-center text-center">
        <button
          id="hero-scroll-down-btn"
          onClick={onExploreProjects}
          className="group flex flex-col items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          aria-label={t.scrollHint}
        >
          <span className="font-mono-tech text-[10px] tracking-widest uppercase">
            {t.scrollHint}
          </span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-white" />
        </button>
      </div>
    </section>
  );
};
