import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

const base = "/dharaniepportfolio/";

export default defineConfig({
  nitro: false,
  envDefine: false,
  tanstackStart: {
    server: { entry: "server" },
    router: { basepath: base },
    spa: {
      enabled: true,
      prerender: { outputPath: "/index.html", autoSubfolderIndex: false },
    },
  },
  vite: {
    base,
    resolve: {
      alias: [{
        find: "@/lib/content.functions",
        replacement: fileURLToPath(new URL("./src/lib/content.pages.ts", import.meta.url)),
      }],
    },
    environments: {
      client: { build: { outDir: "dist" } },
      ssr: { build: { outDir: ".tanstack/pages-server" } },
    },
  },
});
