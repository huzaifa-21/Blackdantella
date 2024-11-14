
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "test/"],
      extension: [".js", ".ts", ".jsx", ".tsx"],
    }),
  ],
  assetsInclude: ["**/*.jpeg", "**/*.jpg", "**/*.Jpeg", "**/*.JPG"],
  optimizeDeps: {
    include: ["react-bootstrap"],
  },
  build: {
    sourcemap: true, // Enable source maps for the production build
    target: "esnext", // Ensure that the build supports modern JavaScript features like top-level await
  },
  css: {
    devSourcemap: true, // Enable source maps in development mode
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
    publicDir: "public",
  },
});
