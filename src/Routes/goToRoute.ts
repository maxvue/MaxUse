import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Helpers/Types';
import { resolveRoute, hasRoute, onResetConfig } from './config';
import type { Router } from 'vue-router';

let activeRouter: Router | null = null;

// Garante que resetConfig() também limpe o router: sem isso, um router
// registrado em um teste permanecia ativo para todos os testes seguintes.
onResetConfig(() => {
    activeRouter = null;
});

/**
 * Configura a instância do Vue Router para uso interno na biblioteca.
 * Deve ser chamado uma vez na inicialização da aplicação (ex: no `main.ts`).
 *
 * @param router - A instância do Vue Router da aplicação.
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { createRouter } from 'vue-router';
 * import { setLibraryRouter } from 'max-use';
 *
 * const router = createRouter({ ... });
 * setLibraryRouter(router);
 * ```
 */
export const setLibraryRouter = (router: Router): void => {
    activeRouter = router;
};

/**
 * Navega programaticamente para uma rota registrada ou Vue Router pelo nome.
 * Tenta resolver primeiro via o resolvedor configurado; se não encontrar, usa `router.push` com `name`.
 *
 * @param route - Nome da rota (registrada ou Vue Router).
 * @param data - Parâmetros da rota (usados como params e query no fallback Vue Router).
 * @returns true se a navegação foi disparada, false se o nome for vazio.
 * @throws Error se `setLibraryRouter` não tiver sido chamado antes.
 */
export const goToRoute = (route: MaybeRefOrGetter<string | null> = null, data: any = {}): boolean => {
    if (!activeRouter) throw new Error('Router não configurado na biblioteca.');

    const route_value = toValue(route);
    if (!route_value || isBlank(route_value)) return false;

    const data_value = toValue(data) ?? {};

    if (hasRoute(route_value, data_value)) {
        const resolved = resolveRoute(route_value, data_value);
        let targetPath = resolved;
        if (resolved.startsWith('http://') || resolved.startsWith('https://')) try {
            const parsed = new URL(resolved);
            targetPath = parsed.pathname + parsed.search + parsed.hash;
        } catch {
            // Fallback para resolved em caso de URL malformada
        }

        activeRouter.push(targetPath);
        return true;
    }


    activeRouter.push({ name: route_value, params: data_value, query: data_value });

    return true;
};

/** Alias de {@link goToRoute}. */
export const goToRouteByName = goToRoute;