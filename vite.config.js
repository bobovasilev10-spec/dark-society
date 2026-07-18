import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        define: {
            "process.env.APP_URL": JSON.stringify(env.APP_URL),
        },
        plugins: [
            react(),
            laravel({
                input: [
                    "resources/css/app.css",
                    "resources/js/app.js",
                    "resources/js/src/index.jsx",
                    "resources/css/filament/admin/theme.css",
                ],
                refresh: true,
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "resources/js/src"),
            },
        },
    };
});
