import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import {
  getAllProjects,
  getPublishedProjects,
  saveProject as repoSaveProject,
  deleteProject as repoDeleteProject,
  reorderProjects as repoReorderProjects,
  resetToDefaultProjects as repoResetDefaults,
  subscribeToProjects,
} from '../lib/projectsRepository';

export function useProjects() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const all = await getAllProjects();
      setAllProjects(all);
      const published = all.filter((p) => p.published);
      setPublishedProjects(published);
    } catch (err) {
      console.error('Error loading projects in hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToProjects(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  const save = async (project: Project) => {
    const res = await repoSaveProject(project);
    await loadData();
    return res;
  };

  const remove = async (idOrSlug: string) => {
    const res = await repoDeleteProject(idOrSlug);
    await loadData();
    return res;
  };

  const togglePublish = async (slug: string) => {
    const target = allProjects.find((p) => p.slug === slug);
    if (!target) return;
    const updated: Project = { ...target, published: !target.published };
    await repoSaveProject(updated);
    await loadData();
  };

  const toggleFeature = async (slug: string) => {
    const target = allProjects.find((p) => p.slug === slug);
    if (!target) return;
    const updated: Project = { ...target, featured: !target.featured };
    await repoSaveProject(updated);
    await loadData();
  };

  const reorder = async (ordered: Project[]) => {
    await repoReorderProjects(ordered);
    await loadData();
  };

  const resetDefaults = async () => {
    await repoResetDefaults();
    await loadData();
  };

  const featuredProjects = publishedProjects.filter((p) => p.featured);
  const nowBuildingProjects = publishedProjects.filter((p) => p.status === 'building' || p.status === 'testing');

  return {
    allProjects,
    publishedProjects,
    featuredProjects,
    nowBuildingProjects,
    loading,
    refresh: loadData,
    saveProject: save,
    deleteProject: remove,
    togglePublish,
    toggleFeature,
    reorderProjects: reorder,
    resetDefaults,
  };
}
