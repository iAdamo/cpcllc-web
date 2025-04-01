import { useEffect, useCallback, useReducer } from "react";

export type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

export async function setStorageItemAsync(key: string, value: string | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error setting storage item (${key}):`, error);
  }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>();

  const fetchStorageItem = useCallback(async () => {
    try {
      const value = localStorage.getItem(key);
      console.log(value);
      setState(value ? JSON.parse(value) : null);
    } catch (error) {
      console.error(`Error fetching storage item (${key}):`, error);
    }
  }, [key, setState]);

  useEffect(() => {
    fetchStorageItem();
  }, [fetchStorageItem]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key, setState]
  );

  return [state, setValue];
}

export function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}
