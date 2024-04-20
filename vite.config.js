import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      'custom.scss': path.resolve(__dirname, 'src/custom.scss'),
      'custom-context': path.resolve(__dirname, 'src/context.jsx'),
      // Add more aliases as needed
    },
  },
})
