import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // listen on all interfaces so phones on the same WiFi can connect
    port: 5173,
    proxy: {
      // Forward all /api requests to the Express backend on the laptop.
      // This makes every device on the LAN work — the phone calls /api (same origin),
      // Vite forwards it to localhost:5000, the phone never needs to reach localhost directly.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssTarget: ['chrome80', 'firefox80', 'safari14', 'edge80'],
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown requires manualChunks to be a function, not an object
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['react', 'react-dom', 'react-router-dom'].some(p => id.includes(`/${p}/`))) return 'react-core';
            if (['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'].some(p => id.includes(p))) return 'mui';
            if (id.includes('@tanstack/react-query')) return 'query';
            if (['react-hook-form', '@hookform/resolvers', 'yup'].some(p => id.includes(p))) return 'forms';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('bootstrap') || id.includes('react-bootstrap')) return 'bootstrap-ui';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('zustand')) return 'zustand';
          }
        },
        chunkFileNames:  'js/[name]-[hash].js',
        entryFileNames:  'js/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query', 'zustand'],
  },
})
