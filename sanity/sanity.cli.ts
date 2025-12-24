import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'cwx5k0kx',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
  typegen: {
    path: '../src/**/*.{ts,tsx,js,jsx}',
    schema: './schema.json',
    generates: '../src/lib/sanity/types.ts',
    overloadClientMethods: true,
  },
})
