/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { useProjects } from './hooks/useProjects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { NowBuildingSection } from './components/NowBuildingSection';
import { BentoGrid } from './components/BentoGrid';
import { HowIBuildSection } from './components/HowIBuildSection';
import { AboutSection } from './components/AboutSection';
import { AiAssistedSection } from './components/AiAssistedSection';
import { SkillsSection } from './components/SkillsSection';
import { HaveAnIdeaSection } from './components/HaveAnIdeaSection';
import { CaseStudyView } from './components/CaseStudyView';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminRouter } from './components/admin/AdminRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFoundView } from './components/NotFoundView';

export default function App() {
  const { allProjects, publishedProjects, loading } = useProjects();

  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('elbravodantas_lang');
      if (saved === 'en' || saved === 'pt') return saved;
    } catch {
      // ignore
    }
    return 'pt';
  });

  // Admin view state
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      return hash === '#admin' || hash.startsWith('#admin') || pathname === '/admin';
    }
    return false;
  });

  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        return hash.replace('#project-', '');
      }
      if (hash.startsWith('#projects/')) {
        return hash.replace('#projects/', '');
      }
    }
    return null;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');

  // Handle language switch
  const toggleLanguage = () => {
    const nextLang: Language = lang === 'pt' ? 'en' : 'pt';
    setLang(nextLang);
    try {
      localStorage.setItem('elbravodantas_lang', nextLang);
      document.documentElement.lang = nextLang === 'pt' ? 'pt-BR' : 'en';
    } catch {
      // ignore
    }
  };

  // Open Case Study and update URL hash
  const handleOpenCaseStudy = (slug: string) => {
    setIsAdminView(false);
    setSelectedProjectSlug(slug);
    window.location.hash = `project-${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close Case Study and restore home view
  const handleCloseCaseStudy = () => {
    setSelectedProjectSlug(null);
    history.pushState('', document.title, window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit admin view to public site
  const handleExitAdmin = () => {
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser navigation (hash & popstate)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash.startsWith('#admin')) {
        setIsAdminView(true);
        setSelectedProjectSlug(null);
        return;
      }

      setIsAdminView(false);

      if (hash.startsWith('#project-')) {
        const slug = hash.replace('#project-', '');
        setSelectedProjectSlug(slug);
        return;
      }
      if (hash.startsWith('#projects/')) {
        const slug = hash.replace('#projects/', '');
        setSelectedProjectSlug(slug);
        return;
      }

      setSelectedProjectSlug(null);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Smooth scroll handler to sections
  const handleNavigateToSection = (sectionId: string) => {
    if (isAdminView) {
      setIsAdminView(false);
    }
    if (selectedProjectSlug) {
      setSelectedProjectSlug(null);
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    setActiveSection(sectionId);

    setTimeout(() => {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Active project object (supports all projects so admin can preview drafts)
  const currentCaseProject = selectedProjectSlug
    ? allProjects.find((p) => p.slug === selectedProjectSlug) || null
    : null;

  // Render Admin View
  if (isAdminView) {
    return (
      <ErrorBoundary>
        <AdminRouter
          onExitToSite={handleExitAdmin}
          onPreviewCaseStudy={(slug) => handleOpenCaseStudy(slug)}
        />
      </ErrorBoundary>
    );
  }

  // Active public projects list
  const displayProjects = publishedProjects.length > 0 ? publishedProjects : allProjects;
  const heroPrimary = displayProjects[0] || allProjects[0];
  const heroSecondary = displayProjects[1] || allProjects[1];

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#050505] text-[#E5E5E5] selection:bg-indigo-600/30 selection:text-white relative">
        {/* Top Background Dot Grid Texture */}
        <div className="fixed inset-0 bg-sophisticated-grid opacity-20 pointer-events-none -z-10" />

        {/* Top Ambient Glow */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-950/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Top Navbar */}
        <Navbar
          lang={lang}
          onToggleLang={toggleLanguage}
          activeSection={activeSection}
          onNavigateToSection={handleNavigateToSection}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {selectedProjectSlug ? (
            currentCaseProject ? (
              <CaseStudyView
                project={currentCaseProject}
                allProjects={displayProjects}
                lang={lang}
                onBack={handleCloseCaseStudy}
                onSelectProject={handleOpenCaseStudy}
              />
            ) : !loading ? (
              <NotFoundView
                slug={selectedProjectSlug}
                lang={lang}
                onReturnHome={handleCloseCaseStudy}
              />
            ) : (
              <div className="min-h-[60vh] flex items-center justify-center font-mono-tech text-xs text-gray-500">
                Carregando projeto...
              </div>
            )
          ) : (
            <>
              {/* 01 Hero */}
              {heroPrimary && (
                <Hero
                  lang={lang}
                  featuredProject={heroPrimary}
                  secondaryProject={heroSecondary}
                  onExploreProjects={() => handleNavigateToSection('projects')}
                  onAboutClick={() => handleNavigateToSection('about')}
                  onContactClick={() => handleNavigateToSection('contact')}
                  onOpenCaseStudy={handleOpenCaseStudy}
                />
              )}

              {/* 02 Project Showcase */}
              <ProjectShowcase
                projects={displayProjects}
                lang={lang}
                onOpenCaseStudy={handleOpenCaseStudy}
              />

              {/* 03 Now Building Live Section */}
              <NowBuildingSection
                projects={displayProjects}
                lang={lang}
                onOpenCaseStudy={handleOpenCaseStudy}
              />

              {/* 04 Bento Grid Metrics */}
              <BentoGrid
                lang={lang}
                projects={displayProjects}
                onOpenCaseStudy={handleOpenCaseStudy}
              />

              {/* 05 How I Build */}
              <HowIBuildSection lang={lang} />

              {/* 06 About */}
              <AboutSection
                lang={lang}
                onContactClick={() => handleNavigateToSection('contact')}
              />

              {/* 07 AI-Assisted Workflow */}
              <AiAssistedSection lang={lang} />

              {/* 08 Skills & Tech Stack */}
              <SkillsSection lang={lang} />

              {/* 09 Custom Project Opportunities ("Have an Idea?") */}
              <HaveAnIdeaSection
                lang={lang}
                onContactClick={() => handleNavigateToSection('contact')}
              />

              {/* 10 Contact */}
              <ContactSection lang={lang} />
            </>
          )}
        </main>

        {/* Global Footer */}
        <Footer
          lang={lang}
          onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onToggleLang={toggleLanguage}
        />
      </div>
    </ErrorBoundary>
  );
}
