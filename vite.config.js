import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
    base: "/devops/",
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
        proxy: {
            "/": {
                target: "https://p1sch.outsrkem.top:20287",
                changeOrigin: true,
            },
        },
    },
});
