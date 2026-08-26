import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  Search,
  CheckCircle,
  Database,
  ExternalLink,
  LogOut,
  RefreshCw,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Project, ProjectStatus } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { isSupabaseConfigured } from '../../lib/supabase';
import { ProjectFormModal } from './ProjectFormModal';
import { SupabaseSetupModal } from './SupabaseSetupModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublicSite: () => void;
  onPreviewCaseStudy: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onViewPublicSite,
  onPreviewCaseStudy,
}) => {
  const {
    allProjects,
    loading,
    saveProject,
    deleteProject,
    togglePublish,
    toggleFeature,
    reorderProjects,
    resetDefaults,
  } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [showSupabaseGuide, setShowSupabaseGuide] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  // Metrics
  const totalCount = allProjects.length;
  const publishedCount = allProjects.filter((p) => p.published).length;
  const draftCount = allProjects.filter((p) => !p.published).length;
  const featuredCount = allProjects.filter((p) => p.featured).length;

  // Filtered list
  const filteredProjects = allProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.pt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSaveProject = async (project: Project) => {
    const result = await saveProject(project);
    if (!result.success) {
      showFeedback(`Falha ao salvar: ${result.error || 'erro desconhecido'}`);
      return;
    }
    showFeedback(`Projeto "${project.name}" salvo com sucesso!`);
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSlug) return;
    const target = allProjects.find((p) => p.slug === deletingSlug || p.id === deletingSlug);
    await deleteProject(deletingSlug);
    showFeedback(`Projeto "${target?.name || deletingSlug}" removido.`);
    setDeletingSlug(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= allProjects.length) return;
    const reordered = [...allProjects];
    const item = reordered.splice(index, 1)[0];
    reordered.splice(targetIdx, 0, item);
    await reorderProjects(reordered);
    showFeedback('Ordem de exibição atualizada.');
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'released':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">Released</span>;
      case 'beta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-violet-950/60 border border-violet-500/40 text-violet-400">Beta</span>;
      case 'testing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-500/40 text-amber-400">Testing</span>;
      case 'building':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">Building</span>;
      case 'paused':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-gray-900 border border-gray-700 text-gray-400">Paused</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-gray-800 text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white font-sans text-left pb-20">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0A0A0A] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black font-display font-black flex items-center justify-center text-sm rounded">
              EB
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-2">
                <span>PORTFOLIO CMS</span>
                <span className="text-[10px] font-mono-tech text-gray-500 font-normal">v2.0</span>
              </div>
              <div className="text-[10px] font-mono-tech text-gray-400">
                El Bravo Dantas • Painel Administrativo
              </div>
            </div>
          </div>

          {/* Center/Right Status & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Supabase Status Button */}
            <button
              onClick={() => setShowSupabaseGuide(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono-tech flex items-center gap-1.5 border transition-all cursor-pointer ${
                supabaseConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {supabaseConfigured ? 'Supabase: Conectado' : 'Persistência: Local'}
              </span>
              <HelpCircle className="w-3 h-3 opacity-60" />
            </button>

            {/* View Live Site */}
            <button
              onClick={onViewPublicSite}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site Público</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
              title="Sair do CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Feedback Alert Toast */}
        {actionNotice && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono-tech flex items-center gap-2 animate-fade-in shadow-xl">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Gerenciamento de Projetos
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Adicione, edite e publique projetos reais no portfólio sem precisar alterar código-fonte.
            </p>
          </div>

          <button
            id="cms-create-project-btn"
            onClick={() => setIsCreatingNew(true)}
            className="px-5 py-3 bg-white hover:bg-indigo-500 hover:text-white text-black font-bold text-xs uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-xl self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Projeto</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-500">
              Total de Projetos
            </div>
            <div className="text-2xl font-bold font-display text-white">{totalCount}</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-400">
              Publicados no Site
            </div>
            <div className="text-2xl font-bold font-display text-emerald-400">{publishedCount}</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono-tech uppercase tracking-widest text-gray-400">
              Rascunhos (Ocultos)
            </div>
            <div className="text-2xl font-bold font-display text-gray-400">{draftCount}</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-1">
            <div className="text-[10px] font-mono-tech uppercase tracking-widest text-amber-400">
              Projetos em Destaque
            </div>
            <div className="text-2xl font-bold font-display text-amber-400">{featuredCount}</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, slug ou categoria..."
              className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-white/10 rounded text-xs text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filter & Reset Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#141414] border border-white/10 rounded text-xs text-white font-mono-tech focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="building">Building</option>
              <option value="testing">Testing</option>
              <option value="beta">Beta</option>
              <option value="released">Released</option>
              <option value="paused">Paused</option>
            </select>

            <button
              onClick={async () => {
                if (confirm('Deseja restaurar os projetos originais de exemplo?')) {
                  await resetDefaults();
                  showFeedback('Projetos padrão restaurados.');
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded text-xs font-mono-tech transition-colors cursor-pointer"
              title="Restaurar dados originais"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Projects List / Table */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-mono-tech text-xs">
              Carregando projetos da base de dados...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-gray-500 font-mono-tech text-xs">
                Nenhum projeto encontrado com os filtros aplicados.
              </p>
              <button
                onClick={() => setIsCreatingNew(true)}
                className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded font-mono-tech cursor-pointer"
              >
                + Criar Primeiro Projeto
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              
              {/* Header row on desktop */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-[#111111] text-[10px] font-mono-tech uppercase tracking-widest text-gray-500 font-bold">
                <div className="col-span-1">Ordem</div>
                <div className="col-span-4">Projeto & Categoria</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">Publicação</div>
                <div className="col-span-1 text-center">Destaque</div>
                <div className="col-span-2 text-right">Ações</div>
              </div>

              {/* Rows */}
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id || project.slug}
                  className="p-4 sm:p-6 lg:px-6 lg:py-4 hover:bg-white/[0.02] transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center"
                >
                  
                  {/* Order & Reorder Controls */}
                  <div className="col-span-1 flex items-center gap-1.5">
                    <span className="font-mono-tech text-xs text-gray-400 font-bold w-6">
                      {project.orderNumber || String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="text-gray-600 hover:text-white disabled:opacity-20 cursor-pointer p-0.5"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === filteredProjects.length - 1}
                        className="text-gray-600 hover:text-white disabled:opacity-20 cursor-pointer p-0.5"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="col-span-4 flex items-center gap-3 w-full">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.name}
                        className="w-12 h-9 rounded object-cover border border-white/10 bg-black shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-9 rounded border border-white/10 bg-[#161616] flex items-center justify-center text-[10px] font-mono-tech text-gray-500 font-bold shrink-0">
                        {project.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                        <span>{project.name}</span>
                        {project.featured && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono-tech text-gray-400 truncate">
                        {project.category.pt} • <code className="text-gray-500">/projects/{project.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex lg:justify-center">
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Published Toggle */}
                  <div className="col-span-2 flex lg:justify-center">
                    <button
                      onClick={() => togglePublish(project.slug)}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                        project.published
                          ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40'
                          : 'bg-gray-900 border border-gray-700 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {project.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Ao Vivo</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Rascunho</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Featured Toggle */}
                  <div className="col-span-1 flex lg:justify-center">
                    <button
                      onClick={() => toggleFeature(project.slug)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        project.featured
                          ? 'text-amber-400 hover:bg-amber-950/30'
                          : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                      }`}
                      title={project.featured ? 'Remover dos destaques' : 'Marcar como destaque'}
                    >
                      <Star className={`w-4 h-4 ${project.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    
                    {/* View Live Case Study */}
                    <button
                      onClick={() => onPreviewCaseStudy(project.slug)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                      title="Visualizar Case Study"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600/30 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-tech"
                      title="Editar projeto"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sm:hidden">Editar</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingSlug(project.slug)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                      title="Excluir projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

      {/* MODAL: Project Editor (Create / Edit) */}
      {(isCreatingNew || editingProject) && (
        <ProjectFormModal
          initialProject={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setIsCreatingNew(false);
            setEditingProject(null);
          }}
        />
      )}

      {/* MODAL: Delete Confirmation */}
      {deletingSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-red-500/30 p-6 rounded-xl max-w-sm w-full space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Confirmar Exclusão</h3>
            </div>
            <p className="text-xs text-gray-300">
              Tem certeza que deseja excluir o projeto <code className="text-red-400 font-mono-tech">{deletingSlug}</code>? Esta ação é irreversível.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingSlug(null)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 rounded text-xs font-mono-tech cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs font-mono-tech uppercase cursor-pointer transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Supabase Setup Guide */}
      {showSupabaseGuide && (
        <SupabaseSetupModal onClose={() => setShowSupabaseGuide(false)} />
      )}

    </div>
  );
};
