import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.mjs'),
      name: 'riscv-sliderules-cheatsheets',
      fileName: 'riscv-sliderules-cheatsheets',
    },
    manifest: false,
    rollupOptions: {
      external: [
        'src/isa/api-gen.js'
      ],
    },
  },
})