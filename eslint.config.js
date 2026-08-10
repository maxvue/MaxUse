import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import eslintPluginVue from 'eslint-plugin-vue';

export default [
    {
        ignores: ['dist/**', 'coverage/**', 'src/Helpers/Locales/**', 'playground/**']
    },
    // 1º Bloco: Configuração Base (Aplica-se a TS, JS e Vue)
    {
        files: ['**/*.{ts,js,mts,vue}'],
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': typescriptEslint.plugin,
            'vue': eslintPluginVue
        },
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: typescriptEslint.parser,
                extraFileExtensions: ['.vue'],
                sourceType: 'module'
            }
        },
        rules: {
            'curly': ['error', 'multi'],
            '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
            // Regras Estilísticas Gerais
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/indent': ['error', 4], // Ativa 4 espaços para arquivos .ts e .js
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/no-trailing-spaces': 'warn',
            '@stylistic/no-multi-spaces': 'warn',
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/no-multiple-empty-lines': ['error', { max: 2 }],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: { delimiter: 'semi', requireLast: true },
                singleline: { delimiter: 'semi', requireLast: false }
            }],

            // Regras Globais do Vue
            'vue/block-order': ['error', {
                order: ['template', 'script', 'style']
            }],
            'vue/html-indent': ['error', 4],
            'vue/multi-word-component-names': 'off',
            'vue/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    },

    // 2º Bloco: Exceções exclusivas para arquivos .vue
    {
        files: ['**/*.vue'],
        rules: {
            '@stylistic/indent': 'off',
            'vue/script-indent': ['error', 4, {
                'baseIndent': 1,
                'switchCase': 1
            }],
            '@stylistic/padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'never', prev: 'import', next: 'import' }
            ]
        }
    }
];