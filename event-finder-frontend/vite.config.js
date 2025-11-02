// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // यह सुनिश्चित करता है कि फ्रंटएंड से '/api' रिक्वेस्ट http://localhost:5050 पर जाएँ।
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false, 
      },
    }
    // 💡 FIX: 'server' ऑब्जेक्ट के लिए क्लोजिंग कर्ली ब्रेस
  } // <-- यह मिसिंग था!
})
