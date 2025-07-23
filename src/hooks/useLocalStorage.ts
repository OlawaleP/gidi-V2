import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: SetValue<T>) => void;
  removeValue: () => void;
  loading: boolean;
  error: string | null;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Get value from localStorage
  const getValue = useCallback((): T => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setError(`Failed to read from localStorage: ${error}`);
      return initialValue;
    }
  }, [key, initialValue]);

  const setValue = useCallback((value: SetValue<T>) => {
    try {
      setError(null);
      
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        window.dispatchEvent(
          new CustomEvent('localStorage', {
            detail: { key, newValue: valueToStore }
          })
        );
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(`Failed to write to localStorage: ${error}`);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch custom event to sync across components
        window.dispatchEvent(
          new CustomEvent('localStorage', {
            detail: { key, newValue: undefined }
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(`Failed to remove from localStorage: ${error}`);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
          setError(`Failed to parse localStorage value: ${error}`);
        }
      } else if ('detail' in e && e.detail.key === key) {
        setStoredValue(e.detail.newValue ?? initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('localStorage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  useEffect(() => {
    try {
      setLoading(true);
      const value = getValue();
      setStoredValue(value);
      setError(null);
    } catch (error) {
      console.error(`Error initializing localStorage for key "${key}":`, error);
      setError(`Failed to initialize localStorage: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [getValue, key]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    loading,
    error
  };
}

export function useLocalStorageMultiple<T extends Record<string, unknown>>(
  keys: Record<keyof T, string>,
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as Record<keyof T, string | null>);

  useEffect(() => {
    const loadValues = async () => {
      setLoading(true);
      const newValues = { ...initialValues };
      const newErrors = {} as Record<keyof T, string | null>;

      for (const [valueKey, storageKey] of Object.entries(keys)) {
        try {
          if (typeof window !== 'undefined') {
            const item = window.localStorage.getItem(storageKey);
            if (item) {
              newValues[valueKey as keyof T] = JSON.parse(item);
            }
          }
          newErrors[valueKey as keyof T] = null;
        } catch (error) {
          console.error(`Error loading localStorage key "${storageKey}":`, error);
          newErrors[valueKey as keyof T] = `Failed to load ${valueKey}`;
        }
      }

      setValues(newValues);
      setErrors(newErrors);
      setLoading(false);
    };

    loadValues();
  }, []);

  const updateValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    try {
      const storageKey = keys[key];
      setValues(prev => ({ ...prev, [key]: value }));
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
      }
      
      setErrors(prev => ({ ...prev, [key]: null }));
    } catch (error) {
      console.error(`Error updating localStorage key "${keys[key]}":`, error);
      setErrors(prev => ({ ...prev, [key]: `Failed to update ${String(key)}` }));
    }
  }, [keys]);

  const removeValue = useCallback(<K extends keyof T>(key: K) => {
    try {
      const storageKey = keys[key];
      setValues(prev => ({ ...prev, [key]: initialValues[key] }));
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
      
      setErrors(prev => ({ ...prev, [key]: null }));
    } catch (error) {
      console.error(`Error removing localStorage key "${keys[key]}":`, error);
      setErrors(prev => ({ ...prev, [key]: `Failed to remove ${String(key)}` }));
    }
  }, [keys, initialValues]);

  return {
    values,
    errors,
    loading,
    updateValue,
    removeValue
  };
}