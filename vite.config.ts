import path from 'node:path';
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default defineConfig({
    plugins: [
        vue(),
        dts({ rollupTypes: false }),
        generateExportsManifest()
    ],
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, './src/index.ts'),
                browser: path.resolve(__dirname, './src/Helpers/Browser/index.ts'),
                dates: path.resolve(__dirname, './src/Helpers/Dates/index.ts'),
                electrical: path.resolve(__dirname, './src/Helpers/Electrical/index.ts'),
                format: path.resolve(__dirname, './src/Helpers/Format/index.ts'),
                lang: path.resolve(__dirname, './src/Helpers/Lang/index.ts'),
                functions: path.resolve(__dirname, './src/Helpers/Functions/index.ts'),
                utils: path.resolve(__dirname, './src/Helpers/Utils/index.ts'),
                seq: path.resolve(__dirname, './src/Helpers/Seq/index.ts'),
                iterables: path.resolve(__dirname, './src/Helpers/Iterables/index.ts'),
                math: path.resolve(__dirname, './src/Helpers/Math/index.ts'),
                objects: path.resolve(__dirname, './src/Helpers/Objects/index.ts'),
                strings: path.resolve(__dirname, './src/Helpers/Strings/index.ts'),
                types: path.resolve(__dirname, './src/Helpers/Types/index.ts'),
                validations: path.resolve(__dirname, './src/Helpers/Validations/index.ts'),
                vueuse: path.resolve(__dirname, './src/Helpers/VueUse/index.ts'),
                composables: path.resolve(__dirname, './src/Composables/index.ts'),
                routes: path.resolve(__dirname, './src/Routes/index.ts'),
                vueUseCore: path.resolve(__dirname, './src/Helpers/VueUse/core.ts')
            },
            name: 'max-use',
            fileName: (format, entryName) => `${entryName}.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'vue',
                'vue-router',
                'node:fs',
                'node:fs/promises',
                'node:path',
                'node:url',
                ...Object.keys(pkg.dependencies || {}),
                ...Object.keys(pkg.peerDependencies || {})
            ],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            },
            onLog(level, log, handler) {
                if (log.code === 'INVALID_ANNOTATION') return;
                handler(level, log);
            }
        },
        sourcemap: true,
        minify: false
    },
    resolve: {
        alias: {}
    }
});


function generateExportsManifest(): Plugin {
    return {
        name: 'generate-exports-manifest',
        generateBundle(options, bundle) {
            let exportsList: string[] = [];

            // Procura pelo arquivo principal gerado (entry chunk)
            for (const fileName in bundle) {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk' && chunk.isEntry) {
                    // A propriedade 'exports' contém apenas o que foi exposto publicamente!
                    exportsList = chunk.exports;
                    break;
                }
            }

            // Remove a exportação padrão 'default' se não quiser usá-la
            const filteredExports = exportsList.filter((name) => name !== 'default');

            // Emite um novo arquivo JSON na pasta dist
            this.emitFile({
                type: 'asset',
                fileName: 'exports.json',
                source: JSON.stringify(filteredExports, null, 2)
            });
        }
    };
}