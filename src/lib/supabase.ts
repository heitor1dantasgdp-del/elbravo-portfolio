import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Browser local persistence is a development-only convenience. It is never a
// production substitute for authenticated Supabase persistence.
export const isLocalFallbackAllowed = (): boolean => !import.meta.env.PROD;

// Lazy or safe Supabase client instantiation
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
};

export const isPortfolioOwner = async (): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) return false;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return false;

  const { data, error } = await supabase
    .from('portfolio_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return !error && Boolean(data);
};

/**
 * Uploads an image (cover or screenshot) to Supabase Storage bucket `project-media`.
 * If Supabase is not configured or in offline/fallback mode, converts to data URL / object URL.
 */
export const uploadProjectMedia = async (
  file: File,
  folder: 'covers' | 'screenshots' = 'covers',
  projectSlug = 'unassigned'
): Promise<{ url: string; previewUrl?: string; error?: string }> => {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const safeSlug = projectSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const cleanFileName = `projects/${safeSlug}/${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('project-media')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        return { url: '', error: error.message };
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('project-media')
        .createSignedUrl(data.path, 60 * 60);

      if (signedUrlError || !signedUrlData?.signedUrl) {
        return { url: '', error: signedUrlError?.message || 'Could not create signed media URL.' };
      }

      // Persist the path marker, never a permanent or expiring URL.
      return { url: `supabase://project-media/${data.path}`, previewUrl: signedUrlData.signedUrl };
    } catch (err: any) {
      console.error('Error during media upload:', err);
      return { url: '', error: err?.message || 'Upload failed' };
    }
  }

  if (!isLocalFallbackAllowed()) {
    return { url: '', error: 'Supabase is not configured; media uploads are disabled in production.' };
  }

  // Development-only fallback: convert file directly to Data URL.
  const dataUrl = await fileToDataUrl(file);
  return { url: dataUrl };
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const resolveProjectMediaUrl = async (value?: string): Promise<string | undefined> => {
  if (!value || !value.startsWith('supabase://project-media/')) return value;
  const supabase = getSupabaseClient();
  if (!supabase) return undefined;
  const path = value.replace('supabase://project-media/', '');
  const { data, error } = await supabase.storage.from('project-media').createSignedUrl(path, 60 * 60);
  return error ? undefined : data.signedUrl;
};

export const deleteProjectMedia = async (value?: string): Promise<{ success: boolean; error?: string }> => {
  if (!value?.startsWith('supabase://project-media/')) return { success: true };
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured.' };
  const path = value.replace('supabase://project-media/', '');
  const { error } = await supabase.storage.from('project-media').remove([path]);
  return error ? { success: false, error: error.message } : { success: true };
};
