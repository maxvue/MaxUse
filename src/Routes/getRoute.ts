import { type MaybeRefOrGetter, toValue } from 'vue';
import { isBlank } from '../Helpers/Types';
import { resolveRoute, hasRoute } from './config';

/**
 * Resolves a named route and returns its URL string.
 * Verifies route existence with configured resolver prior to resolution.
 *
 * @param routeName - Route name (e.g. 'dashboard.index').
 * @param data - Route parameters used for placeholder substitution.
 * @returns Resolved URL string, or null if the route does not exist or name is blank.
 *
 * @example
 * ```typescript
 * const url = getRoute('users.show', { id: 42 });
 * // url → '/users/42'
 * ```
 */
export const getRoute = (routeName: MaybeRefOrGetter<string | null> = null, data: any = {}): string | null => {
    const route_value = toValue(routeName);
    if (!route_value || isBlank(route_value)) return null;

    const data_value = toValue(data) ?? {};

    if (hasRoute(route_value, data_value)) return resolveRoute(route_value, data_value);
    return null;
};

/** Alias for {@link getRoute}. */
export const getRouteByName = getRoute;
