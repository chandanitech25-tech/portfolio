import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base path ensures all assets, scripts, stylesheets, and media
  // resolve correctly whether hosted at https://<username>.github.io/<repo-name>/
  // or at root / custom domain. It can also be overridden via VITE_BASE environment variable.
  base: process.env.VITE_BASE || './',
});
