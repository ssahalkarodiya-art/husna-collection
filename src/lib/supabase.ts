import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment variable retrieval with project defaults
const DEFAULT_URL = 'https://aqjqwbzfcnhnzqtjyiju.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxanF3YnpmY25obnpxdGp5aWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTIzODksImV4cCI6MjEwNTk4ODM4OX0.oJ9D5rCp0FuufmyyOfag01yN1wpHtYL-wdaHuB_q2G8';

const ENV_URL = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_URL;
const ENV_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

// Check if credentials are placeholders or empty
const isPlaceholder = (val: string) => {
  if (!val) return true;
  const lower = val.toLowerCase();
  return lower.includes('your-project') || lower.includes('your-anon-key') || lower.includes('my_');
};

export const getSupabaseConfig = () => {
  let storedUrl = '';
  let storedKey = '';
  try {
    storedUrl = localStorage.getItem('husna_supabase_url') || '';
    storedKey = localStorage.getItem('husna_supabase_anon_key') || '';
  } catch {
    // ignore
  }

  const url = storedUrl || (!isPlaceholder(ENV_URL) ? ENV_URL : DEFAULT_URL);
  const key = storedKey || (!isPlaceholder(ENV_KEY) ? ENV_KEY : DEFAULT_KEY);
  const isCustom = Boolean(storedUrl && storedKey);
  const isConfigured = Boolean(url && key && !isPlaceholder(url) && !isPlaceholder(key));

  return { url, key, isCustom, isConfigured };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

// Fallback mock URL if none provided, to ensure createClient doesn't throw a fatal init error
const currentConfig = getSupabaseConfig();
const defaultFallbackUrl = 'https://placeholder.supabase.co';
const defaultFallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase: SupabaseClient = createClient(
  currentConfig.isConfigured ? currentConfig.url : defaultFallbackUrl,
  currentConfig.isConfigured ? currentConfig.key : defaultFallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const saveSupabaseConfig = (url: string, key: string): boolean => {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    if (!cleanUrl || !cleanKey) return false;
    localStorage.setItem('husna_supabase_url', cleanUrl);
    localStorage.setItem('husna_supabase_anon_key', cleanKey);
    // Reload to re-initialize client
    window.location.reload();
    return true;
  } catch (err) {
    console.error('Failed to save Supabase credentials', err);
    return false;
  }
};

export const clearSupabaseConfig = (): void => {
  try {
    localStorage.removeItem('husna_supabase_url');
    localStorage.removeItem('husna_supabase_anon_key');
    window.location.reload();
  } catch (err) {
    console.error('Failed to clear Supabase credentials', err);
  }
};

export const testSupabaseConnection = async (
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getSupabaseConfig();
    const targetUrl = (testUrl || config.url).trim();
    const targetKey = (testKey || config.key).trim();

    if (!targetUrl || !targetKey || isPlaceholder(targetUrl) || isPlaceholder(targetKey)) {
      return {
        success: false,
        message: 'Please provide both a valid Supabase Project URL and Public Anon Key.',
      };
    }

    const testClient = createClient(targetUrl, targetKey);
    const { error } = await testClient.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, we still know the API is reachable if error is 42P01 (relation doesn't exist)
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! The "products" table has not been created yet — run the SQL schema migration in Supabase SQL editor.',
        };
      }
      return {
        success: false,
        message: `Connection test error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Connection successful! Products table reached and query completed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Unable to establish connection to Supabase endpoint.',
    };
  }
};
