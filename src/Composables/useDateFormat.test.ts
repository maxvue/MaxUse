import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { useDateFormat } from './useDateFormat';

describe('useDateFormat', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
    });

    it('formata data no padrão DD/MM/YYYY', () => {
        scope.run(() => {
            const result = useDateFormat('2026-06-15T12:00:00Z', 'DD/MM/YYYY');
            expect(result.value).toBe('15/06/2026');
        });
    });

    it('formata data com hora', () => {
        scope.run(() => {
            const result = useDateFormat('2026-06-15T14:30:00Z', 'YYYY-MM-DD HH:mm');
            expect(result.value).toContain('2026-06-15');
        });
    });

    it('usa data atual como fallback para null', () => {
        scope.run(() => {
            const result = useDateFormat(null, 'DD/MM/YYYY');
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            // Deve conter o dia de hoje
            expect(result.value).toContain(day);
        });
    });

    it('usa data atual como fallback para undefined', () => {
        scope.run(() => {
            const result = useDateFormat(undefined, 'YYYY');
            const year = new Date().getFullYear().toString();
            expect(result.value).toContain(year);
        });
    });

    it('aceita instância de Date', () => {
        scope.run(() => {
            // Usando hora 12:00 UTC para evitar mudança de dia no fuso local
            const result = useDateFormat(new Date('2026-01-15T12:00:00Z'), 'YYYY');
            expect(result.value).toContain('2026');
        });
    });

    it('não fabrica data plausível para string inválida', () => {
        scope.run(() => {
            const result = useDateFormat('data-invalida', 'DD/MM/YYYY');
            expect(result.value).not.toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        });
    });

    it('não fabrica data plausível para Date(NaN)', () => {
        scope.run(() => {
            const result = useDateFormat(new Date(NaN), 'DD/MM/YYYY');
            expect(result.value).not.toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        });
    });
});

describe('useDateFormat — regressão auditoria (achado 018, parte reatividade)', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => { scope = effectScope(); });
    afterEach(() => { scope.stop(); });

    it('mantém a reatividade quando a data chega depois (valor inicial nulo)', async () => {
        await scope.run(async () => {
            const data = ref<string | null>(null);
            const formatada = useDateFormat(data, 'DD/MM/YYYY');

            data.value = '2020-01-15';
            await nextTick();

            expect(formatada.value).toBe('15/01/2020');
        });
    });

    it('reage a mudanças subsequentes da fonte', async () => {
        await scope.run(async () => {
            const data = ref<string | null>('2020-01-15');
            const formatada = useDateFormat(data, 'DD/MM/YYYY');

            expect(formatada.value).toBe('15/01/2020');

            data.value = '2021-03-20';
            await nextTick();

            expect(formatada.value).toBe('20/03/2021');
        });
    });

    it('volta ao fallback se a data for removida', async () => {
        await scope.run(async () => {
            const data = ref<string | null>('2020-01-15');
            const formatada = useDateFormat(data, 'DD/MM/YYYY');

            data.value = null;
            await nextTick();

            // Fallback atual: data de hoje (comportamento preservado nesta correção)
            expect(formatada.value).toBeTruthy();
        });
    });
});
