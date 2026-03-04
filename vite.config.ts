/**
 * @file vite.config.ts
 * @description Konfiguracja narzędzia budowania Vite.
 * Definiuje wtyczki (React, Tailwind), aliasy ścieżek oraz zmienne środowiskowe.
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Ładowanie zmiennych środowiskowych z pliku .env
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Udostępnienie klucza API Gemini dla frontendu
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Alias '@' wskazujący na katalog główny projektu
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Konfiguracja HMR (Hot Module Replacement)
      // W środowisku AI Studio HMR jest wyłączone, aby zapobiec migotaniu podczas edycji przez agenta.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
