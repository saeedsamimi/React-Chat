import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5712,
		proxy: {
			'/api': {
				target: 'http://localhost:7000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/socket.io': {
				target: 'ws://localhost:7000',
				changeOrigin: true,
				ws: true
			}
		}
	}
})
