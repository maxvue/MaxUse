import { watchDebounced, type WatchDebouncedOptions, whenever, type WheneverOptions } from '@vueuse/core';
import { watch, nextTick, type WatchSource, type WatchOptions, type WatchHandle } from 'vue';
import { isNotEmpty } from '../Helpers/Validations';

/** Alias de `whenever` do VueUse. Executa o callback apenas quando o source for truthy. */
export const watchTrue = whenever;

/**
 * Watch que dispara o callback somente quando o valor do source é válido (não-vazio via `isNotEmpty`).
 * Útil para reagir apenas quando dados reais estiverem disponíveis, ignorando estados null/undefined/vazio.
 *
 * @param source - A fonte reativa a ser observada.
 * @param callback - Função chamada com o valor válido (NonNullable) e o valor anterior.
 * @param options - Opções do watch (suporta `once`, `immediate`, `deep`, etc.).
 * @returns O handle do watcher para parar manualmente.
 *
 * @example
 * ```typescript
 * const usuario = ref<Usuario | null>(null);
 *
 * watchIfValid(usuario, (user) => {
 *     console.log('Usuário carregado:', user.nome);
 * });
 * ```
 */
export function watchIfValid<T, Immediate extends Readonly<boolean> = false>( source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WheneverOptions<Immediate> ): WatchHandle {
    const handle = watch( source, (value, oldValue) => {
        if (isNotEmpty(value)) return;

        if (options?.once) nextTick(() => handle.stop());

        callback(value as NonNullable<T>, oldValue);
    }, { ...options, once: false } as WatchOptions );

    return handle;
}

/** Alias de {@link watchIfValid}. */
export const watchValid = watchIfValid;
/** Alias de {@link watchIfValid}. */
export const watchIsValid = watchIfValid;
/** Alias de {@link watchIfValid}. */
export const watchIsValidComputed = watchIfValid;
/** Alias de {@link watchIfValid}. */
export const watchComputedIsValid = watchIfValid;

/**
 * Watch com debounce que dispara o callback somente quando o valor do source é válido.
 * Combina a funcionalidade de `watchDebounced` do VueUse com a validação de `isNotEmpty`.
 *
 * @param source - A fonte reativa a ser observada.
 * @param callback - Função chamada com o valor válido (NonNullable) e o valor anterior.
 * @param options - Opções do watchDebounced (suporta `debounce`, `maxWait`, `once`, etc.).
 * @returns O handle do watcher para parar manualmente.
 *
 * @example
 * ```typescript
 * const termoBusca = ref('');
 *
 * watchDebounceIfValid(termoBusca, (termo) => {
 *     buscarUsuarios(termo);
 * }, { debounce: 300 });
 * ```
 */
export function watchDebounceIfValid<T, Immediate extends Readonly<boolean> = false>( source: WatchSource<T>, callback: (value: NonNullable<T>, oldValue: T | undefined) => void, options?: WatchDebouncedOptions<Immediate> ): WatchHandle {
    const handle = watchDebounced( source, (value, oldValue) => {
        if (isNotEmpty(value)) return;

        if (options?.once) nextTick(() => handle.stop());

        callback(value as NonNullable<T>, oldValue);
    }, { ...options, once: false } as WatchDebouncedOptions<Immediate>);
    return handle;
}

/** Alias de {@link watchDebounceIfValid}. */
export const watchDebouncedValid = watchDebounceIfValid;
/** Alias de {@link watchDebounceIfValid}. */
export const watchDebouncedIsValid = watchDebounceIfValid;
/** Alias de {@link watchDebounceIfValid}. */
export const watchDebounceValid = watchDebounceIfValid;
/** Alias de {@link watchDebounceIfValid}. */
export const watchComputedDebounceValid = watchDebounceIfValid;
/** Alias de {@link watchDebounceIfValid}. */
export const watchComputedDebounceIsValid = watchDebounceIfValid;