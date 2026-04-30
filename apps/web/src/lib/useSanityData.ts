import { useEffect, useState } from 'react';
import { assertSanityConfigured, sanityClient } from './sanity';

type SanityState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export function useSanityData<T>(query: string, params: Record<string, unknown> = {}) {
  const [state, setState] = useState<SanityState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        assertSanityConfigured();
        const data = await sanityClient.fetch<T>(query, params);

        if (!cancelled) {
          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : 'Failed to load Sanity data.',
            loading: false,
          });
        }
      }
    }

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [query, JSON.stringify(params)]);

  return state;
}

export async function fetchSanityData<T>(query: string, params: Record<string, unknown> = {}) {
  assertSanityConfigured();
  return sanityClient.fetch<T>(query, params);
}

