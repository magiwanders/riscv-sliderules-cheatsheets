import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/bindings.js'),
      name: 'riscv-sliderules-cheatsheets',
      fileName: 'riscv-sliderules-cheatsheets',
    },
  },
})