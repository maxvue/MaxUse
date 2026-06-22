import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { getColorFromVar, contrastColor } from './getColorFromVar';

describe('getColorFromVar', () => {
    it('retorna cor transparente para input vazio', () => {
        expect(getColorFromVar('').hexa().toUpperCase()).toBe('#00000000');
    });

    it('retorna cor transparente para input null ou vazio (via Ref)', () => {
        expect(getColorFromVar(ref('')).hexa().toUpperCase()).toBe('#00000000');
    });

    it('retorna valor de variável CSS definida no :root', () => {
        // Define uma variável CSS no :root para teste
        document.documentElement.style.setProperty('--test-color', '#ff0000');
        const result = getColorFromVar('--test-color');
        expect(result.hex().toUpperCase()).toBe('#FF0000');
    });

    it('aceita formato var(--name)', () => {
        document.documentElement.style.setProperty('--primary', '#00ff00');
        const result = getColorFromVar('var(--primary)');
        expect(result.hex().toUpperCase()).toBe('#00FF00');
    });

    it('retorna transparente para variável inexistente', () => {
        const result = getColorFromVar('--inexistente');
        expect(result.hexa().toUpperCase()).toBe('#00000000');
    });

    it('funciona com Ref', () => {
        document.documentElement.style.setProperty('--ref-color', '#0000ff');
        const result = getColorFromVar(ref('--ref-color'));
        expect(result.hex().toUpperCase()).toBe('#0000FF');
    });
});

describe('contrastColor', () => {
    it('retorna cor contrastante para cores claras', () => {
        const result = contrastColor('#ffffff');
        expect(result.toUpperCase()).toBe('#808080FF');
    });

    it('retorna cor contrastante para cores escuras', () => {
        const result = contrastColor('#000000');
        expect(result.toUpperCase()).toBe('#000000FF');

        const resultMedium = contrastColor('#505050');
        expect(resultMedium.toUpperCase()).toBe('#989898FF');
    });

    it('funciona de forma reativa com Ref', () => {
        const colorRef = ref('#ffffff');
        const result = contrastColor(colorRef);
        expect(result.toUpperCase()).toBe('#808080FF');
    });
});
