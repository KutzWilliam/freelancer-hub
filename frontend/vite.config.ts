import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Adicionar esta linha de importação

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicionar esta seção 'resolve'
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  }
})
