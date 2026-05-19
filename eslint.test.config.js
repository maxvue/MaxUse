import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.ts'],
        plugins: {
            '@typescript-eslint': typescriptEslint.plugin,
            '@stylistic': stylistic
        },
        languageOptions: {
            parser: typescriptEslint.parser,
        },
        rules: {
            'curly': ['error', 'multi']
        }
    }
];
