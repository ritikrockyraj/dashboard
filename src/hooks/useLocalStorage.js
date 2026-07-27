import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Global cache — shared across all hook instances
let globalCache = null;
let fetchPromise = null;
let saveTimeout = null;

export function useLocalStorage(key, initialValue) {
  // 1. Sync init from localStorage (instant, works offline)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 2. On App Mount: fetch from dashboard_store where id = 'user_data'
  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        // Deduplicate: only one fetch across all hook instances
        if (!fetchPromise) {
          console.log('Supabase: fetching cloud state...');
          fetchPromise = supabase
            .from('dashboard_store')
            .select('data')
            .eq('id', 'user_data')
            .single();
        }

        const { data: row, error } = await fetchPromise;

        if (error) {
          if (error.code === 'PGRST116') {
            // Row doesn't exist yet — that's fine, will be created on first save
            console.log('Supabase: no existing data row, starting fresh.');
            globalCache = globalCache ?? {};
          } else {
            console.log('Supabase sync error:', error);
          }
          return;
        }

        if (row?.data) {
          console.log('Supabase: cloud data loaded ✅');
          globalCache = row.data;

          // Hydrate this key into React state and localStorage
          if (globalCache[key] !== undefined) {
            setStoredValue(globalCache[key]);
            window.localStorage.setItem(key, JSON.stringify(globalCache[key]));
          }
        } else {
          globalCache = globalCache ?? {};
        }
      } catch (err) {
        console.log('Supabase sync error:', err?.message);
      }
    };

    fetchFromSupabase();
  }, [key]);

  // 3. On State Change: upsert to dashboard_store with updated_at
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update React state + localStorage immediately
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Update global cache
      if (!globalCache) globalCache = {};
      globalCache[key] = valueToStore;

      // Debounce cloud save — 1 second after last change
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        try {
          console.log('Supabase: saving state to cloud...');
          const { error } = await supabase
            .from('dashboard_store')
            .upsert({
              id: 'user_data',
              data: globalCache,
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.log('Supabase sync error:', error);
          } else {
            console.log('Supabase: sync complete ✅');
          }
        } catch (err) {
          console.log('Supabase sync error:', err?.message);
        }
      }, 1000);

    } catch (error) {
      console.log('Supabase sync error:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
