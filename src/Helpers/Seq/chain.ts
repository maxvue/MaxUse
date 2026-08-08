import { toValue, type MaybeRefOrGetter } from 'vue';
import { MaxUseWrapper, createWrapper } from './_MaxUseWrapper';

/**
 * Cria uma instância de wrapper `MaxUseWrapper` com encadeamento explícito
 * habilitado. O resultado precisa ser desembrulhado com `.value()`.
 * Semelhante ao _.chain do Lodash.
 *
 * @param value valor a encadear
 * @returns novo wrapper de encadeamento
 */
export function chain<T>(value: MaybeRefOrGetter<T>): MaxUseWrapper<T> {
    const data = toValue(value);
    return createWrapper(data);
}
