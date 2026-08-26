import React, { useState } from 'react';
import {
  X,
  Save,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { Project, ProjectStatus, ProjectScreenshot, ProjectFeature } from '../../types';
import { deleteProjectMedia, uploadProjectMedia } from '../../lib/supabase';

interface ProjectFormModalProps {
  initialProject?: Project | null;
  onSave: (project: Project) => Promise<void>;
  onClose: () => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  initialProject,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialProject);

  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'caseStudy' | 'techDemo'>('general');
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialProject?.name || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [displayOrder, setDisplayOrder] = useState<number>(initialProject?.displayOrder ?? 1);
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status || 'building');
  const [published, setPublished] = useState<boolean>(initialProject?.published ?? true);
  const [featured, setFeatured] = useState<boolean>(initialProject?.featured ?? false);

  // Category
  const [categoryPt, setCategoryPt] = useState(initialProject?.category.pt || '');
  const [categoryEn, setCategoryEn] = useState(initialProject?.category.en || '');

  // Tagline (Short description)
  const [taglinePt, setTaglinePt] = useState(initialProject?.tagline.pt || '');
  const [taglineEn, setTaglineEn] = useState(initialProject?.tagline.en || '');

  // Full Description
  const [descriptionPt, setDescriptionPt] = useState(initialProject?.description.pt || '');
  const [descriptionEn, setDescriptionEn] = useState(initialProject?.description.en || '');

  // Status Note
  const [statusNotePt, setStatusNotePt] = useState(initialProject?.statusNote?.pt || '');
  const [statusNoteEn, setStatusNoteEn] = useState(initialProject?.statusNote?.en || '');

  // Links
  const [demoUrl, setDemoUrl] = useState(initialProject?.demoUrl || '');
  const [repositoryUrl, setRepositoryUrl] = useState(initialProject?.repositoryUrl || '');

  // Cover Image
  const [coverImage, setCoverImage] = useState<string>(initialProject?.coverImagePath || initialProject?.coverImage || '');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>(initialProject?.coverImage || '');

  // Stack Tags
  const [stackTags, setStackTags] = useState<string[]>(
    initialProject?.stack || ['React', 'TypeScript', 'Tailwind CSS']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Screenshots Array
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>(
    initialProject?.screenshots.map((shot) => ({
      ...shot,
      url: shot.storagePath || shot.url,
      previewUrl: shot.url,
    })) || []
  );

  // Case Study Sections
  const [problemPt, setProblemPt] = useState(initialProject?.caseStudy.problem.pt || '');
  const [problemEn, setProblemEn] = useState(initialProject?.caseStudy.problem.en || '');

  const [ideaPt] = useState(initialProject?.caseStudy.idea.pt || '');
  const [ideaEn] = useState(initialProject?.caseStudy.idea.en || '');

  const [solutionPt, setSolutionPt] = useState(initialProject?.caseStudy.solution.pt || '');
  const [solutionEn, setSolutionEn] = useState(initialProject?.caseStudy.solution.en || '');

  const [challengesPt, setChallengesPt] = useState(initialProject?.caseStudy.challenges.pt || '');
  const [challengesEn] = useState(initialProject?.caseStudy.challenges.en || '');

  const [learningPt, setLearningPt] = useState(initialProject?.caseStudy.learning.pt || '');
  const [learningEn] = useState(initialProject?.caseStudy.learning.en || '');

  const [limitationsPt, setLimitationsPt] = useState(initialProject?.caseStudy.limitations.pt || '');
  const [limitationsEn] = useState(initialProject?.caseStudy.limitations.en || '');

  const [nextStepsPt, setNextStepsPt] = useState(initialProject?.caseStudy.nextSteps.pt || '');
  const [nextStepsEn] = useState(initialProject?.caseStudy.nextSteps.en || '');

  // Features Array
  const [features, setFeatures] = useState<ProjectFeature[]>(
    initialProject?.caseStudy.features || [
      {
        title: { pt: 'Recurso Principal', en: 'Core Feature' },
        desc: { pt: 'Descrição detalhada do recurso e valor entregue.', en: 'Detailed breakdown of the delivered capability.' },
      },
    ]
  );

  // Demo Credentials
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(
    initialProject?.demoCredentials?.showDemoCredentials ?? Boolean(initialProject?.demoCredentials?.email || initialProject?.demoCredentials?.password)
  );
  const [demoEmail, setDemoEmail] = useState(initialProject?.demoCredentials?.email || '');
  const [demoPassword, setDemoPassword] = useState(initialProject?.demoCredentials?.password || '');
  const [demoRole, setDemoRole] = useState(initialProject?.demoCredentials?.role || '');
  const [demoNotesPt, setDemoNotesPt] = useState(initialProject?.demoCredentials?.notes?.pt || '');
  const [demoNotesEn] = useState(initialProject?.demoCredentials?.notes?.en || '');

  // Auto-generate slug from name if not manually set
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slug) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Stack Tags management
  const addTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !stackTags.includes(trimmed)) {
      setStackTags([...stackTags, trimmed]);
      setNewTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setStackTags(stackTags.filter((_, i) => i !== index));
  };

  // Cover Image upload handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setError('Use uma imagem de até 5 MB.');
      return;
    }
    setUploadingCover(true);
    try {
      const res = await uploadProjectMedia(file, 'covers', slug);
      if (res.error || !res.url) {
        setError(res.error || 'Falha no upload da imagem de capa.');
        return;
      }
      setCoverImage(res.url);
      setCoverPreviewUrl(res.previewUrl || res.url);
    } catch {
      setError('Falha no upload da imagem de capa.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Screenshot upload handler
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setError('Use uma imagem de até 10 MB.');
      return;
    }
    setUploadingScreenshot(true);
    try {
      const res = await uploadProjectMedia(file, 'screenshots', slug);
      if (res.error || !res.url) {
        setError(res.error || 'Falha no upload da captura de tela.');
        return;
      }
      const newScreenshot: ProjectScreenshot = {
        id: `shot_${Date.now()}`,
        title: { pt: file.name.replace(/\.[^/.]+$/, ''), en: file.name.replace(/\.[^/.]+$/, '') },
        description: { pt: 'Captura de tela da interface.', en: 'Interface preview.' },
        type: 'desktop',
        url: res.url,
        previewUrl: res.previewUrl,
        altText: `Screenshot de ${name || 'projeto'}`,
      };
      setScreenshots((current) => [...current, newScreenshot]);
    } catch {
      setError('Falha no upload da captura de tela.');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  // Move Screenshot up/down
  const moveScreenshot = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= screenshots.length) return;
    const reordered = [...screenshots];
    const item = reordered.splice(index, 1)[0];
    reordered.splice(targetIdx, 0, item);
    setScreenshots(reordered);
  };

  const handleRemoveCover = async () => {
    const result = await deleteProjectMedia(coverImage);
    if (!result.success) {
      setError(result.error || 'Falha ao remover a mídia.');
      return;
    }
    setCoverImage('');
    setCoverPreviewUrl('');
  };

  const handleRemoveScreenshot = async (index: number) => {
    const screenshot = screenshots[index];
    const result = await deleteProjectMedia(screenshot.storagePath || screenshot.url);
    if (!result.success) {
      setError(result.error || 'Falha ao remover a mídia.');
      return;
    }
    setScreenshots((current) => current.filter((_, screenshotIndex) => screenshotIndex !== index));
  };

  // Features list management
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        title: { pt: 'Novo Recurso', en: 'New Feature' },
        desc: { pt: 'Descrição do recurso.', en: 'Feature description.' },
      },
    ]);
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const updateFeature = (idx: number, field: 'title' | 'desc', lang: 'pt' | 'en', value: string) => {
    const updated = [...features];
    updated[idx] = {
      ...updated[idx],
      [field]: {
        ...updated[idx][field],
        [lang]: value,
      },
    };
    setFeatures(updated);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nome do projeto é obrigatório.');
      setActiveTab('general');
      return;
    }
    if (!slug.trim()) {
      setError('Slug do projeto é obrigatório.');
      setActiveTab('general');
      return;
    }

    const cleanSlug = slug.trim().toLowerCase();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(cleanSlug)) {
      setError('Slug inválido. Use apenas letras minúsculas sem acento, números e hífens (ex: meu-projeto-app).');
      setActiveTab('general');
      return;
    }

    setSaving(true);

    const projectPayload: Project = {
      id: initialProject?.id,
      name: name.trim(),
      slug: cleanSlug,
      displayOrder: Number(displayOrder) || 1,
      orderNumber: String(displayOrder || '01').padStart(2, '0'),
      status,
      published,
      featured,
      category: {
        pt: categoryPt.trim() || 'Software / Web App',
        en: categoryEn.trim() || 'Software / Web App',
      },
      tagline: {
        pt: taglinePt.trim() || name,
        en: taglineEn.trim() || name,
      },
      description: {
        pt: descriptionPt.trim() || taglinePt.trim(),
        en: descriptionEn.trim() || taglineEn.trim(),
      },
      statusNote: (statusNotePt || statusNoteEn) ? {
        pt: statusNotePt.trim(),
        en: statusNoteEn.trim(),
      } : undefined,
      demoUrl: demoUrl.trim(),
      repositoryUrl: repositoryUrl.trim() || null,
      coverImage: coverImage.trim() || undefined,
      stack: stackTags,
      demoCredentials: (showDemoCredentials || demoEmail || demoPassword || demoRole || demoNotesPt) ? {
        showDemoCredentials,
        email: demoEmail.trim() || undefined,
        password: demoPassword.trim() || undefined,
        role: demoRole.trim() || undefined,
        notes: (demoNotesPt || demoNotesEn) ? {
          pt: demoNotesPt.trim(),
          en: demoNotesEn.trim(),
        } : undefined,
      } : undefined,
      caseStudy: {
        problem: { pt: problemPt.trim(), en: problemEn.trim() },
        idea: { pt: ideaPt.trim(), en: ideaEn.trim() },
        solution: { pt: solutionPt.trim(), en: solutionEn.trim() },
        features,
        challenges: { pt: challengesPt.trim(), en: challengesEn.trim() },
        learning: { pt: learningPt.trim(), en: learningEn.trim() },
        limitations: { pt: limitationsPt.trim(), en: limitationsEn.trim() },
        nextSteps: { pt: nextStepsPt.trim(), en: nextStepsEn.trim() },
      },
      screenshots: screenshots.length > 0 ? screenshots : [
        {
          id: `shot_${slug}_preview`,
          title: { pt: `${name} Preview`, en: `${name} Preview` },
          type: 'desktop',
          previewType: 'custom',
          url: coverImage || undefined,
        }
      ],
      createdAt: initialProject?.createdAt,
    };

    try {
      await onSave({
        ...projectPayload,
        coverImagePath: projectPayload.coverImage,
        screenshots: projectPayload.screenshots.map((shot) => {
          const persisted = { ...shot };
          delete persisted.previewUrl;
          delete persisted.storagePath;
          persisted.url = shot.storagePath || shot.url;
          return persisted;
        }),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar o projeto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-white/20 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111111]/80">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                {isEditing ? `Editar Projeto: ${initialProject?.name}` : 'Criar Novo Projeto no Portfólio'}
              </h2>
              <p className="text-xs text-gray-400 font-mono-tech">
                {isEditing ? `Slug: /projects/${slug}` : 'Preencha os dados em PT e EN para publicação bilíngue instantânea.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#070707] px-6 gap-2 sm:gap-6 overflow-x-auto text-xs font-mono-tech uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            1. Geral & Textos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            2. Imagens & Mídia ({screenshots.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('caseStudy')}
            className={`py-3.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'caseStudy'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            3. Case Study & Features
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('techDemo')}
            className={`py-3.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'techDemo'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            4. Stack, Links & Demo
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          
          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              
              {/* Row 1: Name, Slug, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Nexus CRM"
                    className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    Slug da URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ex: nexus-crm"
                    className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    Status do Projeto *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm font-mono-tech"
                  >
                    <option value="building">Building (Em Construção)</option>
                    <option value="testing">Testing (Em Testes)</option>
                    <option value="beta">Beta (Versão Beta)</option>
                    <option value="released">Released (Lançado / Publicado)</option>
                    <option value="paused">Paused (Pausado)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Visibility & Order */}
              <div className="p-4 bg-[#111111] border border-white/10 rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-tech uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-black border-white/20"
                    />
                    <span className={published ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                      {published ? '● Publicado no Portfólio' : '○ Rascunho (Oculto)'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-tech uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-black border-white/20"
                    />
                    <span className={featured ? 'text-amber-400 font-bold' : 'text-gray-500'}>
                      ★ Projeto em Destaque
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono-tech uppercase">Ordem de Exibição:</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 bg-[#1A1A1A] border border-white/20 rounded text-center text-xs font-mono-tech text-white"
                  />
                </div>
              </div>

              {/* Row 3: Category PT / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    Categoria (PT-BR)
                  </label>
                  <input
                    type="text"
                    value={categoryPt}
                    onChange={(e) => setCategoryPt(e.target.value)}
                    placeholder="Ex: CRM SaaS / B2B"
                    className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-emerald-400 mb-1 font-bold">
                    Category (EN-US)
                  </label>
                  <input
                    type="text"
                    value={categoryEn}
                    onChange={(e) => setCategoryEn(e.target.value)}
                    placeholder="Ex: CRM SaaS / B2B"
                    className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Row 4: Tagline / Short Description PT / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    Descrição Curta / Tagline (PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={taglinePt}
                    onChange={(e) => setTaglinePt(e.target.value)}
                    placeholder="Resumo de 1 frase que aparece no card do projeto..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-emerald-400 mb-1 font-bold">
                    Short Description / Tagline (EN-US)
                  </label>
                  <textarea
                    rows={2}
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    placeholder="1-sentence summary displayed on the project card..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Row 5: Full Description PT / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    Descrição Completa (PT-BR)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionPt}
                    onChange={(e) => setDescriptionPt(e.target.value)}
                    placeholder="Descrição institucional detalhada..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-emerald-400 mb-1 font-bold">
                    Full Description (EN-US)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Detailed overview..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Row 6: Status Note PT / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    Nota de Status / Aviso de Testes (PT-BR)
                  </label>
                  <input
                    type="text"
                    value={statusNotePt}
                    onChange={(e) => setStatusNotePt(e.target.value)}
                    placeholder="Ex: Em desenvolvimento ativo & testes práticos"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    Status Note / Test Environment Notice (EN-US)
                  </label>
                  <input
                    type="text"
                    value={statusNoteEn}
                    onChange={(e) => setStatusNoteEn(e.target.value)}
                    placeholder="Ex: In active development & testing"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              
              {/* Cover Image Section */}
              <div className="p-5 bg-[#111111] border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono-tech text-white">
                      Imagem de Capa do Projeto (Cover Image)
                    </h3>
                  </div>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="text-xs text-red-400 hover:text-red-300 font-mono-tech cursor-pointer"
                    >
                      Remover Capa
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-3">
                    <label className="block text-xs text-gray-400 font-mono-tech">
                      URL Direta da Imagem:
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://... ou faça upload"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white font-mono-tech"
                    />

                    <div className="flex items-center gap-3 pt-1">
                      <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono-tech font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingCover ? 'Enviando...' : 'Fazer Upload (Supabase)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          disabled={uploadingCover}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-lg h-36 bg-[#070707] flex items-center justify-center overflow-hidden relative">
                    {coverPreviewUrl || coverImage ? (
                      <img
                        src={coverPreviewUrl || coverImage}
                        alt="Capa Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center text-gray-600 text-xs font-mono-tech p-4">
                        Nenhuma imagem de capa selecionada. O portfólio usará o layout de preview interativo.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Screenshots Gallery Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono-tech text-white">
                      Capturas de Tela & Galeria ({screenshots.length})
                    </h3>
                    <p className="text-xs text-gray-400">
                      Adicione telas do produto para serem exibidas no Case Study.
                    </p>
                  </div>

                  <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono-tech font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{uploadingScreenshot ? 'Enviando...' : 'Adicionar Screenshot'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      disabled={uploadingScreenshot}
                      className="hidden"
                    />
                  </label>
                </div>

                {screenshots.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/15 rounded-xl text-center text-gray-500 text-xs font-mono-tech">
                    Nenhuma captura de tela personalizada adicionada. Clique em "Adicionar Screenshot" para fazer upload.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {screenshots.map((shot, idx) => (
                      <div
                        key={shot.id || idx}
                        className="p-4 bg-[#111111] border border-white/10 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-xs font-mono-tech text-gray-500 font-bold">
                            #{idx + 1}
                          </span>
                          
                          {shot.previewUrl || shot.url ? (
                            <img
                              src={shot.previewUrl || shot.url}
                              alt={shot.altText || 'Screenshot'}
                              className="w-16 h-12 object-cover rounded border border-white/10 bg-black shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-12 rounded border border-white/10 bg-black flex items-center justify-center text-[10px] text-gray-600 font-mono-tech shrink-0">
                              Preview
                            </div>
                          )}

                          <div className="space-y-1 flex-1">
                            <input
                              type="text"
                              value={shot.title.pt}
                              onChange={(e) => {
                                const copy = [...screenshots];
                                copy[idx].title.pt = e.target.value;
                                setScreenshots(copy);
                              }}
                              placeholder="Título da tela (PT)"
                              className="px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white w-full"
                            />
                            <input
                              type="text"
                              value={shot.altText || ''}
                              onChange={(e) => {
                                const copy = [...screenshots];
                                copy[idx].altText = e.target.value;
                                setScreenshots(copy);
                              }}
                              placeholder="Texto alternativo (Alt Text)"
                              className="px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-[11px] text-gray-400 font-mono-tech w-full"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => moveScreenshot(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 bg-white/5 hover:bg-white/15 rounded text-gray-400 disabled:opacity-30 cursor-pointer"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveScreenshot(idx, 'down')}
                            disabled={idx === screenshots.length - 1}
                            className="p-1.5 bg-white/5 hover:bg-white/15 rounded text-gray-400 disabled:opacity-30 cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(idx)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 rounded text-red-400 cursor-pointer ml-2"
                            title="Remover screenshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: CASE STUDY */}
          {activeTab === 'caseStudy' && (
            <div className="space-y-6">
              
              {/* Problem & Idea */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    O Problema Real (PT-BR)
                  </label>
                  <textarea
                    rows={3}
                    value={problemPt}
                    onChange={(e) => setProblemPt(e.target.value)}
                    placeholder="Qual dor ou ineficiência este software resolve?"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-emerald-400 mb-1 font-bold">
                    The Real Problem (EN-US)
                  </label>
                  <textarea
                    rows={3}
                    value={problemEn}
                    onChange={(e) => setProblemEn(e.target.value)}
                    placeholder="What pain point or inefficiency does this software solve?"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Solution & Idea */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    A Solução Desenvolvida (PT-BR)
                  </label>
                  <textarea
                    rows={3}
                    value={solutionPt}
                    onChange={(e) => setSolutionPt(e.target.value)}
                    placeholder="Como a aplicação foi construída e estruturada?"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-emerald-400 mb-1 font-bold">
                    The Built Solution (EN-US)
                  </label>
                  <textarea
                    rows={3}
                    value={solutionEn}
                    onChange={(e) => setSolutionEn(e.target.value)}
                    placeholder="How was the application engineered and architected?"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Features List */}
              <div className="p-4 bg-[#111111] border border-white/10 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono-tech text-white">
                      Lista de Funcionalidades Principais ({features.length})
                    </h3>
                    <p className="text-xs text-gray-400">
                      Módulos e recursos destacados no estudo de caso.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Recurso</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#171717] border border-white/10 rounded-lg space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-tech text-indigo-400 font-bold">
                          Recurso #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-xs text-red-400 hover:text-red-300 font-mono-tech cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={feat.title.pt}
                          onChange={(e) => updateFeature(idx, 'title', 'pt', e.target.value)}
                          placeholder="Título do Recurso (PT)"
                          className="px-2.5 py-1.5 bg-[#0F0F0F] border border-white/10 rounded text-xs text-white"
                        />
                        <input
                          type="text"
                          value={feat.title.en}
                          onChange={(e) => updateFeature(idx, 'title', 'en', e.target.value)}
                          placeholder="Feature Title (EN)"
                          className="px-2.5 py-1.5 bg-[#0F0F0F] border border-white/10 rounded text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <textarea
                          rows={2}
                          value={feat.desc.pt}
                          onChange={(e) => updateFeature(idx, 'desc', 'pt', e.target.value)}
                          placeholder="Explicação do recurso (PT)"
                          className="px-2.5 py-1.5 bg-[#0F0F0F] border border-white/10 rounded text-xs text-gray-300"
                        />
                        <textarea
                          rows={2}
                          value={feat.desc.en}
                          onChange={(e) => updateFeature(idx, 'desc', 'en', e.target.value)}
                          placeholder="Feature explanation (EN)"
                          className="px-2.5 py-1.5 bg-[#0F0F0F] border border-white/10 rounded text-xs text-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges & Learnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    Desafios Técnicos Enfrentados (PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={challengesPt}
                    onChange={(e) => setChallengesPt(e.target.value)}
                    placeholder="Complexidades e gargalos de engenharia..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-indigo-400 mb-1 font-bold">
                    Aprendizados Reais (PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={learningPt}
                    onChange={(e) => setLearningPt(e.target.value)}
                    placeholder="Conhecimentos práticos consolidados..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs"
                  />
                </div>
              </div>

              {/* Limitations & Next Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-amber-400 mb-1 font-bold">
                    Limitações Conhecidas (PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={limitationsPt}
                    onChange={(e) => setLimitationsPt(e.target.value)}
                    placeholder="Transparência total sobre o escopo atual..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-violet-400 mb-1 font-bold">
                    Próximos Passos & Evolução (PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={nextStepsPt}
                    onChange={(e) => setNextStepsPt(e.target.value)}
                    placeholder="Melhorias planejadas no roadmap..."
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: TECH, LINKS & DEMO */}
          {activeTab === 'techDemo' && (
            <div className="space-y-6">
              
              {/* Stack Tags */}
              <div className="p-4 bg-[#111111] border border-white/10 rounded-xl space-y-3">
                <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-white font-bold">
                  Tecnologias & Stack de Desenvolvimento
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {stackTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white/10 border border-white/15 rounded text-xs font-mono-tech text-gray-200 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="text-gray-400 hover:text-red-400 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Ex: Supabase, Next.js, PostgreSQL... (pressione Enter)"
                    className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white font-mono-tech"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono-tech uppercase font-bold cursor-pointer"
                  >
                    Adicionar Tag
                  </button>
                </div>
              </div>

              {/* URLs: Live Demo & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    URL da Aplicação / Live Demo
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://meu-projeto.vercel.app"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs font-mono-tech"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-tech uppercase tracking-widest text-gray-400 mb-1 font-bold">
                    URL do Repositório GitHub (Opcional)
                  </label>
                  <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/usuario/repo"
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded text-white text-xs font-mono-tech"
                  />
                </div>
              </div>

              {/* Demo Credentials Box */}
              <div className="p-4 bg-[#111111] border border-amber-500/20 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                    <h3 className="text-xs font-mono-tech uppercase tracking-widest font-bold">
                      Credenciais Públicas de Demonstração (Opcional)
                    </h3>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer font-mono-tech">
                    <input
                      type="checkbox"
                      checked={showDemoCredentials}
                      onChange={(e) => setShowDemoCredentials(e.target.checked)}
                      className="rounded bg-[#1A1A1A] border-white/20 text-indigo-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] text-amber-300 font-semibold">Exibir na página pública</span>
                  </label>
                </div>
                <p className="text-xs text-gray-400">
                  Insira credenciais públicas de teste apenas se a aplicação possuir tela de login/roles para visitantes explorarem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono-tech text-gray-400 uppercase mb-1">
                      E-mail / Usuário Demo
                    </label>
                    <input
                      type="text"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="demo@exemplo.com"
                      className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white font-mono-tech"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-tech text-gray-400 uppercase mb-1">
                      Senha Demo
                    </label>
                    <input
                      type="text"
                      value={demoPassword}
                      onChange={(e) => setDemoPassword(e.target.value)}
                      placeholder="DemoPass123!"
                      className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white font-mono-tech"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-tech text-gray-400 uppercase mb-1">
                      Papel / Role Simulado
                    </label>
                    <input
                      type="text"
                      value={demoRole}
                      onChange={(e) => setDemoRole(e.target.value)}
                      placeholder="Ex: Admin / Dono"
                      className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white font-mono-tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-tech text-gray-400 uppercase mb-1">
                    Instrução / Nota para os Visitantes (PT-BR)
                  </label>
                  <input
                    type="text"
                    value={demoNotesPt}
                    onChange={(e) => setDemoNotesPt(e.target.value)}
                    placeholder="Ex: Ambiente de testes para simular fluxos comerciais."
                    className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-white/10 rounded text-xs text-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono-tech text-gray-500">
              {isEditing ? 'Projeto existente será atualizado.' : 'Novo projeto será criado no banco de dados.'}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-white/10 hover:bg-white/5 text-gray-300 rounded text-xs font-mono-tech uppercase font-bold cursor-pointer transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-white hover:bg-indigo-500 hover:text-white text-black font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar & Publicar')}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
