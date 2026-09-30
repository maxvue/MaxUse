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
 * Configures the Vue Router instance for programmatic navigation across the library.
 * Should be called once during application bootstrap (e.g., in `main.ts`).
 *
 * @param router - Application Vue Router instance.
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { router } from './router';
 * import { setLibraryRouter } from '@maxvue/max-use';
 *
 * setLibraryRouter(router);
 * ```
 */
export const setLibraryRouter = (router: Router): void => {
    activeRouter = router;
};

/**
 * Programmatically navigates to a named route via route resolver or Vue Router name.
 * Resolves route path via configured resolver first; falls back to `router.push({ name })`.
 *
 * @param route - Route name (string or ref/getter).
 * @param data - Route parameters / payload.
 * @returns True if navigation was initiated, false if route name is blank.
 * @throws Error if `setLibraryRouter` was not called prior to invocation.
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