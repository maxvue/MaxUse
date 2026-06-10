import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { getColorFromVar } from './getColorFromVar';

describe('getColorFromVar', () => {
    it('retorna string vazia para input vazio', () => {
        expect(getColorFromVar('')).toBe('');
    });

    it('retorna string vazia para input null (via Ref)', () => {
        expect(getColorFromVar(ref('') as any)).toBe('');
    });

    it('retorna valor de variável CSS definida no :root', () => {
        // Define uma variável CSS no :root para teste
        document.documentElement.style.setProperty('--test-color', '#ff0000');
        const result = getColorFromVar('--test-color');
        expect(result).toBe('#ff0000');
    });

    it('aceita formato var(--name)', () => {
        document.documentElement.style.setProperty('--primary', '#00ff00');
        const result = getColorFromVar('var(--primary)');
        expect(result).toBe('#00ff00');
    });

    it('retorna string vazia para variável inexistente', () => {
        const result = getColorFromVar('--inexistente');
        expect(result).toBe('');
    });

    it('funciona com Ref', () => {
        document.documentElement.style.setProperty('--ref-color', '#0000ff');
        const result = getColorFromVar(ref('--ref-color'));
        expect(result).toBe('#0000ff');
    });
});
