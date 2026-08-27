import { Project } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';
import { projectsData } from '../data/projects';
import { deleteProjectMediaFolder, getSupabaseClient, isLocalFallbackAllowed, isSupabaseConfigured, resolveProjectMediaUrl } from './supabase';
import { normalizeExternalUrl, normalizeProjectRecord } from './projectNormalization';

const STORAGE_KEY = 'el_bravo_portfolio_projects_v2';
const PROJECTS_CHANGE_EVENT = 'el_bravo_projects_updated';

// Helper to normalize and map DB row to Project interface
const mapDbRowToProject = (row: unknown): Project => normalizeProjectRecord(row);

// Helper to map Project interface to DB row
const mapProjectToDbRow = (project: Project): Record<string, unknown> => {
  return {
    id: project.id || `proj_${project.slug}_${Date.now()}`,
    slug: project.slug,
    order_number: project.orderNumber || '01',
    display_order: project.displayOrder ?? 1,
    name: project.name,
    category: project.category,
    status: project.status,
    status_note: project.statusNote || null,
    tagline: project.tagline,
    description: project.description,
    demo_url: normalizeExternalUrl(project.demoUrl),
    repository_url: normalizeExternalUrl(project.repositoryUrl),
    featured: project.featured,
    published: project.published,
    cover_image: project.coverImage || null,
    stack: project.stack,
    case_study: project.caseStudy,
    demo_credentials: project.demoCredentials || null,
    last_updated: project.lastUpdated || '2026',
    screenshots: project.screenshots || [],
    updated_at: new Date().toISOString(),
  };
};

const hydrateProjectMedia = async (project: Project): Promise<Project> => {
  const [coverImage, screenshots] = await Promise.all([
    resolveProjectMediaUrl(project.coverImage),
    Promise.all(project.screenshots.map(async (shot) => ({
      ...shot,
      storagePath: shot.url?.startsWith('supabase://project-media/') ? shot.url : shot.storagePath,
      url: await resolveProjectMediaUrl(shot.url),
    }))),
  ]);
  return {
    ...project,
    coverImagePath: project.coverImage?.startsWith('supabase://project-media/') ? project.coverImage : project.coverImagePath,
    coverImage,
    screenshots,
  };
};

const toPersistableProject = (project: Project): Project => ({
  ...project,
  coverImage: project.coverImagePath || project.coverImage,
  screenshots: project.screenshots.map((shot) => {
    const persisted = { ...shot };
    delete persisted.previewUrl;
    delete persisted.storagePath;
    persisted.url = shot.storagePath || shot.url;
    return persisted;
  }),
});

// Local storage management
const getLocalStorageProjects = (): Project[] => {
  if (!isLocalFallbackAllowed()) return projectsData;
  if (typeof window === 'undefined') return projectsData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial projects data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData));
      return projectsData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read from localStorage:', err);
    return projectsData;
  }
};

const setLocalStorageProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent(PROJECTS_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

/**
 * Fetch all projects (for admin dashboard, includes drafts)
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return isLocalFallbackAllowed() ? getLocalStorageProjects() : [];
      }

      if (data && data.length > 0) {
        const mapped = await Promise.all(data.map(mapDbRowToProject).map(hydrateProjectMedia));
        // Cache to local storage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      } else {
        return [];
      }
    } catch (err) {
      console.warn('Error fetching from Supabase:', err);
      return isLocalFallbackAllowed() ? getLocalStorageProjects() : [];
    }
  }

  return getLocalStorageProjects();
};

/**
 * Fetch only published projects (for public site)
 */
export const getPublishedProjects = async (): Promise<Project[]> => {
  const all = await getAllProjects();
  return all
    .filter((p) => p.published)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
};

/**
 * Get single project by slug
 */
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const all = await getPublishedProjects();
  const found = all.find((p) => p.slug === slug);
  return found || null;
};

/**
 * Save project (Insert or Update)
 */
export const saveProject = async (project: Project): Promise<{ success: boolean; project?: Project; error?: string }> => {
  const now = new Date().toISOString();
  const normalized: Project = {
    ...project,
    id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: project.createdAt || now,
    updatedAt: now,
    displayOrder: project.displayOrder ?? 99,
  };

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const dbRow = mapProjectToDbRow(toPersistableProject(normalized));
      const query = project.id
        ? supabase.from('projects').update(dbRow).eq('id', normalized.id)
        : supabase.from('projects').insert(dbRow);
      const { data, error } = await query.select().single();

      if (error) {
        console.error('Supabase save error:', error);
        if (error.code === '23505') {
          return { success: false, error: 'Este slug já está em uso. Escolha outro slug.' };
        }
        if (isLocalFallbackAllowed()) {
          saveToLocalStorage(normalized);
          return { success: true, project: normalized, error: `Saved locally (Supabase: ${error.message})` };
        }
        return { success: false, error: error.message };
      }

      const saved = mapDbRowToProject(data);
      saveToLocalStorage(saved);
      return { success: true, project: saved };
    } catch (err: unknown) {
      console.error('Error saving to Supabase:', err);
      if (isLocalFallbackAllowed()) {
        saveToLocalStorage(normalized);
        return { success: true, project: normalized, error: err instanceof Error ? err.message : 'Save failed' };
      }
      return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
    }
  }

  if (!isLocalFallbackAllowed()) {
    return { success: false, error: 'Supabase is not configured; project persistence is disabled in production.' };
  }

  // Development-only local storage mode.
  saveToLocalStorage(normalized);
  return { success: true, project: normalized };
};

const saveToLocalStorage = (project: Project) => {
  const current = getLocalStorageProjects();
  const index = current.findIndex((p) => p.id === project.id || p.slug === project.slug);
  
  let updated: Project[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = project;
  } else {
    updated = [...current, project];
  }

  // Ensure consistent display order
  updated.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  setLocalStorageProjects(updated);
};

/**
 * Delete project
 */
export const deleteProject = async (idOrSlug: string): Promise<{ success: boolean; error?: string }> => {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: target, error: lookupError } = await supabase
        .from('projects')
        .select('slug')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();
      if (lookupError) return { success: false, error: lookupError.message };
      if (target?.slug) {
        const mediaResult = await deleteProjectMediaFolder(target.slug);
        if (!mediaResult.success) return mediaResult;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      console.error('Error deleting from Supabase:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
    }
  }

  if (!isLocalFallbackAllowed()) {
    return { success: false, error: 'Supabase is not configured; project persistence is disabled in production.' };
  }

  const current = getLocalStorageProjects();
  const updated = current.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  setLocalStorageProjects(updated);

  return { success: true };
};

/**
 * Reorder projects array
 */
export const reorderProjects = async (orderedProjects: Project[]): Promise<boolean> => {
  const reindexed = orderedProjects.map((p, idx) => ({
    ...p,
    displayOrder: idx + 1,
    orderNumber: String(idx + 1).padStart(2, '0'),
  }));

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      for (const p of reindexed) {
        const { error } = await supabase
          .from('projects')
          .update({ display_order: p.displayOrder, order_number: p.orderNumber })
          .eq('slug', p.slug);
        if (error) {
          console.error('Supabase reorder error:', error);
          return false;
        }
      }
    } catch (err) {
      console.error('Error reordering in Supabase:', err);
      return false;
    }
  }

  if (!isLocalFallbackAllowed()) return false;

  setLocalStorageProjects(reindexed);
  return true;
};

/**
 * Reset / Re-seed projects with defaults
 */
export const resetToDefaultProjects = async (): Promise<Project[]> => {
  if (!isLocalFallbackAllowed()) return [];
  setLocalStorageProjects(projectsData);
  return projectsData;
};

/**
 * Subscribe to project changes (both local event & Supabase realtime if enabled)
 */
export const subscribeToProjects = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  window.addEventListener(PROJECTS_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleCustomEvent);

  const supabase = getSupabaseClient();
  let channel: RealtimeChannel | null = null;

  if (supabase && isSupabaseConfigured()) {
    try {
      channel = supabase
        .channel('public:projects')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          () => callback()
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }
  }

  return () => {
    window.removeEventListener(PROJECTS_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleCustomEvent);
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  };
};
