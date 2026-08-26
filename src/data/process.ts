import { BuildProcessStep } from '../types';

export const buildProcessSteps: BuildProcessStep[] = [
  {
    step: "IDEA",
    number: "01",
    title: {
      pt: "IDEIA",
      en: "IDEA"
    },
    desc: {
      pt: "Identificação de problemas reais e oportunidades de utilidade prática.",
      en: "Identifying real-world friction and practical digital product opportunities."
    },
    details: {
      pt: "Mapeamento das dores do usuário, público-alvo e proposição de valor antes de escrever código.",
      en: "Mapping user pain points, target personas, and value proposition prior to coding."
    }
  },
  {
    step: "PLAN",
    number: "02",
    title: {
      pt: "PLANEJAMENTO",
      en: "PLAN"
    },
    desc: {
      pt: "Estruturação de dados, jornadas de usuário e arquitetura de componentes.",
      en: "Data structure modeling, user journeys, and component architecture."
    },
    details: {
      pt: "Definição do escopo, requisitos essenciais (MVP) e layout inicial focado em usabilidade.",
      en: "Scoping core MVP requirements, data contracts, and high-clarity layouts."
    }
  },
  {
    step: "BUILD",
    number: "03",
    title: {
      pt: "CONSTRUÇÃO",
      en: "BUILD"
    },
    desc: {
      pt: "Desenvolvimento com código limpo, TypeScript estrito e design responsivo.",
      en: "Engineering with clean code, strict TypeScript, and responsive mobile-first UI."
    },
    details: {
      pt: "Construção de componentes modulares, integração de fluxos e controle de estados.",
      en: "Building modular components, wiring interactive states, and handling edge cases."
    }
  },
  {
    step: "TEST",
    number: "04",
    title: {
      pt: "TESTES",
      en: "TEST"
    },
    desc: {
      pt: "Validação rigorosa de navegação, responsividade e casos de borda.",
      en: "Rigorous verification across devices, resolutions, and user edge cases."
    },
    details: {
      pt: "Inspeção visual em celular e desktop, verificação de formulários e tratamento de erros.",
      en: "Cross-device manual checks, form validation testing, and resilient error states."
    }
  },
  {
    step: "SHIP",
    number: "05",
    title: {
      pt: "PUBLICAÇÃO",
      en: "SHIP"
    },
    desc: {
      pt: "Deploy de versões funcionais em produção na nuvem (Vercel).",
      en: "Deploying live, accessible versions to production cloud infrastructure (Vercel)."
    },
    details: {
      pt: "Configuração de domínios, variáveis de ambiente e testes em ambiente público real.",
      en: "Configuring domains, production build checks, and live public testing."
    }
  },
  {
    step: "IMPROVE",
    number: "06",
    title: {
      pt: "MELHORIA",
      en: "IMPROVE"
    },
    desc: {
      pt: "Coleta de feedback, diagnóstico de bugs e refatoração contínua.",
      en: "Gathering feedback, diagnosing bottlenecks, and continuous refactoring."
    },
    details: {
      pt: "Aprimoramento de performance, refinamento de interfaces e adição gradual de valor.",
      en: "Performance optimization, UI polish, and continuous iterative enhancement."
    }
  }
];
