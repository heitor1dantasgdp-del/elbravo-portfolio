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

/**
 * Uploads an image (cover or screenshot) to Supabase Storage bucket `project-media`.
 * If Supabase is not configured or in offline/fallback mode, converts to data URL / object URL.
 */
export const uploadProjectMedia = async (
  file: File,
  folder: 'covers' | 'screenshots' = 'covers'
): Promise<{ url: string; error?: string }> => {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('project-media')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        // Fallback to local data URL on upload failure so user experience is not blocked
        const fallbackUrl = await fileToDataUrl(file);
        return { url: fallbackUrl, error: error.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-media')
        .getPublicUrl(data.path);

      return { url: publicUrlData.publicUrl };
    } catch (err: any) {
      console.error('Error during media upload:', err);
      const fallbackUrl = await fileToDataUrl(file);
      return { url: fallbackUrl, error: err?.message || 'Upload failed' };
    }
  }

  // Fallback mode: convert file directly to Data URL
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
