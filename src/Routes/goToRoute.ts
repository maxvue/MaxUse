import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Helpers/Types';
import { resolveRoute, hasRoute } from './config';
import type { Router } from 'vue-router';

let activeRouter: Router | null = null;

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

    if (hasRoute(route_value)) {
        activeRouter.push(resolveRoute(route_value, data_value)!);
        return true;
    };


    activeRouter.push({ name: route_value, params: data_value, query: data_value });

    return true;
};

/** Alias de {@link goToRoute}. */
export const goToRouteByName = goToRoute;