import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? '2025-01-01';
const token = import.meta.env.VITE_SANITY_TOKEN;

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion,
  useCdn: import.meta.env.PROD,
  token: token || undefined,
});

export function assertSanityConfigured() {
  if (isSanityConfigured) {
    return;
  }

  throw new Error(
    'Sanity is not configured. Set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET in your web/.env file.',
  );
}

