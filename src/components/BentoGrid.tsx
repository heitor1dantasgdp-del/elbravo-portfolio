import React from 'react';
import { Layers, Globe, Zap, Cpu, Sparkles, CheckCircle2, Rocket, ArrowUpRight } from 'lucide-react';
import { Language, Project } from '../types';
import { i18n } from '../data/i18n';

interface BentoGridProps {
  lang: Language;
  projects: Project[];
  onOpenCaseStudy: (slug: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ lang, projects, onOpenCaseStudy }) => {
  const t = i18n[lang].bento;
  const totalCount = projects.length;

  return (
    <section id="bento" className="py-20 sm:py-24 bg-[#050505] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12 sm:mb-16 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t.tag}
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            {t.subheading}
          </p>
        </div>

        {/* Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Card 1: 05 Real Projects (Large Tile) */}
          <div className="md:col-span-7 p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between text-left relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-display font-black text-8xl sm:text-9xl text-white select-none pointer-events-none">
              05
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>

              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
                  {totalCount < 10 ? `0${totalCount}` : totalCount}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 mt-1">
                  {t.stat1Label}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
                {t.stat1Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono-tech text-gray-400">
              {projects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onOpenCaseStudy(p.slug)}
                  className="px-2.5 py-1 bg-[#141414] hover:bg-white hover:text-black border border-white/10 hover:border-white text-gray-300 transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: 100% Live Demos (Medium Tile) */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between text-left shadow-2xl">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <Rocket className="w-5 h-5" />
              </div>

              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-emerald-400 tracking-tight">
                  {t.stat2Number}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 mt-1">
                  {t.stat2Label}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {t.stat2Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vercel Deployments
              </span>
              <span className="uppercase tracking-widest text-[10px]">All Active</span>
            </div>
          </div>

          {/* Card 3: PT / EN Bilingual (Medium Tile) */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between text-left shadow-2xl">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                <Globe className="w-5 h-5" />
              </div>

              <div>
                <div className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
                  {t.stat3Number}
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 mt-1">
                  {t.stat3Label}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {t.stat3Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 text-xs font-mono-tech text-gray-400">
              Português (BR) & English UI
            </div>
          </div>

          {/* Card 4: BUILD → TEST → SHIP Loop (Large Tile) */}
          <div className="md:col-span-7 p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between text-left shadow-2xl">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-violet-400">
                <Zap className="w-5 h-5" />
              </div>

              <div>
                <div className="font-mono-tech font-bold text-xl sm:text-2xl text-white tracking-wider">
                  BUILD → TEST → SHIP
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-200 mt-1">
                  {t.stat4Label}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed">
                {t.stat4Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs font-mono-tech">
              <span className="px-2 py-1 bg-[#141414] border border-white/10 text-gray-300">#TransparentLearning</span>
              <span className="px-2 py-1 bg-[#141414] border border-white/10 text-gray-300">#RealSoftware</span>
              <span className="px-2 py-1 bg-[#141414] border border-white/10 text-gray-300">#ContinuousShip</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
