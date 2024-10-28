

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import autoprefixer from "autoprefixer";

// export default defineConfig({
//   plugins: [react()],
//   assetsInclude: ["**/*.Jpeg"],
//   build: {
//     sourcemap: true, // Enable source maps for the production build
//   },
//   css: {
//     devSourcemap: true, // Enable source maps in development mode
//     preprocessorOptions: {
//       scss: {},
//     },
//     postcss: {
//       plugins: [
//         autoprefixer({
//           overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
//         }),
//       ],
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.Jpeg"],
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
  },
});
