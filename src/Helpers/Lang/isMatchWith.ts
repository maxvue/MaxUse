import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseIsMatch } from './_baseIsMatch';

/**
 * Verifica se `object` corresponde parcialmente a `source`, como
 * {@link import('./isMatch').isMatch}, mas consultando `customizer` para
 * cada par de valores comparado (em qualquer profundidade). Se o
 * `customizer` retornar algo diferente de `undefined`, esse resultado
 * decide aquele par; caso contrário, a comparação parcial padrão continua.
 *
 * Peculiaridade: se `customizer` não for uma função (ex.: `undefined`),
 * o comportamento cai de volta para {@link import('./isMatch').isMatch}.
 * Semelhante ao _.isMatchWith do Lodash.
 *
 * @param object valor a inspecionar
 * @param source valor com as chaves/valores exigidos
 * @param customizer função opcional para customizar a comparação por par de valores; recebe `(objValue, srcValue, key, object, source)`
 * @returns `true` se `object` casar parcialmente com `source`
 */
export function isMatchWith(object: MaybeRefOrGetter<unknown>, source: MaybeRefOrGetter<unknown>, customizer?: (objValue: unknown, srcValue: unknown, key: string | symbol, object: unknown, source: unknown) => boolean | undefined): boolean {
    const obj = toValue(object);
    const src = toValue(source);
    const fn = typeof customizer === 'function' ? customizer : undefined;
    return baseIsMatch(obj, src, fn);
}
