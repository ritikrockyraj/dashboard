import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  // 2. Async fetch from Supabase on mount (overwrites local if cloud has data)
  useEffect(() => {
    if (!supabase) return; // Skip if no Supabase configured

    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('app_state')
          .select('value')
          .eq('key', key)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
          console.error('Supabase fetch error:', error);
          return;
        }

        if (data && data.value) {
          setStoredValue(data.value);
          window.localStorage.setItem(key, JSON.stringify(data.value));
        }
      } catch (err) {
        console.error('Error syncing down from Supabase:', err);
      }
    };

    fetchFromSupabase();
  }, [key]);

  // 3. Setter updates React state, LocalStorage, and Supabase
  const setValue = async (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update React state
      setStoredValue(valueToStore);
      
      // Update LocalStorage (Optimistic)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Update Supabase in background
      if (supabase) {
        const { error } = await supabase
          .from('app_state')
          .upsert({ key, value: valueToStore }, { onConflict: 'key' });

        if (error) {
          console.error('Supabase upsert error:', error);
        }
      }
    } catch (error) {
      console.error('Error setting value:', error);
    }
  };

  return [storedValue, setValue];
}
