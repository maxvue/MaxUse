import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        env: {
            TZ: 'America/Sao_Paulo'
        },
        include: ['src/**/*.test.ts'],
        // Avaliação das asserções `expectTypeOf` dos testes. Desligado no `vitest run`
        // padrão para não penalizar o ciclo comum; roda via `npm run test:types`.
        typecheck: {
            enabled: false,
            include: ['src/**/*.test.ts'],
            tsconfig: './tsconfig.test.json'
        },
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/index.ts',
                'src/scripts/**',
                'src/json/**',
                'src/**/*.test.ts',
                'src/Helpers/autoImportData.json',
                'src/Helpers/VueUse/**',
                'src/Helpers/Locales/**'
            ]
        }
    },
    resolve: {
        alias: { '@': '/src' }
    }
});
