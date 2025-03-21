import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

export default defineConfig({
   server: {
      host: "localhost",
      port: 3000,
   },
   plugins: [
      pugPlugin({
         pretty: true,
         locals: { name: "My Pug" },
      }),
   ],
   resolve: {
      alias: {
         "@": "/src",
      },
   },
});
