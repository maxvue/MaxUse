import { toValue, type MaybeRefOrGetter } from 'vue';
import { hasContent } from '../Types/hasContent';

/**
 * Retorna o primeiro valor válido de um array de valores.
 * Um valor é considerado válido quando `hasContent(value)` retorna true.
 *
 * @param values Array de valores possivelmente reativos a serem verificados.
 * @returns O primeiro valor com conteúdo ou undefined se nenhum for válido.
 */
export function getFirst<T>(...values: MaybeRefOrGetter<T>[]): NonNullable<T> | null {

    for (const item of values) {
        const resolved = toValue(item);
        if (hasContent(resolved)) return resolved;
    }

    return null;
}
