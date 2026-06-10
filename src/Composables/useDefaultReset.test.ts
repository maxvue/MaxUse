import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, ref, nextTick } from 'vue';
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
});
