import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    'cypress-plugin-snapshots': {
      autoCleanUp: true,
    },
  },
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
});
