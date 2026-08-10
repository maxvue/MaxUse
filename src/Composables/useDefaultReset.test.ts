import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { useDefaultReset, refAutoReset } from './useDefaultReset';

describe('useDefaultReset', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
    });

    it('inicializa com o valor fornecido', () => {
        scope.run(() => {
            const state = useDefaultReset({ nome: 'João', age: 30 });
            expect(state.value).toEqual({ nome: 'João', age: 30 });
        });
    });

    it('reset restaura valor original', () => {
        scope.run(() => {
            const state = useDefaultReset({ nome: 'João' });
            state.value.nome = 'Maria';
            expect(state.value.nome).toBe('Maria');

            state.reset();
            expect(state.value.nome).toBe('João');
        });
    });

    it('reset com primitivo funciona', () => {
        scope.run(() => {
            const state = useDefaultReset('hello');
            state.value = 'world';
            state.reset();
            expect(state.value).toBe('hello');
        });
    });

    it('gera novo ULID quando id === "ulid"', () => {
        scope.run(() => {
            const state = useDefaultReset({ id: 'ulid', nome: 'Teste' });
            const firstId = (state.value as any).id;

            // ULID deve ter 26 caracteres
            expect(firstId.length).toBe(26);

            state.reset();
            const secondId = (state.value as any).id;
            expect(secondId.length).toBe(26);
            // ULIDs devem ser diferentes
            expect(firstId).not.toBe(secondId);
        });
    });

    it('define created_at como data atual quando created_at === "now"', () => {
        scope.run(() => {
            const before = new Date().toISOString().slice(0, 10);
            const state = useDefaultReset({ id: 'ulid', created_at: 'now' });
            const createdAt = (state.value as any).created_at;

            // Deve ser uma string ISO com a data de hoje
            expect(createdAt).toContain(before);
        });
    });

    it('clona valor inicial (sem compartilhar referência)', () => {
        scope.run(() => {
            const original = { items: [1, 2, 3] };
            const state = useDefaultReset(original);
            state.value.items.push(4);
            state.reset();
            // Deve restaurar sem o 4
            expect(state.value.items).toEqual([1, 2, 3]);
        });
    });

    it('expõe initialData e timer', () => {
        scope.run(() => {
            const state = useDefaultReset('test', null);
            expect(state.initialData).toBe('test');
            expect(state.timer).toBeNull();
        });
    });
});

describe('refAutoReset (alias)', () => {
    it('é funcional como alias de useDefaultReset', () => {
        const scope = effectScope();
        scope.run(() => {
            const state = refAutoReset('hello');
            state.value = 'changed';
            state.reset();
            expect(state.value).toBe('hello');
        });
        scope.stop();
    });
});

describe('useDefaultReset com timer', () => {
    it('inicializa watcher debounced quando timer é passado', async () => {
        vi.useFakeTimers();
        const scope = effectScope();
        await scope.run(async () => {
            const state = useDefaultReset('auto', 500);
            expect(state.timer).toBe(500);
            expect(state.value).toBe('auto');

            state.value = 'changed';
            await nextTick();
            vi.advanceTimersByTime(1500);
            await nextTick();

            expect(state.value).toBe('auto');
        });
        scope.stop();
        vi.useRealTimers();
    });

    it('reseta objeto por timer uma única vez sem entrar em loop infinito', async () => {
        vi.useFakeTimers();
        const scope = effectScope();
        await scope.run(async () => {
            const state = useDefaultReset({ a: 1 }, 500);
            const spy = vi.spyOn(state, 'reset');

            state.value.a = 99;
            await nextTick();
            vi.advanceTimersByTime(1000);
            await nextTick();

            expect(state.value.a).toBe(1);
            // 1 reset do timer capturado após criar o spy
            expect(spy).toHaveBeenCalledTimes(1);

            // Avança mais tempo e verifica que NENHUM novo reset ocorreu em loop
            vi.advanceTimersByTime(2000);
            await nextTick();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        scope.stop();
        vi.useRealTimers();
    });

    it('detecta mutação profunda em objeto via timer com deep: true', async () => {
        vi.useFakeTimers();
        const scope = effectScope();
        await scope.run(async () => {
            const state = useDefaultReset({ user: { name: 'Ana' } }, 300);
            state.value.user.name = 'Beatriz';

            await nextTick();
            vi.advanceTimersByTime(500);
            await nextTick();

            expect(state.value.user.name).toBe('Ana');
        });
        scope.stop();
        vi.useRealTimers();
    });

    it('não ativa timer quando timer for 0, null ou negativo', async () => {
        vi.useFakeTimers();
        const scope = effectScope();
        await scope.run(async () => {
            const state = useDefaultReset({ val: 1 }, 0);
            state.value.val = 2;

            await nextTick();
            vi.advanceTimersByTime(1000);
            await nextTick();

            expect(state.value.val).toBe(2);
        });
        scope.stop();
        vi.useRealTimers();
    });

    it('trata initialData undefined graciosamente sem lançar erro', () => {
        const scope = effectScope();
        scope.run(() => {
            const state = useDefaultReset(undefined as any);
            expect(state.value).toBeUndefined();
            state.reset();
            expect(state.value).toBeUndefined();
        });
        scope.stop();
    });

    it('reset funciona com array de objetos', () => {
        const scope = effectScope();
        scope.run(() => {
            const state = useDefaultReset([{ id: 1 }, { id: 2 }]);
            (state.value as any[]).push({ id: 3 });
            expect((state.value as any[]).length).toBe(3);
            state.reset();
            expect((state.value as any[]).length).toBe(2);
        });
        scope.stop();
    });

    it('preserva Date após reset', () => {
        const scope = effectScope();
        scope.run(() => {
            const state = useDefaultReset({ d: new Date('2024-01-15') });
            state.value.d = new Date('2025-01-01');
            state.reset();
            expect(state.value.d).toBeInstanceOf(Date);
        });
        scope.stop();
    });

    it('não lança com entrada circular', () => {
        const scope = effectScope();
        scope.run(() => {
            const o: any = { a: 1 }; o.self = o;
            expect(() => useDefaultReset(o)).not.toThrow();
        });
        scope.stop();
    });
});

