import {
  LocalizedString,
  Project,
  ProjectCaseStudy,
  ProjectFeature,
  ProjectScreenshot,
  ProjectStatus,
} from '../types';

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord => (
  value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {}
);

const asText = (value: unknown, fallback = ''): string => (
  typeof value === 'string' ? value : fallback
);

const parseValue = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const normalizeLocalized = (value: unknown, fallback = ''): LocalizedString => {
  const source = asRecord(parseValue(value));
  return {
    pt: asText(source.pt, asText(source.en, fallback)),
    en: asText(source.en, asText(source.pt, fallback)),
  };
};

const normalizeFeature = (value: unknown): ProjectFeature | null => {
  const source = asRecord(parseValue(value));
  const title = normalizeLocalized(source.title);
  const desc = normalizeLocalized(source.desc);
  if (!title.pt && !title.en && !desc.pt && !desc.en) return null;
  return {
    title,
    desc,
    iconName: asText(source.iconName) || undefined,
    displayOrder: typeof source.displayOrder === 'number' ? source.displayOrder : undefined,
  };
};

const normalizeScreenshot = (value: unknown, index: number): ProjectScreenshot | null => {
  const source = asRecord(parseValue(value));
  const url = asText(source.url);
  const type = source.type === 'mobile' ? 'mobile' : 'desktop';
  if (!url && !source.title && !source.altText && !source.caption) return null;
  return {
    id: asText(source.id, `screenshot-${index + 1}`),
    title: normalizeLocalized(source.title, `Screenshot ${index + 1}`),
    description: source.description ? normalizeLocalized(source.description) : undefined,
    type,
    previewType: asText(source.previewType) as ProjectScreenshot['previewType'] || undefined,
    url: url || undefined,
    altText: asText(source.altText) || undefined,
    alt: source.alt ? normalizeLocalized(source.alt) : undefined,
    caption: source.caption ? normalizeLocalized(source.caption) : undefined,
    displayOrder: typeof source.displayOrder === 'number' ? source.displayOrder : undefined,
  };
};

const emptyCaseStudy = (): ProjectCaseStudy => ({
  problem: normalizeLocalized(null),
  idea: normalizeLocalized(null),
  solution: normalizeLocalized(null),
  features: [],
  roles: [],
  learning: normalizeLocalized(null),
  challenges: normalizeLocalized(null),
  limitations: normalizeLocalized(null),
  nextSteps: normalizeLocalized(null),
});

const normalizeCaseStudy = (value: unknown): ProjectCaseStudy => {
  const source = asRecord(parseValue(value));
  const features = Array.isArray(source.features)
    ? source.features.map(normalizeFeature).filter((feature): feature is ProjectFeature => Boolean(feature))
    : [];
  const roles = Array.isArray(source.roles)
    ? source.roles
      .map((role) => normalizeLocalized(role))
      .filter((role) => role.pt || role.en)
    : [];

  return {
    ...emptyCaseStudy(),
    problem: normalizeLocalized(source.problem),
    idea: normalizeLocalized(source.idea),
    solution: normalizeLocalized(source.solution),
    features,
    roles,
    learning: normalizeLocalized(source.learning),
    challenges: normalizeLocalized(source.challenges),
    limitations: normalizeLocalized(source.limitations),
    nextSteps: normalizeLocalized(source.nextSteps),
  };
};

const normalizeStack = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => typeof item === 'string' ? item : asText(asRecord(item).name))
    .map((item) => item.trim())
    .filter(Boolean);
};

const validStatuses: ProjectStatus[] = ['building', 'testing', 'beta', 'released', 'paused'];

export const normalizeProjectRecord = (row: unknown): Project => {
  const source = asRecord(row);
  const name = asText(source.name, 'Untitled project');
  const slug = asText(source.slug, `project-${Date.now()}`);
  const tagline = normalizeLocalized(source.tagline, name);
  const description = normalizeLocalized(source.description, tagline.pt || name);
  const status = validStatuses.includes(source.status as ProjectStatus)
    ? source.status as ProjectStatus
    : 'building';
  const screenshots = Array.isArray(parseValue(source.screenshots))
    ? (parseValue(source.screenshots) as unknown[])
      .map(normalizeScreenshot)
      .filter((shot): shot is ProjectScreenshot => Boolean(shot))
    : [];

  return {
    id: asText(source.id) || undefined,
    slug,
    orderNumber: asText(source.order_number, String(Number(source.display_order) || 1).padStart(2, '0')),
    displayOrder: typeof source.display_order === 'number' ? source.display_order : 1,
    name,
    category: normalizeLocalized(source.category, 'Software / Web App'),
    status,
    statusNote: source.status_note ? normalizeLocalized(source.status_note) : undefined,
    tagline,
    description,
    demoUrl: asText(source.demo_url),
    repositoryUrl: asText(source.repository_url) || null,
    featured: Boolean(source.featured),
    published: Boolean(source.published),
    coverImage: asText(source.cover_image) || undefined,
    stack: normalizeStack(source.stack),
    caseStudy: normalizeCaseStudy(source.case_study),
    demoCredentials: source.demo_credentials ? asRecord(parseValue(source.demo_credentials)) as Project['demoCredentials'] : undefined,
    lastUpdated: asText(source.last_updated, '2026'),
    createdAt: asText(source.created_at) || undefined,
    updatedAt: asText(source.updated_at) || undefined,
    screenshots,
  };
};
