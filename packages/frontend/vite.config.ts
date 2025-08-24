import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';


export default defineConfig((env) => ({
  plugins: [
		react(),
		// basicSsl()
  ],
	base: './',
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: true,
  },
	server: {
		proxy: {
			'/term_ws': {
				target: 'ws://localhost:3002',
				secure: false,
				rewriteWsOrigin: true,
				rewrite: (path) => path.replace(/^\/term_ws/, ''),
			},
		},
	},
}));