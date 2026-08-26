import React, { useState } from 'react';
import { Github, Linkedin, Copy, Check, ArrowUpRight, Send, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { profileData } from '../data/profile';
import { i18n } from '../data/i18n';

interface ContactProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderSubject, setSenderSubject] = useState('');
  const [senderMessage, setSenderMessage] = useState('');

  const contact = profileData.contact;
  const t = i18n[lang].contact;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(senderSubject || `Contato via Portfolio - ${senderName || 'Visitante'}`);
    const body = encodeURIComponent(`${senderMessage}\n\nDe: ${senderName}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#050505] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          {/* Left Column: Heading, Direct Info & Links */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.tag}
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {t.heading}
            </h2>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {t.subheading}
            </p>

            {/* Email Card with 1-Click Copy */}
            <div className="p-5 bg-[#0A0A0A] border border-white/10 hover:border-white/25 transition-all space-y-3 shadow-2xl">
              <div className="text-xs font-mono-tech text-gray-400 uppercase tracking-widest">
                {t.emailLabel}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-mono-tech text-sm sm:text-base text-white font-medium truncate">
                  {contact.email}
                </span>

                <button
                  id="contact-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-xs text-gray-300 font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copiedEmail : t.copyEmail}</span>
                </button>
              </div>
            </div>

            {/* Social & External Profiles */}
            <div className="flex flex-wrap items-center gap-3">
              {contact.github && (
                <a
                  id="contact-github-link"
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 hover:border-white/30 text-xs font-mono-tech text-gray-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4 text-indigo-400" />
                  <span>{t.githubLabel}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </a>
              )}

              {contact.linkedin && (
                <a
                  id="contact-linkedin-link"
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 hover:border-white/30 text-xs font-mono-tech text-gray-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4 text-indigo-400" />
                  <span>{t.linkedinLabel}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Direct Message Launcher Form */}
          <div className="lg:col-span-6">
            <form
              id="contact-direct-form"
              onSubmit={handleDirectEmail}
              className="p-6 sm:p-8 bg-[#0A0A0A] border border-white/10 space-y-4 shadow-2xl"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">
                  {lang === 'pt' ? 'Enviar Mensagem Direta' : 'Send a Direct Message'}
                </h3>
                <p className="text-xs text-gray-400">
                  {lang === 'pt' 
                    ? 'Preencha os campos para abrir seu cliente de e-mail pronto para envio.' 
                    : 'Fill in the fields to launch your preferred mail client instantly.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono-tech text-gray-400 uppercase tracking-wide" htmlFor="sender-name">
                  {lang === 'pt' ? 'Seu Nome ou Empresa' : 'Your Name or Company'}
                </label>
                <input
                  id="sender-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={lang === 'pt' ? 'Ex: Carlos Silva' : 'e.g. Alex Johnson'}
                  className="w-full px-4 py-2.5 bg-[#141414] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono-tech text-gray-400 uppercase tracking-wide" htmlFor="sender-subject">
                  {lang === 'pt' ? 'Assunto' : 'Subject'}
                </label>
                <input
                  id="sender-subject"
                  type="text"
                  value={senderSubject}
                  onChange={(e) => setSenderSubject(e.target.value)}
                  placeholder={lang === 'pt' ? 'Ex: Proposta de Projeto / Oportunidade' : 'e.g. Project Inquiry / Opportunity'}
                  className="w-full px-4 py-2.5 bg-[#141414] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono-tech text-gray-400 uppercase tracking-wide" htmlFor="sender-message">
                  {lang === 'pt' ? 'Mensagem' : 'Message'}
                </label>
                <textarea
                  id="sender-message"
                  rows={4}
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  placeholder={lang === 'pt' ? 'Olá El Bravo, vi seus projetos e gostaria de conversar sobre...' : 'Hi El Bravo, I checked your live projects and would like to connect regarding...'}
                  className="w-full px-4 py-2.5 bg-[#141414] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full py-3.5 bg-white text-black hover:bg-indigo-500 hover:text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendEmail}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
