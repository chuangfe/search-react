import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig((config) => {

  return {
    base: '/',
    publicDir: 'public',
    plugins: [
      svgr(),
      react({ tsDecorators: true })
    ],
    server: {
      port: 3000,
      cors: true
    },
    preview: {
      port: 8080
    },
    resolve: {
      alias: {
        '@src': '/src'
      }
    },
    build: {
      ssr: false,
      minify: 'esbuild',
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true
    },
    esbuild: {
      /**
       * `drop` is not mindful of any side-effects of evaluating those function calls,
       * which could introduce problems in your code, but `pure` is, and will only remove them when it's safe to do so.
       */
      drop: ['debugger'],
      pure: config.mode === 'production' ? ['console.log', 'console.debug'] : []
    }
  }
})
