import { Project } from '../types';
import { projectsData } from '../data/projects';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'el_bravo_portfolio_projects_v2';
const PROJECTS_CHANGE_EVENT = 'el_bravo_projects_updated';

// Helper to normalize and map DB row to Project interface
const mapDbRowToProject = (row: any): Project => {
  return {
    id: row.id,
    slug: row.slug,
    orderNumber: row.order_number || String(row.display_order || '01').padStart(2, '0'),
    displayOrder: row.display_order ?? 1,
    name: row.name,
    category: typeof row.category === 'string' ? JSON.parse(row.category) : row.category,
    status: row.status,
    statusNote: typeof row.status_note === 'string' ? JSON.parse(row.status_note) : row.status_note,
    tagline: typeof row.tagline === 'string' ? JSON.parse(row.tagline) : row.tagline,
    description: typeof row.description === 'string' ? JSON.parse(row.description) : row.description,
    demoUrl: row.demo_url || '',
    repositoryUrl: row.repository_url || null,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    coverImage: row.cover_image || undefined,
    stack: Array.isArray(row.stack) ? row.stack : (typeof row.stack === 'string' ? JSON.parse(row.stack) : []),
    caseStudy: typeof row.case_study === 'string' ? JSON.parse(row.case_study) : row.case_study,
    demoCredentials: typeof row.demo_credentials === 'string' ? JSON.parse(row.demo_credentials) : row.demo_credentials,
    lastUpdated: row.last_updated || '2026',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    screenshots: Array.isArray(row.screenshots) ? row.screenshots : (typeof row.screenshots === 'string' ? JSON.parse(row.screenshots) : []),
  };
};

// Helper to map Project interface to DB row
const mapProjectToDbRow = (project: Project): any => {
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
    demo_url: project.demoUrl,
    repository_url: project.repositoryUrl,
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

// Local storage management
const getLocalStorageProjects = (): Project[] => {
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
        console.warn('Supabase fetch error, falling back to local:', error.message);
        return getLocalStorageProjects();
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbRowToProject);
        // Cache to local storage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      } else {
        // If Supabase table is empty, seed from local projects
        const local = getLocalStorageProjects();
        for (const p of local) {
          await supabase.from('projects').upsert(mapProjectToDbRow(p));
        }
        return local;
      }
    } catch (err) {
      console.warn('Error fetching from Supabase:', err);
      return getLocalStorageProjects();
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
  const all = await getAllProjects();
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
      const dbRow = mapProjectToDbRow(normalized);
      const { data, error } = await supabase
        .from('projects')
        .upsert(dbRow, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('Supabase save error:', error);
        // Save to local storage as safety
        saveToLocalStorage(normalized);
        return { success: true, project: normalized, error: `Saved locally (Supabase: ${error.message})` };
      }

      const saved = mapDbRowToProject(data);
      saveToLocalStorage(saved);
      return { success: true, project: saved };
    } catch (err: any) {
      console.error('Error saving to Supabase:', err);
      saveToLocalStorage(normalized);
      return { success: true, project: normalized, error: err?.message };
    }
  }

  // Local storage mode
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
      const { error } = await supabase
        .from('projects')
        .delete()
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

      if (error) {
        console.error('Supabase delete error:', error);
      }
    } catch (err: any) {
      console.error('Error deleting from Supabase:', err);
    }
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
        await supabase
          .from('projects')
          .update({ display_order: p.displayOrder, order_number: p.orderNumber })
          .eq('slug', p.slug);
      }
    } catch (err) {
      console.error('Error reordering in Supabase:', err);
    }
  }

  setLocalStorageProjects(reindexed);
  return true;
};

/**
 * Reset / Re-seed projects with defaults
 */
export const resetToDefaultProjects = async (): Promise<Project[]> => {
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
  let channel: any = null;

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
