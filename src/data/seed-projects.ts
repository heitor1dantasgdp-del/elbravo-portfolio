import { Project } from '../types';

/**
 * Seed projects data used during initial staging or when Supabase is unconfigured / in fallback mode.
 * Real production data should be persisted to Supabase PostgreSQL with Row-Level Security.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: "proj_nexus_crm",
    slug: "nexus-crm",
    orderNumber: "01",
    displayOrder: 1,
    name: "Nexus CRM",
    category: {
      pt: "CRM SaaS / B2B",
      en: "CRM SaaS / B2B"
    },
    status: "building",
    statusNote: {
      pt: "Em desenvolvimento ativo & testes de funcionalidades",
      en: "In active development & functional testing"
    },
    tagline: {
      pt: "Plataforma CRM B2B multiempresa para gestão de pipeline, vendas e automações.",
      en: "Multi-company B2B CRM platform for commercial pipeline management, leads, and sales."
    },
    description: {
      pt: "Aplicação CRM B2B multiempresa em desenvolvimento, focada em gestão comercial estruturada, visibilidade de pipeline e acompanhamento de receita.",
      en: "Multi-company B2B CRM application currently under development, focused on structured sales pipeline management, deals, and revenue tracking."
    },
    demoUrl: "https://crmpro-bay.vercel.app/login?next=%2Fdashboard",
    repositoryUrl: null,
    featured: true,
    published: true,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-02-20T14:30:00.000Z",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Dashboard Analytics",
      "Multi-tenant SaaS Architecture"
    ],
    lastUpdated: "2026",
    demoCredentials: {
      showDemoCredentials: true,
      email: "demo@nexuscrm.com",
      password: "DemoUser2026!",
      role: "Sales Director / Multi-tenant",
      notes: {
        pt: "Ambiente de demonstração para testes de navegação e fluxos comerciais. Dados podem ser restaurados periodicamente.",
        en: "Demonstration environment for testing navigation and sales flows. Data may be reset periodically."
      }
    },
    caseStudy: {
      problem: {
        pt: "Muitas equipes comerciais de pequenas e médias empresas perdem negócios por falta de visibilidade centralizada sobre leads, etapas de negociação e previsões de receita (forecast). Planilhas dispersas geram desencontro de informações e esquecimento de tarefas críticas.",
        en: "Small and medium commercial teams frequently lose deals due to fragmented visibility over leads, deal stages, and revenue forecasts. Scattered spreadsheets cause friction, miscommunication, and missed follow-ups."
      },
      idea: {
        pt: "Construir uma plataforma SaaS com arquitetura multiempresa rápida, limpa e com interface intuitiva para centralizar o ciclo de vida completo de cada oportunidade de venda.",
        en: "Build a fast, clean multi-company SaaS platform with an intuitive UI to centralize the complete lifecycle of every sales opportunity."
      },
      solution: {
        pt: "Desenvolvi uma interface orientada a painéis e pipelines visuais com dashboards executivos em tempo real, gestão organizada de contatos e empresas, acompanhamento de metas e suporte a recursos inteligentes de assistência.",
        en: "I engineered a dashboard-driven visual pipeline interface featuring real-time executive analytics, structured company/contact management, goal tracking, and intelligent workflow assistants."
      },
      features: [
        {
          title: { pt: "Autenticação & Controle de Acesso", en: "Authentication & Access Control" },
          desc: { pt: "Fluxo de login seguro e redirecionamento dinâmico para dashboard por perfil.", en: "Secure login flow with dynamic role-based dashboard redirects." }
        },
        {
          title: { pt: "Dashboard Executivo & Forecast", en: "Executive Dashboard & Forecast" },
          desc: { pt: "Indicadores em tempo real de receita, metas comerciais, volume de negócios e gráficos comparativos.", en: "Real-time metrics for revenue, sales goals, deal volumes, and comparative charts." }
        },
        {
          title: { pt: "Pipeline Comercial & Negócios", en: "Sales Pipeline & Deals" },
          desc: { pt: "Acompanhamento visual de oportunidades em cada estágio do funil comercial.", en: "Visual stage tracking for commercial opportunities across the entire sales funnel." }
        },
        {
          title: { pt: "Leads, Contatos & Empresas", en: "Leads, Contacts & Companies" },
          desc: { pt: "Estruturação detalhada de dados de clientes, histórico de interações e carteiras.", en: "Structured customer profiles, interaction logs, and portfolio organization." }
        },
        {
          title: { pt: "Tarefas, Agenda & Propostas", en: "Tasks, Calendar & Proposals" },
          desc: { pt: "Organização diária de compromissos comerciais, follow-ups e emissão de propostas com produtos.", en: "Daily scheduling for commercial follow-ups and product proposal generation." }
        },
        {
          title: { pt: "Relatórios & Recursos de Copilot / IA", en: "Reports & Copilot / AI Tools" },
          desc: { pt: "Geração de relatórios gerenciais e recursos de assistência e automações comerciais.", en: "Management reporting alongside workflow assistants and automated sales triggers." }
        }
      ],
      learning: {
        pt: "Aprofundamento na arquitetura de estados complexos em dashboards corporativos, estruturação de fluxos multiempresa e desenho de interfaces densas em dados que mantêm alta legibilidade.",
        en: "Deep dive into complex state management for enterprise dashboards, multi-tenant UI hierarchy, and designing dense data views that remain readable and responsive."
      },
      challenges: {
        pt: "Organizar dezenas de módulos interdependentes (leads, propostas, agenda, forecast) sem sobrecarregar a experiência do usuário ou comprometer o desempenho visual.",
        en: "Organizing dozens of interdependent modules (leads, quotes, calendar, forecast) without cluttering UX or degrading rendering performance."
      },
      limitations: {
        pt: "Aplicação em fase de desenvolvimento e testes. Algumas automações e regras avançadas de comissionamento estão em refinamento.",
        en: "Application is in active development and testing. Certain advanced automation rules and commission calculations are being refined."
      },
      nextSteps: {
        pt: "Otimizar filtros avançados de busca no pipeline, ampliar testes de carga com múltiplos registros e aprimorar integração de exportação de dados.",
        en: "Optimize advanced search filters across pipelines, conduct multi-record stress tests, and expand data export capabilities."
      }
    },
    screenshots: [
      {
        id: "nexus-main",
        title: { pt: "Dashboard Executivo", en: "Executive Dashboard" },
        description: { pt: "Visão consolidada de receita, forecast e métricas de conversão.", en: "Consolidated view of revenue, forecast, and conversion rates." },
        type: "desktop",
        previewType: "nexus",
        displayOrder: 1
      },
      {
        id: "nexus-pipeline",
        title: { pt: "Pipeline Comercial", en: "Sales Pipeline" },
        description: { pt: "Gestão visual de negócios divididos por etapas de fechamento.", en: "Visual deal tracking grouped by closing stages." },
        type: "desktop",
        previewType: "nexus",
        displayOrder: 2
      }
    ]
  },
  {
    id: "proj_agendapro",
    slug: "agendapro",
    orderNumber: "02",
    displayOrder: 2,
    name: "AgendaPro",
    category: {
      pt: "Scheduling SaaS",
      en: "Scheduling SaaS"
    },
    status: "building",
    statusNote: {
      pt: "Em desenvolvimento & testes com fluxos de serviços",
      en: "In development & testing service business flows"
    },
    tagline: {
      pt: "Sistema SaaS de gestão de agendamentos para barbearias, salões, clínicas e autônomos.",
      en: "SaaS appointment and scheduling platform for service businesses, salons, clinics, and freelancers."
    },
    description: {
      pt: "Sistema SaaS de gestão de agendamentos projetado especificamente para prestadores de serviços, com suporte a múltiplos profissionais, agendamento público e controle de permissões por papéis.",
      en: "SaaS scheduling management system designed for service businesses, supporting multi-staff rosters, public booking portals, and multi-role permission controls."
    },
    demoUrl: "https://agendapro-lime.vercel.app/",
    repositoryUrl: null,
    featured: true,
    published: true,
    createdAt: "2026-01-20T10:00:00.000Z",
    updatedAt: "2026-02-22T11:00:00.000Z",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Role-Based Access Control",
      "Calendar Scheduling Engine"
    ],
    lastUpdated: "2026",
    demoCredentials: {
      showDemoCredentials: true,
      email: "gestor@agendapro.com",
      password: "DemoAgenda2026!",
      role: "Dono / Gerente / Profissional",
      notes: {
        pt: "Permite simular alternância entre os papéis de Dono, Gerente e Profissional para avaliar permissões.",
        en: "Allows testing permission boundaries between Owner, Manager, and Staff roles."
      }
    },
    caseStudy: {
      problem: {
        pt: "Profissionais de serviços (barbeiros, terapeutas, esteticistas) sofrem com no-shows, mensagens manuais no WhatsApp para marcar horários e conflitos constantes de agenda entre profissionais da mesma equipe.",
        en: "Service professionals (barbers, therapists, clinicians) lose hours daily managing manual WhatsApp bookings, suffering no-shows and double-booking conflicts across their staff."
      },
      idea: {
        pt: "Criar uma solução integrada que una painel de controle operacional para a equipe com uma página de agendamento público rápida e responsiva para o cliente final.",
        en: "Build an integrated platform combining an operational staff scheduling dashboard with a frictionless public booking link for clients."
      },
      solution: {
        pt: "Desenvolvi um sistema completo com suporte a 3 papéis (Dono, Gerente, Profissional), controle individual de horários e bloqueios, catálogo de serviços com durações personalizadas e relatórios de fluxo de clientes.",
        en: "Engineered a comprehensive SaaS featuring 3 operational roles (Owner, Manager, Staff), individual working hours & blockout slots, custom service durations, and customer traffic reports."
      },
      features: [
        {
          title: { pt: "Simulação de Papéis Operacionais", en: "Multi-Role Simulation" },
          desc: { pt: "Perfis distintos para Dono (visão total), Gerente (gestão operacional) e Profissional (sua própria agenda).", en: "Tailored views for Owner (full control), Manager (staff operations), and Professional (individual agenda)." }
        },
        {
          title: { pt: "Agenda & Grade de Horários", en: "Calendar & Schedule Matrix" },
          desc: { pt: "Visualização diária/semanal de compromissos com suporte a bloqueios de intervalo e folgas.", en: "Daily and weekly appointment grids with interval blocks and time-off support." }
        },
        {
          title: { pt: "Gestão de Clientes & Histórico", en: "Client Profiles & History" },
          desc: { pt: "Cadastro completo com registros de atendimentos anteriores e preferências de serviço.", en: "Client registry with past appointment records and preferred service notes." }
        },
        {
          title: { pt: "Página de Agendamento Público", en: "Public Booking Page" },
          desc: { pt: "Interface limpa para clientes agendarem serviços diretamente sem necessidade de criar conta complexa.", en: "Sleek customer portal for booking services directly without friction." }
        },
        {
          title: { pt: "Serviços, Preços & Durações", en: "Services, Pricing & Durations" },
          desc: { pt: "Configuração detalhada de catálogo com preços e tempo de execução por especialidade.", en: "Catalog configuration with custom pricing and duration per staff member." }
        },
        {
          title: { pt: "Relatórios & Gestão de Assinatura", en: "Reports & Subscription Management" },
          desc: { pt: "Métricas de atendimentos realizados e estrutura de planos para negócios em crescimento.", en: "Completed appointment metrics and plan tiers for scaling service businesses." }
        }
      ],
      roles: [
        { pt: "Dono: Acesso irrestrito a faturamento, equipe e configurações da empresa", en: "Owner: Unrestricted access to revenue, team, and company settings" },
        { pt: "Gerente: Gestão da grade de profissionais, clientes e relatórios operacionais", en: "Manager: Schedule management, client records, and operational reports" },
        { pt: "Profissional: Visualização de sua própria agenda, status e clientes designados", en: "Professional: Personal schedule view, status updates, and assigned clients" }
      ],
      learning: {
        pt: "Modelagem de dados temporais e prevenção de colisões de horários em grades de profissionais paralelos, além de estruturação de controle de acesso baseado em papéis (RBAC).",
        en: "Temporal data modeling, collision prevention in multi-staff schedules, and structuring role-based access control (RBAC)."
      },
      challenges: {
        pt: "Garantir que a experiência de agendamento público seja extremamente fluida em smartphones simples com conexões móveis variáveis.",
        en: "Ensuring the public booking interface remains exceptionally lightweight on mobile devices with variable network speeds."
      },
      limitations: {
        pt: "Em fase de testes operacionais. Sistema de notificações automatizadas via webhook/SMS em fase de validação.",
        en: "In operational testing. Automated webhook/SMS notification pipelines are currently undergoing validation."
      },
      nextSteps: {
        pt: "Adicionar lembretes automáticos de confirmação e integração com calendários externos (Google Calendar).",
        en: "Implement automated appointment reminders and external Google Calendar synchronization."
      }
    },
    screenshots: [
      {
        id: "agenda-main",
        title: { pt: "Painel de Agendamentos", en: "Staff Booking Board" },
        description: { pt: "Grade visual de horários por profissional e status de atendimento.", en: "Visual schedule grid by professional and attendance status." },
        type: "desktop",
        previewType: "agenda",
        displayOrder: 1
      }
    ]
  },
  {
    id: "proj_gestao_financeira",
    slug: "gestao-financeira-caixa",
    orderNumber: "03",
    displayOrder: 3,
    name: "Gestão Financeira e Caixa",
    category: {
      pt: "Finance Dashboard",
      en: "Finance Dashboard"
    },
    status: "testing",
    statusNote: {
      pt: "Em testes práticos de cálculo e usabilidade",
      en: "In testing for calculation precision and usability"
    },
    tagline: {
      pt: "Painel financeiro para controle de entradas, saídas, taxa de poupança e fluxo de caixa.",
      en: "Financial control dashboard for tracking income, expenses, savings rate, and cash flow."
    },
    description: {
      pt: "Painel financeiro interativo para controle de fluxo de caixa pessoal ou de microempresas, com cálculo automático de taxa de poupança, limites de orçamento e suporte bilíngue PT/EN.",
      en: "Interactive financial dashboard for micro-business or personal cashflow management, with automated savings rate calculation, budget limits, and bilingual PT/EN support."
    },
    demoUrl: "https://gestao-financeira-caixa.vercel.app/",
    repositoryUrl: null,
    featured: true,
    published: true,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-23T09:00:00.000Z",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Data Visualization",
      "CSV Export Engine",
      "Bilingual (PT/EN)"
    ],
    lastUpdated: "2026",
    demoCredentials: {
      showDemoCredentials: false,
      notes: {
        pt: "Acesso direto sem necessidade de credenciais. Os dados são manipulados na sessão para teste interativo.",
        en: "Direct access with no credentials needed. Data operates interactively within session state."
      }
    },
    caseStudy: {
      problem: {
        pt: "A maioria das planilhas de finanças é complexa demais para preenchimento diário ou carece de visualização imediata da saúde do caixa e da proporção real poupada ao final do mês.",
        en: "Most personal finance spreadsheets are either too tedious for daily entry or lack immediate visual clarity on cash reserves and monthly savings proportions."
      },
      idea: {
        pt: "Construir uma ferramenta leve, instantânea e de alto contraste visual onde cada lançamento atualiza imediatamente o saldo em caixa, gráficos de categorias e métricas essenciais.",
        en: "Build a lightweight, high-contrast dashboard where every recorded transaction instantly recalculates cash on hand, category breakdowns, and key health indicators."
      },
      solution: {
        pt: "Criei um dashboard focado em clareza numérica absoluta: cards de resumo com entradas, saídas e saldo, cálculo automático de taxa de poupança, histórico detalhado, controle de teto orçamentário e exportação em CSV.",
        en: "Created a dashboard focused on numerical clarity: income/expense/balance metric cards, automated savings rate metrics, transaction history, budget caps, and CSV export."
      },
      features: [
        {
          title: { pt: "Dashboard Financeiro em Tempo Real", en: "Real-time Financial Dashboard" },
          desc: { pt: "Visualização imediata de entradas, saídas consolidadas e saldo disponível em caixa.", en: "Instant overview of income, total expenses, and net cash reserve." }
        },
        {
          title: { pt: "Cálculo de Taxa de Poupança", en: "Savings Rate Calculator" },
          desc: { pt: "Métrica percentual automática indicando a eficiência de retenção de capital no período.", en: "Automated percentage metric showing capital retention efficiency for the period." }
        },
        {
          title: { pt: "Orçamento & Limites Mensais", en: "Budget Limits & Alerts" },
          desc: { pt: "Definição de tetos de gastos com avisos visuais de aproximação do limite.", en: "Configurable spending caps with visual warnings upon nearing budget limits." }
        },
        {
          title: { pt: "Histórico Completo de Transações", en: "Full Transaction Ledger" },
          desc: { pt: "Registro categorizado com filtros de data, tipo de operação e descrição.", en: "Categorized transaction list with date, operation type, and search filters." }
        },
        {
          title: { pt: "Gráficos & Análise de Insights", en: "Charts & Spending Insights" },
          desc: { pt: "Distribuição visual de despesas para rápida identificação de maiores centros de custo.", en: "Visual expense distribution for immediate identification of major cost drivers." }
        },
        {
          title: { pt: "Exportação CSV & Interface PT/EN", en: "CSV Export & PT/EN UI" },
          desc: { pt: "Exportação dos dados para planilhas externas e seletor completo de idioma integrado.", en: "One-click CSV ledger export and integrated bilingual language switcher." }
        }
      ],
      learning: {
        pt: "Aprimoramento no manuseio de cálculos monetários sem erros de ponto flutuante, renderização otimizada de tabelas de lançamentos e técnicas de visualização de dados acessíveis.",
        en: "Deepened knowledge in reliable currency arithmetic without floating-point errors, performant ledger rendering, and accessible chart styling."
      },
      challenges: {
        pt: "Manter a interface responsiva e fácil de usar no celular com inputs rápidos para lançamentos em poucos toques.",
        en: "Keeping the UI crisp and effortless on mobile screens with streamlined inputs for fast transaction logging on the go."
      },
      limitations: {
        pt: "Atualmente focado em armazenamento local na sessão/navegador para máxima privacidade. Não possui conexão bancária automática (Open Finance).",
        en: "Currently operates with client-side local session persistence for privacy. Does not include automated Open Banking feeds."
      },
      nextSteps: {
        pt: "Adicionar categorização por tags personalizadas e projeções financeiras para os próximos meses.",
        en: "Add custom tag categories and forward-looking financial forecasting for upcoming months."
      }
    },
    screenshots: [
      {
        id: "finance-main",
        title: { pt: "Visão Geral de Caixa", en: "Cash Flow Overview" },
        description: { pt: "Cards de saldo, taxa de poupança e demonstrativo de receitas e despesas.", en: "Balance cards, savings rate, and income vs expense breakdown." },
        type: "desktop",
        previewType: "finance",
        displayOrder: 1
      }
    ]
  },
  {
    id: "proj_resume_signal",
    slug: "resume-signal",
    orderNumber: "04",
    displayOrder: 4,
    name: "Resume Signal",
    category: {
      pt: "Career Tool",
      en: "Career Tool"
    },
    status: "beta",
    statusNote: {
      pt: "Protótipo funcional / Beta para testes com candidatos",
      en: "Functional prototype / Beta testing with real job applications"
    },
    tagline: {
      pt: "Ferramenta web para comparar currículo com descrição de vaga e aumentar relevância.",
      en: "Web tool to analyze and match resumes against job descriptions with privacy-first processing."
    },
    description: {
      pt: "Ferramenta web para comparar o texto do currículo com os requisitos da vaga, gerando pontuação de relevância (Resume Signal 0–100), termos ausentes e sugestões de impacto com processamento no navegador.",
      en: "Web utility that evaluates resume text against specific job descriptions, generating a relevance score (Resume Signal 0–100), missing keywords, and structural feedback entirely in-browser."
    },
    demoUrl: "https://resume-signal-rho.vercel.app/",
    repositoryUrl: null,
    featured: true,
    published: true,
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-24T16:00:00.000Z",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "In-Browser Text Analysis",
      "Privacy-First Architecture",
      "Zero-Account Friction"
    ],
    lastUpdated: "2026",
    demoCredentials: {
      showDemoCredentials: false,
      notes: {
        pt: "Acesso imediato sem login ou criação de conta. Nenhum dado de currículo é enviado a servidores externos nesta versão.",
        en: "Instant access with no account needed. Resume content is analyzed directly in your browser."
      }
    },
    caseStudy: {
      problem: {
        pt: "Candidatos frequentemente enviam currículos genéricos que não contêm as palavras-chave e termos técnicos específicos descritos no anúncio da vaga, resultando em rejeição precoce por sistemas de triagem.",
        en: "Job applicants often submit generic resumes lacking the exact technical terminology and keywords requested in job descriptions, leading to automated filtering rejections."
      },
      idea: {
        pt: "Criar uma ferramenta de diagnóstico instantâneo, sem fricção de cadastro e 100% orientada à privacidade, onde o candidato cola o currículo e a vaga para receber feedback pontual.",
        en: "Build a friction-free, privacy-first diagnostic tool where applicants paste their resume and job posting to receive instant, actionable matching feedback."
      },
      solution: {
        pt: "Desenvolvi um analisador com pontuação de 0 a 100 (Resume Signal), detector de termos ausentes, análise de verbos de impacto e checklist de próximos passos, com todo o processamento realizado localmente no navegador.",
        en: "Developed an in-browser analyzer generating a 0–100 Resume Signal score, missing keyword identifier, impact verb checker, and recommended next action steps."
      },
      features: [
        {
          title: { pt: "Métrica Resume Signal (0–100)", en: "Resume Signal Metric (0–100)" },
          desc: { pt: "Pontuação global consolidada avaliando a aderência do currículo aos requisitos da vaga.", en: "Consolidated score assessing how closely the resume matches job requirements." }
        },
        {
          title: { pt: "Identificação de Palavras-Chave Ausentes", en: "Missing Keyword Matching" },
          desc: { pt: "Detecção automática de competências e tecnologias exigidas na vaga que não foram citadas.", en: "Automated extraction of requested technical skills absent from the resume." }
        },
        {
          title: { pt: "Análise de Linguagem de Impacto", en: "Impact Language & Verbs" },
          desc: { pt: "Verificação de verbos de ação e clareza de resultados em comparação com termos passivos.", en: "Evaluation of active impact verbs versus vague or passive phrasing." }
        },
        {
          title: { pt: "Análise de Estrutura & Seções", en: "Structure & Section Check" },
          desc: { pt: "Avaliação da organização visual de tópicos como resumo, experiência e habilidades.", en: "Assessment of structural section balance (summary, skills, track record)." }
        },
        {
          title: { pt: "Recomendações de Próximos Passos", en: "Actionable Next Steps" },
          desc: { pt: "Guia prático de ajustes imediatos para aumentar a compatibilidade com a vaga.", en: "Concrete step-by-step suggestions to boost alignment prior to application." }
        },
        {
          title: { pt: "Privacidade Total & Sem Cadastro", en: "100% Private & No Sign-up" },
          desc: { pt: "Processamento realizado no próprio navegador sem envio do texto para bancos de dados externos.", en: "Processed locally inside the client browser without sending personal data to external databases." }
        }
      ],
      learning: {
        pt: "Implementação de algoritmos de processamento de texto e tokenização no lado do cliente, manipulação eficiente de strings e design de interfaces focadas em utilidade prática imediata.",
        en: "Client-side string tokenization and frequency analysis algorithms, stateful UX for comparative text inputs, and utility-first UI design."
      },
      challenges: {
        pt: "Filtrar stopwords e termos irrelevantes para que a lista de palavras-chave ausentes seja precisa e relevante para o usuário.",
        en: "Filtering stopwords and irrelevant noise so that missing keyword suggestions remain genuinely valuable."
      },
      limitations: {
        pt: "Análise baseada em correspondência de termos e estrutura no navegador; não substitui o julgamento contextual humano em cargos executivos altamente especializados.",
        en: "Relies on in-browser keyword and structural heuristics; intended as a supportive prep tool rather than automated hiring replacement."
      },
      nextSteps: {
        pt: "Adicionar suporte a upload de arquivos PDF e exportação de relatório comparativo.",
        en: "Add native PDF document parsing and downloadable comparison reports."
      }
    },
    screenshots: [
      {
        id: "resume-main",
        title: { pt: "Analisador de Compatibilidade", en: "Compatibility Analyzer" },
        description: { pt: "Comparação lado a lado com medidor de sinal e palavras-chave ausentes.", en: "Side-by-side comparison with signal gauge and missing keywords." },
        type: "desktop",
        previewType: "resume",
        displayOrder: 1
      }
    ]
  },
  {
    id: "proj_el_bravo_portfolio",
    slug: "el-bravo-portfolio",
    orderNumber: "05",
    displayOrder: 5,
    name: "El Bravo Dantas Portfolio",
    category: {
      pt: "Personal Portfolio / Frontend",
      en: "Personal Portfolio / Frontend"
    },
    status: "released",
    statusNote: {
      pt: "Publicado na Vercel & em evolução contínua",
      en: "Released on Vercel & continuously improved"
    },
    tagline: {
      pt: "Portfólio interativo com estética Future Product Lab, arquitetura modular e cases reais.",
      en: "Interactive developer portfolio with Future Product Lab aesthetics, modular data architecture, and real cases."
    },
    description: {
      pt: "O próprio portfólio que você está navegando foi projetado e construído do zero como um produto digital independente, com arquitetura bilíngue (PT/EN), design system escuro e vitrine de projetos reais.",
      en: "The very portfolio you are browsing was designed and engineered from the ground up as a standalone product, featuring bilingual PT/EN support, deep dark mode tokens, and real case studies."
    },
    demoUrl: "https://elbravodantas.com.br",
    repositoryUrl: null,
    featured: false,
    published: true,
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-26T08:00:00.000Z",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion Animations",
      "Bilingual Architecture (PT/EN)",
      "Vercel Deployment"
    ],
    lastUpdated: "2026",
    caseStudy: {
      problem: {
        pt: "Portfólios tradicionais de desenvolvedores costumam usar templates genéricos, barras de habilidades falsas em porcentagem e declarações exageradas de senioridade sem apresentar aplicações reais testáveis.",
        en: "Traditional developer portfolios often rely on cookie-cutter templates, fabricated percentage skill bars, and inflated seniority claims without providing testable real-world software."
      },
      idea: {
        pt: "Criar uma experiência com estética 'Future Product Lab' que transmita transparência, foco em construção real e capacidade prática de arquitetar interfaces digitais sofisticadas.",
        en: "Create a 'Future Product Lab' digital showcase conveying complete transparency, genuine craftsmanship, and the concrete ability to engineer polished web products."
      },
      solution: {
        pt: "Estruturei uma arquitetura desacoplada onde todo o conteúdo é alimentado por módulos tipados, com navegação suave, seletor de idiomas instantâneo e demonstrações interativas dos projetos.",
        en: "Engineered a decoupled architecture where all content flows from strongly typed data files, with seamless navigation, instant language toggles, and live interactive project previews."
      },
      features: [
        {
          title: { pt: "Arquitetura Modular Tipada", en: "Typed Modular Architecture" },
          desc: { pt: "Separação total entre dados e componentes para inclusão ágil de novos projetos no futuro.", en: "Decoupled data files ensuring effortless addition of future projects without UI rewrites." }
        },
        {
          title: { pt: "Internacionalização PT-BR / EN", en: "PT-BR / EN Internationalization" },
          desc: { pt: "Suporte completo a tradução sem acoplamento de strings hardcoded na interface.", en: "Comprehensive bilingual localization with seamless in-memory and persisted toggles." }
        },
        {
          title: { pt: "Estética Future Product Lab", en: "Future Product Lab Aesthetic" },
          desc: { pt: "Tema escuro refinado com microinterações, bordas sutis e tipografia moderna sem clichês.", en: "Refined dark obsidian palette with subtle ambient glows, crisp badges, and modern typography." }
        },
        {
          title: { pt: "Páginas de Case Studies", en: "Dedicated Case Study Views" },
          desc: { pt: "Apresentação honesta de problemas, soluções, aprendizados reais e limitações conhecidas.", en: "Honest breakdowns of real problems, solutions, authentic learnings, and known limitations." }
        }
      ],
      learning: {
        pt: "Planejamento de design system escalável, aplicação de microinterações com Framer Motion sem perda de performance e otimização para Core Web Vitals.",
        en: "Scalable design system tokens, performant motion choreography, and fine-tuning for Core Web Vitals and accessible contrast."
      },
      challenges: {
        pt: "Equilibrar um visual futurista e memorável mantendo sobriedade profissional e máxima velocidade de carregamento em redes móveis.",
        en: "Balancing a memorable futuristic aesthetic with professional restraint and rapid mobile loading performance."
      },
      limitations: {
        pt: "Nesta versão inicial os dados residem em arquivos TypeScript locais (preparado para futura migração para CMS/Admin se necessário).",
        en: "Data currently lives in structured TypeScript files (architected for future headless CMS migration)."
      },
      nextSteps: {
        pt: "Adicionar novos projetos conforme forem lançados e expandir a galeria de métricas de testes.",
        en: "Add upcoming projects as they are published and expand automated test reporting."
      }
    },
    screenshots: [
      {
        id: "portfolio-hero",
        title: { pt: "Hero & Identidade Visual", en: "Hero & Brand Identity" },
        description: { pt: "Composição editorial com foco em tipografia e profundidade de produto.", en: "Editorial layout centered around typography and product depth." },
        type: "desktop",
        previewType: "portfolio",
        displayOrder: 1
      }
    ]
  }
];
