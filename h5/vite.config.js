import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import postcssPxToViewport from 'postcss-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport({
          viewportWidth: 375,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false
        })
      ]
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})
