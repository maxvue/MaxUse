import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';

export default defineConfig({
    plugins: [
        vue(),
        UnoCSS({
            configFile: '../uno.config.ts'
        })
    ],
    root: resolve(__dirname),
    server: {
        host: true,
        open: false,
        cors: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        }
    },
    define: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
    }
});
