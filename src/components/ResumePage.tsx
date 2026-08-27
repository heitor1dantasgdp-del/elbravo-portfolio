import React from 'react';
import { ArrowDownToLine, ArrowLeft, BriefcaseBusiness, GraduationCap, Languages, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { resumeContent } from '../data/resume';

interface ResumePageProps {
  lang: Language;
  onBack: () => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({ lang, onBack }) => {
  const content = resumeContent[lang];

  return (
    <section className="min-h-screen pt-32 pb-24 sm:pt-40" aria-labelledby="resume-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'pt' ? 'Voltar ao portfólio' : 'Back to portfolio'}
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/resume" className="inline-flex items-center border border-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-300 hover:border-white/30 hover:text-white transition-colors" aria-current="page">
              {content.viewLabel}
            </a>
            <a href={`/${content.downloadFile}`} download className="inline-flex items-center gap-2 border border-indigo-400/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-200 hover:bg-indigo-500/20 transition-colors">
              <ArrowDownToLine className="w-4 h-4" />
              {content.downloadLabel}
            </a>
          </div>
        </div>

        <header className="max-w-4xl py-16 sm:py-24">
          <p className="font-mono-tech text-xs uppercase tracking-[0.24em] text-indigo-300">{content.eyebrow}</p>
          <h1 id="resume-title" className="mt-5 max-w-3xl font-display text-4xl font-black tracking-tight text-white sm:text-6xl">{content.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">{content.intro}</p>
          <p className="mt-6 font-mono-tech text-xs uppercase tracking-widest text-gray-500">{content.personalNote}</p>
        </header>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div className="space-y-16">
            <ResumeBlock icon={<Sparkles />} label={content.summaryLabel}>
              <p className="max-w-3xl text-base leading-8 text-gray-300">{content.summary}</p>
            </ResumeBlock>

            <ResumeBlock icon={<BriefcaseBusiness />} label={content.experienceLabel}>
              {content.experience.map((entry) => <ResumeEntry key={`${entry.title}-${entry.organization}`} entry={entry} />)}
            </ResumeBlock>

            <ResumeBlock icon={<Sparkles />} label={content.projectsLabel}>
              <p className="max-w-3xl text-sm leading-7 text-gray-400">{content.projectsIntro}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {content.projects.map((project) => <li key={project} className="border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-gray-200">{project}</li>)}
              </ul>
            </ResumeBlock>
          </div>

          <aside className="space-y-10">
            <ResumeBlock icon={<Sparkles />} label={content.skillsLabel}>
              <ul className="space-y-3 text-sm leading-6 text-gray-300">
                {content.skills.map((skill) => <li key={skill} className="border-b border-white/10 pb-3">{skill}</li>)}
              </ul>
            </ResumeBlock>

            <ResumeBlock icon={<GraduationCap />} label={content.educationLabel}>
              {content.education.map((entry) => <ResumeEntry key={entry.title} entry={entry} compact />)}
            </ResumeBlock>

            <ResumeBlock icon={<Languages />} label={content.languagesLabel}>
              <ul className="space-y-3 text-sm text-gray-300">
                {content.languages.map((language) => <li key={language}>{language}</li>)}
              </ul>
            </ResumeBlock>
          </aside>
        </div>
      </div>
    </section>
  );
};

const ResumeBlock: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <section className="border-t border-white/15 pt-5">
    <div className="mb-7 flex items-center gap-3 text-indigo-300">
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'h-4 w-4' })}
      <h2 className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em]">{label}</h2>
    </div>
    {children}
  </section>
);

const ResumeEntry: React.FC<{ entry: import('../data/resume').ResumeEntry; compact?: boolean }> = ({ entry, compact = false }) => (
  <article className={compact ? '' : 'border-l border-indigo-400/40 pl-5'}>
    <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
    {entry.organization && <p className="mt-1 text-sm text-indigo-200">{entry.organization}</p>}
    {entry.period && <p className="mt-2 font-mono-tech text-xs uppercase tracking-widest text-gray-500">{entry.period}</p>}
    {entry.description && <p className="mt-5 text-sm leading-7 text-gray-400">{entry.description}</p>}
  </article>
);
