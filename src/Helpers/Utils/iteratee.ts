import { unref, type MaybeRef } from 'vue';
import { property } from './property';
import { matches } from './matches';
import { matchesProperty } from './matchesProperty';

/**
 * Cria uma função "iteratee" a partir de `func`, escolhendo o
 * comportamento conforme o tipo do valor recebido:
 * - função → é retornada como está (intocada);
 * - `string`/`symbol`/`number` → vira `property(func)`;
 * - array `[path, srcValue]` → vira `matchesProperty(path, srcValue)`;
 * - objeto plano → vira `matches(func)`;
 * - `null`/`undefined`/ausente → identidade (`(value) => value`).
 *
 * Usa `unref` em vez de `toValue`: `func` pode ser a própria função a
 * repassar como iteratee, e `toValue` a invocaria como getter em vez de
 * preservá-la. `unref` só desembrulha `Ref`, nunca chama funções.
 * Semelhante ao _.iteratee do Lodash.
 *
 * @param func valor a converter em função iteratee
 * @returns função pronta para uso como predicado/mapeador
 */
export function iteratee(func?: MaybeRef<unknown>): (...args: unknown[]) => unknown {
    const data = unref(func);

    if (typeof data === 'function') return data as (...args: unknown[]) => unknown;
    if (data == null) return (value: unknown) => value;
    if (Array.isArray(data)) return matchesProperty(data[0], data[1]);
    if (typeof data === 'object') return matches(data);
    return property(data);
}
