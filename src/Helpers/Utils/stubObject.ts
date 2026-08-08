/**
 * Retorna um novo objeto vazio a cada chamada.
 * Semelhante ao _.stubObject do Lodash.
 *
 * @returns um objeto vazio
 */
export function stubObject(): Record<string, never> {
    return {};
}
