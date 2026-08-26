import React from 'react';
import { ExternalLink, CheckCircle2, DollarSign, Calendar, TrendingUp, Sparkles, User, FileText, ArrowUpRight, Shield } from 'lucide-react';
import { Project, Language } from '../types';

interface MockupProps {
  project: Project;
  lang: Language;
  interactive?: boolean;
}

export const ProjectBrowserMockup: React.FC<MockupProps> = ({ project, lang }) => {
  return (
    <div className="w-full bg-[#0D0D0D] border border-white/15 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-white/30">
      {/* Browser Top Bar */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#080808] border-b border-white/10 flex items-center justify-between gap-2 sm:gap-4 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>

        {/* URL Pill */}
        <div className="flex-1 max-w-md mx-auto px-3 py-1 bg-white/5 border border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-gray-300 font-mono-tech truncate">
          <span className="truncate flex items-center gap-1.5">
            <span className="text-emerald-400">https://</span>
            <span className="text-white">{project.demoUrl.replace(/^https?:\/\//, '')}</span>
          </span>
          <span className="shrink-0 text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-bold tracking-wider uppercase">
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs text-gray-400">
          <span className="hidden sm:inline font-mono-tech text-[10px] uppercase tracking-widest text-gray-500">
            {project.category[lang]}
          </span>
        </div>
      </div>

      {/* Mockup Screen Content */}
      <div className="p-3 sm:p-5 bg-[#0A0A0A] min-h-[260px] sm:min-h-[320px] flex flex-col justify-between text-left">
        {project.coverImage ? (
          <div className="relative rounded overflow-hidden h-[240px] sm:h-[280px] border border-white/10 bg-black flex items-center justify-center">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex items-end p-4">
              <span className="text-xs font-mono-tech text-white uppercase tracking-wider font-bold">
                {project.name} • {project.category[lang]}
              </span>
            </div>
          </div>
        ) : (
          <>
            {project.slug === 'nexus-crm' && <NexusCrmPreview lang={lang} />}
            {project.slug === 'agendapro' && <AgendaProPreview lang={lang} />}
            {project.slug === 'gestao-financeira-caixa' && <FinancePreview lang={lang} />}
            {project.slug === 'resume-signal' && <ResumeSignalPreview lang={lang} />}
            {project.slug === 'el-bravo-portfolio' && <PortfolioPreview lang={lang} />}
            {!['nexus-crm', 'agendapro', 'gestao-financeira-caixa', 'resume-signal', 'el-bravo-portfolio'].includes(project.slug) && (
              <GenericDynamicPreview project={project} lang={lang} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* --- Generic Dynamic Project Preview for CMS Added Projects --- */
const GenericDynamicPreview: React.FC<{ project: Project; lang: Language }> = ({ project, lang }) => (
  <div className="space-y-3 font-sans flex-1 flex flex-col justify-between">
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px] rounded">
          {project.name.substring(0, 2).toUpperCase()}
        </div>
        <span className="font-semibold text-white tracking-wide">{project.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-indigo-400 font-mono-tech uppercase">
          {project.category[lang]}
        </span>
      </div>
      <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
        ● {project.status.toUpperCase()}
      </span>
    </div>

    <div className="p-4 bg-[#121212] border border-white/10 space-y-2 rounded">
      <div className="text-sm font-bold text-white font-display">{project.tagline[lang]}</div>
      <div className="text-xs text-gray-400 line-clamp-3">{project.description[lang]}</div>
    </div>

    <div className="flex flex-wrap gap-1.5 pt-1">
      {project.stack.slice(0, 5).map((tech, i) => (
        <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono-tech text-gray-300 rounded">
          {tech}
        </span>
      ))}
    </div>
  </div>
);

/* --- 01 Nexus CRM UI Mockup --- */
const NexusCrmPreview: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="space-y-3 font-sans">
    {/* Mini Topbar */}
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
          N
        </div>
        <span className="font-semibold text-white tracking-wide">Nexus CRM</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-indigo-400 font-mono-tech uppercase">
          Enterprise B2B
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono-tech">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Copilot Active
        </span>
      </div>
    </div>

    {/* Metric Cards */}
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Receita / MRR' : 'Revenue / MRR'}
        </div>
        <div className="text-sm sm:text-base font-bold text-white mt-0.5 font-display">R$ 148.500</div>
        <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5 font-mono-tech">
          <TrendingUp className="w-2.5 h-2.5" /> +14.2% {lang === 'pt' ? 'vs mês ant.' : 'vs last mo.'}
        </div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Pipeline Ativo' : 'Active Pipeline'}
        </div>
        <div className="text-sm sm:text-base font-bold text-white mt-0.5 font-display">38 {lang === 'pt' ? 'Negócios' : 'Deals'}</div>
        <div className="text-[10px] text-indigo-400 font-mono-tech">R$ 620.000 {lang === 'pt' ? 'em forecast' : 'in forecast'}</div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Meta Comercial' : 'Sales Target'}
        </div>
        <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 font-display">82%</div>
        <div className="w-full bg-white/10 h-1 mt-1.5 overflow-hidden">
          <div className="bg-emerald-500 h-full w-[82%]" />
        </div>
      </div>
    </div>

    {/* Mini Pipeline Kanban Stages */}
    <div className="pt-1">
      <div className="text-[11px] font-medium text-gray-300 mb-1.5 flex items-center justify-between">
        <span>{lang === 'pt' ? 'Etapas do Pipeline Comercial' : 'Commercial Pipeline Stages'}</span>
        <span className="text-[10px] text-indigo-400 font-mono-tech">4 Deals closing this week</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <div className="p-2 bg-[#121212] border border-white/10 text-[10px]">
          <div className="font-medium text-gray-200 flex justify-between font-mono-tech">
            <span>Leads</span> <span className="text-gray-500">12</span>
          </div>
          <div className="mt-1.5 p-1 bg-white/5 text-gray-300 truncate">TechLog Solutions</div>
        </div>
        <div className="p-2 bg-[#121212] border border-white/10 text-[10px]">
          <div className="font-medium text-gray-200 flex justify-between font-mono-tech">
            <span>{lang === 'pt' ? 'Proposta' : 'Proposal'}</span> <span className="text-gray-500">8</span>
          </div>
          <div className="mt-1.5 p-1 bg-white/5 text-gray-300 truncate">Nexus Health SA</div>
        </div>
        <div className="p-2 bg-[#121212] border border-white/10 text-[10px]">
          <div className="font-medium text-gray-200 flex justify-between font-mono-tech">
            <span>{lang === 'pt' ? 'Negociação' : 'Negotiation'}</span> <span className="text-gray-500">5</span>
          </div>
          <div className="mt-1.5 p-1 bg-white/5 text-gray-300 truncate">Alpha Logística</div>
        </div>
        <div className="p-2 bg-[#121212] border border-emerald-500/40 text-[10px]">
          <div className="font-medium text-emerald-400 flex justify-between font-mono-tech">
            <span>{lang === 'pt' ? 'Fechados' : 'Won'}</span> <span className="text-emerald-400 font-bold">13</span>
          </div>
          <div className="mt-1.5 p-1 bg-emerald-950/40 text-emerald-300 truncate">Vanguard Corp ✓</div>
        </div>
      </div>
    </div>
  </div>
);

/* --- 02 AgendaPro UI Mockup --- */
const AgendaProPreview: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="space-y-3 font-sans">
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
          <Calendar className="w-3 h-3 text-white" />
        </div>
        <span className="font-semibold text-white tracking-wide">AgendaPro SaaS</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-emerald-400 font-mono-tech uppercase">
          Multi-Role RBAC
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <span className="px-1.5 py-0.5 bg-white/5 text-emerald-400 border border-white/10 font-mono-tech">
          {lang === 'pt' ? 'Papel: Dono / Gerente' : 'Role: Owner / Manager'}
        </span>
      </div>
    </div>

    {/* Staff Schedule Grid */}
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 bg-indigo-500/20 text-indigo-300 text-[9px] flex items-center justify-center font-bold font-mono-tech">
            DR
          </div>
          <span className="text-[11px] font-semibold text-white truncate">Dr. Ricardo</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="p-1 bg-white/5 text-emerald-400 border-l-2 border-emerald-500">
            09:00 - {lang === 'pt' ? 'Consulta Geral' : 'Consultation'}
          </div>
          <div className="p-1 bg-white/5 text-indigo-300 border-l-2 border-indigo-500">
            10:30 - {lang === 'pt' ? 'Retorno Clínico' : 'Follow-up'}
          </div>
          <div className="p-1 bg-white/5 text-gray-500">
            11:30 - {lang === 'pt' ? 'Horário Bloqueado' : 'Blocked Slot'}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 bg-emerald-500/20 text-emerald-300 text-[9px] flex items-center justify-center font-bold font-mono-tech">
            CA
          </div>
          <span className="text-[11px] font-semibold text-white truncate">Camila Silva</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="p-1 bg-white/5 text-emerald-400 border-l-2 border-emerald-500">
            09:30 - {lang === 'pt' ? 'Corte & Tratamento' : 'Hair Styling'}
          </div>
          <div className="p-1 bg-white/5 text-emerald-400 border-l-2 border-emerald-500">
            11:00 - {lang === 'pt' ? 'Procedimento' : 'Treatment'}
          </div>
          <div className="p-1 bg-white/5 text-emerald-400 border border-emerald-500/40">
            14:00 - {lang === 'pt' ? 'Agendamento Público' : 'Public Booking'}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 bg-indigo-500/20 text-indigo-300 text-[9px] flex items-center justify-center font-bold font-mono-tech">
            MB
          </div>
          <span className="text-[11px] font-semibold text-white truncate">Marcos Barbeiro</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="p-1 bg-white/5 text-indigo-300 border-l-2 border-indigo-500">
            10:00 - {lang === 'pt' ? 'Barba & Cabelo' : 'Barber & Shave'}
          </div>
          <div className="p-1 bg-white/5 text-emerald-400 border-l-2 border-emerald-500">
            10:45 - {lang === 'pt' ? 'Degradê Premium' : 'Fade Cut'}
          </div>
          <div className="p-1 bg-white/5 text-indigo-300 border-l-2 border-indigo-500">
            11:30 - {lang === 'pt' ? 'Atendimento VIP' : 'VIP Service'}
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Status bar */}
    <div className="p-2 bg-[#121212] border border-white/10 flex items-center justify-between text-[11px]">
      <span className="text-gray-400 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        {lang === 'pt' ? 'Portal de agendamento público ativo' : 'Public booking portal online'}
      </span>
      <span className="text-indigo-400 font-mono-tech text-[10px]">
        {lang === 'pt' ? '18 atendimentos hoje' : '18 bookings today'}
      </span>
    </div>
  </div>
);

/* --- 03 Gestão Financeira UI Mockup --- */
const FinancePreview: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="space-y-3 font-sans">
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-bold text-[10px]">
          $
        </div>
        <span className="font-semibold text-white tracking-wide">
          {lang === 'pt' ? 'Gestão Financeira e Caixa' : 'Cashflow & Finance'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-gray-300 font-mono-tech uppercase">
          PT / EN Supported
        </span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Saldo em Caixa' : 'Cash on Hand'}
        </div>
        <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 font-display">R$ 42.850,00</div>
        <div className="text-[10px] text-gray-500 font-mono-tech">{lang === 'pt' ? 'Saldo líquido' : 'Net balance'}</div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Taxa de Poupança' : 'Savings Rate'}
        </div>
        <div className="text-sm sm:text-base font-bold text-white mt-0.5 font-display">34.8%</div>
        <div className="text-[10px] text-emerald-400 font-mono-tech">{lang === 'pt' ? 'Meta atingida' : 'Target reached'}</div>
      </div>

      <div className="p-2.5 bg-[#121212] border border-white/10">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          {lang === 'pt' ? 'Teto de Gastos' : 'Monthly Cap'}
        </div>
        <div className="text-sm sm:text-base font-bold text-amber-400 mt-0.5 font-display">68% {lang === 'pt' ? 'usado' : 'used'}</div>
        <div className="w-full bg-white/10 h-1 mt-1.5 overflow-hidden">
          <div className="bg-amber-400 h-full w-[68%]" />
        </div>
      </div>
    </div>

    {/* Ledger preview */}
    <div className="p-2 bg-[#121212] border border-white/10 text-[11px] space-y-1.5">
      <div className="flex justify-between text-gray-400 text-[10px] pb-1 border-b border-white/10 font-mono-tech">
        <span>{lang === 'pt' ? 'Últimas Transações' : 'Recent Transactions'}</span>
        <span>CSV Export Ready</span>
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-gray-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {lang === 'pt' ? 'Contrato de Consultoria B2B' : 'B2B Consulting Contract'}
        </span>
        <span className="text-emerald-400 font-mono-tech font-bold">+ R$ 12.500,00</span>
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-gray-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {lang === 'pt' ? 'Servidores & Infra Cloud' : 'Cloud Infrastructure'}
        </span>
        <span className="text-rose-400 font-mono-tech font-bold">- R$ 1.840,00</span>
      </div>
    </div>
  </div>
);

/* --- 04 Resume Signal UI Mockup --- */
const ResumeSignalPreview: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="space-y-3 font-sans">
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-bold text-[10px]">
          <FileText className="w-3 h-3 text-black" />
        </div>
        <span className="font-semibold text-white tracking-wide">Resume Signal</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-gray-300 font-mono-tech uppercase">
          In-Browser Engine
        </span>
      </div>
      <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-tech">
        <Shield className="w-3 h-3" />
        {lang === 'pt' ? '100% Privado' : '100% Private'}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 items-center">
      {/* Score Circle */}
      <div className="p-2.5 bg-[#121212] border border-white/10 flex flex-col items-center justify-center text-center">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono-tech">
          Signal Score
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-display mt-0.5">88 / 100</div>
        <div className="text-[10px] text-gray-400 font-mono-tech">{lang === 'pt' ? 'Alta relevância' : 'High alignment'}</div>
      </div>

      {/* Missing Keywords Box */}
      <div className="col-span-2 p-2.5 bg-[#121212] border border-white/10 text-[10px]">
        <div className="text-gray-400 mb-1.5 font-medium font-mono-tech uppercase tracking-wider text-[9px]">
          {lang === 'pt' ? 'Termos Identificados:' : 'Detected Job Keywords:'}
        </div>
        <div className="flex flex-wrap gap-1 font-mono-tech">
          <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            ✓ TypeScript
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            ✓ Next.js
          </span>
          <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300">
            ! CI/CD
          </span>
          <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300">
            ! Testing
          </span>
        </div>
      </div>
    </div>

    <div className="p-2 bg-[#121212] border border-white/10 text-[10px] text-gray-400 flex items-center justify-between font-mono-tech">
      <span>{lang === 'pt' ? '92% verbos de ação' : '92% action verbs'}</span>
      <span className="text-indigo-400 font-medium">{lang === 'pt' ? 'Zero cadastro' : 'No sign-up'}</span>
    </div>
  </div>
);

/* --- 05 Portfolio Preview --- */
const PortfolioPreview: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="space-y-3 font-sans">
    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-bold text-[10px]">
          EB
        </div>
        <span className="font-semibold text-white tracking-wide">El Bravo Dantas</span>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-gray-300 border border-white/10 font-mono-tech uppercase">
        Future Product Lab
      </span>
    </div>

    <div className="p-3 bg-[#121212] border border-white/10 text-center space-y-1">
      <div className="text-[10px] font-mono-tech text-indigo-400 uppercase tracking-widest">
        ● BUILDING / LEARNING / SHIPPING
      </div>
      <div className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
        I BUILD REAL DIGITAL PRODUCTS.
      </div>
      <div className="text-[11px] text-gray-400">
        {lang === 'pt' ? 'Portfólio com arquitetura modular e cases reais.' : 'Modular architecture portfolio with real testable cases.'}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-tech">
      <div className="p-2 bg-[#121212] border border-white/10 text-gray-300 uppercase tracking-wider">
        5 {lang === 'pt' ? 'Aplicações Reais' : 'Real Applications'}
      </div>
      <div className="p-2 bg-[#121212] border border-white/10 text-emerald-400 uppercase tracking-wider">
        100% {lang === 'pt' ? 'Demos Públicas' : 'Public Demos'}
      </div>
    </div>
  </div>
);
