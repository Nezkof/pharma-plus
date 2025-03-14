import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

const option = { pretty: true };
const locals = { name: "My Pug" };

export default defineConfig({
   plugins: [pugPlugin(undefined, { pagesUrl: "./pages/" })],
   resolve: {
      alias: {
         "@": "/src",
      },
   },
});
