const path = require('path');
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: '@sigmie-vue',
      fileName: (format) => `index.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue()],
});