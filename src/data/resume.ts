import { Language } from '../types';

export interface ResumeEntry {
  title: string;
  organization?: string;
  period?: string;
  description?: string;
}

export interface ResumeContent {
  eyebrow: string;
  title: string;
  intro: string;
  summaryLabel: string;
  summary: string;
  experienceLabel: string;
  experience: ResumeEntry[];
  projectsLabel: string;
  projectsIntro: string;
  projects: string[];
  skillsLabel: string;
  skills: string[];
  educationLabel: string;
  education: ResumeEntry[];
  languagesLabel: string;
  languages: string[];
  personalNote: string;
  viewLabel: string;
  downloadLabel: string;
  downloadFile: string;
}

export const resumeContent: Record<Language, ResumeContent> = {
  pt: {
    eyebrow: 'CURRÍCULO / TRAJETÓRIA',
    title: 'Uma trajetória construída com prática.',
    intro: 'Experiência operacional, aprendizagem autodidata e projetos pessoais construídos com assistência de IA, testes e melhoria contínua.',
    summaryLabel: 'Resumo profissional',
    summary: 'Profissional detalhista com seis anos de experiência em ambientes industriais de alta produção. Entusiasta autodidata de tecnologia, com prática diária no uso de ferramentas de IA para pesquisa, resolução de problemas e experimentação de software. Busco oportunidades para aplicar raciocínio lógico, atenção a instruções e capacidade de aprender com consistência.',
    experienceLabel: 'Experiência profissional',
    experience: [{
      title: 'Operador de máquinas',
      organization: 'Wickbold Ltda.',
      period: '2020 — fevereiro de 2026',
      description: 'Operação de máquinas de divisão de massa em ambiente de produção de alto volume, mantendo consistência de saída e seguindo protocolos operacionais estabelecidos.'
    }],
    projectsLabel: 'Projetos pessoais assistidos por IA',
    projectsIntro: 'São experimentos e aplicações pessoais, não experiência comercial em engenharia de software. A IA é utilizada como ferramenta de pesquisa, construção, debugging e aprendizagem; o código é revisado, testado e validado na prática.',
    projects: ['Sistemas de CRM e gestão de leads', 'Ferramentas pessoais de agenda e controle de estoque', 'Protótipos de aplicações SaaS', 'Utilitários de gestão financeira e empresarial'],
    skillsLabel: 'Competências',
    skills: ['Português brasileiro nativo', 'Interação diária com assistentes de IA e chatbots', 'Raciocínio lógico e troubleshooting', 'Pesquisa online e verificação de informações', 'Atenção disciplinada a instruções complexas', 'React, TypeScript, Next.js e interfaces web'],
    educationLabel: 'Formação',
    education: [{ title: 'Ensino Médio completo' }],
    languagesLabel: 'Idiomas',
    languages: ['Português (Brasil) — nativo', 'Inglês — básico'],
    personalNote: 'I build. I test. I learn. I improve.',
    viewLabel: 'Ver currículo',
    downloadLabel: 'Baixar currículo',
    downloadFile: 'Jeyson_Dantas_CV.docx'
  },
  en: {
    eyebrow: 'RESUME / BACKGROUND',
    title: 'A path built through practice.',
    intro: 'Operations experience, self-directed learning, and personal projects built with AI assistance, testing, and continuous improvement.',
    summaryLabel: 'Professional summary',
    summary: 'Detail-oriented professional with six years of experience in high-output industrial environments. Self-taught technology enthusiast with a daily practice of using AI tools for research, problem-solving, and software experimentation. Seeking opportunities to apply logical reasoning, attention to instructions, and a consistent learning mindset.',
    experienceLabel: 'Professional experience',
    experience: [{
      title: 'Machine Operator',
      organization: 'Wickbold Ltda.',
      period: '2020 — February 2026',
      description: 'Operated dough dividing machines in a high-volume production environment, maintaining consistent output and following established operational protocols.'
    }],
    projectsLabel: 'Personal AI-assisted projects',
    projectsIntro: 'These are self-initiated experiments and applications, not commercial software engineering experience. AI is used as a tool for research, building, debugging, and learning; code is reviewed, tested, and validated in practice.',
    projects: ['CRM and lead management systems', 'Personal scheduling and inventory tools', 'SaaS application prototypes', 'Financial and business management utilities'],
    skillsLabel: 'Skills',
    skills: ['Native Brazilian Portuguese', 'Daily interaction with AI assistants and chatbots', 'Logical reasoning and troubleshooting', 'Online research and information verification', 'Disciplined adherence to complex instructions', 'React, TypeScript, Next.js, and web interfaces'],
    educationLabel: 'Education',
    education: [{ title: 'High School Diploma' }],
    languagesLabel: 'Languages',
    languages: ['Portuguese (Brazil) — native', 'English — basic'],
    personalNote: 'I build. I test. I learn. I improve.',
    viewLabel: 'View resume',
    downloadLabel: 'Download CV',
    downloadFile: 'Jeyson_Dantas_CV.docx'
  }
};
