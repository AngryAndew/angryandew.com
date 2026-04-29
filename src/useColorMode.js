import { useState, useCallback } from 'react';

const STORAGE_KEY = 'color-mode';
const VALID_MODES = ['light', 'dark'];

function getStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (VALID_MODES.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage unavailable (private browsing, disabled storage)
  }
  return null;
}

function getSystemPreference() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  } catch {
    // matchMedia unavailable
  }
  return 'light';
}

function getInitialMode() {
  return getStoredMode() || getSystemPreference();
}

export function useColorMode() {
  const [mode, setMode] = useState(getInitialMode);

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // persistence unavailable — mode still updates in memory
      }
      return next;
    });
  }, []);

  return { mode, toggleColorMode };
}

export default useColorMode;
