import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { i18n } from '../data/i18n';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeSection?: string;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeSection = 'hero',
  onNavigateToSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = i18n[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'projects', label: t.projects },
    { id: 'bento', label: lang === 'pt' ? 'Métricas' : 'Metrics' },
    { id: 'process', label: t.process },
    { id: 'about', label: t.about },
    { id: 'skills', label: t.skills },
    { id: 'contact', label: t.contact }
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateToSection(id);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-[#050505]/50 backdrop-blur-sm border-b border-white/5 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleItemClick('hero')}
          className="flex items-center gap-3 sm:gap-4 group text-left cursor-pointer focus:outline-none rounded-none"
          aria-label="El Bravo Dantas - Home"
        >
          <span className="font-display font-black tracking-tighter text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-[#e5e5e5] to-gray-400 group-hover:to-white transition-all">
            EL BRAVO DANTAS
          </span>

          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono-tech tracking-widest uppercase text-emerald-400">
              {lang === 'pt' ? 'BUILDING / LEARNING' : 'BUILDING / LEARNING'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-gray-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`transition-colors cursor-pointer tracking-widest uppercase text-xs ${
                activeSection === item.id
                  ? 'text-white font-bold'
                  : 'hover:text-white text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Group: Language Switcher & Contact Button */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center border-l border-white/20 pl-6 gap-3 text-xs font-mono-tech uppercase tracking-widest">
            <button
              id="lang-toggle-pt"
              onClick={() => lang !== 'pt' && onToggleLang()}
              className={`cursor-pointer transition-colors ${
                lang === 'pt' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              PT
            </button>
            <span className="opacity-30 text-white select-none">|</span>
            <button
              id="lang-toggle-en"
              onClick={() => lang !== 'en' && onToggleLang()}
              className={`cursor-pointer transition-colors ${
                lang === 'en' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Contact CTA */}
          <button
            id="nav-cta-contact-btn"
            onClick={() => handleItemClick('contact')}
            className="border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            <span>{t.contact}</span>
          </button>
        </div>

        {/* Mobile Controls (Lang + Menu Toggle) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-lang-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 text-[11px] font-mono-tech text-gray-300 cursor-pointer"
            aria-label={i18n[lang].nav.langSwitch}
          >
            <span className={lang === 'pt' ? 'text-white font-bold' : 'text-gray-500'}>PT</span>
            <span className="opacity-30">/</span>
            <span className={lang === 'en' ? 'text-white font-bold' : 'text-gray-500'}>EN</span>
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 mt-2"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className="w-full text-left px-4 py-3 text-xs font-mono-tech uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-gray-500 text-xs">→</span>
            </button>
          ))}
          <div className="pt-3 border-t border-white/10">
            <button
              id="mobile-drawer-contact-btn"
              onClick={() => handleItemClick('contact')}
              className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-indigo-500 hover:text-white transition-colors"
            >
              <span>{t.contact}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
