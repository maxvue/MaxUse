import { ref, type Ref } from 'vue';
import { ulid } from 'ulid';
import { watchDebounced } from '@vueuse/core';

/**
 * Tipo de retorno do composable {@link useDefaultReset}.
 * Estende uma Ref adicionando o método `reset()` para restaurar ao valor inicial.
 *
 * @template T - O tipo do valor armazenado na Ref.
 */
export type DefaultReset<T> = ([T] extends [Ref] ? T : Ref<T>) & {
    reset(): void;
    initialData?: any;
    timer?: number | null;
};

/**
 * Cria uma Ref com capacidade de reset ao valor inicial.
 * Opcionalmente, reseta automaticamente após um período de inatividade (debounce).
 * Útil para formulários, estados temporários e valores que precisam voltar ao padrão.
 *
 * Comportamentos especiais no valor inicial:
 * - Se `initialData.id === 'ulid'`, gera um novo ULID a cada reset.
 * - Se `initialData.created_at === 'now'`, define a data atual a cada reset.
 *
 * @param initialData - O valor inicial (será clonado internamente via JSON).
 * @param timer - Tempo em ms para auto-reset após mudança (null desativa). Padrão: null.
 * @returns Uma Ref estendida com o método `reset()`.
 *
 * @example
 * ```typescript
 * const form = useDefaultReset({ nome: '', email: '' });
 * form.value.nome = 'João';
 * form.reset(); // volta para { nome: '', email: '' }
 *
 * // Com auto-reset após 3 segundos de inatividade
 * const mensagem = useDefaultReset('', 3000);
 * mensagem.value = 'Salvo com sucesso!';
 * // Após 3s → volta para ''
 * ```
 */
export function useDefaultReset<T>(initialData: T, timer: number | null = null): DefaultReset<T> {
    const state = ref<T>() as DefaultReset<T>;
    state.initialData = JSON.parse(JSON.stringify(initialData));

    state.reset = () => {
        const new_data = JSON.parse(JSON.stringify(state.initialData));
        if (typeof state.initialData === 'object') {
            if ((state.initialData as any)?.id === 'ulid') (new_data as any).id = ulid().toLowerCase();
            if ((state.initialData as any)?.created_at === 'now') (new_data as any).created_at = new Date().toISOString();
        }
        state.value = new_data;
    };

    state.reset();
    state.timer = timer;

    if (timer) watchDebounced(state, () => state.reset(), { debounce: timer });


    return state as DefaultReset<T>;
}

/** Alias de {@link useDefaultReset}. */
export const refAutoReset = useDefaultReset;
