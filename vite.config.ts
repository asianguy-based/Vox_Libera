import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No API keys needed: speech is generated entirely client-side via the
// browser's built-in Web Speech API (SpeechSynthesis), using the user's
// own device/OS voices. This keeps the app 100% free to run and host.
export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true as true,
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true as true,
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
