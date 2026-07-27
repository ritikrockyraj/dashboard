import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Global cache to prevent race conditions across multiple hooks
let globalSupabaseCache = null;
let fetchPromise = null;
let saveTimeout = null;

export function useLocalStorage(key, initialValue) {
  // 1. Initialize from LocalStorage synchronously
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });

  // 2. Fetch from Supabase on mount
  useEffect(() => {
    const fetchFromSupabase = async () => {
      // Ensure we only fetch once globally on initial load
      if (!fetchPromise) {
        fetchPromise = supabase
          .from('dashboard_store')
          .select('state')
          .eq('id', 'user_data')
          .single();
      }

      try {
        const { data, error } = await fetchPromise;
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = Row not found
          console.error('Supabase fetch error:', error);
          return;
        }

        if (data && data.state) {
          globalSupabaseCache = data.state;
          
          // If the cloud state has this key, update local React state and LocalStorage
          if (globalSupabaseCache[key] !== undefined) {
            setStoredValue(globalSupabaseCache[key]);
            window.localStorage.setItem(key, JSON.stringify(globalSupabaseCache[key]));
          }
        } else if (!globalSupabaseCache) {
          // Initialize empty cache if row doesn't exist yet
          globalSupabaseCache = {};
        }
      } catch (err) {
        console.error('Error syncing down from Supabase:', err);
      }
    };

    fetchFromSupabase();
  }, [key]);

  // 3. Setter handles React state, LocalStorage, and debounced Supabase sync
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update React state
      setStoredValue(valueToStore);
      
      // Update LocalStorage immediately
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Update global cache immediately
      if (!globalSupabaseCache) globalSupabaseCache = {};
      globalSupabaseCache[key] = valueToStore;

      // Auto-debounce Supabase upsert (wait 1 second after last change)
      if (saveTimeout) clearTimeout(saveTimeout);
      
      saveTimeout = setTimeout(async () => {
        console.log('Syncing state to Supabase...');
        const { error } = await supabase
          .from('dashboard_store')
          .upsert({ id: 'user_data', state: globalSupabaseCache });

        if (error) {
          console.error('Supabase upsert error:', error);
        } else {
          console.log('✅ Supabase sync complete!');
        }
      }, 1000); 

    } catch (error) {
      console.error('Error setting value:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
