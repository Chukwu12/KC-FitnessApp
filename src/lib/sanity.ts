// src/lib/sanity.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'cwx5k0kx', // your project ID
  dataset: 'production',
  apiVersion: '2025-12-15', // use today’s date or a fixed date
  useCdn: true, // `true` for cached, `false` for fresh data
});
