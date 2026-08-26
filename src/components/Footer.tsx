import React from 'react';
import { ArrowUp, Github, Linkedin, Terminal, Globe } from 'lucide-react';
import { Language } from '../types';
import { profileData } from '../data/profile';
import { i18n } from '../data/i18n';

interface FooterProps {
  lang: Language;
  onScrollToTop: () => void;
  onToggleLang: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onScrollToTop, onToggleLang }) => {
  const currentYear = new Date().getFullYear();
  const t = i18n[lang].footer;
  const contact = profileData.contact;

  return (
    <footer id="footer" className="py-12 bg-[#020202] border-t border-white/10 text-xs text-gray-500 font-mono-tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 border border-white/20 flex items-center justify-center font-display font-bold text-white text-xs">
              EB
            </div>
            <span className="font-semibold text-gray-200 uppercase tracking-wider">EL BRAVO DANTAS</span>
            <span className="text-gray-600">|</span>
            <span className="text-indigo-400 font-bold uppercase tracking-widest">{t.portfolioTag}</span>
          </div>

          {/* Social and Language switches */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleLang}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-widest"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'pt' ? 'PT-BR' : 'EN-US'}</span>
            </button>

            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            <button
              id="footer-back-to-top"
              onClick={onScrollToTop}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-widest"
              title={t.backToTop}
            >
              <span>{t.backToTop}</span>
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px]">
          <div>
            <span className="text-gray-300 font-bold tracking-widest uppercase">
              {t.builtBy}
            </span>
            <p className="text-gray-500 mt-0.5">
              {t.portfolioJourney}
            </p>
          </div>

          <div className="text-gray-600">
            © {currentYear} {t.domain} • {t.allRights}
          </div>
        </div>

      </div>
    </footer>
  );
};
