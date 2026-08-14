import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ets2la.cn',
  output: 'static',
  build: { format: 'directory' }
});
