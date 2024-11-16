import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import viteCompression from "vite-plugin-compression"; // Import the compression plugin

export default defineConfig({
  plugins: [
    react(),
    // viteCompression({
    //   algorithm: "gzip", // Use gzip for compression (you can switch to 'brotliCompress' for Brotli)
    //   ext: ".gz", // Add a .gz extension for the compressed files
    //   threshold: 10240, // Only compress files larger than 10KB
    //   deleteOriginFile: true, // Keep the original uncompressed files
    // }),
  ],
  assetsInclude: ["**/*.jpeg", "**/*.jpg", "**/*.Jpeg", "**/*.JPG", "**/*.png"],
  build: {
    sourcemap: false, // Disable source maps for production (prevents React-Bootstrap source map issues)
    target: "esnext", // Supports modern JavaScript features like top-level await
    chunkSizeWarningLimit: 1000, // Suppress warnings for chunks larger than 500kB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large libraries into separate chunks for better performance
          react: ["react", "react-dom"],
          bootstrap: ["react-bootstrap"],
        },
      },
    },
  },
  css: {
    devSourcemap: true, // Keep source maps for development
    preprocessorOptions: {
      scss: {},
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
        }),
      ],
    },
  },
});
