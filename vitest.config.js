import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
    test:{
        globals: true,
        reporters: ["default", "html"],
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '~': fileURLToPath(new URL('./tests', import.meta.url)),
        },
    }
});