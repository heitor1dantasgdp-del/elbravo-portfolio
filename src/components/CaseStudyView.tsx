import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowUpRight, Copy, Check, ShieldAlert, Sparkles, 
  Terminal, Layers, BookOpen, AlertCircle, Wrench, CheckCircle2, 
  Users, Key, ExternalLink, Calendar, DollarSign, FileText, ArrowRight, EyeOff
} from 'lucide-react';
import { Project, Language } from '../types';
import { i18n } from '../data/i18n';
import { ProjectBrowserMockup } from './ProjectBrowserMockup';

interface CaseStudyProps {
  project: Project;
  allProjects: Project[];
  lang: Language;
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export const CaseStudyView: React.FC<CaseStudyProps> = ({
  project,
  allProjects,
  lang,
  onBack,
  onSelectProject
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const t = i18n[lang].caseStudy;
  const statusLabels = i18n[lang].statusTag;

  // Dynamic SEO metadata per project
  useEffect(() => {
    const originalTitle = document.title;
    const projectTitle = `${project.name} — Case Study | El Bravo Dantas`;
    document.title = projectTitle;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute('content', project.description[lang] || project.tagline[lang]);
    }

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const originalOgTitle = ogTitle?.getAttribute('content') || '';
    if (ogTitle) {
      ogTitle.setAttribute('content', projectTitle);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
      if (ogTitle && originalOgTitle) ogTitle.setAttribute('content', originalOgTitle);
    };
  }, [project, lang]);

  // Find next project
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const handleCopyEmail = () => {
    if (project.demoCredentials?.email) {
      navigator.clipboard.writeText(project.demoCredentials.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPassword = () => {
    if (project.demoCredentials?.password) {
      navigator.clipboard.writeText(project.demoCredentials.password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div id={`case-study-page-${project.slug}`} className="min-h-screen bg-[#050505] text-[#E5E5E5] pt-24 pb-24 text-left">
      {/* Top Floating Action Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 flex items-center justify-between">
        <button
          id="case-study-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-xs font-mono-tech text-gray-300 transition-all cursor-pointer uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backButton}</span>
        </button>

        {!project.published && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded text-xs font-mono-tech">
            <EyeOff className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider">Preview de Rascunho</span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        
        {/* Case Study Hero Header */}
        <header className="space-y-6 border-b border-white/10 pb-10">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
            <span className="px-3 py-1 bg-white/10 text-white font-bold tracking-widest uppercase">
              PROJECT {project.orderNumber}
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 uppercase tracking-widest">
              {project.category[lang]}
            </span>
            <span className="text-gray-600">/</span>
            <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
              ● {statusLabels[project.status]}
            </span>
            {!project.published && (
              <>
                <span className="text-gray-600">/</span>
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  DRAFT
                </span>
              </>
            )}
          </div>

          {/* Title & Tagline */}
          <div className="space-y-2">
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {project.name}
            </h1>
            <p className="font-mono-tech text-sm sm:text-base text-indigo-400 uppercase tracking-wide">
              {project.tagline[lang]}
            </p>
          </div>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl">
            {project.description[lang]}
          </p>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              id="case-study-live-demo-primary"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.launchApp}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <span className="text-xs font-mono-tech text-gray-400">
              {project.statusNote ? project.statusNote[lang] : t.disclaimer}
            </span>
          </div>

        </header>

        {/* Demo / Test Environment Notice Block */}
        {project.status !== 'released' && (
          <section
            id="case-study-demo-notice-banner"
            className="p-5 sm:p-6 bg-[#0A0A0A] border border-amber-500/30 text-left space-y-2 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-mono-tech text-xs uppercase tracking-widest text-amber-400 font-bold">
                {t.demoBadge}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {t.demoNotice}
            </p>
          </section>
        )}

        {/* Demo Credentials Box (If Available and allowed to be shown publicly) */}
        {project.demoCredentials && 
         project.demoCredentials.showDemoCredentials !== false && 
         (project.demoCredentials.email || project.demoCredentials.notes) && (
          <section
            id="case-study-demo-credentials"
            className="p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <h3 className="font-mono-tech text-xs uppercase tracking-widest text-indigo-300 font-bold">
                {t.demoBoxTitle}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-400">
              {t.demoBoxSubtitle}
            </p>

            {/* Email & Password Copy Fields */}
            {project.demoCredentials.email && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-[#141414] border border-white/10 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[10px] text-gray-500 font-mono-tech uppercase">{t.demoEmail}</div>
                    <div className="text-xs font-mono-tech text-white truncate">{project.demoCredentials.email}</div>
                  </div>
                  <button
                    id="copy-demo-email-btn"
                    onClick={handleCopyEmail}
                    className="p-1.5 bg-white/10 hover:bg-white hover:text-black text-gray-300 transition-colors cursor-pointer shrink-0 text-xs flex items-center gap-1 font-mono-tech uppercase"
                    title={t.copyBtn}
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? t.copiedBtn : t.copyBtn}</span>
                  </button>
                </div>

                {project.demoCredentials.password && (
                  <div className="p-3.5 bg-[#141414] border border-white/10 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="text-[10px] text-gray-500 font-mono-tech uppercase">{t.demoPassword}</div>
                      <div className="text-xs font-mono-tech text-white truncate">{project.demoCredentials.password}</div>
                    </div>
                    <button
                      id="copy-demo-password-btn"
                      onClick={handleCopyPassword}
                      className="p-1.5 bg-white/10 hover:bg-white hover:text-black text-gray-300 transition-colors cursor-pointer shrink-0 text-xs flex items-center gap-1 font-mono-tech uppercase"
                      title={t.copyBtn}
                    >
                      {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPassword ? t.copiedBtn : t.copyBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Role indicator if present */}
            {project.demoCredentials.role && (
              <div className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1.5 pt-1">
                <Users className="w-3.5 h-3.5" />
                <span>{t.demoRole}: {project.demoCredentials.role}</span>
              </div>
            )}

            {/* Note disclaimer */}
            {project.demoCredentials.notes && (
              <div className="text-xs text-gray-500 border-t border-white/10 pt-3 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{project.demoCredentials.notes[lang]}</span>
              </div>
            )}
          </section>
        )}

        {/* Large Interactive Browser Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech text-gray-500">
            <span>{t.galleryTitle}</span>
            <span className="uppercase tracking-widest">INTERACTIVE PREVIEW</span>
          </div>
          <ProjectBrowserMockup project={project} lang={lang} />
        </section>

        {/* Problem, Idea & Solution Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-3 shadow-2xl">
            <div className="text-xs font-mono-tech font-bold text-rose-400 uppercase tracking-widest">
              {t.theProblem}
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.problem[lang]}
            </p>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-3 shadow-2xl">
            <div className="text-xs font-mono-tech font-bold text-amber-400 uppercase tracking-widest">
              {t.theIdea}
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.idea[lang]}
            </p>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-3 shadow-2xl">
            <div className="text-xs font-mono-tech font-bold text-emerald-400 uppercase tracking-widest">
              {t.theSolution}
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.solution[lang]}
            </p>
          </div>
        </section>

        {/* Implemented Features Grid */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono-tech text-indigo-400 uppercase tracking-widest font-bold">
              {t.coreFeatures}
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              {lang === 'pt' ? 'Módulos e Funcionalidades Construídas' : 'Engineered Functional Modules'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.caseStudy.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-colors space-y-2 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h3 className="font-display font-semibold text-sm sm:text-base text-white">
                    {feature.title[lang]}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">
                  {feature.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles Simulation (If applicable, e.g. AgendaPro) */}
        {project.caseStudy.roles && project.caseStudy.roles.length > 0 && (
          <section className="p-6 bg-[#0A0A0A] border border-white/10 space-y-4 shadow-xl">
            <div className="text-xs font-mono-tech text-indigo-400 uppercase tracking-widest font-bold">
              {t.simulatedRoles}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.caseStudy.roles.map((roleItem, i) => (
                <div key={i} className="p-3 bg-[#141414] border border-white/10 text-xs text-gray-300 font-mono-tech">
                  {roleItem[lang]}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack */}
        <section className="space-y-3">
          <div className="text-xs font-mono-tech text-indigo-400 uppercase tracking-widest font-bold">
            {t.techUsed}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-[#141414] border border-white/10 text-xs text-gray-300 font-mono-tech"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Learnings, Challenges, Limitations & Next Steps */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning */}
          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-2.5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-indigo-400 font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.whatImLearning}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.learning[lang]}
            </p>
          </div>

          {/* Challenges */}
          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-2.5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 font-bold uppercase tracking-widest">
              <Wrench className="w-3.5 h-3.5" />
              <span>{t.challengesFaced}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.challenges[lang]}
            </p>
          </div>

          {/* Limitations (Honest & Transparent) */}
          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-2.5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-rose-400 font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.currentLimitations}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.limitations[lang]}
            </p>
          </div>

          {/* Next Steps */}
          <div className="p-6 bg-[#0A0A0A] border border-white/10 space-y-2.5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400 font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.nextStepsTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {project.caseStudy.nextSteps[lang]}
            </p>
          </div>
        </section>

        {/* Bottom Navigation: Next Project / Return */}
        <footer className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-xs font-mono-tech text-gray-300 transition-colors cursor-pointer uppercase tracking-wider font-bold"
          >
            {t.backButton}
          </button>

          <button
            id="next-project-btn"
            onClick={() => onSelectProject(nextProject.slug)}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <span>{lang === 'pt' ? `Próximo Projeto: ${nextProject.name}` : `Next Project: ${nextProject.name}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </footer>

      </div>
    </div>
  );
};
