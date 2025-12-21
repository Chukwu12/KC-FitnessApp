import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'cwx5k0kx',
  dataset: 'production', 
  apiVersion: '2024-01-01',
  useCdn: true,
});
