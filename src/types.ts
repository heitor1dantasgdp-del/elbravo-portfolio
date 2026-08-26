export type Language = 'pt' | 'en';

export type ProjectStatus = 'building' | 'testing' | 'beta' | 'released' | 'paused';

export interface LocalizedString {
  pt: string;
  en: string;
}

export interface DemoCredentials {
  showDemoCredentials?: boolean;
  email?: string;
  password?: string;
  role?: string;
  notes?: LocalizedString;
}

export interface ProjectFeature {
  title: LocalizedString;
  desc: LocalizedString;
  iconName?: string;
  displayOrder?: number;
}

export interface ProjectScreenshot {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  type: 'desktop' | 'mobile';
  previewType?: 'nexus' | 'agenda' | 'finance' | 'resume' | 'portfolio' | 'custom';
  url?: string;
  altText?: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
  displayOrder?: number;
}

export interface ProjectCaseStudy {
  problem: LocalizedString;
  idea: LocalizedString;
  solution: LocalizedString;
  features: ProjectFeature[];
  roles?: LocalizedString[];
  learning: LocalizedString;
  challenges: LocalizedString;
  limitations: LocalizedString;
  nextSteps: LocalizedString;
}

export interface Project {
  id?: string;
  slug: string;
  orderNumber: string; // "01", "02", etc.
  displayOrder?: number;
  name: string;
  category: LocalizedString;
  status: ProjectStatus;
  statusNote?: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  demoUrl: string;
  repositoryUrl: string | null;
  featured: boolean;
  published: boolean;
  coverImage?: string;
  stack: string[];
  caseStudy: ProjectCaseStudy;
  demoCredentials?: DemoCredentials;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  screenshots: ProjectScreenshot[];
}

export type AdminRoute = 
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'project_new'
  | 'project_edit';

export interface AdminRouteState {
  route: AdminRoute;
  projectId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ProfileContact {
  email: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
  domain: string;
}

export interface Profile {
  name: string;
  roleTitle: LocalizedString;
  badge: LocalizedString;
  headline: {
    line1: LocalizedString;
    line2: LocalizedString;
    line3: LocalizedString;
  };
  motto: LocalizedString;
  subheadline: LocalizedString;
  about: {
    title: LocalizedString;
    quote: LocalizedString;
    paragraphs: {
      pt: string[];
      en: string[];
    };
    highlights: {
      label: LocalizedString;
      value: LocalizedString;
    }[];
  };
  aiPhilosophy: {
    badge: LocalizedString;
    title: LocalizedString;
    concept: LocalizedString;
    description: LocalizedString;
    points: LocalizedString[];
  };
  contact: ProfileContact;
}

export interface BuildProcessStep {
  step: string;
  number: string;
  title: LocalizedString;
  desc: LocalizedString;
  details: LocalizedString;
}

export interface SkillCategory {
  title: LocalizedString;
  description: LocalizedString;
  items: string[];
}
