import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
    it('formata número inteiro', () => {
        const result = formatCurrency(1000);
        expect(result).toContain('1.000');
        expect(result).toContain('R$');
    });

    it('formata número com decimais', () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain('1.234,56');
    });

    it('formata zero como R$ 0,00 (isBlank(0) intercepta)', () => {
        expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('retorna R$ 0,00 para null', () => {
        expect(formatCurrency(null)).toBe('R$ 0,00');
    });

    it('retorna R$ 0,00 para NaN', () => {
        expect(formatCurrency('abc')).toBe('R$ 0,00');
    });

    it('formata negativos', () => {
        const result = formatCurrency(-500);
        expect(result).toContain('500');
    });

    it('funciona com string numérica', () => {
        const result = formatCurrency('1234.56');
        expect(result).toContain('1.234');
    });

    it('funciona com Ref', () => {
        const result = formatCurrency(ref(100));
        expect(result).toContain('100');
    });
});
