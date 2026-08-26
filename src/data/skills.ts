import { SkillCategory } from '../types';

export const skillsData: SkillCategory[] = [
  {
    title: {
      pt: "Desenvolvimento Frontend",
      en: "Frontend Engineering"
    },
    description: {
      pt: "Construção de interfaces web responsivas, componentes tipados e design systems modernos.",
      en: "Engineering responsive web interfaces, strictly typed components, and modern design systems."
    },
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "JavaScript (ESNext)",
      "HTML5 / Semantic Web",
      "CSS3 / Flexbox & Grid",
      "Framer Motion / Motion"
    ]
  },
  {
    title: {
      pt: "Arquitetura & Padrões",
      en: "Architecture & Patterns"
    },
    description: {
      pt: "Estruturação de dados desacoplados, controle de acessos (RBAC) e estado de aplicação.",
      en: "Decoupled data modeling, role-based access control (RBAC), and clean state architecture."
    },
    items: [
      "Modular Architecture",
      "Component-Driven UI",
      "State Management",
      "RESTful API Consumption",
      "Role-Based Access (RBAC)",
      "Responsive Layouts (Mobile First)"
    ]
  },
  {
    title: {
      pt: "Ferramentas & Qualidade",
      en: "Tooling & Quality"
    },
    description: {
      pt: "Fluxo de versionamento, inspeção de código e análise de usabilidade.",
      en: "Source version control, code linting, and continuous usability verification."
    },
    items: [
      "Git & GitHub",
      "Vite",
      "ESLint & TypeScript Compiler",
      "Chrome DevTools & Lighthouse",
      "Figma (Inspect & Translation to Code)"
    ]
  },
  {
    title: {
      pt: "Publicação & Deploy",
      en: "Deployment & Hosting"
    },
    description: {
      pt: "Hospedagem contínua e configuração de domínios em plataformas modernas.",
      en: "Continuous cloud deployment and custom domain management on modern platforms."
    },
    items: [
      "Vercel",
      "CI / CD Deployments",
      "Custom Domains & DNS",
      "Environment Variables (.env)"
    ]
  },
  {
    title: {
      pt: "Fluxo com IA",
      en: "AI-Assisted Workflow"
    },
    description: {
      pt: "Aceleração de pesquisa técnica, geração de testes e resolução rápida de bugs com validação humana.",
      en: "Accelerating technical research, test suite drafting, and rapid debugging with human validation."
    },
    items: [
      "Rapid Prototyping",
      "Automated Debugging Assistance",
      "Edge-Case Analysis",
      "Documentation & Refactoring"
    ]
  }
];
