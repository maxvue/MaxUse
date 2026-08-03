import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Helpers/Types';
import { resolveRoute, hasRoute } from './config';

/**
 * Resolve uma rota nomeada e retorna sua URL.
 * Verifica se a rota existe antes de resolvê-la.
 *
 * @param routeName - Nome da rota (ex: 'dashboard.index').
 * @param data - Parâmetros da rota (substituídos na URL).
 * @returns A URL resolvida ou null se a rota não existir ou o nome for vazio.
 */
export const getRoute = (routeName: MaybeRefOrGetter<string | null> = null, data: any = {}): string | null => {
    const route_value = toValue(routeName);
    if (!route_value || isBlank(route_value)) return null;

    const data_value = toValue(data) ?? {};

    if (hasRoute(route_value)) return resolveRoute(route_value, data_value);
    return null;
};

/** Alias de {@link getRoute}. */
export const getRouteByName = getRoute;
