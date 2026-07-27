import { useState, useEffect, useCallback } from 'react';

// Lazy-load supabase so a bad import never crashes the entire app
let supabaseClient = null;
const getSupabase = async () => {
  if (supabaseClient) return supabaseClient;
  try {
    const { supabase } = await import('../lib/supabase.js');
    supabaseClient = supabase;
    return supabaseClient;
  } catch (e) {
    console.warn('Supabase failed to load, running in offline mode.', e);
    return null;
  }
};

// Global cache to prevent race conditions across multiple hooks
let globalSupabaseCache = null;
let fetchPromise = null;
let saveTimeout = null;

export function useLocalStorage(key, initialValue) {
  // 1. Initialize from LocalStorage synchronously (works offline)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 2. Async cloud fetch on mount — NEVER throws
  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        const sb = await getSupabase();
        if (!sb) return; // Offline mode - skip silently

        if (!fetchPromise) {
          fetchPromise = sb
            .from('dashboard_store')
            .select('state')
            .eq('id', 'user_data')
            .single();
        }

        const { data, error } = await fetchPromise;

        if (error && error.code !== 'PGRST116') {
          console.warn('Supabase fetch error (non-fatal):', error.message);
          return;
        }

        if (data?.state) {
          globalSupabaseCache = data.state;
          if (globalSupabaseCache[key] !== undefined) {
            setStoredValue(globalSupabaseCache[key]);
            window.localStorage.setItem(key, JSON.stringify(globalSupabaseCache[key]));
          }
        } else {
          globalSupabaseCache = globalSupabaseCache ?? {};
        }
      } catch (err) {
        // Log but NEVER re-throw — app must keep working without cloud sync
        console.warn('Cloud sync unavailable, using local storage only.', err?.message);
      }
    };

    fetchFromSupabase();
  }, [key]);

  // 3. Setter — updates state + localStorage + debounced cloud sync
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      if (!globalSupabaseCache) globalSupabaseCache = {};
      globalSupabaseCache[key] = valueToStore;

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        try {
          const sb = await getSupabase();
          if (!sb) return;
          const { error } = await sb
            .from('dashboard_store')
            .upsert({ id: 'user_data', state: globalSupabaseCache });
          if (error) console.warn('Supabase save error (non-fatal):', error.message);
          else console.log('✅ Cloud sync complete');
        } catch (e) {
          console.warn('Cloud save failed silently.', e?.message);
        }
      }, 1000);
    } catch (error) {
      console.error('Error setting value:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
