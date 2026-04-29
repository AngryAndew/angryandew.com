import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import { useColorMode } from './useColorMode';

// ---------------------------------------------------------------------------
// Helpers — mock localStorage and matchMedia
// ---------------------------------------------------------------------------

function mockLocalStorage(store = {}) {
  const storage = { ...store };
  return {
    getItem: jest.fn((key) => (key in storage ? storage[key] : null)),
    setItem: jest.fn((key, value) => { storage[key] = value; }),
    removeItem: jest.fn((key) => { delete storage[key]; }),
    clear: jest.fn(() => { Object.keys(storage).forEach((k) => delete storage[k]); }),
    _store: storage,
  };
}

function mockMatchMedia(prefersDark) {
  return jest.fn((query) => ({
    matches: prefersDark && query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

// ---------------------------------------------------------------------------
// Property-based test — Feature: dark-mode-styling, Property 1:
// Color mode persistence round-trip
// Validates: Requirements 2.1, 2.2
// ---------------------------------------------------------------------------

describe('Property: Color mode persistence round-trip', () => {
  let originalLocalStorage;
  let originalMatchMedia;

  beforeEach(() => {
    originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    }
    window.matchMedia = originalMatchMedia;
  });

  test('persisted mode equals mode returned on re-initialization (100 runs)', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.constant('light'), fc.constant('dark')),
        (mode) => {
          // Use a shared backing store so writes are visible to subsequent reads
          const store = {};
          const storage = {
            getItem: (key) => (key in store ? store[key] : null),
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: (key) => { delete store[key]; },
          };
          Object.defineProperty(window, 'localStorage', {
            value: storage, writable: true, configurable: true,
          });
          window.matchMedia = mockMatchMedia(false);

          // Step 1: Initialize from empty storage — should default to 'light'
          const { result: r1, unmount: u1 } = renderHook(() => useColorMode());
          expect(r1.current.mode).toBe('light');

          // Step 2: Toggle until we reach the target mode (writes to store)
          if (mode === 'dark') {
            act(() => { r1.current.toggleColorMode(); });
          }
          expect(r1.current.mode).toBe(mode);
          u1();

          // Step 3: Re-initialize — hook should read persisted value from store
          const { result: r2, unmount: u2 } = renderHook(() => useColorMode());
          expect(r2.current.mode).toBe(mode);
          u2();
        },
      ),
      { numRuns: 100 },
    );
  });
});


// ---------------------------------------------------------------------------
// Unit tests — Requirements 2.1, 2.2, 2.3, 2.4
// ---------------------------------------------------------------------------

describe('useColorMode', () => {
  let originalLocalStorage;
  let originalMatchMedia;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true, configurable: true });
    window.matchMedia = originalMatchMedia;
  });

  // Requirement 2.3 — system preference fallback when localStorage is empty
  test('falls back to system dark preference when localStorage is empty', () => {
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage({}), writable: true, configurable: true });
    window.matchMedia = mockMatchMedia(true);

    const { result } = renderHook(() => useColorMode());
    expect(result.current.mode).toBe('dark');
  });

  test('falls back to system light preference when localStorage is empty', () => {
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage({}), writable: true, configurable: true });
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useColorMode());
    expect(result.current.mode).toBe('light');
  });

  // Requirement 2.4 — localStorage unavailable falls back to system preference
  test('falls back to system preference when localStorage throws', () => {
    const broken = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('SecurityError'); },
    };
    Object.defineProperty(window, 'localStorage', { value: broken, writable: true, configurable: true });
    window.matchMedia = mockMatchMedia(true);

    const { result } = renderHook(() => useColorMode());
    expect(result.current.mode).toBe('dark');
  });

  // Requirement 2.2 — invalid localStorage value falls back to system preference
  test('falls back to system preference when localStorage has invalid value', () => {
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage({ 'color-mode': 'auto' }), writable: true, configurable: true });
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useColorMode());
    expect(result.current.mode).toBe('light');
  });

  // Requirements 2.1, 2.2 — toggleColorMode flips mode and writes to localStorage
  test('toggleColorMode flips mode and writes to localStorage', () => {
    const ls = mockLocalStorage({});
    Object.defineProperty(window, 'localStorage', { value: ls, writable: true, configurable: true });
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useColorMode());
    expect(result.current.mode).toBe('light');

    act(() => { result.current.toggleColorMode(); });
    expect(result.current.mode).toBe('dark');
    expect(ls.setItem).toHaveBeenCalledWith('color-mode', 'dark');

    act(() => { result.current.toggleColorMode(); });
    expect(result.current.mode).toBe('light');
    expect(ls.setItem).toHaveBeenCalledWith('color-mode', 'light');
  });
});
