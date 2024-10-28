import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.Jpeg"],
  build: {
    sourcemap: true, // Enable source maps for the production build
  },
  css: {
    devSourcemap: true, // Enable source maps in development mode
    preprocessorOptions: {
      scss: {
        sourceMap: true, // Enable source maps for Sass
      },
    },
  },
});
