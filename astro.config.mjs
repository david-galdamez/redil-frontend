// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react()],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://comu-redil-api-development.up.railway.app',
          changeOrigin: true,
          secure: true,
        }
      }
    },
    plugins: [tailwindcss()]
  }
});