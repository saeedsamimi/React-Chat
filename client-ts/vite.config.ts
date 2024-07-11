import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path';
import tsconfigPaths from "vite-tsconfig-paths";

const root = resolve(__dirname, 'src')

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        host: '0.0.0.0',
        port: 5712,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:6430',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    resolve: {
        alias: {
            '@styles': resolve(root, 'assets/styles'),
            '@components': resolve(root, 'Components'),
            '@pages': resolve(root, 'Pages'),
            '@hooks': resolve(root, 'Hooks'),
            '@routers': resolve(root, 'Routers'),
            '@contexts': resolve(root, 'Contexts'),
            '@types': resolve(root, 'Types')
        }
    },
})
