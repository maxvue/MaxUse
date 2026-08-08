import { toValue, type MaybeRefOrGetter } from 'vue';
import { MaxUseWrapper } from './_MaxUseWrapper';

/**
 * Cria um wrapper de encadeamento **implícito** (equivalente ao `_(value)`
 * chamável do Lodash — a própria função `_`). Diferente de `chain(value)`,
 * que habilita encadeamento explícito (`__chain__: true`), `wrapperLodash`
 * cria o wrapper com `__chain__: false`: nesta migração, sem a otimização
 * de "shortcut fusion" com métodos que retornam primitivo automaticamente,
 * a diferença observável entre os dois modos se resume à flag `__chain__`
 * — o comportamento de `.value()` é idêntico.
 * Semelhante a `_` (a própria função lodash, também exposta como
 * `wrapperLodash`) do Lodash.
 *
 * @param value valor a envolver no wrapper
 * @returns novo wrapper com encadeamento implícito (`__chain__: false`)
 */
export function wrapperLodash<T>(value: MaybeRefOrGetter<T>): MaxUseWrapper<T> {
    const data = toValue(value);
    return new MaxUseWrapper<T>(data, false);
}
