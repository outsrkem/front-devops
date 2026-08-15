// vite.config.js
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const API_Endpoint = env.VITE_API_Endpoint;

    return {
        base: "/devops/",
        esbuild: {
            drop: ["console", "debugger"],
        },
        build: {
            outDir: "dist",
            rollupOptions: {
                input: {
                    main: resolve(__dirname, "index.html"),
                },
            },
        },
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],

        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },

        server: {
            host: "0.0.0.0",
            proxy: {
                "/api": {
                    target: API_Endpoint,
                    changeOrigin: true,
                    secure: false,
                },
                "/authui": {
                    target: API_Endpoint,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
