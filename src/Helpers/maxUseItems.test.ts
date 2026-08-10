import { describe, it, expect } from 'vitest';
import { maxUseItems, maxUseAutoImport } from './maxUseItems';

describe('maxUseItems', () => {
    it('retorna array não-vazio', () => {
        const items = maxUseItems();
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBeGreaterThan(0);
    });

    it('retorna items ordenados', () => {
        const items = maxUseItems();
        const sorted = [...items].sort();
        expect(items).toEqual(sorted);
    });

    it('contém funções conhecidas da biblioteca', () => {
        const items = maxUseItems();
        // Amostra representativa dos módulos
        expect(items).toContain('deepClone');
        expect(items).toContain('isBlank');
        expect(items).toContain('orderBy');
        expect(items).toContain('isNumber');
        expect(items).toContain('addTime');
        expect(items).toContain('formatCurrency');
        expect(items).toContain('isCpf');
        expect(items).toContain('useDefaultReset');
    });

    it('não contém "vueUse" (filtrado)', () => {
        const items = maxUseItems();
        expect(items).not.toContain('vueUse');
    });

    it('não contém duplicatas', () => {
        const items = maxUseItems();
        const unique = new Set(items);
        expect(unique.size).toBe(items.length);
    });
});

describe('maxUseAutoImport', () => {
    it('é uma função chamável que retorna a configuração de auto-import', () => {
        expect(typeof maxUseAutoImport).toBe('function');
        const config = maxUseAutoImport();
        expect(Array.isArray(config)).toBe(true);
        expect(config[0]).toHaveProperty('@maxvue/max-use');
    });

    it('garante que todos os itens de maxUseItems estão presentes no autoImportData', () => {
        const items = maxUseItems();
        const config = maxUseAutoImport();
        const autoImportItems = (config[0] as any)['@maxvue/max-use'];
        for (const item of items) expect(autoImportItems).toContain(item);

    });
});
