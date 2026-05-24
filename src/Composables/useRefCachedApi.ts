import { ref, type Ref, watch, computed } from 'vue';
import { apiGetRoute } from '../Routes/apiGetRoute';

export type ToRefCachedApi<T> = T extends Ref ? T : Ref<T>;

/**
 * Cria uma Ref com cache local (localStorage) que sincroniza automaticamente com uma rota de API (GET).
 * Na primeira chamada, carrega do cache local (se existir) e dispara a requisição em background para atualizar.
 *
 * @param route_name - Nome da rota Ziggy para a requisição GET.
 * @param options - Opções de configuração.
 * @param options.data_get - Dados enviados como parâmetros da rota (alternativo a `data`).
 * @param options.data - Dados enviados como parâmetros da rota.
 * @param options.key - Chave do localStorage (padrão: `route_name`).
 * @param options.defaultValue - Valor padrão enquanto não há dados no cache nem da API.
 * @param options.sync - Se false, desativa a sincronização com a API (padrão: true).
 * @param options.watch - Se false, desativa a persistência automática ao mudar o valor (padrão: true).
 * @returns Uma Ref reativa com os dados da API/cache.
 *
 * @example
 * ```typescript
 * // Carrega dados de uma API com cache local
 * const usuarios = useCachedApi<Usuario[]>('api.usuarios.index', {
 *     defaultValue: [],
 *     data: { ativo: true }
 * });
 *
 * // Sem sincronização com API (apenas cache local)
 * const config = useCachedApi<Config>('api.config', { sync: false });
 * ```
 */
export function useCachedApi<T>(route_name: string, options: { data_get?: any; data?: any; key?: string | null; defaultValue?: T; sync?: boolean; watch?: boolean } = {}): ToRefCachedApi<T> {
    const state = ref(options.defaultValue ?? null) as ToRefCachedApi<T>;
    const key = options.key ?? route_name;

    const data = localStorage.getItem(key);

    if (data) state.value = JSON.parse(data);

    if (options.watch !== false) {
        const data_save = computed(() => JSON.stringify(state.value));

        watch(data_save, (value) => {
            localStorage.setItem(key, value);
        });
    }


    if (options.sync !== false){
        const data_get = options.data_get ?? options.data ?? {};
        apiGetRoute(route_name, data_get).then((value) => {
            if (value) {
                state.value = value;
                const cleanData = JSON.parse(JSON.stringify(value));
                localStorage.setItem(key, JSON.stringify(cleanData));
            }
        });
    }

    return state;
}

/** Alias de {@link useCachedApi}. */
export const useRefCachedApi = useCachedApi;
/** Alias de {@link useCachedApi}. */
export const useSharedCacheApi = useCachedApi;
/** Alias de {@link useCachedApi}. */
export const useInCacheApi = useCachedApi;