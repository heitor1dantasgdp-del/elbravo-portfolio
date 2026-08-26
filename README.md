# EL BRAVO DANTAS — Portfolio & Digital Product Lab

> **"I build. I test. I learn. I improve."**

Modern, modular, and bilingual (PT-BR / EN) product design & frontend developer portfolio engineered for **El Bravo Dantas** ([elbravodantas.com.br](https://elbravodantas.com.br)). Designed with the **Future Product Lab** aesthetic: dark obsidian surfaces, subtle ambient lighting, strong typography, real live SaaS showcases, and transparent build methodologies.

---

## 🚀 Key Highlights & Architecture

- **Modular Content Architecture**: Data is fully decoupled in `src/data/` (projects, profile, skills, process, i18n). Adding or modifying projects requires **zero** manual HTML/component rewrites.
- **Bilingual Support (PT-BR / EN)**: Native internationalization with persistent state and instant language toggling.
- **Live Deployed Showcases**: Interactive browser mockups representing the real live SaaS apps (`Nexus CRM`, `AgendaPro`, `Gestão Financeira`, `Resume Signal`).
- **Comprehensive Case Studies**: Deep dive into real problems, solutions, engineered features, roles (RBAC), genuine learnings, limitations, next steps, and 1-click copy demo credentials.
- **Core Web Vitals & Accessibility**: Semantic HTML, strict contrast ratios (WCAG AA), responsive layout from mobile to ultra-wide desktop.
- **Ready for Vercel**: Zero complex backend or database dependencies; instant static & SPA deployment.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Design Tokens
- **Typography**: Plus Jakarta Sans, Syne, JetBrains Mono
- **Icons**: Lucide React
- **Hosting / Deploy**: Vercel

---

## 📂 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx            # Editorial "Learning by Building" layout
│   │   ├── AiAssistedSection.tsx       # AI workflow & human validation
│   │   ├── BentoGrid.tsx               # Verified metric showcase
│   │   ├── CaseStudyView.tsx           # Full case study view with demo credentials
│   │   ├── ContactSection.tsx          # Direct contact & 1-click email copy
│   │   ├── Footer.tsx                  # Minimalist footer & copyright
│   │   ├── Hero.tsx                    # Fullscreen Future Product Lab Hero
│   │   ├── HowIBuildSection.tsx        # IDEA → PLAN → BUILD → TEST → SHIP → IMPROVE
│   │   ├── Navbar.tsx                  # Floating responsive navbar & PT/EN switcher
│   │   ├── NowBuildingSection.tsx      # Live active projects filter (Building/Testing)
│   │   ├── ProjectBrowserMockup.tsx    # Realistic custom browser mockups
│   │   ├── ProjectShowcase.tsx         # Large product showcase sections
│   │   └── SkillsSection.tsx           # Categorized skill badges (no fake bars)
│   ├── data/
│   │   ├── i18n.ts                     # Full PT & EN translation dictionaries
│   │   ├── process.ts                  # 6-step build methodology
│   │   ├── profile.ts                  # Bio, motto, headlines, contact details
│   │   ├── projects.ts                 # All projects data, features, cases, credentials
│   │   └── skills.ts                   # Structured technical categories
│   ├── types.ts                        # TypeScript interfaces & types
│   ├── App.tsx                         # Main portfolio state & router logic
│   ├── index.css                       # Design tokens, fonts, custom scrollbar
│   └── main.tsx                        # Application mount
├── index.html                          # Meta, Open Graph, SEO tags
├── package.json
└── tsconfig.json
```

---

## 📦 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Dev Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 3. Production Build

```bash
npm run build
```

---

## ⚡ How to Add a New Project

Adding a new project to the portfolio takes under 2 minutes thanks to the modular data system.

Open `src/data/projects.ts` and append a new object to `projectsData`:

```typescript
{
  slug: "my-new-app",
  orderNumber: "06",
  name: "My New App",
  category: {
    pt: "SaaS / Produtividade",
    en: "SaaS / Productivity"
  },
  status: "building", // "building" | "testing" | "beta" | "released" | "paused"
  statusNote: {
    pt: "Em desenvolvimento ativo de MVP",
    en: "In active MVP development"
  },
  tagline: {
    pt: "Resumo em uma linha da proposta do produto.",
    en: "One-line summary of the product value."
  },
  description: {
    pt: "Descrição detalhada do projeto.",
    en: "Detailed description of the project."
  },
  demoUrl: "https://my-new-app.vercel.app",
  repositoryUrl: null, // or "https://github.com/..."
  featured: true,
  stack: ["React", "TypeScript", "Tailwind CSS"],
  demoCredentials: {
    email: "demo@mynewapp.com",
    password: "DemoPassword123!",
    role: "Admin / Standard User",
    notes: {
      pt: "Ambiente para testes rápidos.",
      en: "Environment for rapid testing."
    }
  },
  caseStudy: {
    problem: {
      pt: "Qual problema real o software resolve.",
      en: "The real friction the software solves."
    },
    idea: {
      pt: "A concepção inicial da solução.",
      en: "The initial conception of the solution."
    },
    solution: {
      pt: "Como a aplicação resolve o problema na prática.",
      en: "How the application delivers the solution."
    },
    features: [
      {
        title: { pt: "Recurso 01", en: "Feature 01" },
        desc: { pt: "Descrição da funcionalidade.", en: "Description of the feature." }
      }
    ],
    learning: {
      pt: "O que você aprendeu construindo este projeto.",
      en: "What you learned building this project."
    },
    challenges: {
      pt: "Desafios técnicos ou de design superados.",
      en: "Technical or UX challenges overcome."
    },
    limitations: {
      pt: "Limitações transparentes atuais.",
      en: "Current known limitations."
    },
    nextSteps: {
      pt: "Próximas melhorias planejadas.",
      en: "Next planned improvements."
    }
  },
  screenshots: []
}
```

The new project will **automatically** appear on:
1. The **Hero** & Showcase list
2. The **Now Building** live pulse (if status is `building` or `testing`)
3. The **Bento Grid** project count
4. Its dedicated **Case Study** page at `#project-my-new-app`

---

## 🔑 How to Add Demo Credentials

In `src/data/projects.ts`, simply populate the `demoCredentials` property of any project:

```typescript
demoCredentials: {
  email: "guest@example.com",
  password: "DemoPassword2026!",
  role: "Manager",
  notes: {
    pt: "Conta de demonstração com dados de teste.",
    en: "Demonstration account with sample records."
  }
}
```

If a project doesn't require login, simply remove or omit `email`/`password`, and provide a note:

```typescript
demoCredentials: {
  notes: {
    pt: "Acesso direto sem necessidade de conta.",
    en: "Direct access with no account required."
  }
}
```

---

## 🌐 How to Change Translations / Languages

- UI system labels: `src/data/i18n.ts` (Both `pt` and `en` keys)
- Bio and About: `src/data/profile.ts`
- Skills: `src/data/skills.ts`
- Process: `src/data/process.ts`

---

## 📬 Contact Configuration

Update your contact links in `src/data/profile.ts`:

```typescript
contact: {
  email: "brabo.dantas.gdp@gmail.com",
  github: "https://github.com/...",
  linkedin: "https://linkedin.com/in/...",
  whatsapp: "", // Optional. Leave empty to hide.
  domain: "https://elbravodantas.com.br"
}
```

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project**.
3. Select your repository.
4. Framework Preset: **Vite** / **Other**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.
8. Connect your custom domain: `elbravodantas.com.br`.

---

## 📄 License & Attribution

Designed and engineered with pride by **El Bravo Dantas**.
Released under the Apache-2.0 License.
